import { MetadataRoute } from "next";
import { projectsData } from "@/config/work";
import { defaultLocale, locales } from "@/lib/i18n-config";
import { absoluteUrl, localizedPath } from "@/lib/seo";

/**
 * Public, indexable pages only.
 * Every localized page is emitted once per locale (en, de, ar) with full hreflang alternates
 * including x-default -> defaultLocale ("en").
 * `/impressum` and `/datenschutz` are intentionally excluded while they carry `noindex`
 * placeholder fields; add them here once finalized and set to indexable.
 * `lastModified` is deliberately omitted to avoid fabricating timestamps on every build.
 */
const localizedPaths = [
  "/",
  "/services",
  "/services/software-dev",
  "/services/web-dev",
  "/services/mobile-dev",
  "/services/ai-automation",
  "/services/design",
  "/our-projects",
  ...projectsData.map((p) => `/our-projects/${p.slug}`),
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

// English-only non-prefixed pages (no DE/AR translation exists).
const englishOnlyPaths = [
  "/blog",
  "/blog/the-ultimate-guide-to-ai-automation-for-b2b-enterprises",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of localizedPaths) {
    const languages = {
      de: absoluteUrl(localizedPath(path, "de")),
      en: absoluteUrl(localizedPath(path, "en")),
      ar: absoluteUrl(localizedPath(path, "ar")),
      "x-default": absoluteUrl(localizedPath(path, defaultLocale)),
    };

    for (const locale of locales) {
      entries.push({
        url: languages[locale],
        alternates: { languages },
      });
    }
  }

  for (const path of englishOnlyPaths) {
    entries.push({ url: absoluteUrl(path) });
  }

  return entries;
}
