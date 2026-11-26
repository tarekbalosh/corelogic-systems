import type { Booking, Lead } from "@prisma/client";
import { formatSlotLabels } from "@/lib/booking/availability";
import { siteConfig } from "@/config/site";
import { maskPhone, safeLogInfo, safeLogWarn } from "@/lib/security/mask";
import {
  sendInteractiveButtons,
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
    safeLogWarn("whatsapp.notify_booking_request.template_fallback_to_interactive", {
      bookingId: booking.id,
      reason: err instanceof Error ? err.message : "template_failed",
    });
    const bodyText = [
      "📅 طلب حجز استشارة جديد (Core Logic Systems):",
      `• الاسم: ${booking.lead.name}`,
      `• الموعد: ${formattedTime}`,
      `• واتساب العميل: ${booking.lead.whatsappNumber}`,
      booking.customerNote ? `• ملاحظة: ${booking.customerNote}` : null,
      "",
      "اختر أحد الأزرار أدناه لتأكيد أو رفض الحجز فوراً:",
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    try {
      await sendInteractiveButtons(
        {
          to: ownerTo,
          body: bodyText,
          footer: "Core Logic Systems Booking",
          buttons: [
            {
              id: `BOOKING_CONFIRM:${booking.id}`,
              title: "✅ تأكيد الحجز",
            },
            {
              id: `BOOKING_REJECT:${booking.id}`,
              title: "❌ رفض الحجز",
            },
          ],
        },
        clientOptions
      );
    } catch {
      await sendText({ to: ownerTo, body: bodyText }, clientOptions);
    }
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
 * WhatsApp number using the language stored on their conversation ("ar", "de", or "en").
 * Template names and variable order are unchanged:
 * Variables: {{1}} Name, {{2}} Date & Time (Europe/Berlin MEZ/MESZ for "de", MYT for "en"/"ar")
 */
export async function notifyCustomerBookingDecision(
  booking: BookingNotificationRecord,
  decision: "CONFIRM" | "REJECT",
  clientOptions?: WhatsAppClientOptions
): Promise<void> {
  const customerPhone = booking.lead.whatsappNumber;
  const storedLang = booking.lead.conversations?.[0]?.language;
  const customerLocale: "ar" | "de" | "en" =
    storedLang === "ar" ? "ar" : storedLang === "de" ? "de" : "en";

  const labels = formatSlotLabels(booking.startsAt, booking.endsAt);
  const slotLabel =
    customerLocale === "ar"
      ? labels.label_ar
      : customerLocale === "de"
        ? labels.label_de
        : labels.label_en;

  const tpl =
    decision === "CONFIRM"
      ? WHATSAPP_CONFIG.templates.bookingConfirmedCustomer
      : WHATSAPP_CONFIG.templates.bookingRejectedCustomer;
  const languageCode = tpl.languages[customerLocale];

  try {
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
  } catch (err) {
    safeLogWarn(
      "whatsapp.notify_customer_booking_decision.template_fallback_to_text",
      {
        bookingId: booking.id,
        decision,
        reason: err instanceof Error ? err.message : "template_failed",
      }
    );
    const fallbackBody =
      decision === "CONFIRM"
        ? customerLocale === "ar"
          ? `✅ مرحباً ${booking.lead.name}، تم تأكيد موعد استشارتك مع Core Logic Systems بنجاح!\n\n📅 الموعد: ${slotLabel}\n\nنتطلع للتحدث معك.`
          : customerLocale === "de"
            ? `✅ Guten Tag ${booking.lead.name}, Ihr Beratungstermin bei CoreLogic Systems wurde bestätigt.\n\n📅 Termin: ${slotLabel}\n\nWir freuen uns auf das Gespräch mit Ihnen.`
            : `✅ Hello ${booking.lead.name}, your consultation with Core Logic Systems has been confirmed!\n\n📅 Time: ${slotLabel}\n\nWe look forward to speaking with you.`
        : customerLocale === "ar"
          ? `نعتذر يا ${booking.lead.name}، الموعد المقترح (${slotLabel}) غير متاح حالياً.${booking.alternativeProposal ? `\n\nالموعد البديل المقترح: ${booking.alternativeProposal}` : ""}\n\nيمكنك الرد علينا هنا أو اختيار موعد آخر من الموقع.`
          : customerLocale === "de"
            ? `Guten Tag ${booking.lead.name}, der angefragte Beratungstermin (${slotLabel}) ist leider nicht mehr verfügbar.${booking.alternativeProposal ? `\n\nAlternativvorschlag: ${booking.alternativeProposal}` : ""}\n\nAntworten Sie uns gerne hier oder wählen Sie einen anderen Termin auf unserer Website.`
            : `Hi ${booking.lead.name}, unfortunately the requested slot (${slotLabel}) is no longer available.${booking.alternativeProposal ? `\n\nProposed alternative: ${booking.alternativeProposal}` : ""}\n\nPlease reply here or choose another slot on our website.`;

    await sendText({ to: customerPhone, body: fallbackBody }, clientOptions);
  }

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
