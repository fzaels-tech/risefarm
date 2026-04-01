'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/lib/translations'

export function CTASection() {
  const { lang } = useLanguage()
  const t = translations[lang].cta

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-emerald-900"></div>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center fade-in-up">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6" dangerouslySetInnerHTML={{ __html: t.title }} />
        <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">{t.desc}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="https://wa.me/6281281091257" target="_blank" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1 text-center">
            {t.btn1}
          </a>
          <a href="https://wa.me/6281281091257" target="_blank" className="px-8 py-4 bg-white hover:bg-emerald-50 text-emerald-900 rounded-full font-bold text-lg transition-all shadow-xl hover:-translate-y-1 text-center">
            {t.btn2}
          </a>
        </div>
      </div>
    </section>
  )
}
