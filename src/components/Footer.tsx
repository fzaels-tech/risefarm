'use client'

import { Leaf, MapPin, Phone, Mail } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/lib/translations'
import Link from 'next/link'

export function Footer() {
  const { lang } = useLanguage()
  const t = translations[lang]

  return (
    <footer id="contact" className="bg-[#2A231D] text-stone-300 pt-24 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="w-8 h-8 text-emerald-500" />
              <span className="text-2xl font-bold tracking-tighter text-white">RISE<span className="text-orange-500">FARM</span></span>
            </div>
            <p className="text-stone-400 mb-8 leading-relaxed">{t.footer.desc}</p>

          </div>

          <div className="md:col-span-2 md:col-start-6">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t.footer.nav}</h4>
            <ul className="space-y-4">
              <li><Link href="/#about" className="hover:text-orange-400 transition-colors">{t.nav.about}</Link></li>
              <li><Link href="/#products" className="hover:text-orange-400 transition-colors">{t.nav.products}</Link></li>
              <li><Link href="/#process" className="hover:text-orange-400 transition-colors">{t.nav.process}</Link></li>
              <li><Link href="/#gallery" className="hover:text-orange-400 transition-colors">{t.nav.gallery}</Link></li>
              <li><Link href="/news" className="hover:text-orange-400 transition-colors">{t.nav.articles}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t.footer.contact}</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <a href="https://maps.google.com/?q=Jl.+Parungkuda,+Kabupaten+Sukabumi,+Jawa+Barat+Indonesia" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors break-words">Jl. Parungkuda, Kabupaten Sukabumi, Jawa Barat Indonesia</a>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-emerald-500 shrink-0" />
                <a href="https://wa.me/6281281091257" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">+62 812 8109 1257</a>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-emerald-500 shrink-0" />
                <a href="mailto:csrisefarm@gmail.com" className="hover:text-emerald-400 transition-colors break-all">csrisefarm@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500">
          <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
          <p>{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
