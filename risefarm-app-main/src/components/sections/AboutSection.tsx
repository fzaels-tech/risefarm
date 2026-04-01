'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/lib/translations'
import { Leaf } from 'lucide-react'
import Image from 'next/image'

export function AboutSection() {
  const { lang } = useLanguage()
  const t = translations[lang]

  return (
    <section id="about" className="py-24 bg-[#FDFBF7]">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="fade-in-right relative">
            <div className="aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative">
              <Image
                src="/images/ubiferry.jpeg"
                alt="Petani RISEFARM"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-emerald-900/10 hover:bg-transparent transition-colors duration-500"></div>
            </div>

            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-emerald-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-purple-700" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-900">100%</p>
                  <p className="text-stone-500 font-medium">{t.about.badge}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="fade-in-left" style={{ transitionDelay: '200ms' }}>
            <div>
              <h3 className="text-orange-600 font-bold uppercase tracking-wider mb-2">{t.about.kicker}</h3>
              <h2 className="text-4xl md:text-5xl font-bold text-emerald-950 mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: t.about.title }} />
              <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                {t.about.desc1}
              </p>
              <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                {t.about.desc2}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-emerald-700 mb-1">112+</span>
                  <span className="text-stone-500 font-medium">{t.about.land}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-purple-700 mb-1">45+</span>
                  <span className="text-stone-500 font-medium">{t.about.farmers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
