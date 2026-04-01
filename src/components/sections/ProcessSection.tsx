'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/lib/translations'
import { Sprout, Sun, PackageCheck, Truck } from 'lucide-react'

export function ProcessSection() {
  const { lang } = useLanguage()
  const t = translations[lang].process

  return (
    <section id="process" className="py-24 bg-stone-100 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 fade-in-up">
          <h3 className="text-orange-600 font-bold uppercase tracking-wider mb-2">{t.kicker}</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-6">{t.title}</h2>
          <p className="text-stone-600 text-lg">{t.desc}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-12 md:gap-6 relative z-10">
          <div className="fade-in-up">
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full shadow-xl border-4 border-emerald-500 flex items-center justify-center mb-6">
                <Sprout className="w-10 h-10 text-emerald-700" />
              </div>
              <h4 className="text-xl font-bold text-emerald-950 mb-3">{t.s1}</h4>
              <p className="text-stone-600 px-4">{t.s1d}</p>
            </div>
          </div>
          <div className="fade-in-up">
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full shadow-xl border-4 border-emerald-500 flex items-center justify-center mb-6">
                <Sun className="w-10 h-10 text-emerald-700" />
              </div>
              <h4 className="text-xl font-bold text-emerald-950 mb-3">{t.s2}</h4>
              <p className="text-stone-600 px-4">{t.s2d}</p>
            </div>
          </div>
          <div className="fade-in-up">
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full shadow-xl border-4 border-emerald-500 flex items-center justify-center mb-6">
                <PackageCheck className="w-10 h-10 text-emerald-700" />
              </div>
              <h4 className="text-xl font-bold text-emerald-950 mb-3">{t.s3}</h4>
              <p className="text-stone-600 px-4">{t.s3d}</p>
            </div>
          </div>
          <div className="fade-in-up">
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white rounded-full shadow-xl border-4 border-emerald-500 flex items-center justify-center mb-6">
                <Truck className="w-10 h-10 text-emerald-700" />
              </div>
              <h4 className="text-xl font-bold text-emerald-950 mb-3">{t.s4}</h4>
              <p className="text-stone-600 px-4">{t.s4d}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
