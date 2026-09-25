import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/portal/', '/api/', '/_next/'],
    },
    sitemap: 'https://corelogic.my/sitemap.xml',
  }
}
