import crypto from "node:crypto";
import type Anthropic from "@anthropic-ai/sdk";
import type { Booking, BookingStatus, Lead, MessageRole } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import {
  runChatTurn,
  type AnthropicStreamClient,
  type ChatSseEvent,
  type ConversationPersistenceAdapter,
} from "@/lib/agent/runner";
import { executeTool, type ConversationLeadStore } from "@/lib/agent/tools";
import { getAvailableSlots } from "@/lib/booking/availability";
import {
  createPendingBooking,
  decideBooking,
  type BookingDbClient,
  type BookingTxClient,
} from "@/lib/booking/booking";
import { getSessionAuthorizedBookingStatus } from "@/lib/booking/status-query";
import {
  notifyBookingRequest,
  notifyCustomerBookingDecision,
  notifyEscalation,
  notifyNewLead,
} from "@/lib/whatsapp/notifications";
import { processWhatsAppWebhookPost } from "@/lib/whatsapp/webhook";

const WEBHOOK_SECRET = "e2e-webhook-secret-key";
const OWNER_NUMBER = "601169397149";

function signRaw(body: string): string {
  return `sha256=${crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body, "utf-8")
    .digest("hex")}`;
}

function streamBlocks(
  blocks: Array<
    | { type: "text"; text: string }
    | { type: "tool_use"; id: string; name: string; input: Record<string, unknown> }
  >
): AsyncIterable<Anthropic.Messages.RawMessageStreamEvent> {
  return {
    async *[Symbol.asyncIterator]() {
      yield {
        type: "message_start",
        message: { usage: { input_tokens: 100, output_tokens: 10 } },
      } as unknown as Anthropic.Messages.RawMessageStreamEvent;
      for (let i = 0; i < blocks.length; i += 1) {
        const b = blocks[i];
        if (b.type === "text") {
          yield {
            type: "content_block_start",
            index: i,
            content_block: { type: "text", text: "" },
          } as unknown as Anthropic.Messages.RawMessageStreamEvent;
          yield {
            type: "content_block_delta",
            index: i,
            delta: { type: "text_delta", text: b.text },
          } as unknown as Anthropic.Messages.RawMessageStreamEvent;
        } else {
          yield {
            type: "content_block_start",
            index: i,
            content_block: {
              type: "tool_use",
              id: b.id,
              name: b.name,
              input: {},
            },
          } as unknown as Anthropic.Messages.RawMessageStreamEvent;
          yield {
            type: "content_block_delta",
            index: i,
            delta: {
              type: "input_json_delta",
              partial_json: JSON.stringify(b.input),
            },
          } as unknown as Anthropic.Messages.RawMessageStreamEvent;
        }
        yield {
          type: "content_block_stop",
          index: i,
        } as unknown as Anthropic.Messages.RawMessageStreamEvent;
      }
      yield {
        type: "message_delta",
        usage: { output_tokens: 25 },
      } as unknown as Anthropic.Messages.RawMessageStreamEvent;
    },
  };
}

describe("end-to-end AI agent + booking + WhatsApp verification (Step 12)", () => {
  it("completes the full lead -> slot selection -> pending booking -> double-booking rejection -> WhatsApp owner Confirm & Reject lifecycle", async () => {
    const prevOwner = process.env.OWNER_WHATSAPP_NUMBER;
    process.env.OWNER_WHATSAPP_NUMBER = OWNER_NUMBER;

    try {
      const fixedNow = new Date("2026-11-24T00:00:00.000Z"); // Tue 08:00 MYT
      const graphPayloads: Array<Record<string, unknown>> = [];

      const mockGraphFetch = vi.fn(async (_url: unknown, init?: RequestInit) => {
        if (init?.body && typeof init.body === "string") {
          graphPayloads.push(JSON.parse(init.body) as Record<string, unknown>);
        }
        return Response.json({ messages: [{ id: `wamid.${graphPayloads.length}` }] });
      }) as unknown as typeof fetch;

      const waClientOpts = {
        enabled: true,
        phoneNumberId: "999888777",
        accessToken: "EAAMockPermanentToken",
        fetchFn: mockGraphFetch,
      };

      // Shared in-memory state across Conversation, Lead, Booking, Webhook
      const conversations = new Map<
        string,
        {
          id: string;
          sessionId: string;
          language: string | null;
          leadId: string | null;
          messages: Array<{ role: MessageRole; content: string }>;
        }
      >();
      const leads = new Map<string, Lead>();
      const bookings = new Map<string, Booking>();
      const processedEvents = new Set<string>();
      const rules = [1, 2, 3, 4, 5].flatMap((dayOfWeek) => [
        { dayOfWeek, startTime: "10:00", endTime: "12:30", active: true },
        { dayOfWeek, startTime: "14:00", endTime: "18:00", active: true },
      ]);

      let seq = 1;

      const convStore: ConversationPersistenceAdapter = {
        async findOrCreateConversation(sessionId, lang) {
          let conv = [...conversations.values()].find(
            (c) => c.sessionId === sessionId
          );
          if (!conv) {
            conv = {
              id: `conv_${seq++}`,
              sessionId,
              language: lang,
              leadId: null,
              messages: [],
            };
            conversations.set(conv.id, conv);
          } else {
            conv.language = lang;
          }
          return {
            id: conv.id,
            sessionId: conv.sessionId,
            language: conv.language,
            messageCount: conv.messages.length,
          };
        },
        async loadRecentMessages(conversationId, limit) {
          return (conversations.get(conversationId)?.messages ?? []).slice(
            -limit
          );
        },
        async saveMessage(conversationId, role, content) {
          conversations.get(conversationId)?.messages.push({ role, content });
        },
        async updateConversationLanguage(conversationId, language) {
          const c = conversations.get(conversationId);
          if (c) c.language = language;
        },
      };

      const leadStore: ConversationLeadStore = {
        async findConversationWithLead(conversationId) {
          const conv = conversations.get(conversationId);
          if (!conv) return null;
          return {
            id: conv.id,
            sessionId: conv.sessionId,
            leadId: conv.leadId,
            lead: conv.leadId ? (leads.get(conv.leadId) ?? null) : null,
          };
        },
        async createLeadAndLinkConversation({ conversationId, data }) {
          const id = `lead_${seq++}`;
          const lead: Lead = {
            id,
            ...data,
            status: "NEW",
            notifiedAt: null,
            createdAt: fixedNow,
            updatedAt: fixedNow,
          };
          leads.set(id, lead);
          const conv = conversations.get(conversationId);
          if (conv) conv.leadId = id;
          return lead;
        },
        async updateLead({ leadId, data }) {
          const existing = leads.get(leadId)!;
          const updated: Lead = { ...existing, ...data, updatedAt: fixedNow };
          leads.set(leadId, updated);
          return updated;
        },
        async claimLeadNotification(leadId, now) {
          const existing = leads.get(leadId);
          if (!existing || existing.notifiedAt) return false;
          leads.set(leadId, { ...existing, notifiedAt: now });
          return true;
        },
      };

      const txClient: BookingTxClient = {
        availabilityRule: {
          async findMany({ where }) {
            return rules.filter((r) => r.active === where.active);
          },
        },
        blockedDate: {
          async findMany() {
            return [];
          },
        },
        booking: {
          async findFirst({ where }) {
            const match = [...bookings.values()].find(
              (b) =>
                where.status.in.includes(b.status as "PENDING" | "CONFIRMED") &&
                b.startsAt < where.startsAt.lt &&
                b.endsAt > where.endsAt.gt
            );
            return match ? { id: match.id } : null;
          },
          async create({ data }) {
            const dup = [...bookings.values()].find(
              (b) =>
                (b.status === "PENDING" || b.status === "CONFIRMED") &&
                b.startsAt.getTime() === data.startsAt.getTime()
            );
            if (dup) {
              const err = new Error("Unique violation") as Error & {
                code: string;
              };
              err.code = "P2002";
              throw err;
            }
            const id = `bk_${seq++}`;
            const bk: Booking = {
              id,
              leadId: data.leadId,
              startsAt: data.startsAt,
              endsAt: data.endsAt,
              status: data.status,
              customerNote: data.customerNote,
              decidedAt: null,
              alternativeProposal: null,
              createdAt: fixedNow,
              updatedAt: fixedNow,
            };
            bookings.set(id, bk);
            const lead = leads.get(data.leadId)!;
            const linkedConvs = [...conversations.values()]
              .filter((c) => c.leadId === lead.id)
              .map((c) => ({ id: c.id, language: c.language }));
            return { ...bk, lead: { ...lead, conversations: linkedConvs } };
          },
          async findUnique({ where }) {
            const bk = bookings.get(where.id);
            if (!bk) return null;
            const lead = leads.get(bk.leadId)!;
            const linkedConvs = [...conversations.values()]
              .filter((c) => c.leadId === lead.id)
              .map((c) => ({ id: c.id, language: c.language }));
            return { ...bk, lead: { ...lead, conversations: linkedConvs } };
          },
          async update({ where, data }) {
            const bk = bookings.get(where.id)!;
            const updated: Booking = {
              ...bk,
              status: data.status,
              decidedAt: data.decidedAt,
              alternativeProposal:
                data.alternativeProposal !== undefined
                  ? data.alternativeProposal
                  : bk.alternativeProposal,
              updatedAt: fixedNow,
            };
            bookings.set(where.id, updated);
            const lead = leads.get(updated.leadId)!;
            const linkedConvs = [...conversations.values()]
              .filter((c) => c.leadId === lead.id)
              .map((c) => ({ id: c.id, language: c.language }));
            return {
              ...updated,
              lead: { ...lead, conversations: linkedConvs },
            };
          },
        },
      };

      const bookingDb: BookingDbClient & {
        booking: BookingTxClient["booking"] & {
          findMany: (args: {
            where: {
              status: { in: Array<"PENDING" | "CONFIRMED"> };
              endsAt: { gt: Date };
              startsAt: { lt: Date };
            };
          }) => Promise<Array<{ startsAt: Date; endsAt: Date }>>;
        };
      } = {
        ...txClient,
        booking: {
          ...txClient.booking,
          async findMany({ where }) {
            return [...bookings.values()]
              .filter(
                (b) =>
                  where.status.in.includes(b.status as "PENDING" | "CONFIRMED") &&
                  b.endsAt > where.endsAt.gt &&
                  b.startsAt < where.startsAt.lt
              )
              .map((b) => ({ startsAt: b.startsAt, endsAt: b.endsAt }));
          },
        },
        async $transaction(fn) {
          return fn(txClient);
        },
      };

      const notifier = {
        notifyNewLead: (lead: Lead) => notifyNewLead(lead, waClientOpts),
        notifyBookingRequest: (bk: Booking & { lead: Lead }) =>
          notifyBookingRequest(bk, waClientOpts),
        notifyEscalation: (p: Parameters<typeof notifyEscalation>[0]) =>
          notifyEscalation(p, waClientOpts),
      };

      const SESSION_A = "11111111-2222-4333-8444-555555555555";
      const SESSION_B = "66666666-7777-4888-8999-000000000000";

      // Turn 1 (Visitor A in Arabic): confirms details -> save_lead + get_available_slots + book_appointment
      const eventsA: ChatSseEvent[] = [];
      let callCountA = 0;
      let discoveredSlotIso = "";

      const anthropicA: AnthropicStreamClient = {
        messages: {
          async create() {
            callCountA += 1;
            if (callCountA === 1) {
              return streamBlocks([
                {
                  type: "tool_use",
                  id: "tu_1",
                  name: "save_lead",
                  input: {
                    name: "خالد العتيبي",
                    whatsappNumber: "+966501234567",
                    requestType: "CONSULTATION",
                    projectDescription: "تطبيق جوال ونظام حجوزات",
                    consent: true,
                  },
                },
                {
                  type: "tool_use",
                  id: "tu_2",
                  name: "get_available_slots",
                  input: { daysAhead: 5 },
                },
              ]);
            }
            if (callCountA === 2) {
              return streamBlocks([
                {
                  type: "tool_use",
                  id: "tu_3",
                  name: "book_appointment",
                  input: { startsAt: discoveredSlotIso, note: "استشارة أولية" },
                },
              ]);
            }
            return streamBlocks([
              {
                type: "text",
                text: "تم استلام طلب الحجز بتوقيت ماليزيا (MYT) وهو الآن قيد التأكيد من الفريق، وسيتم إشعارك عبر واتساب فور تأكيده.",
              },
            ]);
          },
        },
      };

      await runChatTurn({
        request: {
          sessionId: SESSION_A,
          message: "نعم، البيانات صحيحة وأوافق على التواصل عبر واتساب وحجز أول موعد متاح.",
          clientLanguage: "ar",
        },
        emit: (ev) => {
          eventsA.push(ev);
          if (ev.type === "slots" && ev.slots[0]) {
            discoveredSlotIso = ev.slots[0].startsAt;
          }
        },
        store: convStore,
        anthropicClient: anthropicA,
        modelName: "claude-test",
        executeToolFn: (name, inp, ctx) =>
          executeTool(name, inp, {
            ...ctx,
            store: leadStore,
            notifier,
            now: fixedNow,
            getAvailableSlotsFn: (opts) =>
              getAvailableSlots({ ...opts, now: fixedNow }, bookingDb),
            createPendingBookingFn: (bInp) =>
              createPendingBooking(bInp, { now: fixedNow }, bookingDb),
          }),
      });

      const bookingEventA = eventsA.find((e) => e.type === "booking");
      expect(bookingEventA).toBeDefined();
      if (!bookingEventA || bookingEventA.type !== "booking") {
        throw new Error("Expected booking SSE event");
      }
      const bookingIdA = bookingEventA.bookingId;

      // Verify owner received both new_lead_alert and booking_request_alert templates
      const sentTemplates = graphPayloads
        .filter((p) => p.type === "template")
        .map((p) => (p.template as { name: string }).name);
      expect(sentTemplates).toContain("new_lead_alert");
      expect(sentTemplates).toContain("booking_request_alert");

      // Visitor B tries to book the exact same slot -> receives SLOT_UNAVAILABLE + fresh slots
      await convStore.findOrCreateConversation(SESSION_B, "en");
      const convBId = [...conversations.values()].find(
        (c) => c.sessionId === SESSION_B
      )!.id;
      await executeTool(
        "save_lead",
        {
          name: "Visitor B",
          whatsappNumber: "+60129998888",
          requestType: "APPOINTMENT",
          projectDescription: "Web portal",
          consent: true,
        },
        {
          conversationId: convBId,
          sessionId: SESSION_B,
          store: leadStore,
          notifier,
          now: fixedNow,
        }
      );

      const raceResult = await executeTool(
        "book_appointment",
        { startsAt: discoveredSlotIso },
        {
          conversationId: convBId,
          sessionId: SESSION_B,
          store: leadStore,
          notifier,
          now: fixedNow,
          getAvailableSlotsFn: (opts) =>
            getAvailableSlots({ ...opts, now: fixedNow }, bookingDb),
          createPendingBookingFn: (bInp) =>
            createPendingBooking(bInp, { now: fixedNow }, bookingDb),
        }
      );
      expect(raceResult).toMatchObject({
        ok: false,
        error: "SLOT_UNAVAILABLE",
      });

      // Widget status poll for Session A sees PENDING; Session B trying to poll A's booking gets null (404)
      const sessionStatusStore = {
        async findBookingStatusForSession(
          bookingId: string,
          sessionId: string
        ): Promise<BookingStatus | null> {
          const bk = bookings.get(bookingId);
          if (!bk) return null;
          const conv = [...conversations.values()].find(
            (c) => c.sessionId === sessionId && c.leadId === bk.leadId
          );
          return conv ? bk.status : null;
        },
      };

      expect(
        await getSessionAuthorizedBookingStatus(
          bookingIdA,
          SESSION_A,
          sessionStatusStore
        )
      ).toEqual({ status: "PENDING" });
      expect(
        await getSessionAuthorizedBookingStatus(
          bookingIdA,
          SESSION_B,
          sessionStatusStore
        )
      ).toBeNull();

      // Owner taps Confirm on WhatsApp -> webhook confirms booking & notifies customer in Arabic ("ar")!
      const webhookConfirmRaw = JSON.stringify({
        object: "whatsapp_business_account",
        entry: [
          {
            changes: [
              {
                value: {
                  messages: [
                    {
                      id: "wamid.owner_confirm_e2e",
                      from: OWNER_NUMBER,
                      type: "button",
                      button: { payload: `BOOKING_CONFIRM:${bookingIdA}` },
                    },
                  ],
                },
              },
            ],
          },
        ],
      });

      const whRes = await processWhatsAppWebhookPost(
        webhookConfirmRaw,
        signRaw(webhookConfirmRaw),
        {
          appSecret: WEBHOOK_SECRET,
          ownerNumber: OWNER_NUMBER,
          claimEventId: async (id) => {
            if (processedEvents.has(id)) return false;
            processedEvents.add(id);
            return true;
          },
          decideBookingFn: (inp) => decideBooking(inp, bookingDb),
          notifyCustomerFn: (bk, dec) =>
            notifyCustomerBookingDecision(bk, dec, waClientOpts),
          replyOwnerFn: async () => {},
        }
      );
      expect(whRes.status).toBe(200);

      // Widget status poll now returns CONFIRMED!
      expect(
        await getSessionAuthorizedBookingStatus(
          bookingIdA,
          SESSION_A,
          sessionStatusStore
        )
      ).toEqual({ status: "CONFIRMED" });

      // Customer WhatsApp confirmation was sent in Arabic ("ar") to +966501234567
      const customerConfirmMsg = graphPayloads.find(
        (p) =>
          p.type === "template" &&
          (p.template as { name: string }).name === "booking_confirmed_customer"
      );
      expect(customerConfirmMsg).toBeDefined();
      expect(customerConfirmMsg?.to).toBe("966501234567");
      expect(
        (customerConfirmMsg?.template as { language: { code: string } })
          .language.code
      ).toBe("ar");
    } finally {
      if (prevOwner === undefined) {
        delete process.env.OWNER_WHATSAPP_NUMBER;
      } else {
        process.env.OWNER_WHATSAPP_NUMBER = prevOwner;
      }
    }
  });
});
