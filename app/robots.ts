import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/portal/', '/api/', '/_next/'],
    },
    sitemap: 'https://www.corelogic-system.my/sitemap.xml',
  }
}
