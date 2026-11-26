import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { hasLocale, type Locale } from "@/lib/i18n-config";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

type PageProps = { params: Promise<{ locale: string }> };

const copy: Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    subtitle: string;
    draftNoticeTitle: string;
    draftNoticeBody: string;
    section1Title: string;
    fields: Array<{ label: string; value: string; isTodo?: boolean }>;
    section2Title: string;
    mstvLabel: string;
    mstvValue: string;
    reviewNote: string;
  }
> = {
  de: {
    metaTitle: "Impressum (Entwurf – [TODO])",
    metaDescription:
      "Pflichtangaben gemäß § 5 DDG für CoreLogic Systems UG (haftungsbeschränkt) – Entwurf mit [TODO]-Platzhaltern (noindex).",
    heading: "Impressum",
    subtitle: "Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)",
    draftNoticeTitle: "Entwurf / Platzhalter (noindex aktiv)",
    draftNoticeBody:
      "Diese Seite enthält noch [TODO]-Platzhalter für fehlende Pflichtangaben nach § 5 DDG und ist bis zur vollständigen Befüllung und Prüfung auf noindex gesetzt.",
    section1Title: "Unternehmensangaben (§ 5 DDG)",
    fields: [
      {
        label: "Unternehmensname & Rechtsform",
        value:
          "CoreLogic Systems UG (haftungsbeschränkt) — [TODO: Exakte eingetragene Firmierung laut Handelsregister bestätigen]",
        isTodo: true,
      },
      {
        label: "Ladungsfähige Geschäftsadresse",
        value: "[TODO: Straße, Hausnummer, PLZ, Ort, Deutschland]",
        isTodo: true,
      },
      {
        label: "Vertretungsberechtigte Person (Geschäftsführung)",
        value: "[TODO: Vor- und Nachname der Geschäftsführung]",
        isTodo: true,
      },
      {
        label: "Registergericht & Registernummer",
        value: "[TODO: Amtsgericht (Ort), HRB XXXXX]",
        isTodo: true,
      },
      {
        label: "Umsatzsteuer-Identifikationsnummer (gemäß § 27 a UStG)",
        value: "[TODO: DE XXXXXXXXX (oder Hinweis, falls noch nicht erteilt)]",
        isTodo: true,
      },
      {
        label: "E-Mail-Adresse",
        value: siteConfig.email,
      },
      {
        label: "Telefonnummer",
        value: `${siteConfig.phone} — [TODO: Deutsche Telefonnummer ergänzen, falls vorhanden]`,
        isTodo: true,
      },
    ],
    section2Title: "Redaktionell verantwortlich (§ 18 Abs. 2 MStV)",
    mstvLabel: "Verantwortliche Person",
    mstvValue: "[TODO: Vor- und Nachname sowie ladungsfähige Anschrift ergänzen]",
    reviewNote:
      "Hinweis: Keine erfundenen Rechtstexte. Bitte alle [TODO]-Felder mit den tatsächlichen Handelsregister- und Unternehmensdaten befüllen und vor Entfernung von noindex rechtlich prüfen lassen.",
  },
  en: {
    metaTitle: "Impressum / Legal Notice (Draft – [TODO])",
    metaDescription:
      "Statutory legal notice placeholders per § 5 DDG for CoreLogic Systems UG (haftungsbeschränkt) — noindex until completed.",
    heading: "Impressum (Legal Notice)",
    subtitle: "Information pursuant to § 5 DDG (German Digital Services Act)",
    draftNoticeTitle: "Draft / Placeholder Page (noindex enabled)",
    draftNoticeBody:
      "This page contains [TODO] placeholders for statutory disclosures required under German law (§ 5 DDG) and is set to noindex until all real company registration details are filled in and legally reviewed.",
    section1Title: "Company Information (§ 5 DDG)",
    fields: [
      {
        label: "Company Name & Legal Form",
        value:
          "CoreLogic Systems UG (haftungsbeschränkt) — [TODO: Confirm exact registered name from Handelsregister]",
        isTodo: true,
      },
      {
        label: "Registered Business Address",
        value: "[TODO: Street, House Number, Postal Code, City, Germany]",
        isTodo: true,
      },
      {
        label: "Authorized Representative (Geschäftsführung)",
        value: "[TODO: Full name of Managing Director]",
        isTodo: true,
      },
      {
        label: "Register Court & HRB Number",
        value: "[TODO: Amtsgericht (City), HRB XXXXX]",
        isTodo: true,
      },
      {
        label: "VAT ID (Umsatzsteuer-ID per § 27 a UStG)",
        value: "[TODO: DE XXXXXXXXX (or note if not yet issued)]",
        isTodo: true,
      },
      {
        label: "Contact Email",
        value: siteConfig.email,
      },
      {
        label: "Contact Phone",
        value: `${siteConfig.phone} — [TODO: Add German business phone number if applicable]`,
        isTodo: true,
      },
    ],
    section2Title: "Responsible for Content (§ 18 Abs. 2 MStV)",
    mstvLabel: "Responsible Person",
    mstvValue: "[TODO: Full name and business address]",
    reviewNote:
      "Note: No invented legal clauses. Fill in all [TODO] fields using verified company registration documents and have a qualified German lawyer review before removing noindex.",
  },
  ar: {
    metaTitle: "بيانات الشركة – Impressum (مسودة – [TODO])",
    metaDescription:
      "حقول الإفصاح القانوني الألماني وفق المادة § 5 DDG لشركة CoreLogic Systems UG (haftungsbeschränkt) — لا تُفهرس (noindex) حتى استكمال البيانات.",
    heading: "بيانات الشركة (Impressum)",
    subtitle: "الإفصاح القانوني وفق المادة § 5 من قانون الخدمات الرقمية الألماني (DDG)",
    draftNoticeTitle: "مسودة / حقول قيد الاستكمال (noindex مفعّل)",
    draftNoticeBody:
      "تحتوي هذه الصفحة على حقول [TODO] للبيانات القانونية المطلوبة في ألمانيا وفق § 5 DDG، وهي مضبوطة على noindex حتى استكمال البيانات الرسمية ومراجعتها قانونياً.",
    section1Title: "بيانات الشركة (§ 5 DDG)",
    fields: [
      {
        label: "اسم الشركة والشكل القانوني",
        value:
          "CoreLogic Systems UG (haftungsbeschränkt) — [TODO: تأكيد الاسم المسجل رسمياً في السجل التجاري الألماني]",
        isTodo: true,
      },
      {
        label: "العنوان التجاري الرسمي",
        value: "[TODO: الشارع، رقم المبنى، الرمز البريدي، المدينة، ألمانيا]",
        isTodo: true,
      },
      {
        label: "الممثل القانوني المفوّض (المدير التنفيذي)",
        value: "[TODO: الاسم الكامل للمدير المفوّض]",
        isTodo: true,
      },
      {
        label: "محكمة التسجيل ورقم السجل (HRB)",
        value: "[TODO: Amtsgericht (المدينة)، HRB XXXXX]",
        isTodo: true,
      },
      {
        label: "الرقم الضريبي للقيمة المضافة (USt-IdNr. وفق § 27 a UStG)",
        value: "[TODO: DE XXXXXXXXX أو توضيح في حال عدم الإصدار بعد]",
        isTodo: true,
      },
      {
        label: "البريد الإلكتروني",
        value: siteConfig.email,
      },
      {
        label: "رقم الهاتف",
        value: `${siteConfig.phone} — [TODO: إضافة رقم هاتف ألماني إن وُجد]`,
        isTodo: true,
      },
    ],
    section2Title: "المسؤول عن المحتوى (§ 18 Abs. 2 MStV)",
    mstvLabel: "الشخص المسؤول",
    mstvValue: "[TODO: الاسم الكامل والعنوان الرسمي]",
    reviewNote:
      "ملاحظة: لا توجد نصوص قانونية مختلقة. يرجى استكمال كافة حقول [TODO] من وثائق السجل التجاري ومراجعتها لدى محامٍ ألماني قبل إزالة وسم noindex.",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = copy[locale];

  return pageMetadata({
    path: "/impressum",
    locale,
    title: t.metaTitle,
    description: t.metaDescription,
    noindex: true,
  });
}

export default async function LocalizedImpressumPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = copy[locale];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden font-sans">
      <ParticleBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-10">
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
          <AlertTriangle className="h-6 w-6 shrink-0 text-amber-700 mt-0.5" />
          <div className="space-y-1.5">
            <p className="font-bold text-base">{t.draftNoticeTitle}</p>
            <p className="text-sm leading-relaxed">{t.draftNoticeBody}</p>
          </div>
        </div>

        <section className="rounded-3xl border border-foreground/10 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            {t.section1Title}
          </h2>
          <dl className="divide-y divide-foreground/10">
            {t.fields.map((field) => (
              <div
                key={field.label}
                className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6"
              >
                <dt className="text-sm font-semibold text-foreground/70">
                  {field.label}
                </dt>
                <dd
                  className={`sm:col-span-2 text-base break-words ${
                    field.isTodo
                      ? "font-mono text-sm text-amber-900 bg-amber-50/80 rounded-xl px-3 py-2 border border-amber-200/80"
                      : "font-medium text-foreground"
                  }`}
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-3xl border border-foreground/10 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {t.section2Title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6">
            <p className="text-sm font-semibold text-foreground/70">
              {t.mstvLabel}
            </p>
            <p className="sm:col-span-2 font-mono text-sm text-amber-900 bg-amber-50/80 rounded-xl px-3 py-2 border border-amber-200/80">
              {t.mstvValue}
            </p>
          </div>
        </section>

        <p className="text-sm text-foreground/65 leading-relaxed border-t border-foreground/10 pt-6">
          {t.reviewNote}
        </p>
      </div>
    </div>
  );
}
