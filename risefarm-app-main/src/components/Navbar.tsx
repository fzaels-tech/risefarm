'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Leaf, Menu, X, SquarePen, ChevronDown, Image as ImageIcon, Package } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { translations } from '@/lib/translations'
import { LoginModal } from '@/components/LoginModal'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { lang, changeLanguage } = useLanguage()
  const { isAuthenticated, logout } = useAuth()

  const t = translations[lang]

  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 20)
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true)
        setMobileMenuOpen(false) // Auto close mobile menu when hiding navbar
      } else if (currentScrollY < lastScrollY) {
        setHidden(false)
      }
      
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full p-2 pl-4 transition-all duration-500 backdrop-blur-md border border-white/10 ${scrolled ? 'bg-[#1A1208]/85 shadow-2xl' : 'bg-[#1A1208]/40'} ${hidden ? '-translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <div className="flex justify-between items-center w-full">
          {/* Bagian Kiri (Logo & Nama Brand) */}
          <Link href="/" className="flex items-center gap-2.5 relative z-10 transition-transform hover:scale-105">
            <div className="bg-white w-9 h-9 rounded-full flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-white font-bold tracking-tighter text-lg md:text-xl">
              RISE<span className="text-orange-500">FARM</span>
            </span>
          </Link>
          
          {/* Bagian Tengah (Nav Links) */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/#about" className="text-white/80 text-sm font-medium hover:text-orange-500 transition-colors">{t.nav.about}</Link>
            <Link href="/#products" className="text-white/80 text-sm font-medium hover:text-orange-500 transition-colors">{t.nav.products}</Link>
            <Link href="/#process" className="text-white/80 text-sm font-medium hover:text-orange-500 transition-colors">{t.nav.process}</Link>
            <Link href="/#gallery" className="text-white/80 text-sm font-medium hover:text-orange-500 transition-colors">{t.nav.gallery}</Link>
            <Link href="/news" className="text-white/80 text-sm font-medium hover:text-orange-500 transition-colors">{t.nav.articles}</Link>
            <Link href="/#contact" className="text-white/80 text-sm font-medium hover:text-orange-500 transition-colors">{t.nav.contact}</Link>

            {/* Admin Write Article */}
            {isAuthenticated && (
              <div className="relative group">
                <button className="font-medium text-sm flex items-center gap-1.5 transition-colors text-emerald-400 hover:text-orange-500 py-2">
                  <span>Menu Admin</span>
                  <ChevronDown className="w-4 h-4 mt-0.5 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full -right-4 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-3 z-50">
                  <Link href="/editor" className="px-5 py-2.5 text-sm font-semibold text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-3">
                    <SquarePen className="w-4 h-4" />
                    Tulis Artikel
                  </Link>
                  <Link href="/editor/products" className="px-5 py-2.5 text-sm font-semibold text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    Katalog Produk
                  </Link>
                  <Link href="/editor/gallery" className="px-5 py-2.5 text-sm font-semibold text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-3">
                    <ImageIcon className="w-4 h-4" />
                    Tambahkan Foto
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bagian Kanan (Actions & Tombol) */}
          <div className="flex items-center gap-3">
            {/* Lang Toggles */}
            <div className="hidden sm:flex items-center gap-2 mr-1">
              <button onClick={() => changeLanguage('id')} className={`w-8 h-8 flex items-center justify-center rounded-full border text-[10px] font-bold transition-all duration-300 ${lang === 'id' ? 'bg-white/20 border-white text-white' : 'border-white/20 text-white hover:bg-white/10'}`}>ID</button>
              <button onClick={() => changeLanguage('en')} className={`w-8 h-8 flex items-center justify-center rounded-full border text-[10px] font-bold transition-all duration-300 ${lang === 'en' ? 'bg-white/20 border-white text-white' : 'border-white/20 text-white hover:bg-white/10'}`}>EN</button>
            </div>

            {/* Admin Login/Logout Button — hanya tampil di desktop */}
            <div className="hidden lg:flex">
              {isAuthenticated ? (
                <button onClick={logout} className="bg-white text-[#1A1208] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 shrink-0 transition-colors">Logout Admin</button>
              ) : (
                <button onClick={() => setIsLoginModalOpen(true)} className="bg-white text-[#1A1208] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 shrink-0 transition-colors">Admin Login</button>
              )}
            </div>

            {/* Mobile Toggle - SUDAH BENAR (hilang saat lg:hidden) */}
            <button
              className="lg:hidden text-white shrink-0 ml-1 mr-3 inline-flex h-12 w-12 items-center justify-center rounded-full hover:bg-white/10 active:scale-95 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown - TIDAK DIUBAH */}
      {mobileMenuOpen && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-lg bg-[#1A1208]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:hidden flex flex-col gap-5 shadow-2xl">
          <Link href="/#about" onClick={() => setMobileMenuOpen(false)} className="text-white/90 font-medium text-lg hover:text-orange-500 transition-colors">{t.nav.about}</Link>
          <Link href="/#products" onClick={() => setMobileMenuOpen(false)} className="text-white/90 font-medium text-lg hover:text-orange-500 transition-colors">{t.nav.products}</Link>
          <Link href="/#process" onClick={() => setMobileMenuOpen(false)} className="text-white/90 font-medium text-lg hover:text-orange-500 transition-colors">{t.nav.process}</Link>
          <Link href="/#gallery" onClick={() => setMobileMenuOpen(false)} className="text-white/90 font-medium text-lg hover:text-orange-500 transition-colors">{t.nav.gallery}</Link>
          <Link href="/news" onClick={() => setMobileMenuOpen(false)} className="text-white/90 font-medium text-lg hover:text-orange-500 transition-colors">{t.nav.articles}</Link>
          <Link href="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-white/90 font-medium text-lg hover:text-orange-500 transition-colors">{t.nav.contact}</Link>
          
          {isAuthenticated && (
            <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-white/10">
               <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Menu Admin</span>
               <Link href="/editor" onClick={() => setMobileMenuOpen(false)} className="text-emerald-400 font-bold text-lg hover:text-orange-500 transition-colors flex items-center gap-2">
                 <SquarePen className="w-5 h-5" />
                 Tulis Artikel
               </Link>
               <Link href="/editor/products" onClick={() => setMobileMenuOpen(false)} className="text-emerald-400 font-bold text-lg hover:text-orange-500 transition-colors flex items-center gap-2">
                 <Package className="w-5 h-5" />
                 Katalog Produk
               </Link>
               <Link href="/editor/gallery" onClick={() => setMobileMenuOpen(false)} className="text-emerald-400 font-bold text-lg hover:text-orange-500 transition-colors flex items-center gap-2">
                 <ImageIcon className="w-5 h-5" />
                 Tambahkan Foto
               </Link>
            </div>
          )}
          
          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button onClick={() => changeLanguage('id')} className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-bold transition-all ${lang === 'id' ? 'bg-white/20 border-white text-white' : 'border-white/20 text-white hover:bg-white/10'}`}>ID</button>
            <button onClick={() => changeLanguage('en')} className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-bold transition-all ${lang === 'en' ? 'bg-white/20 border-white text-white' : 'border-white/20 text-white hover:bg-white/10'}`}>EN</button>
          </div>
          
          {isAuthenticated ? (
            <button onClick={logout} className="w-full bg-white text-[#1A1208] px-5 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors mt-2">Logout Admin</button>
          ) : (
            <button onClick={() => { setIsLoginModalOpen(true); setMobileMenuOpen(false); }} className="w-full bg-white text-[#1A1208] px-5 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors mt-2">Admin Login</button>
          )}
        </div>
      )}
      
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}
