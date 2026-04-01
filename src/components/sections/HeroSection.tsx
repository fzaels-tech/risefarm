'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/lib/translations'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'

export function HeroSection() {
  const { lang } = useLanguage()
  const t = translations[lang].hero

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cuciubi_pak_rama.jpeg"
          alt="Perkebunan Ubi"
          fill
          priority
          quality={60}
          sizes="100vw"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        <div className="max-w-3xl">
          <div className="fade-in-up" style={{ transitionDelay: '100ms' }}>
            <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-300 font-semibold text-sm mb-6 border border-orange-500/30 backdrop-blur-sm">
              {t.badge}
            </span>
          </div>
          <div className="fade-in-up" style={{ transitionDelay: '200ms' }}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6 break-words">
              {t.title}
            </h1>
          </div>
          <div className="fade-in-up" style={{ transitionDelay: '300ms' }}>
            <p className="text-base sm:text-lg md:text-2xl text-stone-200 mb-8 sm:mb-10 max-w-2xl leading-relaxed">
              {t.desc}
            </p>
          </div>
          <div className="fade-in-up flex flex-col sm:flex-row gap-3 sm:gap-4" style={{ transitionDelay: '400ms' }}>
            <Link href="#products" className="w-full sm:w-auto justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-base sm:text-lg transition-all shadow-lg hover:shadow-orange-500/30 flex items-center gap-2 group">
              <span>{t.cta1}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/news" className="w-full sm:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-full font-bold text-base sm:text-lg transition-all border border-white/30">
              {t.ctaArticles}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
