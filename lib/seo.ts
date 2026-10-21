import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export type Locale = "en" | "ar";

/** Builds an absolute URL on the canonical domain. `path` must start with "/" (or be ""). */
export function absoluteUrl(path: string = ""): string {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}

/** Maps an English route ("/about") to its localized route ("/ar/about"). "/" -> "/ar". */
export function localizedPath(enPath: string, locale: Locale): string {
  if (locale === "en") return enPath || "/";
  return enPath === "/" || enPath === "" ? "/ar" : `/ar${enPath}`;
}

interface PageMetadataInput {
  /** English route of the page, e.g. "/services/web-dev" or "/" for the home page. */
  path: string;
  locale: Locale;
  title: string;
  description: string;
  /** Use the title exactly as given (skips the "| CoreLogic Systems" template). */
  absoluteTitle?: boolean;
  /** Set false for pages that exist in only one language (no hreflang pair). */
  hasTranslation?: boolean;
  noindex?: boolean;
  ogType?: "website" | "article";
}

/**
 * Single source of truth for per-page metadata: unique title/description, a self-referencing
 * canonical on the primary domain, valid hreflang alternates and Open Graph / Twitter tags.
 */
export function pageMetadata({
  path,
  locale,
  title,
  description,
  absoluteTitle = false,
  hasTranslation = true,
  noindex = false,
  ogType = "website",
}: PageMetadataInput): Metadata {
  const selfPath = localizedPath(path, locale);
  const canonical = absoluteUrl(selfPath);
  const ogTitle = absoluteTitle
    ? title
    : `${title} | ${locale === "ar" ? siteConfig.nameAr : siteConfig.name}`;

  const languages: Record<string, string> = hasTranslation
    ? {
        en: absoluteUrl(localizedPath(path, "en")),
        ar: absoluteUrl(localizedPath(path, "ar")),
        "x-default": absoluteUrl(localizedPath(path, "en")),
      }
    : { [locale]: canonical };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: ogType,
      url: canonical,
      title: ogTitle,
      description,
      siteName: locale === "ar" ? siteConfig.nameAr : siteConfig.name,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      images: [{ url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [absoluteUrl("/twitter-image")],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export interface Crumb {
  name: string;
  /** Route on the site, e.g. "/services" or "/ar/services". */
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
    inLanguage: opts.locale,
    provider: { "@id": `${siteConfig.url}/#organization` },
  };
}
