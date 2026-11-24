import type { NextRequest } from "next/server";
import {
  ChatRequestSchema,
  encodeSseEvent,
  runChatTurn,
} from "@/lib/agent/runner";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BODY_BYTES = 16_384; // 16 KB max request body

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json(
      { error: "Content-Type must be application/json." },
      { status: 415 }
    );
  }

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const declaredBytes = Number.parseInt(contentLengthHeader, 10);
    if (Number.isFinite(declaredBytes) && declaredBytes > MAX_BODY_BYTES) {
      return Response.json(
        { error: "Request body exceeds maximum allowed size." },
        { status: 413 }
      );
    }
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return Response.json({ error: "Unable to read request body." }, { status: 400 });
  }

  if (Buffer.byteLength(rawBody, "utf-8") > MAX_BODY_BYTES) {
    return Response.json(
      { error: "Request body exceeds maximum allowed size." },
      { status: 413 }
    );
  }

  let jsonBody: unknown;
  try {
    jsonBody = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
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
      { status: 400 }
    );
  }

  // Honeypot check (if hidden website_url field is filled by an automated bot)
  if (parsed.data.website_url && parsed.data.website_url.trim().length > 0) {
    return Response.json({ error: "Request rejected." }, { status: 400 });
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
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
