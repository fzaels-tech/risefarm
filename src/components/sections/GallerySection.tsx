'use client'

import { useLanguage } from '@/hooks/useLanguage'
import { translations } from '@/lib/translations'
import { ChevronRight, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useFetch } from '@/hooks/useFetch'
import Image from 'next/image'

// All gallery images in one place — easy to extend
const DEFAULT_GALLERY_IMAGES = [
  { src: '/images/pengecekan_berulang_pak_budi.jpeg', alt: 'Petani di ladang', caption: 'Pemberdayaan Petani Lokal' },
  { src: '/images/pickup_ubi.jpeg', alt: 'Pickup Ubi', caption: 'Distribusi Ubi Segar' },
  { src: '/images/ubiakbar.jpeg', alt: 'Produk ubi', caption: 'Produk Unggulan' },
  { src: '/images/penyucian_tahap_awal.jpeg', alt: 'Pencucian', caption: 'Proses Pencucian' },
  { src: '/images/susunan_ubi.jpeg', alt: 'Susunan ubi', caption: 'Sortir & Pengemasan' },
  { src: '/images/cuciubi_pak_rama.jpeg', alt: 'Cuci ubi', caption: 'Quality Control' },
  { src: '/images/pengkelompokanubi.jpeg', alt: 'Pengelompokan', caption: 'Grading & Pengelompokan' },
  { src: '/images/ubiferry.jpeg', alt: 'Ubi ferry', caption: 'Varietas Pilihan' },
]

export function GallerySection() {
  const { lang } = useLanguage()
  const t = translations[lang].gallery
  const [showFull, setShowFull] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)

  const { data: galleryData } = useFetch<any[]>('/api/gallery', { staleTime: 0 })

  const displayImages = Array.isArray(galleryData) && galleryData.length > 0
    ? [
        ...galleryData.map((img: any) => ({
          src: img.url,
          alt: img.caption || 'Risefarm Gallery',
          caption: img.caption || 'Dokumentasi RISEFARM'
        })),
        ...DEFAULT_GALLERY_IMAGES,
      ]
    : DEFAULT_GALLERY_IMAGES

  // Prevent scroll when modal is open
  useEffect(() => {
    if (showFull || lightbox) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showFull, lightbox])

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal { animation: modal-in 0.3s ease-out forwards; }
        .animate-scale { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
      
      {/* Preview section */}
      <section id="gallery" className="py-24 bg-[#FDFBF7]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="fade-in-up flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h3 className="text-orange-600 font-bold uppercase tracking-wider mb-2">{t.kicker}</h3>
              <h2 className="text-4xl font-bold text-emerald-950">{t.title}</h2>
            </div>
            <button
              onClick={() => setShowFull(true)}
              className="mt-6 md:mt-0 text-emerald-700 font-bold flex items-center gap-2 hover:text-orange-600 transition-colors"
            >
              <span>{t.all}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="fade-in-up col-span-2 row-span-2">
              <div className="h-64 md:h-[500px] rounded-3xl overflow-hidden group relative cursor-pointer" onClick={() => setLightbox(displayImages[0].src)}>
                <Image
                  src={displayImages[0].src}
                  alt={displayImages[0].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <p className="text-white font-bold text-xl">{displayImages[0].caption || t.caption1}</p>
                </div>
              </div>
            </div>
            {displayImages.slice(1, 4).map((img, i) => (
              <div key={i} className={`fade-in-up${i === 2 ? ' col-span-2 md:col-span-2' : ''}`}>
                <div className="h-48 md:h-[238px] rounded-3xl overflow-hidden group relative cursor-pointer" onClick={() => setLightbox(img.src)}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setShowFull(true)}
              className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full transition-all shadow-md"
            >
              {t.all} ({displayImages.length} foto) →
            </button>
          </div>
        </div>
      </section>

      {/* Full gallery modal */}
      {showFull && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md overflow-y-auto animate-modal" id="gallery-full">
          <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl">
            {/* Header Card */}
            <div className="flex items-center justify-between mb-8 md:mb-12 bg-white/5 border border-white/10 p-5 md:p-6 rounded-3xl animate-scale opacity-0" style={{ animationDelay: '0.1s' }}>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{t.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                  <p className="text-stone-300 text-sm font-medium">{displayImages.length} foto dokumentasi</p>
                </div>
              </div>
              <button
                onClick={() => setShowFull(false)}
                aria-label="Tutup galeri penuh"
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 hover:rotate-90 flex items-center justify-center text-white transition-all duration-300 shadow-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Masonry Layout without JS */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6">
              {displayImages.map((img, i) => (
                <div 
                  key={i} 
                  className="group relative rounded-3xl overflow-hidden cursor-pointer bg-black/20 break-inside-avoid mb-4 md:mb-6 animate-scale opacity-0 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-300"
                  style={{ animationDelay: `${0.1 + (i % 8) * 0.05}s` }}
                  onClick={() => setLightbox(img.src)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={1200}
                    height={900}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-5 md:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-medium text-sm md:text-base translate-y-3 group-hover:translate-y-0 transition-transform duration-300">{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-modal"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Tutup preview galeri"
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 flex items-center justify-center text-white transition-all duration-300 z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative w-full max-w-[92vw] h-[85vh] animate-scale opacity-0"
            style={{ animationDelay: '0.1s' }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={lightbox}
              alt="Gallery"
              fill
              sizes="100vw"
              className="rounded-2xl object-contain shadow-2xl"
            />
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-[92vw] px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl animate-scale opacity-0" style={{ animationDelay: '0.2s' }}>
            <p className="text-white text-sm font-medium tracking-wide text-center break-words">
              {displayImages.find(img => img.src === lightbox)?.caption || 'Dokumentasi RISEFARM'}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
