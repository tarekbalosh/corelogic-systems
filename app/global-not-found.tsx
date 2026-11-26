import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import {
  getDirection,
  getLocaleFromPathname,
  type Locale,
} from "@/lib/i18n-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin", "latin-ext"],
});

const copy: Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    body: string;
    homeLabel: string;
    servicesLabel: string;
    contactLabel: string;
  }
> = {
  de: {
    metaTitle: "404 – Seite nicht gefunden | CoreLogic Systems",
    metaDescription:
      "Die angeforderte Seite wurde leider nicht gefunden. Kehren Sie zur Startseite von CoreLogic Systems zurück.",
    heading: "Seite nicht gefunden",
    body: "Die angeforderte Seite existiert leider nicht oder wurde verschoben.",
    homeLabel: "Zur Startseite",
    servicesLabel: "Leistungen ansehen",
    contactLabel: "Kontakt",
  },
  en: {
    metaTitle: "404 – Page Not Found | CoreLogic Systems",
    metaDescription:
      "The requested page could not be found. Return to the CoreLogic Systems home page.",
    heading: "Page not found",
    body: "The page you requested could not be found or may have been moved.",
    homeLabel: "Back to Home",
    servicesLabel: "Our Services",
    contactLabel: "Contact Us",
  },
  ar: {
    metaTitle: "404 – الصفحة غير موجودة | كورلوجيك سيستمز",
    metaDescription:
      "تعذّر العثور على الصفحة المطلوبة. يمكنك العودة إلى الصفحة الرئيسية لكورلوجيك سيستمز.",
    heading: "الصفحة غير موجودة",
    body: "عذراً، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها.",
    homeLabel: "العودة للرئيسية",
    servicesLabel: "خدماتنا",
    contactLabel: "تواصل معنا",
  },
};

async function resolveLocaleFromHeaders(): Promise<Locale> {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") || "/";
  return getLocaleFromPathname(pathname);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveLocaleFromHeaders();
  const t = copy[locale];
  return {
    metadataBase: new URL(siteConfig.url),
    title: t.metaTitle,
    description: t.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function GlobalNotFound() {
  const locale = await resolveLocaleFromHeaders();
  const dir = getDirection(locale);
  const t = copy[locale];
  const base = `/${locale}`;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`dark ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body
        className={`antialiased bg-background text-foreground min-h-screen flex items-center justify-center px-6 py-20 ${
          locale === "ar" ? "rtl" : ""
        }`}
      >
        <main className="max-w-lg w-full text-center space-y-6">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            404
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t.heading}
          </h1>
          <p className="text-foreground/65 text-base sm:text-lg leading-relaxed">
            {t.body}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Link
              href={base}
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              {t.homeLabel}
            </Link>
            <Link
              href={`${base}/services`}
              className="inline-flex items-center justify-center rounded-full border border-foreground/15 bg-white px-6 py-3 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
            >
              {t.servicesLabel}
            </Link>
            <Link
              href={`${base}/contact`}
              className="inline-flex items-center justify-center rounded-full border border-foreground/15 bg-white px-6 py-3 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors"
            >
              {t.contactLabel}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
