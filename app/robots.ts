import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/settings/',
        '/admin/',
        '/api/',
        '/mensagens/',
        '/auth/'
      ],
    },
    sitemap: 'https://www.vcanews.com.br/sitemap.xml',
  }
}
