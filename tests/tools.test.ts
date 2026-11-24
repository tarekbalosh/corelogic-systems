import { describe, expect, it, vi } from "vitest";
import type { Lead } from "@prisma/client";
import {
  executeTool,
  normalizeWhatsAppNumber,
  type ConversationLeadStore,
} from "@/lib/agent/tools";
import { SlotUnavailableError } from "@/lib/booking/booking";
import type { AgentNotificationAdapter } from "@/lib/whatsapp/types";

function createInMemoryToolHarness() {
  let leadRecord: Lead | null = null;
  let seq = 1;

  const store: ConversationLeadStore = {
    async findConversationWithLead(conversationId) {
      return {
        id: conversationId,
        sessionId: "11111111-1111-4111-8111-111111111111",
        leadId: leadRecord?.id ?? null,
        lead: leadRecord,
      };
    },
    async createLeadAndLinkConversation({ data }) {
      const now = new Date("2026-11-24T08:00:00.000Z");
      leadRecord = {
        id: `lead_${seq++}`,
        name: data.name,
        whatsappNumber: data.whatsappNumber,
        email: data.email,
        companyName: data.companyName,
        requestType: data.requestType,
        projectType: data.projectType,
        projectDescription: data.projectDescription,
        requirements: data.requirements,
        existingSystem: data.existingSystem,
        budgetRange: data.budgetRange,
        expectedStart: data.expectedStart,
        consentGiven: data.consentGiven,
        consentAt: data.consentAt,
        status: "NEW",
        notifiedAt: null,
        createdAt: now,
        updatedAt: now,
      };
      return leadRecord;
    },
    async updateLead({ data }) {
      if (!leadRecord) throw new Error("No lead to update");
      leadRecord = {
        ...leadRecord,
        ...data,
        updatedAt: new Date("2026-11-24T08:05:00.000Z"),
      };
      return leadRecord;
    },
    async claimLeadNotification(_leadId, now) {
      if (!leadRecord || leadRecord.notifiedAt !== null) {
        return false;
      }
      leadRecord = { ...leadRecord, notifiedAt: now };
      return true;
    },
  };

  const notifier: AgentNotificationAdapter = {
    notifyNewLead: vi.fn(async () => {}),
    notifyBookingRequest: vi.fn(async () => {}),
    notifyEscalation: vi.fn(async () => {}),
  };

  return {
    store,
    notifier,
    getLead: () => leadRecord,
  };
}

describe("agent tools & server executors (Step 6)", () => {
  it("normalizes international phone numbers to E.164 and rejects numbers missing country code", () => {
    expect(normalizeWhatsAppNumber("+60 12-345 6789")).toEqual({
      ok: true,
      e164: "+60123456789",
    });
    expect(normalizeWhatsAppNumber("00966 50 123 4567")).toEqual({
      ok: true,
      e164: "+966501234567",
    });
    // Arabic-Indic numerals with +60
    expect(normalizeWhatsAppNumber("+٦٠١٢٣٤٥٦٧٨٩")).toEqual({
      ok: true,
      e164: "+60123456789",
    });

    // Missing country code -> must NOT guess Malaysia or any default country
    const missingCode = normalizeWhatsAppNumber("0123456789");
    expect(missingCode.ok).toBe(false);
    if (!missingCode.ok) {
      expect(missingCode.error).toContain("MISSING_COUNTRY_CODE");
    }
  });

  it("enforces consent === true before saving a lead", async () => {
    const { store, notifier, getLead } = createInMemoryToolHarness();

    const rejected = await executeTool(
      "save_lead",
      {
        name: "Sara",
        whatsappNumber: "+60123456789",
        requestType: "QUOTE",
        projectDescription: "E-commerce website",
        consent: false,
      },
      {
        conversationId: "conv_1",
        sessionId: "11111111-1111-4111-8111-111111111111",
        store,
        notifier,
      }
    );

    expect(rejected).toMatchObject({ ok: false });
    if (!rejected.ok) {
      expect(rejected.error).toContain("CONSENT_REQUIRED");
    }
    expect(getLead()).toBeNull();
    expect(notifier.notifyNewLead).not.toHaveBeenCalled();
  });

  it("validates tool inputs with zod and prevents duplicate leads while notifying owner only once", async () => {
    const { store, notifier, getLead } = createInMemoryToolHarness();
    const ctx = {
      conversationId: "conv_1",
      sessionId: "11111111-1111-4111-8111-111111111111",
      store,
      notifier,
    };

    // Invalid requestType
    const badSchema = await executeTool(
      "save_lead",
      {
        name: "Omar",
        whatsappNumber: "+60123456789",
        requestType: "INVALID_ENUM",
        consent: true,
      },
      ctx
    );
    expect(badSchema.ok).toBe(false);

    // First valid save -> creates lead_1 and triggers notifyNewLead once
    const firstSave = await executeTool(
      "save_lead",
      {
        name: "Omar Ali",
        whatsappNumber: "+60 12-345 6789",
        requestType: "CONSULTATION",
        projectDescription: "Custom inventory & POS system for 3 branches",
        consent: true,
      },
      ctx
    );
    expect(firstSave).toEqual({ ok: true, leadId: "lead_1" });
    expect(notifier.notifyNewLead).toHaveBeenCalledTimes(1);
    expect(getLead()?.whatsappNumber).toBe("+60123456789");

    // Second save in same conversation -> updates lead_1 in place (no duplicate), does NOT re-send new lead alert
    const secondSave = await executeTool(
      "save_lead",
      {
        name: "Omar Ali",
        whatsappNumber: "+60123456789",
        requestType: "CONSULTATION",
        companyName: "Oasis Retail Sdn Bhd",
        budgetRange: "MYR 25,000 - 40,000",
        consent: true,
      },
      ctx
    );
    expect(secondSave).toEqual({ ok: true, leadId: "lead_1" });
    expect(notifier.notifyNewLead).toHaveBeenCalledTimes(1);
    expect(getLead()?.companyName).toBe("Oasis Retail Sdn Bhd");
    expect(getLead()?.projectDescription).toBe(
      "Custom inventory & POS system for 3 branches"
    );
  });

  it("does not fail save_lead if WhatsApp notification throws", async () => {
    const { store } = createInMemoryToolHarness();
    const failingNotifier: AgentNotificationAdapter = {
      notifyNewLead: vi.fn(async () => {
        throw new Error("WhatsApp API 503 Unavailable");
      }),
      notifyBookingRequest: vi.fn(async () => {}),
      notifyEscalation: vi.fn(async () => {}),
    };

    const res = await executeTool(
      "save_lead",
      {
        name: "Nadia",
        whatsappNumber: "+60198765432",
        requestType: "SUPPORT",
        consent: true,
      },
      {
        conversationId: "conv_2",
        sessionId: "22222222-2222-4222-8222-222222222222",
        store,
        notifier: failingNotifier,
      }
    );

    expect(res).toEqual({ ok: true, leadId: "lead_1" });
  });

  it("requires saved lead before book_appointment and returns fresh slots on SlotUnavailableError", async () => {
    const { store, notifier } = createInMemoryToolHarness();
    const freshSlot = {
      startsAt: "2026-11-26T02:00:00.000Z",
      endsAt: "2026-11-26T02:30:00.000Z",
      label_en: "Thursday, Nov 26, 2026 · 10:00 AM – 10:30 AM MYT (Malaysia time)",
      label_ar: "الخميس، 26 نوفمبر 2026 · 10:00 ص – 10:30 ص بتوقيت ماليزيا — MYT (Malaysia time)",
      dayKey: "2026-11-26",
      dayLabel_en: "Thursday, Nov 26, 2026",
      dayLabel_ar: "الخميس، 26 نوفمبر 2026",
      timeRange_en: "10:00 AM – 10:30 AM",
      timeRange_ar: "10:00 ص – 10:30 ص",
    };

    // Attempt booking before lead saved
    const beforeLead = await executeTool(
      "book_appointment",
      { startsAt: "2026-11-25T02:00:00.000Z" },
      {
        conversationId: "conv_3",
        sessionId: "33333333-3333-4333-8333-333333333333",
        store,
        notifier,
      }
    );
    expect(beforeLead.ok).toBe(false);
    if (!beforeLead.ok) {
      expect(beforeLead.error).toContain("LEAD_REQUIRED");
    }

    // Save lead first
    await executeTool(
      "save_lead",
      {
        name: "Hassan",
        whatsappNumber: "+60123456789",
        requestType: "APPOINTMENT",
        projectDescription: "Mobile app consultation",
        consent: true,
      },
      {
        conversationId: "conv_3",
        sessionId: "33333333-3333-4333-8333-333333333333",
        store,
        notifier,
      }
    );

    // Simulate race/taken slot -> returns SLOT_UNAVAILABLE + fresh slots
    const unavailable = await executeTool(
      "book_appointment",
      { startsAt: "2026-11-25T02:00:00.000Z" },
      {
        conversationId: "conv_3",
        sessionId: "33333333-3333-4333-8333-333333333333",
        store,
        notifier,
        createPendingBookingFn: async () => {
          throw new SlotUnavailableError();
        },
        getAvailableSlotsFn: async () => ({
          slots: [freshSlot],
          moreAvailable: false,
          timezone: "Asia/Kuala_Lumpur",
        }),
      }
    );

    expect(unavailable.ok).toBe(false);
    if (!unavailable.ok) {
      expect(unavailable.error).toBe("SLOT_UNAVAILABLE");
      expect(unavailable.availableSlots).toHaveLength(1);
      expect(unavailable.availableSlots?.[0].startsAt).toBe(
        "2026-11-26T02:00:00.000Z"
      );
    }
  });
});
