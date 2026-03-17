import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.vcanews.com.br'

  // Static routes
  const staticRoutes = [
    '',
    '/compra-e-venda',
    '/profissionais',
    '/denuncias',
    '/contato',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic Marketplace Ads
  const ads = await (prisma as any).ad.findMany({
    where: { status: 'APPROVED' },
    select: { id: true, updatedAt: true }
  })

  const adRoutes = ads.map((ad: any) => ({
    url: `${baseUrl}/compra-e-venda/${ad.id}`,
    lastModified: ad.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Dynamic Professional Profiles
  const users = await (prisma as any).user.findMany({
    where: { 
      professionId: { not: null },
      username: { not: null }
    },
    select: { username: true, updatedAt: true }
  })

  const profileRoutes = users.map((user: any) => ({
    url: `${baseUrl}/user/${user.username}`,
    lastModified: user.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...adRoutes, ...profileRoutes]
}
