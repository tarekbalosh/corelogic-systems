export type UiLanguage = "en" | "de" | "ar";

export interface ChatStrings {
  companyName: string;
  subtitle: string;
  launcherLabel: string;
  closeLabel: string;
  langToggleLabel: string;
  langToggleShort: string;
  welcomeMessage: string;
  quickReplies: string[];
  inputPlaceholder: string;
  sendLabel: string;
  retryLabel: string;
  typingLabel: string;
  availableSlotsTitle: string;
  slotChosenPrefix: string;
  bookingPendingTitle: string;
  bookingPendingBadge: string;
  bookingPendingSubtitle: string;
  bookingConfirmedBadge: string;
  bookingRejectedBadge: string;
  privacyText: string;
  privacyLinkLabel: string;
  privacyHref: string;
  networkErrorText: string;
  botCheckRequiredText: string;
}

export const CHAT_STRINGS: Record<UiLanguage, ChatStrings> = {
  en: {
    companyName: "Core Logic Systems",
    subtitle: "AI Assistant",
    launcherLabel: "Open Core Logic Systems AI chat assistant",
    closeLabel: "Close chat panel",
    langToggleLabel: "Switch chat interface to German",
    langToggleShort: "DE",
    welcomeMessage:
      "Welcome to **Core Logic Systems**! Tell me briefly about what you'd like to build, or select a topic below to get started.",
    quickReplies: [
      "Build a website",
      "Custom system / ERP / CRM",
      "AI chatbot or automation",
      "Book a consultation",
    ],
    inputPlaceholder: "Type your message…",
    sendLabel: "Send message",
    retryLabel: "Retry",
    typingLabel: "Assistant is typing",
    availableSlotsTitle: "Available Consultation Times (MYT)",
    slotChosenPrefix: "I choose",
    bookingPendingTitle: "Booking request received — pending confirmation",
    bookingPendingBadge: "Pending team confirmation",
    bookingPendingSubtitle:
      "Checking confirmation status automatically. You will also be notified on WhatsApp.",
    bookingConfirmedBadge: "Confirmed ✓",
    bookingRejectedBadge: "The team will propose another time",
    privacyText:
      "By chatting you agree that we process your messages to assist you. Do not share passwords or sensitive data.",
    privacyLinkLabel: "Privacy Policy",
    privacyHref: "/privacy",
    networkErrorText:
      "Connection interrupted. Please check your network and try again.",
    botCheckRequiredText:
      "Please complete the quick security check before sending your first message.",
  },
  de: {
    companyName: "CoreLogic Systems",
    subtitle: "KI-Assistent",
    launcherLabel: "KI-Chat-Assistent von CoreLogic Systems öffnen",
    closeLabel: "Chat-Fenster schließen",
    langToggleLabel: "Chat-Oberfläche auf Arabisch umschalten",
    langToggleShort: "AR",
    welcomeMessage:
      "Willkommen bei **CoreLogic Systems**! Schildern Sie kurz Ihr Vorhaben oder wählen Sie eines der Themen unten aus.",
    quickReplies: [
      "Webanwendung entwickeln",
      "Individuelle Software / ERP / CRM",
      "KI-Chatbot oder Automatisierung",
      "Erstberatung buchen",
    ],
    inputPlaceholder: "Ihre Nachricht eingeben …",
    sendLabel: "Nachricht senden",
    retryLabel: "Erneut versuchen",
    typingLabel: "Assistent schreibt",
    availableSlotsTitle: "Verfügbare Beratungstermine (Europe/Berlin, MEZ/MESZ)",
    slotChosenPrefix: "Ich wähle den Termin:",
    bookingPendingTitle: "Terminanfrage eingegangen – wartet auf Bestätigung",
    bookingPendingBadge: "Wartet auf Bestätigung durch das Team",
    bookingPendingSubtitle:
      "Der Bestätigungsstatus wird automatisch aktualisiert. Sie erhalten zusätzlich eine Nachricht per WhatsApp.",
    bookingConfirmedBadge: "Bestätigt ✓",
    bookingRejectedBadge: "Unser Team schlägt einen Ausweichtermin vor",
    privacyText:
      "Mit dem Start des Chats stimmen Sie zu, dass wir Ihre Nachrichten zur Bearbeitung Ihrer Anfrage verarbeiten. Bitte teilen Sie keine Passwörter oder sensiblen Daten.",
    privacyLinkLabel: "Datenschutz",
    privacyHref: "/de/datenschutz",
    networkErrorText:
      "Verbindung unterbrochen. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.",
    botCheckRequiredText:
      "Bitte schließen Sie die kurze Sicherheitsprüfung ab, bevor Sie Ihre erste Nachricht senden.",
  },
  ar: {
    companyName: "Core Logic Systems",
    subtitle: "المساعد الذكي",
    launcherLabel: "فتح المساعد الذكي لشركة كورلوجيك سيستمز",
    closeLabel: "إغلاق نافذة المحادثة",
    langToggleLabel: "تبديل واجهة المحادثة إلى الإنجليزية",
    langToggleShort: "EN",
    welcomeMessage:
      "مرحباً بك في **Core Logic Systems**! أخبرني باختصار عن المشروع الذي ترغب ببنائه، أو اختر أحد الخيارات أدناه للبدء.",
    quickReplies: [
      "تصميم وتطوير موقع إلكتروني",
      "نظام مخصص / ERP / CRM",
      "شات بوت أو أتمتة بالذكاء الاصطناعي",
      "حجز موعد استشارة",
    ],
    inputPlaceholder: "اكتب رسالتك هنا…",
    sendLabel: "إرسال الرسالة",
    retryLabel: "إعادة المحاولة",
    typingLabel: "يكتب المساعد الآن",
    availableSlotsTitle: "المواعيد المتاحة للاستشارة (بتوقيت ماليزيا MYT)",
    slotChosenPrefix: "أختار الموعد:",
    bookingPendingTitle: "تم استلام طلب الحجز — قيد التأكيد",
    bookingPendingBadge: "بانتظار تأكيد الإدارة",
    bookingPendingSubtitle:
      "يتم تحديث الحالة تلقائياً، كما سيصلك إشعار عبر واتساب فور التأكيد.",
    bookingConfirmedBadge: "تم التأكيد ✓",
    bookingRejectedBadge: "سيقترح الفريق وقتاً آخر يناسبك",
    privacyText:
      "بدء المحادثة يعني موافقتك على معالجة رسائلك لمساعدتك. لا تشارك كلمات المرور أو البيانات الحساسة.",
    privacyLinkLabel: "سياسة الخصوصية",
    privacyHref: "/ar/privacy",
    networkErrorText:
      "انقطع الاتصال أثناء الإرسال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى.",
    botCheckRequiredText:
      "يرجى إكمال التحقق الأمني السريع قبل إرسال رسالتك الأولى.",
  },
};

export function detectBubbleDirection(
  text: string,
  fallback: UiLanguage
): "rtl" | "ltr" {
  const ar = text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g)?.length ?? 0;
  const latin = text.match(/[A-Za-zÄÖÜäöüß]/g)?.length ?? 0;
  if (ar + latin === 0) {
    return fallback === "ar" ? "rtl" : "ltr";
  }
  return ar / (ar + latin) >= 0.2 ? "rtl" : "ltr";
}
