import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

const SITE_URL = 'https://risefarm.asia'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prismaAny = prisma as any

  // Fetch all published article translations
  const translations = await prismaAny.articleTranslation.findMany({
    where: {
      article: { status: 'published' },
    },
    select: {
      slug: true,
      locale: true,
      article: {
        select: { updatedAt: true },
      },
    },
  })

  const articleUrls: MetadataRoute.Sitemap = translations.map((t: any) => ({
    url: `${SITE_URL}/news/${t.slug}`,
    lastModified: t.article.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        'id-ID': `${SITE_URL}/news/${t.slug}`,
        'en-US': `${SITE_URL}/news/${t.slug}`,
      },
    },
  }))

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: { languages: { 'id-ID': SITE_URL, 'en-US': `${SITE_URL}/en` } },
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: { languages: { 'id-ID': `${SITE_URL}/news`, 'en-US': `${SITE_URL}/news` } },
    },
    {
      url: `${SITE_URL}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: { languages: { 'id-ID': `${SITE_URL}/tentang`, 'en-US': `${SITE_URL}/tentang` } },
    },
    {
      url: `${SITE_URL}/produk/ubi-segar-ekspor`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: { languages: { 'id-ID': `${SITE_URL}/produk/ubi-segar-ekspor`, 'en-US': `${SITE_URL}/produk/ubi-segar-ekspor` } },
    },
    {
      url: `${SITE_URL}/produk/ubi-supermarket`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: { languages: { 'id-ID': `${SITE_URL}/produk/ubi-supermarket`, 'en-US': `${SITE_URL}/produk/ubi-supermarket` } },
    },
  ]

  return [...staticPages, ...articleUrls]
}
