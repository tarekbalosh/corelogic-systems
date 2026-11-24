import crypto from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import type { BookingStatus } from "@prisma/client";
import type { BookingWithLead } from "@/lib/booking/booking";
import { sendTemplate } from "@/lib/whatsapp/client";
import {
  OWNER_HELP_TEXT,
  processWhatsAppWebhookPost,
  verifyWebhookHandshakeToken,
  verifyWhatsAppSignature,
} from "@/lib/whatsapp/webhook";

const TEST_SECRET = "test-whatsapp-app-secret-12345";
const OWNER_PHONE = "601169397149";

function signPayload(rawBody: string, secret = TEST_SECRET): string {
  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf-8")
    .digest("hex");
  return `sha256=${digest}`;
}

function makeSampleBooking(
  id: string,
  status: BookingStatus = "PENDING"
): BookingWithLead {
  const startsAt = new Date("2026-11-25T02:00:00.000Z"); // Wed 10:00 MYT
  const endsAt = new Date("2026-11-25T02:30:00.000Z");
  const now = new Date("2026-11-24T08:00:00.000Z");

  return {
    id,
    leadId: "lead_100",
    startsAt,
    endsAt,
    status,
    customerNote: null,
    decidedAt: status === "PENDING" ? null : now,
    alternativeProposal: null,
    createdAt: now,
    updatedAt: now,
    lead: {
      id: "lead_100",
      name: "Tariq Mansoor",
      whatsappNumber: "+60198887777",
      email: null,
      companyName: null,
      requestType: "CONSULTATION",
      projectType: null,
      projectDescription: "AI Automation workflow",
      requirements: null,
      existingSystem: null,
      budgetRange: null,
      expectedStart: null,
      consentGiven: true,
      consentAt: now,
      status: "NEW",
      notifiedAt: now,
      createdAt: now,
      updatedAt: now,
      conversations: [{ id: "conv_99", language: "ar" }],
    },
  };
}

describe("WhatsApp Cloud API client & webhook (Step 7)", () => {
  it("verifies GET handshake token and POST X-Hub-Signature-256 in constant time", () => {
    expect(
      verifyWebhookHandshakeToken("subscribe", "my-verify-tok", "my-verify-tok")
    ).toBe(true);
    expect(
      verifyWebhookHandshakeToken("subscribe", "wrong", "my-verify-tok")
    ).toBe(false);

    const body = JSON.stringify({ object: "whatsapp_business_account" });
    const validSig = signPayload(body);
    expect(verifyWhatsAppSignature(body, validSig, TEST_SECRET)).toBe(true);
    expect(
      verifyWhatsAppSignature(body + " ", validSig, TEST_SECRET)
    ).toBe(false);
    expect(
      verifyWhatsAppSignature(body, "sha256=0000", TEST_SECRET)
    ).toBe(false);
    expect(verifyWhatsAppSignature(body, null, TEST_SECRET)).toBe(false);
  });

  it("rejects invalid signatures on POST with 401", async () => {
    const raw = JSON.stringify({ object: "whatsapp_business_account", entry: [] });
    const res = await processWhatsAppWebhookPost(raw, "sha256=" + "a".repeat(64), {
      appSecret: TEST_SECRET,
      ownerNumber: OWNER_PHONE,
    });
    expect(res.status).toBe(401);
  });

  it("ignores messages from non-owner phone numbers without mutating bookings", async () => {
    const decideBookingFn = vi.fn();
    const replyOwnerFn = vi.fn();
    const raw = JSON.stringify({
      object: "whatsapp_business_account",
      entry: [
        {
          changes: [
            {
              field: "messages",
              value: {
                messages: [
                  {
                    id: "wamid.stranger_1",
                    from: "60199990000", // Not owner!
                    type: "button",
                    button: { payload: "BOOKING_CONFIRM:bk_1" },
                  },
                ],
              },
            },
          ],
        },
      ],
    });

    const res = await processWhatsAppWebhookPost(raw, signPayload(raw), {
      appSecret: TEST_SECRET,
      ownerNumber: `+${OWNER_PHONE}`,
      decideBookingFn,
      replyOwnerFn,
    });

    expect(res.status).toBe(200);
    expect(decideBookingFn).not.toHaveBeenCalled();
    expect(replyOwnerFn).not.toHaveBeenCalled();
  });

  it("enforces idempotency via ProcessedWebhookEvent and executes Confirm / Reject / already-decided / plain-text flows", async () => {
    const processed = new Set<string>();
    let currentStatus: BookingStatus = "PENDING";

    const claimEventId = vi.fn(async (id: string) => {
      if (processed.has(id)) return false;
      processed.add(id);
      return true;
    });

    const decideBookingFn = vi.fn(async ({ bookingId, decision }) => {
      if (currentStatus !== "PENDING") {
        return {
          booking: makeSampleBooking(bookingId, currentStatus),
          alreadyDecided: true,
        };
      }
      currentStatus = decision === "CONFIRM" ? "CONFIRMED" : "REJECTED";
      return {
        booking: makeSampleBooking(bookingId, currentStatus),
        alreadyDecided: false,
      };
    });

    const notifyCustomerFn = vi.fn(async () => {});
    const replyOwnerFn = vi.fn(async () => {});

    const confirmPayload = JSON.stringify({
      object: "whatsapp_business_account",
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    id: "wamid.confirm_1",
                    from: OWNER_PHONE,
                    type: "button",
                    button: { payload: "BOOKING_CONFIRM:bk_500" },
                  },
                ],
              },
            },
          ],
        },
      ],
    });

    // 1. First delivery -> confirms booking, notifies customer, replies to owner
    const first = await processWhatsAppWebhookPost(
      confirmPayload,
      signPayload(confirmPayload),
      {
        appSecret: TEST_SECRET,
        ownerNumber: OWNER_PHONE,
        claimEventId,
        decideBookingFn,
        notifyCustomerFn,
        replyOwnerFn,
      }
    );
    expect(first.status).toBe(200);
    expect(decideBookingFn).toHaveBeenCalledTimes(1);
    expect(notifyCustomerFn).toHaveBeenCalledWith(
      expect.objectContaining({ id: "bk_500", status: "CONFIRMED" }),
      "CONFIRM"
    );
    expect(replyOwnerFn).toHaveBeenCalledWith(
      expect.stringContaining("Booking confirmed for Tariq Mansoor")
    );

    // 2. Duplicate delivery of same wamid -> skipped completely
    await processWhatsAppWebhookPost(
      confirmPayload,
      signPayload(confirmPayload),
      {
        appSecret: TEST_SECRET,
        ownerNumber: OWNER_PHONE,
        claimEventId,
        decideBookingFn,
        notifyCustomerFn,
        replyOwnerFn,
      }
    );
    expect(decideBookingFn).toHaveBeenCalledTimes(1);
    expect(notifyCustomerFn).toHaveBeenCalledTimes(1);

    // 3. Different wamid tapping Reject on an already-CONFIRMED booking -> tells owner current state, does not re-notify customer
    const rejectAfterConfirm = JSON.stringify({
      object: "whatsapp_business_account",
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    id: "wamid.reject_2",
                    from: OWNER_PHONE,
                    type: "interactive",
                    interactive: {
                      type: "button_reply",
                      button_reply: { id: "BOOKING_REJECT:bk_500", title: "Reject" },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    await processWhatsAppWebhookPost(
      rejectAfterConfirm,
      signPayload(rejectAfterConfirm),
      {
        appSecret: TEST_SECRET,
        ownerNumber: OWNER_PHONE,
        claimEventId,
        decideBookingFn,
        notifyCustomerFn,
        replyOwnerFn,
      }
    );
    expect(notifyCustomerFn).toHaveBeenCalledTimes(1);
    expect(replyOwnerFn).toHaveBeenLastCalledWith(
      expect.stringContaining("already CONFIRMED")
    );

    // 4. Plain text from owner -> replies with help message only
    const textMsg = JSON.stringify({
      object: "whatsapp_business_account",
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    id: "wamid.text_3",
                    from: OWNER_PHONE,
                    type: "text",
                    text: { body: "confirm bk_500" },
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    await processWhatsAppWebhookPost(textMsg, signPayload(textMsg), {
      appSecret: TEST_SECRET,
      ownerNumber: OWNER_PHONE,
      claimEventId,
      decideBookingFn,
      notifyCustomerFn,
      replyOwnerFn,
    });
    expect(replyOwnerFn).toHaveBeenLastCalledWith(OWNER_HELP_TEXT);
  });

  it("retries transient 429/5xx Graph API errors with backoff in sendTemplate", async () => {
    let attempts = 0;
    const mockFetch = vi.fn(async () => {
      attempts += 1;
      if (attempts === 1) {
        return new Response("Rate limit", { status: 429 });
      }
      return Response.json({ messages: [{ id: "wamid.sent_ok" }] });
    }) as unknown as typeof fetch;

    const result = await sendTemplate(
      {
        to: "+60123456789",
        name: "new_lead_alert",
        languageCode: "ar",
      },
      {
        enabled: true,
        phoneNumberId: "1234567890",
        accessToken: "EAATestSecretTokenValue",
        fetchFn: mockFetch,
        initialBackoffMs: 5,
      }
    );

    expect(attempts).toBe(2);
    expect(result).toEqual({ skipped: false, messageId: "wamid.sent_ok" });
  });
});
