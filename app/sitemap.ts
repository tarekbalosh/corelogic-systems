import { MetadataRoute } from 'next'
import { projectsData } from '@/config/work'
import { absoluteUrl, localizedPath } from '@/lib/seo'

/**
 * Public, indexable pages only. Every page that exists in both languages is listed once per
 * language, each entry carrying hreflang alternates (including x-default -> English).
 * `lastModified` is deliberately omitted: we have no reliable per-page modification date and a
 * fabricated "now" on every build would teach Google to ignore the field.
 */
const bilingualPaths = [
  '/',
  '/services',
  '/services/software-dev',
  '/services/web-dev',
  '/services/mobile-dev',
  '/services/ai-automation',
  '/services/design',
  '/our-projects',
  ...projectsData.map((p) => `/our-projects/${p.slug}`),
  '/about',
  '/contact',
  '/privacy',
  '/terms',
]

// English-only pages (no Arabic translation exists).
const englishOnlyPaths = [
  '/blog',
  '/blog/the-ultimate-guide-to-ai-automation-for-b2b-enterprises',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const path of bilingualPaths) {
    const languages = {
      en: absoluteUrl(localizedPath(path, 'en')),
      ar: absoluteUrl(localizedPath(path, 'ar')),
      'x-default': absoluteUrl(localizedPath(path, 'en')),
    }
    entries.push({ url: languages.en, alternates: { languages } })
    entries.push({ url: languages.ar, alternates: { languages } })
  }

  for (const path of englishOnlyPaths) {
    entries.push({ url: absoluteUrl(path) })
  }

  return entries
}
