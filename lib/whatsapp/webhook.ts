import crypto from "node:crypto";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { formatSlotLabels } from "@/lib/booking/availability";
import {
  BookingNotFoundError,
  decideBooking,
  type DecideBookingInput,
  type DecideBookingResult,
} from "@/lib/booking/booking";
import {
  maskPhone,
  safeLogError,
  safeLogInfo,
  safeLogWarn,
} from "@/lib/security/mask";
import { normalizeDigitsOnlyPhone } from "@/lib/whatsapp/config";
import {
  notifyCustomerBookingDecision,
  replyToOwnerText,
  type BookingNotificationRecord,
} from "@/lib/whatsapp/notifications";

export const OWNER_HELP_TEXT =
  "Use the Confirm/Reject buttons on booking alerts.";

function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verifies Meta's `X-Hub-Signature-256: sha256=<hex>` over the exact raw request body
 * using constant-time comparison.
 */
export function verifyWhatsAppSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string | undefined = process.env.WHATSAPP_APP_SECRET
): boolean {
  const secret = appSecret?.trim();
  if (!secret || !signatureHeader) {
    return false;
  }
  if (!signatureHeader.startsWith("sha256=")) {
    return false;
  }
  const providedHex = signatureHeader.slice("sha256=".length).trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(providedHex)) {
    return false;
  }

  const expectedHex = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf-8")
    .digest("hex")
    .toLowerCase();

  return constantTimeEquals(providedHex, expectedHex);
}

export function verifyWebhookHandshakeToken(
  mode: string | null,
  token: string | null,
  expectedToken: string | undefined = process.env.WHATSAPP_VERIFY_TOKEN
): boolean {
  const secret = expectedToken?.trim();
  if (mode !== "subscribe" || !secret || !token) {
    return false;
  }
  return constantTimeEquals(token, secret);
}

interface IncomingWhatsAppMessage {
  id?: string;
  from?: string;
  type?: string;
  text?: { body?: string };
  button?: { payload?: string; text?: string };
  interactive?: {
    type?: string;
    button_reply?: { id?: string; title?: string };
  };
}

interface WhatsAppWebhookPayload {
  object?: string;
  entry?: Array<{
    id?: string;
    changes?: Array<{
      field?: string;
      value?: {
        messages?: IncomingWhatsAppMessage[];
      };
    }>;
  }>;
}

export interface WebhookDependencies {
  ownerNumber?: string;
  appSecret?: string;
  claimEventId?: (messageId: string) => Promise<boolean>;
  decideBookingFn?: (input: DecideBookingInput) => Promise<DecideBookingResult>;
  notifyCustomerFn?: (
    booking: BookingNotificationRecord,
    decision: "CONFIRM" | "REJECT"
  ) => Promise<void>;
  replyOwnerFn?: (body: string) => Promise<void>;
}

async function defaultClaimEventId(messageId: string): Promise<boolean> {
  try {
    await prisma.processedWebhookEvent.create({
      data: { id: messageId },
    });
    return true;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return false;
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return false;
    }
    throw error;
  }
}

function extractButtonPayload(msg: IncomingWhatsAppMessage): string | null {
  if (msg.type === "button" && msg.button?.payload) {
    return msg.button.payload.trim();
  }
  if (
    msg.type === "interactive" &&
    msg.interactive?.button_reply?.id
  ) {
    return msg.interactive.button_reply.id.trim();
  }
  return null;
}

function parseBookingAction(
  payload: string
): { action: "CONFIRM" | "REJECT"; bookingId: string } | null {
  const match = /^BOOKING_(CONFIRM|REJECT):([A-Za-z0-9_-]{3,64})$/.exec(
    payload
  );
  if (!match) return null;
  return {
    action: match[1] as "CONFIRM" | "REJECT",
    bookingId: match[2],
  };
}

/**
 * Processes a raw POST webhook delivery from Meta WhatsApp Cloud API.
 */
export async function processWhatsAppWebhookPost(
  rawBody: string,
  signatureHeader: string | null,
  deps: WebhookDependencies = {}
): Promise<{ status: number; body: Record<string, unknown> }> {
  if (!verifyWhatsAppSignature(rawBody, signatureHeader, deps.appSecret)) {
    safeLogWarn("whatsapp.webhook.invalid_signature", {});
    return { status: 401, body: { error: "Invalid webhook signature" } };
  }

  let parsedPayload: WhatsAppWebhookPayload;
  try {
    parsedPayload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
  } catch {
    return { status: 400, body: { error: "Malformed JSON body" } };
  }

  const ownerDigits = normalizeDigitsOnlyPhone(
    deps.ownerNumber ?? process.env.OWNER_WHATSAPP_NUMBER
  );
  const claimEventId = deps.claimEventId ?? defaultClaimEventId;
  const decideFn = deps.decideBookingFn ?? ((inp) => decideBooking(inp));
  const notifyCustomerFn =
    deps.notifyCustomerFn ??
    ((bk, dec) => notifyCustomerBookingDecision(bk, dec));
  const replyOwnerFn = deps.replyOwnerFn ?? ((txt) => replyToOwnerText(txt));

  const messages: IncomingWhatsAppMessage[] = [];
  for (const entry of parsedPayload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      for (const msg of change.value?.messages ?? []) {
        messages.push(msg);
      }
    }
  }

  for (const msg of messages) {
    const messageId = msg.id?.trim();
    const senderDigits = normalizeDigitsOnlyPhone(msg.from);

    if (!messageId || !senderDigits) {
      continue;
    }

    // Enforce owner-only processing BEFORE writing state or executing actions
    if (!ownerDigits || !constantTimeEquals(senderDigits, ownerDigits)) {
      safeLogInfo("whatsapp.webhook.ignored_non_owner", {
        from: maskPhone(senderDigits),
        type: msg.type ?? "unknown",
      });
      continue;
    }

    // Atomic idempotency check via ProcessedWebhookEvent
    const isFresh = await claimEventId(messageId);
    if (!isFresh) {
      safeLogInfo("whatsapp.webhook.duplicate_skipped", { messageId });
      continue;
    }

    const buttonPayload = extractButtonPayload(msg);
    if (!buttonPayload) {
      // Plain text or non-button message from owner -> reply with short help text only
      try {
        await replyOwnerFn(OWNER_HELP_TEXT);
      } catch (err) {
        safeLogError("whatsapp.webhook.owner_help_reply_failed", err, {
          messageId,
        });
      }
      continue;
    }

    const parsedAction = parseBookingAction(buttonPayload);
    if (!parsedAction) {
      try {
        await replyOwnerFn(OWNER_HELP_TEXT);
      } catch (err) {
        safeLogError("whatsapp.webhook.owner_unknown_button_reply_failed", err, {
          messageId,
        });
      }
      continue;
    }

    try {
      const decisionResult = await decideFn({
        bookingId: parsedAction.bookingId,
        decision: parsedAction.action,
      });

      const slotLabels = formatSlotLabels(
        decisionResult.booking.startsAt,
        decisionResult.booking.endsAt
      );
      const customerName = decisionResult.booking.lead.name;
      const slotEn = slotLabels.label_en;

      if (decisionResult.alreadyDecided) {
        await replyOwnerFn(
          `Booking for ${customerName} (${slotEn}) was already ${decisionResult.booking.status}. No changes made.`
        );
        continue;
      }

      try {
        await notifyCustomerFn(decisionResult.booking, parsedAction.action);
      } catch (custErr) {
        safeLogError("whatsapp.webhook.customer_notify_failed", custErr, {
          bookingId: decisionResult.booking.id,
          decision: parsedAction.action,
        });
      }

      if (parsedAction.action === "CONFIRM") {
        await replyOwnerFn(`Booking confirmed for ${customerName} at ${slotEn}.`);
      } else {
        await replyOwnerFn(
          `Booking rejected for ${customerName} at ${slotEn}. Customer notified that the team will propose another time.`
        );
      }
    } catch (err) {
      if (err instanceof BookingNotFoundError) {
        await replyOwnerFn(
          `Booking ${parsedAction.bookingId} was not found.`
        ).catch(() => {});
      } else {
        safeLogError("whatsapp.webhook.booking_decision_failed", err, {
          bookingId: parsedAction.bookingId,
        });
      }
    }
  }

  return { status: 200, body: { ok: true } };
}
