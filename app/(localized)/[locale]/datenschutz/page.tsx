import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { hasLocale, type Locale } from "@/lib/i18n-config";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

type PageProps = { params: Promise<{ locale: string }> };

interface ServiceEntry {
  service: string;
  provider: string;
  purpose: string;
  dataProcessed: string;
  status: string;
}

const copy: Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    subtitle: string;
    legalReviewTitle: string;
    legalReviewBody: string;
    controllerTitle: string;
    controllerTodo: string;
    servicesTitle: string;
    servicesIntro: string;
    tableHeaders: [string, string, string, string];
    services: ServiceEntry[];
    cookiesTitle: string;
    cookiesSummary: string;
    cookieItems: Array<{ name: string; storage: string; purpose: string }>;
    consentAssessmentTitle: string;
    consentAssessmentBody: string;
    todoSectionsTitle: string;
    todoSections: Array<{ heading: string; todo: string }>;
  }
> = {
  de: {
    metaTitle: "Datenschutz – Struktur & Dienstleister-Übersicht (Entwurf – [TODO])",
    metaDescription:
      "Struktur der Datenschutzerklärung (DSGVO) und technische Übersicht aller auf der Website eingesetzten Drittanbieterdienste – Entwurf (noindex).",
    heading: "Datenschutzerklärung (Struktur-Entwurf)",
    subtitle:
      "Technische Bestandsaufnahme gemäß DSGVO / TDDDG – bis zur anwaltlichen Prüfung auf noindex gesetzt",
    legalReviewTitle: "Rechtlicher Prüfhinweis (noindex aktiv)",
    legalReviewBody:
      "Diese Seite stellt ausschließlich die technische Struktur und eine vollständige Bestandsaufnahme der auf dieser Website eingebundenen Dienste dar. Der finale rechtliche Text MUSS vor Veröffentlichung für den deutschen Markt von einer deutschen Rechtsanwältin / einem deutschen Rechtsanwalt oder einem geprüften Datenschutz-Tool (z. B. eRecht24 / IT-Recht Kanzlei) geprüft und freigegeben werden.",
    controllerTitle: "1. Verantwortlicher (Art. 4 Nr. 7 DSGVO)",
    controllerTodo: `[TODO: CoreLogic Systems UG (haftungsbeschränkt), vollständige deutsche Anschrift, Vertretungsberechtigte Person, E-Mail: ${siteConfig.email}, Telefonnummer ergänzen]`,
    servicesTitle: "2. Eingesetzte Drittanbieter & technische Infrastruktur",
    servicesIntro:
      "Folgende Dienste werden vom aktuellen Codebase tatsächlich angesprochen oder sind optional konfigurierbar:",
    tableHeaders: ["Dienst / Anbieter", "Zweck", "Verarbeitete Daten", "Hinweis"],
    services: [
      {
        service: "Hosting & CDN",
        provider: "Vercel Inc. (USA / Edge)",
        purpose: "Auslieferung der Website, Server-Funktionen und Sicherheits-Header",
        dataProcessed: "IP-Adresse, Zeitstempel, angeforderte URL, User-Agent (Server-Logs)",
        status: "[TODO: AVV/DPA & EU-US Data Privacy Framework prüfen]",
      },
      {
        service: "Datenbank (PostgreSQL)",
        provider: "Neon (via Prisma ORM)",
        purpose: "Speicherung von Chat-Verläufen, Leads, Beratungsbuchungen, Verfügbarkeiten & Rate-Limits",
        dataProcessed: "Name, E-Mail, WhatsApp-Nummer, Chat-Nachrichten, Terminzeiten, gehashte IP für Rate-Limits",
        status: "[TODO: EU-Region (z. B. Frankfurt) & AVV/DPA prüfen]",
      },
      {
        service: "Schriftarten (Inter, Space Grotesk, Cairo)",
        provider: "Selbstgehostet via next/font/google (Build-Time)",
        purpose: "Darstellung der Typografie",
        dataProcessed: "Keine Datenübermittlung an Google-Server zur Laufzeit (lokal über eigene Domain ausgeliefert)",
        status: "Datenschutzfreundlich umgesetzt",
      },
      {
        service: "KI-Chat-Assistent (LLM-API)",
        provider: "Anthropic PBC (oder optional Google Gemini / Groq via Env-Konfiguration)",
        purpose: "Beantwortung von Besucherfragen, Lead-Aufnahme und Terminvorbereitung im Chat-Widget",
        dataProcessed: "Vom Nutzer aktiv eingegebene Chat-Nachrichten (nur bei Nutzung des Widgets)",
        status: "[TODO: Aktiven Provider dokumentieren, AVV/DPA & Drittlandtransfer prüfen]",
      },
      {
        service: "WhatsApp Business Cloud API & wa.me-Links",
        provider: "Meta Platforms Ireland Ltd. / Meta Platforms, Inc.",
        purpose: "Terminbestätigungen/-absagen per WhatsApp nach ausdrücklicher Einwilligung des Nutzers sowie optionale Direktkontakt-Links",
        dataProcessed: "WhatsApp-Telefonnummer, Name, Terminzeitpunkt",
        status: "[TODO: Einwilligungstext (Art. 6 Abs. 1 lit. a DSGVO) & Meta-DPA juristisch prüfen]",
      },
      {
        service: "Google Maps (Kontaktseite)",
        provider: "Google Ireland Limited / Google LLC",
        purpose: "Optionale Standortkarte auf der Kontaktseite",
        dataProcessed: "Erst nach aktivem Klick auf „Google Maps laden“ (2-Klick-Lösung) wird eine Verbindung zu Google aufgebaut",
        status: "2-Klick-Sperre implementiert – [TODO: Einwilligungshinweis anwaltlich prüfen]",
      },
      {
        service: "Bot-Schutz (optional)",
        provider: "Cloudflare Turnstile (nur aktiv, wenn BOT_PROTECTION_ENABLED=true)",
        purpose: "Schutz des KI-Chats vor automatisiertem Missbrauch",
        dataProcessed: "Technische Browser-/Gerätesignale und IP-Adresse bei Öffnung des Chat-Widgets",
        status: "[TODO: Nur aufnehmen/aktivieren, wenn genutzt; AVV mit Cloudflare prüfen]",
      },
      {
        service: "Web-Analyse / Tracking",
        provider: "Derzeit KEIN Dienst eingebunden",
        purpose: "Kein Google Analytics, kein Meta Pixel, kein Vercel Analytics aktiv",
        dataProcessed: "Keine Marketing- oder Tracking-Daten",
        status: "Kein Tracking aktiv",
      },
    ],
    cookiesTitle: "3. Cookies, Local Storage & Consent-Banner-Bewertung",
    cookiesSummary:
      "Die Website verwendet derzeit ausschließlich technisch bzw. funktional erforderliche Speicherungen:",
    cookieItems: [
      {
        name: "NEXT_LOCALE",
        storage: "Cookie (SameSite=Lax, 1 Jahr)",
        purpose: "Speichert die vom Nutzer aktiv gewählte Sprache (DE / EN / AR) – funktional auf Nutzerwunsch.",
      },
      {
        name: "corelogic_chat_session_id",
        storage: "localStorage (Browser)",
        purpose: "Technische Sitzungs-ID für den KI-Chat-Assistenten (erst bei Nutzung relevant).",
      },
      {
        name: "corelogic_chat_messages_v1",
        storage: "sessionStorage (Browser)",
        purpose: "Zwischenspeicherung des sichtbaren Chat-Verlaufs für den aktuellen Tab.",
      },
      {
        name: "Admin-Session-Cookie",
        storage: "HttpOnly-Cookie (nur /admin/*)",
        purpose: "Authentifizierung für interne Administratoren.",
      },
    ],
    consentAssessmentTitle: "Bewertung: Wird ein Cookie-/Consent-Banner benötigt?",
    consentAssessmentBody:
      "Stand jetzt ist KEIN klassischer Cookie-Banner erforderlich, solange (1) kein Analyse-/Marketing-Tracking eingebunden wird, (2) Google Maps auf der Kontaktseite wie implementiert hinter der 2-Klick-Lösung bleibt, (3) Schriften lokal über next/font ausgeliefert werden und (4) WhatsApp- sowie Chat-Daten erst nach aktiver Handlung/Einwilligung des Nutzers verarbeitet werden. Falls künftig Analytics, Marketing-Pixel oder automatische Drittanbieter-Embeds ergänzt werden, ist vorab eine Consent-Management-Plattform (CMP) erforderlich. [TODO: Abschließende rechtliche Bewertung nach § 25 TDDDG durch Rechtsanwalt einholen.]",
    todoSectionsTitle: "4. Weitere Pflichtabschnitte (juristisch zu ergänzen)",
    todoSections: [
      {
        heading: "Rechtsgrundlagen & Speicherdauer",
        todo: "[TODO: Genaue Zuordnung der Rechtsgrundlagen (Art. 6 Abs. 1 lit. a, b, f DSGVO) sowie konkrete Löschfristen (z. B. Chat-Verläufe, Leads, Buchungen, Server-Logs) durch Rechtsberatung formulieren lassen.]",
      },
      {
        heading: "Drittlandübermittlungen (USA / Malaysia)",
        todo: "[TODO: Hinweise zu EU-US Data Privacy Framework, Standardvertragsklauseln (SCC) und Datenverarbeitung außerhalb des EWR juristisch ausformulieren.]",
      },
      {
        heading: "Betroffenenrechte (Art. 15–21, 77 DSGVO)",
        todo: "[TODO: Vollständige Belehrung über Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Widerruf von Einwilligungen und Beschwerderecht bei einer deutschen Aufsichtsbehörde ergänzen.]",
      },
    ],
  },
  en: {
    metaTitle: "Datenschutz / GDPR Privacy Notice (Draft Structure – [TODO])",
    metaDescription:
      "GDPR privacy notice structure and complete technical inventory of third-party services called by this website — noindex until reviewed by German legal counsel.",
    heading: "Datenschutz (GDPR Privacy Structure)",
    subtitle:
      "Technical third-party audit & placeholder structure — set to noindex until reviewed by a German lawyer",
    legalReviewTitle: "Legal Review Required (noindex enabled)",
    legalReviewBody:
      "This page provides only the structural outline and factual inventory of third-party services used by this site. The final German/English GDPR privacy text MUST be reviewed and finalized by a German lawyer (Rechtsanwalt) or certified German data-protection generator before removing noindex.",
    controllerTitle: "1. Data Controller (Art. 4(7) GDPR)",
    controllerTodo: `[TODO: CoreLogic Systems UG (haftungsbeschränkt), full German street address, authorized representative, Email: ${siteConfig.email}, German phone number]`,
    servicesTitle: "2. Third-Party Services & Infrastructure Inventory",
    servicesIntro:
      "Every external service actually called (or optionally enabled) by the current codebase:",
    tableHeaders: ["Service / Provider", "Purpose", "Data Processed", "Compliance Note"],
    services: [
      {
        service: "Hosting & CDN",
        provider: "Vercel Inc.",
        purpose: "Website hosting, serverless functions and edge delivery",
        dataProcessed: "IP address, timestamp, requested URL, user agent (access logs)",
        status: "[TODO: Review DPA & EU-US Data Privacy Framework]",
      },
      {
        service: "PostgreSQL Database",
        provider: "Neon (via Prisma ORM)",
        purpose: "Stores chat transcripts, leads, consultation bookings, availability rules and rate limits",
        dataProcessed: "Name, email, WhatsApp number, chat messages, booking slots, hashed IP",
        status: "[TODO: Confirm EU region (e.g. Frankfurt) & DPA]",
      },
      {
        service: "Web Fonts (Inter, Space Grotesk, Cairo)",
        provider: "Self-hosted via next/font/google (build-time)",
        purpose: "Typography rendering",
        dataProcessed: "Zero runtime requests to Google servers (served from same origin)",
        status: "Privacy-friendly (self-hosted)",
      },
      {
        service: "AI Chat Agent LLM API",
        provider: "Anthropic PBC (or optional Google Gemini / Groq via env config)",
        purpose: "Answers visitor questions, lead capture and consultation booking in the chat widget",
        dataProcessed: "Messages actively submitted by visitors using the chat widget",
        status: "[TODO: Document active provider, DPA & third-country transfer basis]",
      },
      {
        service: "WhatsApp Business Cloud API & wa.me",
        provider: "Meta Platforms Ireland Ltd. / Meta Platforms, Inc.",
        purpose: "Booking confirmation/rejection templates after explicit visitor consent and optional direct chat links",
        dataProcessed: "WhatsApp phone number, name, consultation timestamp",
        status: "[TODO: Legal review of consent wording (Art. 6(1)(a) GDPR) & Meta DPA]",
      },
      {
        service: "Google Maps (Contact Page)",
        provider: "Google Ireland Limited / Google LLC",
        purpose: "Optional location map on the Contact page",
        dataProcessed: "Loaded ONLY after active user click on 'Load Google Maps' (2-click gate)",
        status: "2-click consent gate implemented — [TODO: Lawyer review of notice]",
      },
      {
        service: "Bot Protection (Optional)",
        provider: "Cloudflare Turnstile (only if BOT_PROTECTION_ENABLED=true)",
        purpose: "Protects the AI chat endpoint against automated abuse",
        dataProcessed: "Technical browser/device signals and IP when opening chat",
        status: "[TODO: Include & sign Cloudflare DPA if enabled in production]",
      },
      {
        service: "Analytics / Marketing Tracking",
        provider: "NONE installed",
        purpose: "No Google Analytics, Meta Pixel or Vercel Analytics installed",
        dataProcessed: "None",
        status: "No tracking active",
      },
    ],
    cookiesTitle: "3. Cookies, Local Storage & Consent Banner Assessment",
    cookiesSummary:
      "The site currently uses only strictly functional/user-requested browser storage:",
    cookieItems: [
      {
        name: "NEXT_LOCALE",
        storage: "Cookie (SameSite=Lax, 1 year)",
        purpose: "Remembers the visitor's explicitly selected language (DE / EN / AR).",
      },
      {
        name: "corelogic_chat_session_id",
        storage: "localStorage",
        purpose: "Technical session identifier for the AI chat widget.",
      },
      {
        name: "corelogic_chat_messages_v1",
        storage: "sessionStorage",
        purpose: "Keeps visible chat messages in the current browser tab.",
      },
      {
        name: "Admin session cookie",
        storage: "HttpOnly cookie (/admin/* only)",
        purpose: "Internal admin console authentication.",
      },
    ],
    consentAssessmentTitle: "Is a Cookie / Consent Banner Needed?",
    consentAssessmentBody:
      "Currently NO general cookie banner is required as long as (1) no analytics/marketing trackers are added, (2) Google Maps remains behind the 2-click gate on the Contact page, (3) fonts remain self-hosted via next/font, and (4) chat/WhatsApp data are processed only upon active user request and consent. If analytics or marketing pixels are added later, a CMP consent banner will be required first. [TODO: Obtain final German legal confirmation under § 25 TDDDG.]",
    todoSectionsTitle: "4. Remaining Legal Sections (for Lawyer / Privacy Tool)",
    todoSections: [
      {
        heading: "Legal Bases & Retention Periods",
        todo: "[TODO: Draft final Art. 6(1) GDPR legal bases and retention/deletion periods (chat logs, leads, bookings, server logs) with German legal counsel.]",
      },
      {
        heading: "Third-Country Transfers (USA / Malaysia)",
        todo: "[TODO: Document EU-US Data Privacy Framework, Standard Contractual Clauses (SCCs), and cross-border access safeguards.]",
      },
      {
        heading: "Data Subject Rights (Art. 15–21, 77 GDPR)",
        todo: "[TODO: Insert verified statutory wording for access, rectification, erasure, restriction, portability, objection, withdrawal of consent, and supervisory authority complaint rights.]",
      },
    ],
  },
  ar: {
    metaTitle: "حماية البيانات – Datenschutz (مسودة هيكلية – [TODO])",
    metaDescription:
      "هيكل إشعار حماية البيانات وفق اللائحة الأوروبية DSGVO وقائمة الخدمات الخارجية المستخدمة في الموقع — لا تُفهرس (noindex) حتى المراجعة القانونية.",
    heading: "حماية البيانات (Datenschutz – مسودة هيكلية)",
    subtitle:
      "جرد تقني للخدمات الخارجية وفق متطلبات DSGVO و TDDDG — الصفحة على noindex حتى المراجعة القانونية",
    legalReviewTitle: "تتطلب مراجعة محامٍ ألماني (noindex مفعّل)",
    legalReviewBody:
      "تقدم هذه الصفحة الهيكل الأساسي وجرداً تقنياً دقيقاً لجميع الخدمات الخارجية التي يستدعيها الموقع فقط. يجب مراجعة النص النهائي واعتماده من قِبل محامٍ ألماني مختص أو أداة حماية بيانات معتمدة في ألمانيا قبل إزالة وسم noindex.",
    controllerTitle: "1. الجهة المسؤولة عن المعالجة (المادة 4 الفقرة 7 DSGVO)",
    controllerTodo: `[TODO: CoreLogic Systems UG (haftungsbeschränkt)، العنوان الكامل في ألمانيا، الممثل القانوني، البريد: ${siteConfig.email}، رقم الهاتف]`,
    servicesTitle: "2. قائمة الخدمات الخارجية والبنية التقنية المستخدمة",
    servicesIntro:
      "الخدمات الخارجية الفعلية أو القابلة للتفعيل في الشيفرة الحالية للموقع:",
    tableHeaders: ["الخدمة / المزود", "الغرض", "البيانات المعالجة", "ملاحظة الامتثال"],
    services: [
      {
        service: "الاستضافة وشبكة التوزيع",
        provider: "Vercel Inc.",
        purpose: "استضافة الموقع وتشغيل الوظائف الخادمية",
        dataProcessed: "عنوان IP، الطابع الزمني، الرابط المطلوب، متصفح المستخدم",
        status: "[TODO: مراجعة اتفاقية معالجة البيانات DPA وإطار نقل البيانات]",
      },
      {
        service: "قاعدة البيانات (PostgreSQL)",
        provider: "Neon (عبر Prisma ORM)",
        purpose: "تخزين محادثات المساعد الذكي، بيانات العملاء المحتملين، حجوزات الاستشارات وحدود الطلبات",
        dataProcessed: "الاسم، البريد الإلكتروني، رقم واتساب، رسائل المحادثة، المواعيد، IP مشفّر",
        status: "[TODO: التحقق من منطقة الاستضافة الأوروبية واتفاقية DPA]",
      },
      {
        service: "الخطوط (Inter, Space Grotesk, Cairo)",
        provider: "مستضافة محلياً عبر next/font/google أثناء البناء",
        purpose: "عرض الخطوط",
        dataProcessed: "لا يتم إرسال أي طلبات لخوادم Google أثناء تصفح الزائر",
        status: "تنفيذ صديق للخصوصية (استضافة محلية)",
      },
      {
        service: "نموذج الذكاء الاصطناعي للمساعد الذكي",
        provider: "Anthropic PBC (أو اختيارياً Google Gemini / Groq)",
        purpose: "الرد على استفسارات الزوار وتنسيق حجوزات الاستشارات داخل نافذة الدردشة",
        dataProcessed: "الرسائل التي يرسلها الزائر طوعاً في المحادثة فقط",
        status: "[TODO: توثيق المزود الفعلي واتفاقية DPA ونقل البيانات]",
      },
      {
        service: "واتساب للأعمال (WhatsApp Cloud API)",
        provider: "Meta Platforms Ireland Ltd. / Meta Platforms, Inc.",
        purpose: "إرسال إشعارات تأكيد أو رفض الموعد بعد موافقة الزائر الصريحة وروابط التواصل المباشر",
        dataProcessed: "رقم واتساب، الاسم، وقت الموعد",
        status: "[TODO: مراجعة صياغة الموافقة واتفاقية Meta DPA قانونياً]",
      },
      {
        service: "خرائط Google (صفحة التواصل)",
        provider: "Google Ireland Limited / Google LLC",
        purpose: "عرض خريطة الموقع اختيارياً",
        dataProcessed: "لا تُحمّل الخريطة إلا بعد نقر الزائر صراحةً على زر تحميل الخريطة (آلية النقرتين)",
        status: "آلية النقرتين مفعّلة — [TODO: مراجعة نص الإشعار قانونياً]",
      },
      {
        service: "حماية من البوتات (اختياري)",
        provider: "Cloudflare Turnstile (فقط عند تفعيل BOT_PROTECTION_ENABLED=true)",
        purpose: "حماية نافذة الدردشة من الاستخدام الآلي المسيء",
        dataProcessed: "إشارات تقنية للمتصفح وعنوان IP عند فتح الدردشة",
        status: "[TODO: توثيقه ومراجعة اتفاقية Cloudflare DPA عند التفعيل]",
      },
      {
        service: "أدوات التحليلات والتتبع",
        provider: "لا يوجد أي مزود مثبّت حالياً",
        purpose: "لا يوجد Google Analytics أو Meta Pixel أو Vercel Analytics",
        dataProcessed: "لا توجد بيانات تتبع تسويقي",
        status: "لا يوجد تتبع مفعّل",
      },
    ],
    cookiesTitle: "3. ملفات تعريف الارتباط والتخزين المحلي وتقييم شريط الموافقة",
    cookiesSummary:
      "يستخدم الموقع حالياً تخزيناً وظيفياً ضرورياً فقط بناءً على طلب المستخدم:",
    cookieItems: [
      {
        name: "NEXT_LOCALE",
        storage: "ملف تعريف ارتباط (SameSite=Lax، لمدة سنة)",
        purpose: "حفظ اللغة التي اختارها الزائر (DE / EN / AR).",
      },
      {
        name: "corelogic_chat_session_id",
        storage: "localStorage",
        purpose: "معرّف تقني لجلسة المساعد الذكي.",
      },
      {
        name: "corelogic_chat_messages_v1",
        storage: "sessionStorage",
        purpose: "حفظ رسائل المحادثة المرئية خلال التبويب الحالي.",
      },
      {
        name: "جلسة الإدارة",
        storage: "HttpOnly Cookie (لمسارات /admin/* فقط)",
        purpose: "مصادقة لوحة التحكم الداخلية.",
      },
    ],
    consentAssessmentTitle: "هل يلزم شريط موافقة (Cookie Banner) حالياً؟",
    consentAssessmentBody:
      "حالياً لا يلزم شريط موافقة تقليدي لملفات تعريف الارتباط طالما (1) لم تُضف أدوات تحليلات أو تسويق، و(2) تبقى خرائط Google خلف زر التحميل اليدوي (آلية النقرتين)، و(3) تُستضاف الخطوط محلياً عبر next/font، و(4) لا تُعالج بيانات الدردشة وواتساب إلا بطلب وموافقة صريحة من المستخدم. عند إضافة أي تحليلات لاحقاً سيصبح شريط الموافقة إلزامياً قبل التحميل. [TODO: تأكيد قانوني نهائي وفق § 25 TDDDG.]",
    todoSectionsTitle: "4. أقسام قانونية متبقية للاستكمال والمراجعة القانونية",
    todoSections: [
      {
        heading: "الأسس القانونية ومدد الاحتفاظ بالبيانات",
        todo: "[TODO: صياغة الأسس القانونية وفق المادة 6 DSGVO ومدد الحذف للمحادثات والعملاء والحجوزات وسجلات الخادم عبر مستشار قانوني.]",
      },
      {
        heading: "نقل البيانات إلى دول خارج المنطقة الاقتصادية الأوروبية",
        todo: "[TODO: توثيق إطار EU-US DPF والبنود التعاقدية القياسية SCCs وضوابط الوصول من خارج الاتحاد الأوروبي.]",
      },
      {
        heading: "حقوق أصحاب البيانات (المواد 15–21 و77 DSGVO)",
        todo: "[TODO: إدراج النص القانوني الكامل لحقوق الاطلاع والتصحيح والحذف وتقييد المعالجة ونقل البيانات والاعتراض والشكوى لدى الجهة الرقابية الألمانية.]",
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = copy[locale];

  return pageMetadata({
    path: "/datenschutz",
    locale,
    title: t.metaTitle,
    description: t.metaDescription,
    noindex: true,
  });
}

export default async function LocalizedDatenschutzPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = copy[locale];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <ParticleBackground />
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24 space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold break-words hyphens-auto">
            {t.heading}
          </h1>
          <p className="text-lg text-foreground/65">{t.subtitle}</p>
        </header>

        <div
          role="note"
          className="rounded-3xl border border-amber-300 bg-amber-50 p-6 text-amber-950 flex items-start gap-4"
        >
          <ShieldAlert className="h-6 w-6 shrink-0 text-amber-700 mt-0.5" />
          <div className="space-y-1.5">
            <p className="font-bold text-base">{t.legalReviewTitle}</p>
            <p className="text-sm leading-relaxed">{t.legalReviewBody}</p>
          </div>
        </div>

        {/* 1. Controller */}
        <section className="rounded-3xl border border-foreground/10 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-2xl font-bold text-foreground break-words hyphens-auto">
            {t.controllerTitle}
          </h2>
          <p className="font-mono text-sm text-amber-900 bg-amber-50/80 rounded-xl p-4 border border-amber-200/80 break-words">
            {t.controllerTodo}
          </p>
        </section>

        {/* 2. Third-Party Services */}
        <section className="rounded-3xl border border-foreground/10 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground break-words hyphens-auto">
              {t.servicesTitle}
            </h2>
            <p className="text-foreground/70">{t.servicesIntro}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-sm">
              <thead>
                <tr className="border-b border-foreground/15 text-foreground/70">
                  {t.tableHeaders.map((h) => (
                    <th key={h} className="py-3 pe-4 font-bold text-start">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {t.services.map((s) => (
                  <tr key={s.service} className="align-top">
                    <td className="py-4 pe-4 font-semibold text-foreground">
                      <div>{s.service}</div>
                      <div className="text-xs font-normal text-foreground/60 mt-0.5">
                        {s.provider}
                      </div>
                    </td>
                    <td className="py-4 pe-4 text-foreground/80">{s.purpose}</td>
                    <td className="py-4 pe-4 text-foreground/75">
                      {s.dataProcessed}
                    </td>
                    <td className="py-4 text-xs text-foreground/75 font-medium">
                      {s.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Cookies & Consent Banner */}
        <section className="rounded-3xl border border-foreground/10 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-foreground break-words hyphens-auto">
            {t.cookiesTitle}
          </h2>
          <p className="text-foreground/75">{t.cookiesSummary}</p>

          <ul className="space-y-3">
            {t.cookieItems.map((c) => (
              <li
                key={c.name}
                className="rounded-2xl border border-foreground/10 bg-background/70 p-4 space-y-1"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <code className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                    {c.name}
                  </code>
                  <span className="text-xs text-foreground/60 font-medium">
                    {c.storage}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">{c.purpose}</p>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <AlertTriangle className="h-4 w-4 text-primary shrink-0" />
              <h3>{t.consentAssessmentTitle}</h3>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {t.consentAssessmentBody}
            </p>
          </div>
        </section>

        {/* 4. Remaining TODO Sections */}
        <section className="rounded-3xl border border-foreground/10 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-foreground break-words hyphens-auto">
            {t.todoSectionsTitle}
          </h2>
          <div className="space-y-5">
            {t.todoSections.map((sec) => (
              <div key={sec.heading} className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">
                  {sec.heading}
                </h3>
                <p className="font-mono text-sm text-amber-900 bg-amber-50/80 rounded-xl p-4 border border-amber-200/80">
                  {sec.todo}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
