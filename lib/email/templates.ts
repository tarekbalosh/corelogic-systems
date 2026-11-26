import { formatSlotLabels, GERMAN_VISITOR_TIMEZONE } from "@/lib/booking/availability";
import { formatLocaleDate } from "@/lib/format";
import type { Locale } from "@/lib/i18n-config";

export interface EmailMessageContent {
  subject: string;
  text: string;
}

export function buildContactConfirmationEmail(params: {
  locale: Locale;
  fullName: string;
  service: string;
  submittedAt?: Date;
}): EmailMessageContent {
  const date = params.submittedAt ?? new Date();
  const formattedDate = formatLocaleDate(date, params.locale, {
    timeZone:
      params.locale === "de" ? GERMAN_VISITOR_TIMEZONE : "Asia/Kuala_Lumpur",
  });

  if (params.locale === "de") {
    return {
      subject: `Ihre Anfrage bei CoreLogic Systems (${params.service})`,
      text: [
        `Guten Tag ${params.fullName},`,
        "",
        `vielen Dank für Ihre Anfrage vom ${formattedDate} zum Thema „${params.service}“.`,
        "Unser Team bei CoreLogic Systems prüft Ihr Anliegen und meldet sich innerhalb von 24 Werktagsstunden bei Ihnen.",
        "",
        "Mit freundlichen Grüßen",
        "Ihr Team von CoreLogic Systems",
      ].join("\n"),
    };
  }

  if (params.locale === "ar") {
    return {
      subject: `تم استلام طلبك في CoreLogic Systems (${params.service})`,
      text: [
        `مرحباً ${params.fullName}،`,
        "",
        `شكراً لتواصلك معنا بتاريخ ${formattedDate} بخصوص «${params.service}».`,
        "سيراجع فريق CoreLogic Systems طلبك ويتواصل معك خلال 24 ساعة عمل.",
        "",
        "مع أطيب التحيات،",
        "فريق CoreLogic Systems",
      ].join("\n"),
    };
  }

  return {
    subject: `We received your inquiry at CoreLogic Systems (${params.service})`,
    text: [
      `Hello ${params.fullName},`,
      "",
      `Thank you for contacting us on ${formattedDate} regarding "${params.service}".`,
      "A specialist from CoreLogic Systems will review your message and get back to you within 24 business hours.",
      "",
      "Best regards,",
      "CoreLogic Systems Team",
    ].join("\n"),
  };
}

export function buildBookingConfirmedEmail(params: {
  locale: Locale;
  customerName: string;
  startsAt: Date;
  endsAt: Date;
}): EmailMessageContent {
  const labels = formatSlotLabels(params.startsAt, params.endsAt);

  if (params.locale === "de") {
    return {
      subject: "Terminbestätigung: Ihre Erstberatung bei CoreLogic Systems",
      text: [
        `Guten Tag ${params.customerName},`,
        "",
        "wir bestätigen hiermit Ihren Beratungstermin bei CoreLogic Systems:",
        `Termin: ${labels.label_de}`,
        "",
        "Wir freuen uns auf das Gespräch mit Ihnen.",
        "",
        "Mit freundlichen Grüßen",
        "Ihr Team von CoreLogic Systems",
      ].join("\n"),
    };
  }

  if (params.locale === "ar") {
    return {
      subject: "تأكيد موعد الاستشارة مع CoreLogic Systems",
      text: [
        `مرحباً ${params.customerName}،`,
        "",
        "يسعدنا تأكيد موعد الاستشارة الخاص بك مع فريق CoreLogic Systems:",
        `الموعد: ${labels.label_ar}`,
        "",
        "نتطلع للتحدث معك في الموعد المحدد.",
        "",
        "مع أطيب التحيات،",
        "فريق CoreLogic Systems",
      ].join("\n"),
    };
  }

  return {
    subject: "Consultation Confirmed — CoreLogic Systems",
    text: [
      `Hello ${params.customerName},`,
      "",
      "Your consultation appointment with CoreLogic Systems is confirmed:",
      `Time: ${labels.label_en}`,
      "",
      "Our team looks forward to speaking with you.",
      "",
      "Best regards,",
      "CoreLogic Systems Team",
    ].join("\n"),
  };
}

export function buildBookingRejectedEmail(params: {
  locale: Locale;
  customerName: string;
  startsAt: Date;
  endsAt: Date;
  alternativeProposal?: string | null;
}): EmailMessageContent {
  const labels = formatSlotLabels(params.startsAt, params.endsAt);
  const alt = params.alternativeProposal?.trim();

  if (params.locale === "de") {
    return {
      subject: "Rückmeldung zu Ihrer Terminanfrage bei CoreLogic Systems",
      text: [
        `Guten Tag ${params.customerName},`,
        "",
        `bezüglich Ihrer Terminanfrage für ${labels.label_de}: Dieser Zeitpunkt ist leider nicht mehr verfügbar.`,
        ...(alt ? ["", `Alternativvorschlag: ${alt}`] : []),
        "",
        "Unser Team bei CoreLogic Systems meldet sich zeitnah bei Ihnen, um einen passenden Ausweichtermin abzustimmen.",
        "",
        "Mit freundlichen Grüßen",
        "Ihr Team von CoreLogic Systems",
      ].join("\n"),
    };
  }

  if (params.locale === "ar") {
    return {
      subject: "بخصوص طلب موعد الاستشارة مع CoreLogic Systems",
      text: [
        `مرحباً ${params.customerName}،`,
        "",
        `بخصوص طلب الاستشارة في (${labels.label_ar})، هذا الوقت لم يعد متاحاً حالياً.`,
        ...(alt ? ["", `الموعد البديل المقترح: ${alt}`] : []),
        "",
        "سيتواصل معك فريق CoreLogic Systems قريباً لاقتراح وقت بديل يناسبك.",
        "",
        "مع أطيب التحيات،",
        "فريق CoreLogic Systems",
      ].join("\n"),
    };
  }

  return {
    subject: "Update on Your Consultation Request — CoreLogic Systems",
    text: [
      `Hello ${params.customerName},`,
      "",
      `Regarding your requested consultation slot (${labels.label_en}), that time is unfortunately no longer available.`,
      ...(alt ? ["", `Proposed alternative: ${alt}`] : []),
      "",
      "Our team at CoreLogic Systems will follow up shortly to propose an alternative time.",
      "",
      "Best regards,",
      "CoreLogic Systems Team",
    ].join("\n"),
  };
}
