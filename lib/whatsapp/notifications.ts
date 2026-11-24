import type { Booking, Lead } from "@prisma/client";
import { formatSlotLabels } from "@/lib/booking/availability";
import { siteConfig } from "@/config/site";
import { maskPhone, safeLogInfo, safeLogWarn } from "@/lib/security/mask";
import {
  sendTemplate,
  sendText,
  type WhatsAppClientOptions,
} from "@/lib/whatsapp/client";
import {
  normalizeDigitsOnlyPhone,
  sanitizeTemplateParam,
  WHATSAPP_CONFIG,
} from "@/lib/whatsapp/config";
import type {
  AgentNotificationAdapter,
  EscalationNoticePayload,
} from "@/lib/whatsapp/types";

export type BookingNotificationRecord = Booking & {
  lead: Lead & {
    conversations?: Array<{ id: string; language: string | null }>;
  };
};

function getOwnerNumber(): string {
  return normalizeDigitsOnlyPhone(process.env.OWNER_WHATSAPP_NUMBER);
}

/**
 * Sends `new_lead_alert` template to OWNER_WHATSAPP_NUMBER.
 * Variables: {{1}} Name, {{2}} Request Type, {{3}} Customer WhatsApp, {{4}} Project Summary
 */
export async function notifyNewLead(
  lead: Lead,
  clientOptions?: WhatsAppClientOptions
): Promise<void> {
  const ownerTo = getOwnerNumber();
  if (!ownerTo) {
    safeLogWarn("whatsapp.notify_new_lead.missing_owner_number", {
      leadId: lead.id,
    });
    return;
  }

  const summaryParts = [
    lead.projectType ? `[${lead.projectType}]` : null,
    lead.projectDescription,
    lead.companyName ? `Company: ${lead.companyName}` : null,
    lead.budgetRange ? `Budget: ${lead.budgetRange}` : null,
  ].filter(Boolean);

  try {
    await sendTemplate(
      {
        to: ownerTo,
        name: WHATSAPP_CONFIG.templates.newLeadAlert.name,
        languageCode: WHATSAPP_CONFIG.templates.newLeadAlert.defaultLanguage,
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: sanitizeTemplateParam(lead.name, 120) },
              {
                type: "text",
                text: sanitizeTemplateParam(lead.requestType, 40),
              },
              {
                type: "text",
                text: sanitizeTemplateParam(lead.whatsappNumber, 40),
              },
              {
                type: "text",
                text: sanitizeTemplateParam(summaryParts.join(" — "), 380),
              },
            ],
          },
        ],
      },
      clientOptions
    );
  } catch (err) {
    // Fallback to plain text if custom Meta template is not created/approved yet
    // (delivers immediately within an open 24h session window on Meta Test/Business numbers).
    safeLogWarn("whatsapp.notify_new_lead.template_fallback_to_text", {
      leadId: lead.id,
      reason: err instanceof Error ? err.message : "template_failed",
    });
    const fallbackText = [
      "🔔 عميل جديد من المساعد الذكي (Core Logic Systems):",
      `• الاسم: ${lead.name}`,
      `• نوع الطلب: ${lead.requestType}`,
      `• واتساب العميل: ${lead.whatsappNumber}`,
      `• الملخص: ${summaryParts.join(" — ") || "-"}`,
    ].join("\n");
    await sendText({ to: ownerTo, body: fallbackText }, clientOptions);
  }
}

/**
 * Sends `booking_request_alert` template to OWNER_WHATSAPP_NUMBER with two quick-reply buttons:
 *   - index 0: BOOKING_CONFIRM:<bookingId>
 *   - index 1: BOOKING_REJECT:<bookingId>
 * Variables: {{1}} Name, {{2}} Date & Time (MYT), {{3}} Customer WhatsApp
 */
export async function notifyBookingRequest(
  booking: Booking & { lead: Lead },
  clientOptions?: WhatsAppClientOptions
): Promise<void> {
  const ownerTo = getOwnerNumber();
  if (!ownerTo) {
    safeLogWarn("whatsapp.notify_booking_request.missing_owner_number", {
      bookingId: booking.id,
    });
    return;
  }

  const labels = formatSlotLabels(booking.startsAt, booking.endsAt);
  const ownerLang =
    WHATSAPP_CONFIG.templates.bookingRequestAlert.defaultLanguage;
  const formattedTime = ownerLang.startsWith("ar")
    ? labels.label_ar
    : labels.label_en;

  try {
    await sendTemplate(
      {
        to: ownerTo,
        name: WHATSAPP_CONFIG.templates.bookingRequestAlert.name,
        languageCode: ownerLang,
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: sanitizeTemplateParam(booking.lead.name, 120),
              },
              {
                type: "text",
                text: sanitizeTemplateParam(formattedTime, 200),
              },
              {
                type: "text",
                text: sanitizeTemplateParam(booking.lead.whatsappNumber, 40),
              },
            ],
          },
          {
            type: "button",
            sub_type: "quick_reply",
            index: "0",
            parameters: [
              { type: "payload", payload: `BOOKING_CONFIRM:${booking.id}` },
            ],
          },
          {
            type: "button",
            sub_type: "quick_reply",
            index: "1",
            parameters: [
              { type: "payload", payload: `BOOKING_REJECT:${booking.id}` },
            ],
          },
        ],
      },
      clientOptions
    );
  } catch (err) {
    safeLogWarn("whatsapp.notify_booking_request.template_fallback_to_text", {
      bookingId: booking.id,
      reason: err instanceof Error ? err.message : "template_failed",
    });
    const fallbackText = [
      "📅 طلب حجز استشارة جديد (Core Logic Systems):",
      `• الاسم: ${booking.lead.name}`,
      `• الموعد: ${formattedTime}`,
      `• واتساب العميل: ${booking.lead.whatsappNumber}`,
      `• رقم الحجز: ${booking.id}`,
      "يمكنك تأكيد أو رفض الحجز من لوحة التحكم /admin/bookings",
    ].join("\n");
    await sendText({ to: ownerTo, body: fallbackText }, clientOptions);
  }
}

/**
 * Sends `escalation_alert` template to OWNER_WHATSAPP_NUMBER.
 * Variables: {{1}} Reason (with urgency), {{2}} Conversation / Admin reference
 */
export async function notifyEscalation(
  payload: EscalationNoticePayload,
  clientOptions?: WhatsAppClientOptions
): Promise<void> {
  const ownerTo = getOwnerNumber();
  if (!ownerTo) {
    safeLogWarn("whatsapp.notify_escalation.missing_owner_number", {
      conversationId: payload.conversationId,
    });
    return;
  }

  const urgencyTag = payload.urgency === "high" ? "[HIGH] " : "";
  const reasonText = `${urgencyTag}${payload.reason}`;
  const refParts = [
    `Conv: ${payload.conversationId}`,
    payload.lead
      ? `Lead: ${payload.lead.name} (${payload.lead.whatsappNumber}) — ${siteConfig.url}/admin/leads?id=${payload.lead.id}`
      : "No saved lead yet",
  ];

  await sendTemplate(
    {
      to: ownerTo,
      name: WHATSAPP_CONFIG.templates.escalationAlert.name,
      languageCode: WHATSAPP_CONFIG.templates.escalationAlert.defaultLanguage,
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: sanitizeTemplateParam(reasonText, 300) },
            {
              type: "text",
              text: sanitizeTemplateParam(refParts.join(" | "), 300),
            },
          ],
        },
      ],
    },
    clientOptions
  );
}

/**
 * Sends `booking_confirmed_customer` or `booking_rejected_customer` to the customer's
 * WhatsApp number using the language stored on their conversation ("ar" or "en").
 * Variables: {{1}} Name, {{2}} Date & Time (MYT)
 */
export async function notifyCustomerBookingDecision(
  booking: BookingNotificationRecord,
  decision: "CONFIRM" | "REJECT",
  clientOptions?: WhatsAppClientOptions
): Promise<void> {
  const customerPhone = booking.lead.whatsappNumber;
  const storedLang = booking.lead.conversations?.[0]?.language;
  const isArabic = storedLang === "ar";

  const labels = formatSlotLabels(booking.startsAt, booking.endsAt);
  const slotLabel = isArabic ? labels.label_ar : labels.label_en;

  const tpl =
    decision === "CONFIRM"
      ? WHATSAPP_CONFIG.templates.bookingConfirmedCustomer
      : WHATSAPP_CONFIG.templates.bookingRejectedCustomer;
  const languageCode = isArabic ? tpl.languages.ar : tpl.languages.en;

  await sendTemplate(
    {
      to: customerPhone,
      name: tpl.name,
      languageCode,
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: sanitizeTemplateParam(booking.lead.name, 120),
            },
            { type: "text", text: sanitizeTemplateParam(slotLabel, 220) },
          ],
        },
      ],
    },
    clientOptions
  );

  safeLogInfo("whatsapp.notify_customer_booking_decision.sent", {
    bookingId: booking.id,
    decision,
    languageCode,
    to: maskPhone(customerPhone),
  });
}

/**
 * Sends a short free-form reply to the owner inside the 24-hour webhook reply window.
 */
export async function replyToOwnerText(
  body: string,
  clientOptions?: WhatsAppClientOptions
): Promise<void> {
  const ownerTo = getOwnerNumber();
  if (!ownerTo) return;
  await sendText({ to: ownerTo, body }, clientOptions);
}

export const defaultNotificationAdapter: AgentNotificationAdapter = {
  notifyNewLead: (lead) => notifyNewLead(lead),
  notifyBookingRequest: (booking) => notifyBookingRequest(booking),
  notifyEscalation: (payload) => notifyEscalation(payload),
};
