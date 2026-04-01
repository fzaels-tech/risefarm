import Link from 'next/link'
import { translations } from '@/lib/translations'
import Image from 'next/image'

interface Article {
  id: string
  title: string
  slug: string
  category: string
  author: string
  image: string
  excerpt: string
  lang?: string
  locale?: 'id' | 'en'
  status: string
  publishedAt: string | Date | null
  createdAt: string | Date
}

export function ArticleCard({
  article,
  showStatus = false,
  onEdit,
  onDelete,
  isAdmin = false,
  lang = 'id',
  showEditText = false,
  statusLabelMode = 'capitalize',
}: {
  article: Article,
  showStatus?: boolean,
  onEdit?: (id: string) => void,
  onDelete?: (id: string) => void,
  isAdmin?: boolean,
  lang?: 'id' | 'en',
  showEditText?: boolean,
  statusLabelMode?: 'capitalize' | 'raw'
}) {
  const t = translations[lang]
  const dateStr = article.publishedAt || article.createdAt
  const date = new Date(dateStr).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
  const statusLabel = statusLabelMode === 'raw'
    ? article.status
    : article.status.charAt(0).toUpperCase() + article.status.slice(1)

  return (
    <article className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 group flex flex-col h-full">
      <div className="h-52 overflow-hidden relative">
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {article.category || t.news.defaultCategory}
          </span>
          {showStatus && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${article.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-700'}`}>
              {statusLabel}
            </span>
          )}
        </div>
        <Image
          src={article.image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80'}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-emerald-950 mb-3 line-clamp-2">{article.title}</h3>
        <p className="text-stone-600 mb-6 flex-grow line-clamp-3">{article.excerpt}</p>
        
        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex items-center gap-3 text-xs text-stone-400 uppercase tracking-wider font-semibold">
            <span>{article.author}</span>
            <span className="w-1 h-1 rounded-full bg-stone-300"></span>
            <span suppressHydrationWarning>{date}</span>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <Link href={`/news/${article.slug}`} className="text-emerald-700 font-bold flex items-center gap-2 hover:text-orange-600 transition-colors">
              {t.news.readMore}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            
            <div className="flex items-center gap-3">
              {isAdmin && onEdit && (
                <button onClick={() => onEdit(article.id)} className="text-stone-400 hover:text-emerald-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              )}
              {isAdmin && !onEdit && (
                showEditText ? (
                  <Link href="/editor" className="text-stone-500 hover:text-emerald-600 transition-colors text-sm" title="Edit di Dashboard">
                    Edit
                  </Link>
                ) : (
                  <Link href="/editor" className="text-stone-400 hover:text-emerald-600 transition-colors" title="Edit di Dashboard">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </Link>
                )
              )}
              {isAdmin && onDelete && (
                <button onClick={() => onDelete(article.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
