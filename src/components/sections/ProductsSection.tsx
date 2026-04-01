'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/lib/translations'
import { ChevronRight } from 'lucide-react'
import { useState, useRef } from 'react'
import { useFetch } from '@/hooks/useFetch'
import Image from 'next/image'

type ProductTranslation = {
  locale: 'id' | 'en'
  badge: string
  title: string
  desc: string
}

type Product = {
  id: string
  image: string
  badgeColor: string
  link: string | null
  translations: ProductTranslation[]
}

const getBadgeColor = (color: string) => {
  const map: Record<string, string> = {
    orange: 'bg-orange-500',
    emerald: 'bg-emerald-600',
    purple: 'bg-purple-600',
    blue: 'bg-blue-600',
    stone: 'bg-stone-600'
  }
  return map[color] || 'bg-emerald-600'
}

export function ProductsSection() {
  const { lang } = useLanguage()
  const t = translations[lang].products
  
  const { data: productsData, loading, error } = useFetch<Product[]>('/api/products')
  const products = productsData ?? []

  const [scrollProgress, setScrollProgress] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    const totalScroll = scrollWidth - clientWidth
    if (totalScroll === 0) return setScrollProgress(0)
    setScrollProgress((scrollLeft / totalScroll) * 100)
  }

  return (
    <section id="products" className="py-24 bg-[#FDFBF7]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-up">
          <h3 className="text-orange-600 font-bold uppercase tracking-wider mb-2">{t.kicker}</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-6">{t.title}</h2>
          <p className="text-stone-600 text-lg">{t.desc}</p>
        </div>

        <div className="relative group">
          {error && products.length === 0 && (
            <div className="mb-4 mx-6 md:mx-12 rounded-2xl border border-orange-200 bg-orange-50 text-orange-800 px-5 py-4 text-sm font-medium text-center">
              {lang === 'en' ? 'Failed to load products from server. Showing backup catalog.' : 'Gagal memuat produk dari server. Menampilkan katalog cadangan.'}
            </div>
          )}
          {/* Scrollable Container */}
          <div 
            ref={carouselRef}
            onScroll={handleScroll}
            className="hide-scrollbar flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pt-4 pb-12 px-4 sm:px-6 md:px-12"
          >
            {!loading && products.length > 0 ? (
              products.map((p) => {
                const trans = p.translations.find(tr => tr.locale === lang) || p.translations[0]
                
                return (
                  <div 
                    key={p.id} 
                    className="shrink-0 w-[84vw] sm:w-[72vw] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] max-w-full snap-center md:snap-start h-auto" 
                  >
                    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 group/card flex flex-col h-full">
                      <div className="h-64 overflow-hidden relative shrink-0">
                        {trans?.badge && (
                          <div className={`absolute top-4 right-4 ${getBadgeColor(p.badgeColor)} text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full z-10`}>
                            {trans.badge}
                          </div>
                        )}
                        <Image
                          src={p.image}
                          alt={trans?.title || 'Product'}
                          fill
                          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                          className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-8 flex flex-col flex-grow">
                        <h3 className="text-xl md:text-2xl font-bold text-emerald-950 mb-3 line-clamp-2">{trans?.title || 'No Title'}</h3>
                        <p className="text-stone-600 mb-6 line-clamp-3">{trans?.desc || 'No description available'}</p>
                        
                        {p.link && (
                          <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold flex items-center gap-2 hover:text-orange-600 transition-colors mt-auto">
                            <span>{t.detail}</span>
                            <ChevronRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <>
                <div className="shrink-0 w-[84vw] sm:w-[72vw] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] max-w-full snap-center md:snap-start h-auto">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 group/card flex flex-col h-full">
                    <div className="h-64 overflow-hidden relative shrink-0">
                      <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">{t.badge1}</div>
                      <Image
                        src="/images/cilembu.png"
                        alt="Ekspor"
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-emerald-950 mb-3">{t.p1}</h3>
                      <p className="text-stone-600 mb-6">{t.p1d}</p>
                      <a href="https://wa.me/6281281091257" target="_blank" className="text-emerald-700 font-bold flex items-center gap-2 hover:text-orange-600 transition-colors mt-auto">
                        <span>{t.detail}</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 w-[84vw] sm:w-[72vw] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] max-w-full snap-center md:snap-start h-auto">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 group/card flex flex-col h-full">
                    <div className="h-64 overflow-hidden relative shrink-0">
                      <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">B2B</div>
                      <Image
                        src="/images/pengkelompokanubi.jpeg"
                        alt="Supermarket"
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-emerald-950 mb-3">{t.p2}</h3>
                      <p className="text-stone-600 mb-6">{t.p2d}</p>
                      <a href="https://wa.me/6281281091257" target="_blank" className="text-emerald-700 font-bold flex items-center gap-2 hover:text-orange-600 transition-colors mt-auto">
                        <span>{t.detail}</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 w-[84vw] sm:w-[72vw] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] max-w-full snap-center md:snap-start h-auto">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 group/card flex flex-col h-full">
                    <div className="h-64 overflow-hidden relative shrink-0">
                      <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">{t.badge3}</div>
                      <Image
                        src="/images/hasil.jpeg"
                        alt="Sayuran"
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-emerald-950 mb-3">{t.p3}</h3>
                      <p className="text-stone-600 mb-6">{t.p3d}</p>
                      <a href="https://wa.me/6281281091257" target="_blank" className="text-emerald-700 font-bold flex items-center gap-2 hover:text-orange-600 transition-colors mt-auto">
                        <span>{t.detail}</span>
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Custom Hover Scroll Progress Bar */}
          <div className="absolute bottom-2 left-6 right-6 md:left-12 md:right-12 h-1.5 bg-stone-200 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-100 ease-out" 
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
