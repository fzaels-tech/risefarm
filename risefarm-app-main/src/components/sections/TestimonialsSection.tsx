'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/lib/translations'
import Image from 'next/image'

export function TestimonialsSection() {
  const { lang } = useLanguage()
  const t = translations[lang].testimonials

  return (
    <section className="py-24 bg-emerald-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-6">{t.title}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="fade-in-up">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-emerald-100 relative h-full">
              <div className="text-6xl text-orange-200 absolute top-6 right-8 font-serif">"</div>
              <p className="text-stone-600 text-lg italic mb-8 relative z-10 leading-relaxed">{t.t1}</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-200 rounded-full overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                    alt={t.t1n}
                    fill
                    sizes="56px"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950">{t.t1n}</h4>
                  <p className="text-stone-500 text-sm">{t.t1r}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="fade-in-up">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-emerald-100 relative h-full">
              <div className="text-6xl text-purple-200 absolute top-6 right-8 font-serif">"</div>
              <p className="text-stone-600 text-lg italic mb-8 relative z-10 leading-relaxed">{t.t2}</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-200 rounded-full overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                    alt={t.t2n}
                    fill
                    sizes="56px"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950">{t.t2n}</h4>
                  <p className="text-stone-500 text-sm">{t.t2r}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
