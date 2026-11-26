import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Space_Grotesk, Cairo } from "next/font/google";
import "../../globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { ChatWidgetMount } from "@/components/chat/chat-widget-mount";
import { siteConfig } from "@/config/site";
import { getDirection, hasLocale, locales, type Locale } from "@/lib/i18n-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
});

const arabicFont = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "600", "700", "800"],
  preload: false,
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const layoutDefaults: Record<
  Locale,
  { defaultTitle: string; template: string; description: string }
> = {
  en: {
    defaultTitle:
      "CoreLogic Systems | Custom Software, Web & Mobile Apps, AI Automation",
    template: "%s | CoreLogic Systems",
    description:
      "We design and build custom business systems, web and mobile apps, and AI-powered automation for growing businesses.",
  },
  de: {
    defaultTitle:
      "Individualsoftware, Webdesign & KI | CoreLogic Systems",
    template: "%s | CoreLogic Systems",
    description:
      "Individualsoftware, Webdesign und KI-Automatisierung für Unternehmen in Duisburg, NRW und dem DACH-Raum. Jetzt kostenlose Erstberatung anfragen.",
  },
  ar: {
    defaultTitle: "كورلوجيك سيستمز | برمجيات مخصصة وأتمتة بالذكاء الاصطناعي",
    template: "%s | كورلوجيك سيستمز",
    description:
      "نصمم ونبني أنظمة الأعمال وتطبيقات الويب والجوال وحلول الأتمتة بالذكاء الاصطناعي، من الفكرة حتى التشغيل والدعم للأعمال النامية.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = hasLocale(locale) ? locale : "en";
  const defaults = layoutDefaults[resolved];

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: defaults.defaultTitle,
      template: defaults.template,
    },
    description: defaults.description,
    applicationName: siteConfig.name,
    verification: {
      google: "-e6ABi1a2blC15Up04wIeE4IS9tD1DybkrAXJJpoRD0",
    },
  };
}

// Organization & WebSite JSON-LD contain strictly verified real company data only
// (no invented German address, registration number, or reviews).
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  alternateName: siteConfig.nameAr,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/corelogic-symbol-color.svg`,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  address: { "@type": "PostalAddress", ...siteConfig.address },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    contactType: "customer service",
    availableLanguage: ["English", "German", "Arabic"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  inLanguage: ["en", "de", "ar"],
  publisher: { "@id": `${siteConfig.url}/#organization` },
};

export default async function LocalizedRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(locale)) {
    notFound();
  }

  const dir = getDirection(locale);
  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`dark scroll-smooth ${inter.variable} ${spaceGrotesk.variable} ${
        isArabic ? arabicFont.variable : ""
      }`}
      suppressHydrationWarning
    >
      <body
        className={`antialiased bg-background text-foreground min-h-screen ${
          isArabic ? "rtl font-arabic" : ""
        }`}
        suppressHydrationWarning
      >
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
        <div className="relative flex min-h-screen flex-col">
          <Navbar locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </div>
        <ChatWidgetMount />
      </body>
    </html>
  );
}
