import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

// Everything public is crawlable. /_next/ is intentionally NOT blocked: Google needs the CSS/JS
// there to render pages. Non-public pages (e.g. /portal) are kept out of the index with a
// "noindex" robots meta tag, which only works if crawlers are allowed to fetch the page.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
