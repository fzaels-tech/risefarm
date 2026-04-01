import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getArticleBySlugWithLocaleFallback } from '@/lib/article-i18n'
import type { Metadata } from 'next'
import Script from 'next/script'

const SITE_URL = 'https://risefarm.asia'

// Dynamic metadata — same logic as /news/[slug] but with canonical pointing to /artikel/[slug]
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const cookieStore = await cookies()
  const lang = (cookieStore.get('risefarm_lang')?.value as 'id' | 'en') || 'id'
  const article = await getArticleBySlugWithLocaleFallback(slug, lang, false)

  if (!article) {
    return { title: 'Artikel Tidak Ditemukan' }
  }

  const ogImage = article.image?.startsWith('http')
    ? article.image
    : article.image
    ? `${SITE_URL}${article.image}`
    : `${SITE_URL}/images/og-image.jpg`

  return {
    title: article.title,
    description: article.excerpt || `Baca artikel ${article.title} di RISEFARM.`,
    keywords: [article.category, 'RISEFARM', 'ubi', 'agritech', 'artikel ubi'],
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/artikel/${article.slug}`,
      title: article.title,
      description: article.excerpt || '',
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt?.toISOString(),
      authors: [article.author],
      tags: [article.category, 'RISEFARM', 'ubi', 'agritech'],
      locale: lang === 'en' ? 'en_US' : 'id_ID',
      siteName: 'RISEFARM',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || '',
      images: [ogImage],
    },
    // Canonical points to /news/[slug] (the primary URL)
    alternates: {
      canonical: `${SITE_URL}/news/${article.slug}`,
    },
  }
}

// This route is an SEO-friendly alias → redirect permanently to /news/[slug]
export default async function ArtikelRedirect(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  redirect(`/news/${slug}`)
}
