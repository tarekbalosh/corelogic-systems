import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.corelogic-system.my';
  
  const generateAlternates = (path: string) => ({
    languages: {
      en: `${baseUrl}${path}`,
      ar: `${baseUrl}/ar${path}`,
    },
  });

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
      alternates: generateAlternates(''),
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
      alternates: generateAlternates(''),
    },
    {
      url: `${baseUrl}/services/web-dev`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: generateAlternates('/services/web-dev'),
    },
    {
      url: `${baseUrl}/ar/services/web-dev`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: generateAlternates('/services/web-dev'),
    },
    {
      url: `${baseUrl}/services/ai-automation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: generateAlternates('/services/ai-automation'),
    },
    {
      url: `${baseUrl}/ar/services/ai-automation`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: generateAlternates('/services/ai-automation'),
    },
    {
      url: `${baseUrl}/services/mobile-dev`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: generateAlternates('/services/mobile-dev'),
    },
    {
      url: `${baseUrl}/ar/services/mobile-dev`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: generateAlternates('/services/mobile-dev'),
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
      alternates: generateAlternates('/services'),
    },
    {
      url: `${baseUrl}/ar/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
      alternates: generateAlternates('/services'),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: generateAlternates('/about'),
    },
    {
      url: `${baseUrl}/ar/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: generateAlternates('/about'),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
      alternates: generateAlternates('/contact'),
    },
    {
      url: `${baseUrl}/ar/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
      alternates: generateAlternates('/contact'),
    },
  ]
}
