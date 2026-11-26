/**
 * Centralized WhatsApp Business Cloud API template names and language codes.
 * Adjust here (or via optional environment variables) if Meta approves templates
 * under a regional locale code such as "en_US" instead of "en".
 */
export const WHATSAPP_CONFIG = {
  defaultApiVersion: "v21.0",
  requestTimeoutMs: 10_000,
  maxRetries: 2,
  initialBackoffMs: 400,

  templates: {
    newLeadAlert: {
      name: process.env.WHATSAPP_TPL_NEW_LEAD ?? "new_lead_alert",
      defaultLanguage: process.env.WHATSAPP_OWNER_TEMPLATE_LANG ?? "ar",
    },
    bookingRequestAlert: {
      name: process.env.WHATSAPP_TPL_BOOKING_REQUEST ?? "booking_request_alert",
      defaultLanguage: process.env.WHATSAPP_OWNER_TEMPLATE_LANG ?? "ar",
    },
    bookingConfirmedCustomer: {
      name:
        process.env.WHATSAPP_TPL_BOOKING_CONFIRMED ??
        "booking_confirmed_customer",
      languages: {
        ar: process.env.WHATSAPP_CUSTOMER_LANG_AR ?? "ar",
        en: process.env.WHATSAPP_CUSTOMER_LANG_EN ?? "en",
        de: process.env.WHATSAPP_CUSTOMER_LANG_DE ?? "de",
      },
    },
    bookingRejectedCustomer: {
      name:
        process.env.WHATSAPP_TPL_BOOKING_REJECTED ??
        "booking_rejected_customer",
      languages: {
        ar: process.env.WHATSAPP_CUSTOMER_LANG_AR ?? "ar",
        en: process.env.WHATSAPP_CUSTOMER_LANG_EN ?? "en",
        de: process.env.WHATSAPP_CUSTOMER_LANG_DE ?? "de",
      },
    },
    escalationAlert: {
      name: process.env.WHATSAPP_TPL_ESCALATION ?? "escalation_alert",
      defaultLanguage: process.env.WHATSAPP_OWNER_TEMPLATE_LANG ?? "ar",
    },
  },
} as const;

export function getWhatsAppApiVersion(): string {
  const v = process.env.WHATSAPP_API_VERSION?.trim();
  return v && /^v\d+\.\d+$/.test(v) ? v : WHATSAPP_CONFIG.defaultApiVersion;
}

export function isWhatsAppEnabled(): boolean {
  return process.env.WHATSAPP_ENABLED === "true";
}

export function normalizeDigitsOnlyPhone(phone: string | undefined | null): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

/**
 * Meta template body parameters reject newlines, tabs, and >4 consecutive spaces (#132018).
 */
export function sanitizeTemplateParam(
  text: string | null | undefined,
  maxLength = 400
): string {
  const collapsed = (text ?? "—")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (!collapsed) return "—";
  return collapsed.length > maxLength
    ? `${collapsed.slice(0, maxLength - 1)}…`
    : collapsed;
}
