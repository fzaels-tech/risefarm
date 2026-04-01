'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { translations } from '@/lib/translations'
import Link from 'next/link'
import { ArticleCard } from '@/components/ArticleCard'
import { useFetch } from '@/hooks/useFetch'

export function ArticlesPreviewSection() {
  const { lang } = useLanguage()
  const { isAuthenticated } = useAuth()
  const t = translations[lang].articles
  const { data, loading, error, refetch } = useFetch<any[]>(`/api/articles?lang=${lang}`)
  const articles = Array.isArray(data) ? data.slice(0, 3) : []

  return (
    <section id="articles" className="py-24 bg-[#F8F4ED]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 fade-in-up">
          <div className="max-w-2xl">
            <h3 className="text-[#C4521A] font-bold uppercase tracking-wider mb-2">{t.kicker}</h3>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C4A2E] mb-4">{t.title}</h2>
            <p className="text-stone-600 text-lg">{t.desc}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/news" className="px-6 py-3 rounded-full border-[1.5px] border-[#1C4A2E]/25 text-[#1C4A2E] font-semibold hover:bg-[#4A7C59]/10 hover:border-[#4A7C59] transition-all">
              {t.viewAll}
            </Link>
            {isAuthenticated && (
              <Link href="/editor" className="px-6 py-3 rounded-full bg-[#C4521A] text-white font-semibold hover:bg-[#A94315] hover:-translate-y-0.5 shadow-lg transition-all shrink-0">
                {t.write}
              </Link>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[420px] rounded-3xl bg-[#F0EBE1] animate-pulse border border-[#1C4A2E]/5" />
            ))
          ) : error ? (
            <div className="md:col-span-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              <p className="font-semibold">
                {lang === 'en' ? 'Failed to load articles.' : 'Gagal memuat artikel.'}
              </p>
              <p className="text-sm mt-1 mb-3">{error}</p>
              <button
                onClick={refetch}
                className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                {lang === 'en' ? 'Try again' : 'Coba lagi'}
              </button>
            </div>
          ) : articles.length === 0 ? (
            <p className="text-stone-500 font-medium md:col-span-3">
              {lang === 'en' ? 'No published articles yet.' : 'Belum ada artikel yang dipublikasikan.'}
            </p>
          ) : (
            articles.map((article: any) => (
              <div key={article.id} className="h-full">
                <ArticleCard article={article} lang={lang} isAdmin={!!isAuthenticated} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
