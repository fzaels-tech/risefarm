'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/lib/translations'
import { ShieldCheck, Sprout, Tractor, Users } from 'lucide-react'

export function WhySection() {
  const { lang } = useLanguage()
  const t = translations[lang].why

  return (
    <section className="py-20 bg-emerald-900 text-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t.title}</h2>
          <p className="text-emerald-100 text-lg">{t.desc}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="fade-in-up">
            <div className="bg-emerald-800/50 p-8 rounded-2xl border border-emerald-700/50 h-full">
              <div className="w-14 h-14 rounded-xl bg-emerald-950 flex items-center justify-center mb-6 text-orange-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.q1}</h3>
              <p className="text-emerald-100/80 leading-relaxed">{t.q1d}</p>
            </div>
          </div>
          <div className="fade-in-up">
            <div className="bg-emerald-800/50 p-8 rounded-2xl border border-emerald-700/50 h-full">
              <div className="w-14 h-14 rounded-xl bg-emerald-950 flex items-center justify-center mb-6 text-emerald-400">
                <Sprout className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.q2}</h3>
              <p className="text-emerald-100/80 leading-relaxed">{t.q2d}</p>
            </div>
          </div>
          <div className="fade-in-up">
            <div className="bg-emerald-800/50 p-8 rounded-2xl border border-emerald-700/50 h-full">
              <div className="w-14 h-14 rounded-xl bg-emerald-950 flex items-center justify-center mb-6 text-purple-400">
                <Tractor className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.q3}</h3>
              <p className="text-emerald-100/80 leading-relaxed">{t.q3d}</p>
            </div>
          </div>
          <div className="fade-in-up">
            <div className="bg-emerald-800/50 p-8 rounded-2xl border border-emerald-700/50 h-full">
              <div className="w-14 h-14 rounded-xl bg-emerald-950 flex items-center justify-center mb-6 text-blue-400">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.q4}</h3>
              <p className="text-emerald-100/80 leading-relaxed">{t.q4d}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
