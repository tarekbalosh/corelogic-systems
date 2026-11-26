"use server";

import { hasLocale, type Locale } from "@/lib/i18n-config";
import { buildContactConfirmationEmail } from "@/lib/email/templates";

const errorStrings: Record<Locale, { spam: string; missing: string }> = {
  en: {
    spam: "Request rejected.",
    missing: "Please fill in all required fields.",
  },
  de: {
    spam: "Anfrage abgelehnt.",
    missing: "Bitte füllen Sie alle Pflichtfelder aus.",
  },
  ar: {
    spam: "تم رفض الطلب.",
    missing: "يرجى تعبئة جميع الحقول المطلوبة.",
  },
};

export async function sendContactEmail(formData: FormData) {
  const rawLocale = String(formData.get("locale") ?? "en");
  const locale: Locale = hasLocale(rawLocale) ? rawLocale : "en";

  const honeypot = formData.get("website_url");
  if (honeypot) {
    return { success: false, error: errorStrings[locale].spam };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const service = String(formData.get("service") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!fullName || !email || !service) {
    return { success: false, error: errorStrings[locale].missing };
  }

  const confirmationEmail = buildContactConfirmationEmail({
    locale,
    fullName,
    service,
  });

  // TODO: integrate with Resend, SendGrid, or nodemailer to deliver inquiry to contact@corelogic-system.my
  // and confirmationEmail to the visitor's email address.
  console.log("Contact inquiry prepared:", {
    locale,
    service,
    hasPhone: Boolean(phone),
    hasMessage: Boolean(message),
    confirmationSubject: confirmationEmail.subject,
  });

  await new Promise((resolve) => setTimeout(resolve, 600));

  return { success: true };
}
