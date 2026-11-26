import type Anthropic from "@anthropic-ai/sdk";
import type { Booking, Lead, LeadRequestType, LeadStatus } from "@prisma/client";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";
import prisma from "@/lib/db";
import {
  formatSlotLabels,
  getAvailableSlots,
  type AvailableSlot,
  type GetAvailableSlotsOptions,
  type GetAvailableSlotsResult,
} from "@/lib/booking/availability";
import {
  createPendingBooking,
  SlotUnavailableError,
  type BookingWithLead,
  type CreatePendingBookingInput,
} from "@/lib/booking/booking";
import {
  maskPhone,
  safeLogError,
  safeLogInfo,
  stripControlChars,
} from "@/lib/security/mask";
import { defaultNotificationAdapter } from "@/lib/whatsapp/notifications";
import type { AgentNotificationAdapter } from "@/lib/whatsapp/types";

export const LeadRequestTypeSchema = z.enum([
  "CONSULTATION",
  "QUOTE",
  "SUPPORT",
  "APPOINTMENT",
  "OTHER",
]);

export const SaveLeadInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  whatsappNumber: z.string().trim().min(4).max(40),
  requestType: LeadRequestTypeSchema,
  projectType: z.string().trim().max(120).optional(),
  projectDescription: z.string().trim().max(4000).optional(),
  requirements: z.string().trim().max(4000).optional(),
  companyName: z.string().trim().max(160).optional(),
  existingSystem: z.string().trim().max(500).optional(),
  budgetRange: z.string().trim().max(160).optional(),
  expectedStart: z.string().trim().max(160).optional(),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  consent: z.boolean(),
});

export const GetAvailableSlotsInputSchema = z.object({
  daysAhead: z.number().int().min(1).max(14).optional(),
});

export const BookAppointmentInputSchema = z.object({
  startsAt: z.string().trim().min(10).max(64),
  note: z.string().trim().max(1000).optional(),
});

export const EscalateToTeamInputSchema = z.object({
  reason: z.string().trim().min(2).max(1000),
  urgency: z.enum(["normal", "high"]).optional().default("normal"),
});

export const toolDefinitions: Anthropic.Messages.Tool[] = [
  {
    name: "save_lead",
    description:
      "Save or update the visitor's contact and project details for the current conversation after showing a summary and receiving explicit confirmation and WhatsApp contact consent (consent=true).",
    input_schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Visitor's full name or preferred name.",
        },
        whatsappNumber: {
          type: "string",
          description:
            "Visitor's WhatsApp phone number including international country code (e.g. +60123456789 or +966501234567). Never guess a country code.",
        },
        requestType: {
          type: "string",
          enum: ["CONSULTATION", "QUOTE", "SUPPORT", "APPOINTMENT", "OTHER"],
          description: "Category of the visitor's request.",
        },
        projectType: {
          type: "string",
          description:
            "Optional project category (e.g. ERP, CRM, Web App, Mobile App, AI Automation, UI/UX).",
        },
        projectDescription: {
          type: "string",
          description:
            "Short summary of what the visitor wants to build or solve (required unless requestType is SUPPORT or OTHER).",
        },
        requirements: {
          type: "string",
          description: "Optional detailed features, modules, or integrations mentioned.",
        },
        companyName: {
          type: "string",
          description: "Optional company or organization name.",
        },
        existingSystem: {
          type: "string",
          description: "Optional existing website or software system.",
        },
        budgetRange: {
          type: "string",
          description: "Optional indicative budget range shared by the visitor.",
        },
        expectedStart: {
          type: "string",
          description: "Optional expected start timeline.",
        },
        email: {
          type: "string",
          description: "Optional email address.",
        },
        consent: {
          type: "boolean",
          description:
            "Must be true ONLY after the visitor explicitly confirmed the summary and agreed to be contacted on WhatsApp.",
        },
      },
      required: ["name", "whatsappNumber", "requestType", "consent"],
    },
  },
  {
    name: "get_available_slots",
    description:
      "Retrieve available 30-minute consultation time slots (in UTC with English/Arabic MYT labels and German Europe/Berlin MEZ/MESZ labels) for up to 14 days ahead.",
    input_schema: {
      type: "object",
      properties: {
        daysAhead: {
          type: "integer",
          minimum: 1,
          maximum: 14,
          description: "Optional number of days ahead to check (1 to 14).",
        },
      },
    },
  },
  {
    name: "book_appointment",
    description:
      "Request a consultation booking in PENDING confirmation state for a saved lead using an exact startsAt ISO UTC timestamp returned by get_available_slots.",
    input_schema: {
      type: "object",
      properties: {
        startsAt: {
          type: "string",
          description:
            "Exact ISO-8601 UTC startsAt string returned by get_available_slots.",
        },
        note: {
          type: "string",
          description: "Optional short note from the visitor for the consultation.",
        },
      },
      required: ["startsAt"],
    },
  },
  {
    name: "escalate_to_team",
    description:
      "Notify the human Core Logic Systems team when a visitor requests a human, is frustrated, or asks about contracts, discounts, custom terms, or topics outside the knowledge base.",
    input_schema: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          description: "Concise explanation of why human follow-up is needed.",
        },
        urgency: {
          type: "string",
          enum: ["normal", "high"],
          description: "Urgency level (default: normal; high for frustrated/urgent issues).",
        },
      },
      required: ["reason"],
    },
  },
];

export interface ConversationLeadStore {
  findConversationWithLead(conversationId: string): Promise<{
    id: string;
    sessionId: string;
    leadId: string | null;
    lead: Lead | null;
  } | null>;
  createLeadAndLinkConversation(params: {
    conversationId: string;
    data: {
      name: string;
      whatsappNumber: string;
      requestType: LeadRequestType;
      projectType: string | null;
      projectDescription: string | null;
      requirements: string | null;
      companyName: string | null;
      existingSystem: string | null;
      budgetRange: string | null;
      expectedStart: string | null;
      email: string | null;
      consentGiven: true;
      consentAt: Date;
    };
  }): Promise<Lead>;
  updateLead(params: {
    leadId: string;
    data: Partial<{
      name: string;
      whatsappNumber: string;
      requestType: LeadRequestType;
      projectType: string | null;
      projectDescription: string | null;
      requirements: string | null;
      companyName: string | null;
      existingSystem: string | null;
      budgetRange: string | null;
      expectedStart: string | null;
      email: string | null;
      consentGiven: boolean;
      consentAt: Date;
      status: LeadStatus;
    }>;
  }): Promise<Lead>;
  claimLeadNotification(leadId: string, now: Date): Promise<boolean>;
}

const prismaConversationLeadStore: ConversationLeadStore = {
  async findConversationWithLead(conversationId) {
    return prisma.conversation.findUnique({
      where: { id: conversationId },
      select: {
        id: true,
        sessionId: true,
        leadId: true,
        lead: true,
      },
    });
  },
  async createLeadAndLinkConversation({ conversationId, data }) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.conversation.findUnique({
        where: { id: conversationId },
        select: { leadId: true },
      });
      if (current?.leadId) {
        return tx.lead.update({
          where: { id: current.leadId },
          data,
        });
      }
      const created = await tx.lead.create({
        data: {
          ...data,
          status: "NEW",
        },
      });
      await tx.conversation.update({
        where: { id: conversationId },
        data: { leadId: created.id },
      });
      return created;
    });
  },
  async updateLead({ leadId, data }) {
    return prisma.lead.update({
      where: { id: leadId },
      data,
    });
  },
  async claimLeadNotification(leadId, now) {
    const res = await prisma.lead.updateMany({
      where: { id: leadId, notifiedAt: null },
      data: { notifiedAt: now },
    });
    return res.count === 1;
  },
};

export interface ToolExecutionContext {
  conversationId: string;
  sessionId: string;
  store?: ConversationLeadStore;
  notifier?: AgentNotificationAdapter;
  getAvailableSlotsFn?: (
    options?: GetAvailableSlotsOptions
  ) => Promise<GetAvailableSlotsResult>;
  createPendingBookingFn?: (
    input: CreatePendingBookingInput
  ) => Promise<BookingWithLead>;
  now?: Date;
}

export type ToolExecutionResult =
  | {
      ok: true;
      leadId: string;
    }
  | {
      ok: true;
      slots: AvailableSlot[];
      moreAvailable: boolean;
      timezone: string;
    }
  | {
      ok: true;
      bookingId: string;
      status: "PENDING";
      startsAt: string;
      endsAt: string;
      label_en: string;
      label_ar: string;
      label_de?: string;
    }
  | {
      ok: true;
    }
  | {
      ok: false;
      error: string;
      message?: string;
      availableSlots?: AvailableSlot[];
    };

function convertArabicIndicDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/**
 * Validates and normalizes an international phone number to E.164 using libphonenumber-js.
 * Never guesses a country code if '+' or '00' international prefix is missing.
 */
export function normalizeWhatsAppNumber(
  rawPhone: string
): { ok: true; e164: string } | { ok: false; error: string } {
  const ascii = convertArabicIndicDigits(stripControlChars(rawPhone))
    .replace(/[\u200E\u200F\u202A-\u202E]/g, "")
    .trim();

  // Strip visual separators while keeping leading '+'
  const compact = ascii.replace(/[\s().-]+/g, "");

  let candidate = compact;
  if (candidate.startsWith("00") && candidate.length > 4) {
    candidate = `+${candidate.slice(2)}`;
  }

  if (!candidate.startsWith("+")) {
    return {
      ok: false,
      error:
        "MISSING_COUNTRY_CODE: Phone number is missing the international country code (e.g. +60 for Malaysia, +966 for Saudi Arabia). Politely ask the visitor to confirm their country code; do not guess.",
    };
  }

  const parsed = parsePhoneNumberFromString(candidate);
  if (!parsed || !parsed.isValid()) {
    return {
      ok: false,
      error:
        "INVALID_PHONE_NUMBER: The WhatsApp number could not be validated. Politely ask the visitor to double-check their number including country code.",
    };
  }

  return {
    ok: true,
    e164: parsed.number,
  };
}

function cleanOptionalText(val: string | undefined): string | undefined {
  if (val === undefined) return undefined;
  const cleaned = stripControlChars(val).trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

/**
 * Executes an agent tool call safely on the server with strict Zod validation,
 * injected conversation context, and structured non-throwing error responses.
 */
export async function executeTool(
  name: string,
  rawInput: unknown,
  ctx: ToolExecutionContext
): Promise<ToolExecutionResult> {
  const store = ctx.store ?? prismaConversationLeadStore;
  const notifier = ctx.notifier ?? defaultNotificationAdapter;
  const slotsFn = ctx.getAvailableSlotsFn ?? ((opts) => getAvailableSlots(opts));
  const bookFn =
    ctx.createPendingBookingFn ?? ((inp) => createPendingBooking(inp));
  const now = ctx.now ?? new Date();

  try {
    switch (name) {
      case "save_lead": {
        const parsed = SaveLeadInputSchema.safeParse(rawInput);
        if (!parsed.success) {
          return {
            ok: false,
            error: `INVALID_INPUT: ${parsed.error.issues
              .map((i) => `${i.path.join(".") || "input"}: ${i.message}`)
              .join("; ")}`,
          };
        }

        const input = parsed.data;
        if (input.consent !== true) {
          return {
            ok: false,
            error:
              "CONSENT_REQUIRED: Show a short summary of the visitor's details and obtain explicit confirmation and consent for WhatsApp contact before calling save_lead.",
          };
        }

        const phoneCheck = normalizeWhatsAppNumber(input.whatsappNumber);
        if (!phoneCheck.ok) {
          return { ok: false, error: phoneCheck.error };
        }

        const conv = await store.findConversationWithLead(ctx.conversationId);
        if (!conv) {
          return {
            ok: false,
            error: "CONVERSATION_NOT_FOUND: Unable to locate active session.",
          };
        }

        const cleanedDescription = cleanOptionalText(input.projectDescription);
        const requiresDescription =
          input.requestType !== "SUPPORT" && input.requestType !== "OTHER";

        if (
          requiresDescription &&
          !cleanedDescription &&
          !conv.lead?.projectDescription
        ) {
          return {
            ok: false,
            error:
              "MISSING_PROJECT_DESCRIPTION: Please ask the visitor for a brief description of their project before saving the lead.",
          };
        }

        const cleanedName = stripControlChars(input.name).trim();
        const cleanedProjectType = cleanOptionalText(input.projectType);
        const cleanedRequirements = cleanOptionalText(input.requirements);
        const cleanedCompany = cleanOptionalText(input.companyName);
        const cleanedExistingSystem = cleanOptionalText(input.existingSystem);
        const cleanedBudget = cleanOptionalText(input.budgetRange);
        const cleanedExpectedStart = cleanOptionalText(input.expectedStart);
        const cleanedEmail = cleanOptionalText(input.email);

        let savedLead: Lead;
        if (conv.lead) {
          savedLead = await store.updateLead({
            leadId: conv.lead.id,
            data: {
              name: cleanedName,
              whatsappNumber: phoneCheck.e164,
              requestType: input.requestType,
              ...(cleanedProjectType !== undefined
                ? { projectType: cleanedProjectType }
                : {}),
              ...(cleanedDescription !== undefined
                ? { projectDescription: cleanedDescription }
                : {}),
              ...(cleanedRequirements !== undefined
                ? { requirements: cleanedRequirements }
                : {}),
              ...(cleanedCompany !== undefined
                ? { companyName: cleanedCompany }
                : {}),
              ...(cleanedExistingSystem !== undefined
                ? { existingSystem: cleanedExistingSystem }
                : {}),
              ...(cleanedBudget !== undefined
                ? { budgetRange: cleanedBudget }
                : {}),
              ...(cleanedExpectedStart !== undefined
                ? { expectedStart: cleanedExpectedStart }
                : {}),
              ...(cleanedEmail !== undefined ? { email: cleanedEmail } : {}),
              consentGiven: true,
              ...(conv.lead.consentAt ? {} : { consentAt: now }),
            },
          });
        } else {
          savedLead = await store.createLeadAndLinkConversation({
            conversationId: ctx.conversationId,
            data: {
              name: cleanedName,
              whatsappNumber: phoneCheck.e164,
              requestType: input.requestType,
              projectType: cleanedProjectType ?? null,
              projectDescription: cleanedDescription ?? null,
              requirements: cleanedRequirements ?? null,
              companyName: cleanedCompany ?? null,
              existingSystem: cleanedExistingSystem ?? null,
              budgetRange: cleanedBudget ?? null,
              expectedStart: cleanedExpectedStart ?? null,
              email: cleanedEmail ?? null,
              consentGiven: true,
              consentAt: now,
            },
          });
        }

        // Notify owner on WhatsApp at most once per lead (non-blocking to tool success)
        if (!savedLead.notifiedAt) {
          const claimed = await store.claimLeadNotification(savedLead.id, now);
          if (claimed) {
            try {
              await notifier.notifyNewLead({ ...savedLead, notifiedAt: now });
            } catch (notifyErr) {
              safeLogError("tool.save_lead.notify_failed", notifyErr, {
                leadId: savedLead.id,
                phone: maskPhone(savedLead.whatsappNumber),
              });
            }
          }
        }

        safeLogInfo("tool.save_lead.ok", {
          leadId: savedLead.id,
          requestType: savedLead.requestType,
          phone: maskPhone(savedLead.whatsappNumber),
        });

        return {
          ok: true,
          leadId: savedLead.id,
        };
      }

      case "get_available_slots": {
        const parsed = GetAvailableSlotsInputSchema.safeParse(rawInput ?? {});
        if (!parsed.success) {
          return {
            ok: false,
            error: `INVALID_INPUT: ${parsed.error.issues
              .map((i) => i.message)
              .join("; ")}`,
          };
        }

        const result = await slotsFn({
          days: parsed.data.daysAhead,
          now: ctx.now,
        });

        return {
          ok: true,
          slots: result.slots,
          moreAvailable: result.moreAvailable,
          timezone: result.timezone,
        };
      }

      case "book_appointment": {
        const parsed = BookAppointmentInputSchema.safeParse(rawInput);
        if (!parsed.success) {
          return {
            ok: false,
            error: `INVALID_INPUT: ${parsed.error.issues
              .map((i) => i.message)
              .join("; ")}`,
          };
        }

        const conv = await store.findConversationWithLead(ctx.conversationId);
        if (!conv || !conv.lead) {
          return {
            ok: false,
            error:
              "LEAD_REQUIRED: Save the visitor's lead details via save_lead (with explicit confirmation and consent) before booking an appointment.",
          };
        }

        try {
          const booking = await bookFn({
            leadId: conv.lead.id,
            startsAt: parsed.data.startsAt,
            note: cleanOptionalText(parsed.data.note),
          });

          const labels = formatSlotLabels(booking.startsAt, booking.endsAt);

          try {
            await notifier.notifyBookingRequest(
              booking as Booking & { lead: Lead }
            );
          } catch (notifyErr) {
            safeLogError("tool.book_appointment.notify_failed", notifyErr, {
              bookingId: booking.id,
              leadId: conv.lead.id,
            });
          }

          safeLogInfo("tool.book_appointment.ok", {
            bookingId: booking.id,
            leadId: conv.lead.id,
            startsAt: booking.startsAt.toISOString(),
          });

          return {
            ok: true,
            bookingId: booking.id,
            status: "PENDING",
            startsAt: booking.startsAt.toISOString(),
            endsAt: booking.endsAt.toISOString(),
            label_en: labels.label_en,
            label_ar: labels.label_ar,
            label_de: labels.label_de,
          };
        } catch (err) {
          if (err instanceof SlotUnavailableError) {
            const fresh = await slotsFn({ now: ctx.now });
            return {
              ok: false,
              error: "SLOT_UNAVAILABLE",
              message:
                "The requested slot is unavailable. Offer one of the fresh availableSlots.",
              availableSlots: fresh.slots,
            };
          }
          safeLogError("tool.book_appointment.failed", err, {
            conversationId: ctx.conversationId,
          });
          return {
            ok: false,
            error:
              "BOOKING_ERROR: Could not create the booking request at this moment.",
          };
        }
      }

      case "escalate_to_team": {
        const parsed = EscalateToTeamInputSchema.safeParse(rawInput);
        if (!parsed.success) {
          return {
            ok: false,
            error: `INVALID_INPUT: ${parsed.error.issues
              .map((i) => i.message)
              .join("; ")}`,
          };
        }

        const conv = await store.findConversationWithLead(ctx.conversationId);
        let activeLead = conv?.lead ?? null;

        if (activeLead && activeLead.status === "CLOSED") {
          activeLead = await store.updateLead({
            leadId: activeLead.id,
            data: { status: "NEW" },
          });
        }

        try {
          await notifier.notifyEscalation({
            conversationId: ctx.conversationId,
            sessionId: ctx.sessionId,
            reason: stripControlChars(parsed.data.reason).trim(),
            urgency: parsed.data.urgency,
            lead: activeLead
              ? {
                  id: activeLead.id,
                  name: activeLead.name,
                  whatsappNumber: activeLead.whatsappNumber,
                  requestType: activeLead.requestType,
                }
              : null,
          });
        } catch (notifyErr) {
          safeLogError("tool.escalate_to_team.notify_failed", notifyErr, {
            conversationId: ctx.conversationId,
          });
        }

        safeLogInfo("tool.escalate_to_team.ok", {
          conversationId: ctx.conversationId,
          urgency: parsed.data.urgency,
          hasLead: Boolean(activeLead),
        });

        return { ok: true };
      }

      default:
        return {
          ok: false,
          error: `UNKNOWN_TOOL: Tool "${name}" is not supported.`,
        };
    }
  } catch (unexpectedError) {
    safeLogError("tool.execute_unexpected_error", unexpectedError, {
      tool: name,
      conversationId: ctx.conversationId,
    });
    return {
      ok: false,
      error: "INTERNAL_TOOL_ERROR: Unable to complete this action right now.",
    };
  }
}
