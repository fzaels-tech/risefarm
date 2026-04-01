import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { NewsListClient } from './NewsListClient'
import { getArticlesByLocaleWithFallback } from '@/lib/article-i18n'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Artikel & Berita',
  description:
    'Baca artikel dan berita terbaru dari RISEFARM — seputar dunia agritech ubi, pertanian regeneratif, ubi Cilembu, ubi ekspor, dan pemberdayaan petani lokal Indonesia.',
  keywords: [
    'berita agritech ubi',
    'artikel ubi Cilembu',
    'pertanian regeneratif Indonesia',
    'berita RISEFARM',
    'ubi ekspor terbaru',
  ],
  alternates: {
    canonical: 'https://risefarm.asia/news',
  },
  openGraph: {
    type: 'website',
    title: 'Artikel & Berita RISEFARM',
    description: 'Berita dan artikel terbaru tentang agritech ubi dan pertanian dari RISEFARM.',
    url: 'https://risefarm.asia/news',
    siteName: 'RISEFARM',
  },
}


export default async function NewsList() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('risefarm_lang')?.value as 'id' | 'en') || 'id'
  const token = cookieStore.get('risefarm_token')?.value
  const payload = token ? await verifyToken(token) : null
  const isAuthenticated = !!payload

  const articles = await getArticlesByLocaleWithFallback(lang, isAuthenticated)

  return (
    <>
      <Navbar />
      <NewsListClient initialArticles={articles as any[]} isAuthenticated={isAuthenticated} lang={lang} />
      <Footer />
    </>
  )
}
