import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  defaultLocale,
  localeMetadata,
  locales,
  localizedPath as buildLocalizedPath,
  type Locale,
} from "@/lib/i18n-config";

export type { Locale };

/** Builds an absolute URL on the canonical domain. `path` must start with "/" (or be ""). */
export function absoluteUrl(path: string = ""): string {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}

/** Maps a locale-agnostic route ("/about" or "/") to its canonical prefixed route ("/de/about", "/en"). */
export function localizedPath(path: string, locale: Locale): string {
  return buildLocalizedPath(path, locale);
}

interface PageMetadataInput {
  /** Locale-agnostic route of the page, e.g. "/services/web-dev" or "/" for the home page. */
  path: string;
  locale: Locale;
  title: string;
  description: string;
  /** Use the title exactly as given (skips the "| CoreLogic Systems" template). */
  absoluteTitle?: boolean;
  /** Set false for pages that exist in only one language (no hreflang pair). */
  hasTranslation?: boolean;
  /** Set true for non-localized root routes such as /blog that should NOT receive a locale prefix. */
  unprefixed?: boolean;
  noindex?: boolean;
  ogType?: "website" | "article";
}

function getBrandName(locale: Locale): string {
  return locale === "ar" ? siteConfig.nameAr : siteConfig.name;
}

const ogImageAltByLocale: Record<Locale, string> = {
  de: "CoreLogic Systems – Individualsoftware, Webdesign und KI-Automatisierung",
  en: "CoreLogic Systems – Custom Software, Web & Mobile Apps, AI Automation",
  ar: "كورلوجيك سيستمز – برمجيات مخصصة وتطبيقات ويب وجوال وأتمتة بالذكاء الاصطناعي",
};

/**
 * Single source of truth for per-page metadata: unique title/description, a self-referencing
 * canonical on the primary domain, valid hreflang alternates (de, en, ar, x-default)
 * for indexable pages only, and Open Graph / Twitter tags with per-locale `og:locale` and images.
 */
export function pageMetadata({
  path,
  locale,
  title,
  description,
  absoluteTitle = false,
  hasTranslation = true,
  unprefixed = false,
  noindex = false,
  ogType = "website",
}: PageMetadataInput): Metadata {
  const selfPath = unprefixed ? path || "/" : localizedPath(path, locale);
  const canonical = absoluteUrl(selfPath);
  const brandName = getBrandName(locale);
  const ogTitle = absoluteTitle ? title : `${title} | ${brandName}`;

  // Never emit hreflang alternates on non-indexable (`noindex`) pages:
  // hreflang targets must only point to HTTP 200, indexable canonical URLs.
  const languages: Record<string, string> | undefined = noindex
    ? undefined
    : hasTranslation && !unprefixed
      ? {
          de: absoluteUrl(localizedPath(path, "de")),
          en: absoluteUrl(localizedPath(path, "en")),
          ar: absoluteUrl(localizedPath(path, "ar")),
          "x-default": absoluteUrl(localizedPath(path, defaultLocale)),
        }
      : { [locale]: canonical };

  const alternateOgLocales =
    !noindex && hasTranslation && !unprefixed
      ? locales
          .filter((l) => l !== locale)
          .map((l) => localeMetadata[l].ogLocale)
      : undefined;

  const ogImageUrl = absoluteUrl(`/og/${locale}`);
  const ogImageAlt = ogImageAltByLocale[locale];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: languages ? { canonical, languages } : { canonical },
    openGraph: {
      type: ogType,
      url: canonical,
      title: ogTitle,
      description,
      siteName: brandName,
      locale: localeMetadata[locale].ogLocale,
      ...(alternateOgLocales ? { alternateLocale: alternateOgLocales } : {}),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [{ url: ogImageUrl, alt: ogImageAlt }],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export interface Crumb {
  name: string;
  /** Route on the site, e.g. "/en/services" or "/de/services". */
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function webPageJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  locale: Locale;
}) {
  const url = absoluteUrl(opts.path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: localeMetadata[opts.locale].bcp47,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function serviceJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    inLanguage: localeMetadata[opts.locale].bcp47,
    provider: { "@id": `${siteConfig.url}/#organization` },
  };
}
