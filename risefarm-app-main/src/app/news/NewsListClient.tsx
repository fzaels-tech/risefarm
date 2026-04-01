'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { ArticleCard } from '@/components/ArticleCard'
import { translations } from '@/lib/translations'

type Article = {
  id: string
  title: string
  slug: string
  category: string
  author: string
  image: string
  excerpt: string
  locale: 'id' | 'en'
  status: string
  publishedAt: Date | null
  createdAt: Date
}

type Props = {
  initialArticles: Article[]
  isAuthenticated: boolean
  lang: 'id' | 'en'
}

export function NewsListClient({ initialArticles, isAuthenticated, lang }: Props) {
  const t = translations[lang]
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('published')

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase()

    return initialArticles.filter((article) => {
      if (statusFilter !== 'all' && article.status !== statusFilter) return false
      if (!q) return true

      return [article.title, article.category, article.author, article.excerpt].some((field) =>
        (field || '').toLowerCase().includes(q)
      )
    })
  }, [initialArticles, query, statusFilter])

  return (
    <main className="pt-32 min-h-screen bg-[#F8F4ED]">
      <section className="pb-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mb-10">
            <p className="text-[#C4521A] font-bold uppercase tracking-wider mb-3">Newsroom</p>
            <h1 className="text-4xl md:text-6xl font-sans font-bold text-[#0A3A2D] mb-4">{t.news.title}</h1>
            <p className="text-stone-600 text-lg max-w-3xl">
              {lang === 'id'
                ? 'Temukan informasi terbaru, wawasan industri pertanian, dan kabar terkini seputar perjalanan Risefarm dalam menghadirkan hasil panen berkualitas tinggi.'
                : "Discover the latest information, agricultural industry insights, and current news about Risefarm's journey in delivering high-quality harvests."}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="relative w-full lg:max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={lang === 'id' ? 'Cari artikel atau kategori...' : 'Search article or category...'}
                className="w-full h-12 rounded-2xl border border-emerald-300 bg-white pl-11 pr-4 text-sm text-stone-700 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 self-start lg:self-auto">
              {isAuthenticated && (
                <>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
                    className="h-12 rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-700 outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="all">All</option>
                  </select>

                  <Link
                    href="/editor"
                    className="h-12 px-6 rounded-2xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-colors inline-flex items-center"
                  >
                    + {lang === 'id' ? 'Tulis Artikel' : 'Write Article'}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                lang={lang}
                isAdmin={isAuthenticated}
                showStatus={isAuthenticated}
                showEditText={isAuthenticated}
                statusLabelMode="raw"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}