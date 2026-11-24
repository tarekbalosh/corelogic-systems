import type { NextRequest } from "next/server";
import prisma from "@/lib/db";
import {
  ChatRequestSchema,
  detectMessageLanguage,
  encodeSseEvent,
  runChatTurn,
} from "@/lib/agent/runner";
import { verifyBotProtection } from "@/lib/security/bot-protection";
import {
  API_SECURITY_HEADERS,
  extractClientIp,
  isSameOriginRequest,
} from "@/lib/security/http";
import {
  checkChatRateLimits,
  consumeDailyModelCall,
  recordChatErrorAndCheckAlertCooldown,
} from "@/lib/security/rate-limit";
import { notifyEscalation } from "@/lib/whatsapp/notifications";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BODY_BYTES = 16_384; // 16 KB max request body

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return Response.json(
      { error: "Cross-origin requests are not permitted." },
      { status: 403, headers: { ...API_SECURITY_HEADERS, Vary: "Origin" } }
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json(
      { error: "Content-Type must be application/json." },
      { status: 415, headers: API_SECURITY_HEADERS }
    );
  }

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const declaredBytes = Number.parseInt(contentLengthHeader, 10);
    if (Number.isFinite(declaredBytes) && declaredBytes > MAX_BODY_BYTES) {
      return Response.json(
        { error: "Request body exceeds maximum allowed size." },
        { status: 413, headers: API_SECURITY_HEADERS }
      );
    }
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return Response.json(
      { error: "Unable to read request body." },
      { status: 400, headers: API_SECURITY_HEADERS }
    );
  }

  if (Buffer.byteLength(rawBody, "utf-8") > MAX_BODY_BYTES) {
    return Response.json(
      { error: "Request body exceeds maximum allowed size." },
      { status: 413, headers: API_SECURITY_HEADERS }
    );
  }

  let jsonBody: unknown;
  try {
    jsonBody = JSON.parse(rawBody);
  } catch {
    return Response.json(
      { error: "Invalid JSON payload." },
      { status: 400, headers: API_SECURITY_HEADERS }
    );
  }

  const parsed = ChatRequestSchema.safeParse(jsonBody);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid chat request payload.",
        details: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400, headers: API_SECURITY_HEADERS }
    );
  }

  // Honeypot check (if hidden website_url field is filled by an automated bot)
  if (parsed.data.website_url && parsed.data.website_url.trim().length > 0) {
    return Response.json(
      { error: "Request rejected." },
      { status: 400, headers: API_SECURITY_HEADERS }
    );
  }

  const clientIp = extractClientIp(request);
  const lang = detectMessageLanguage(
    parsed.data.message,
    parsed.data.clientLanguage
  );

  // Per-session, per-IP, and global daily rate limit enforcement
  const rateDecision = await checkChatRateLimits({
    sessionId: parsed.data.sessionId,
    clientIp,
  });

  if (!rateDecision.allowed) {
    const localizedMessage =
      lang === "ar" ? rateDecision.message_ar : rateDecision.message_en;
    return Response.json(
      {
        error: rateDecision.reason,
        message: localizedMessage,
      },
      {
        status: 429,
        headers: {
          ...API_SECURITY_HEADERS,
          "Retry-After": String(rateDecision.retryAfterSeconds),
        },
      }
    );
  }

  // Optional Turnstile verification before the very first message of a session
  if (process.env.BOT_PROTECTION_ENABLED === "true") {
    let existingMessageCount = 0;
    if (process.env.DATABASE_URL?.trim()) {
      const existingConv = await prisma.conversation
        .findUnique({
          where: { sessionId: parsed.data.sessionId },
          include: { _count: { select: { messages: true } } },
        })
        .catch(() => null);
      existingMessageCount = existingConv?._count.messages ?? 0;
    }

    if (existingMessageCount === 0) {
      const botCheck = await verifyBotProtection({
        token: parsed.data.turnstileToken,
        remoteIp: clientIp,
      });
      if (!botCheck.ok) {
        return Response.json(
          {
            error: botCheck.reason,
            message:
              lang === "ar"
                ? "يرجى إكمال التحقق الأمني قبل إرسال رسالتك الأولى."
                : "Please complete the security verification before sending your first message.",
          },
          { status: 403, headers: API_SECURITY_HEADERS }
        );
      }
    }
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const emit = (event: Parameters<typeof encodeSseEvent>[0]) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(encodeSseEvent(event)));
        } catch {
          closed = true;
        }
      };

      try {
        await runChatTurn({
          request: parsed.data,
          emit,
          onModelCallRecorded: () => consumeDailyModelCall(),
          onUnhandledChatError: async (err) => {
            const shouldAlert = await recordChatErrorAndCheckAlertCooldown();
            if (shouldAlert) {
              await notifyEscalation({
                conversationId: parsed.data.sessionId,
                sessionId: parsed.data.sessionId,
                urgency: "high",
                reason: `Repeated /api/chat server errors detected (${err instanceof Error ? err.name : "Error"}). Check Vercel Function logs.`,
              }).catch(() => {});
            }
          },
        });
      } finally {
        if (!closed) {
          closed = true;
          try {
            controller.close();
          } catch {
            // Stream already closed by client disconnect
          }
        }
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      ...API_SECURITY_HEADERS,
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      Vary: "Origin",
    },
  });
}
