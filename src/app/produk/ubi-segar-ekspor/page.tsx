import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const SITE_URL = 'https://risefarm.asia'

export const metadata: Metadata = {
  title: 'Ubi Segar Kualitas Ekspor',
  description:
    'RISEFARM menyediakan ubi Cilembu, ubi ungu, ubi Jepang, Murasaki, dan Pinky berkualitas ekspor. Pasokan stabil untuk kebutuhan eksportir, supermarket internasional, dan industri pengolahan makanan.',
  keywords: [
    'ubi ekspor Indonesia',
    'sweet potato export supplier',
    'supplier ubi ekspor',
    'ubi Cilembu ekspor',
    'ubi Jepang ekspor Indonesia',
    'Murasaki sweet potato supplier',
    'ubi ungu ekspor',
    'ubi segar kualitas ekspor',
    'RISEFARM ekspor',
  ],
  alternates: {
    canonical: `${SITE_URL}/produk/ubi-segar-ekspor`,
    languages: {
      'id-ID': `${SITE_URL}/produk/ubi-segar-ekspor`,
      'en-US': `${SITE_URL}/produk/ubi-segar-ekspor`,
    },
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/produk/ubi-segar-ekspor`,
    title: 'Ubi Segar Kualitas Ekspor | RISEFARM',
    description:
      'Supplier ubi premium Indonesia untuk pasar ekspor. Ubi Cilembu, ubi ungu, ubi Jepang, Murasaki, dan Pinky — konsisten, tersertifikasi, siap kirim.',
    images: [{ url: `${SITE_URL}/images/og-image.jpg`, width: 1200, height: 630, alt: 'Ubi Ekspor RISEFARM' }],
    siteName: 'RISEFARM',
    locale: 'id_ID',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ubi Segar Kualitas Ekspor | RISEFARM',
    description: 'Supplier ubi premium Indonesia untuk pasar ekspor dan supermarket internasional.',
    images: [`${SITE_URL}/images/og-image.jpg`],
  },
}

export default function UbiEksporPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FDFBF7]">
        <section className="container mx-auto px-6 md:px-12 py-20">
          <p className="text-orange-600 font-bold uppercase tracking-wider mb-3">Produk</p>
          <h1 className="text-4xl md:text-6xl font-bold text-emerald-950 mb-6">
            Ubi Segar Kualitas Ekspor
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl">
            Halaman ini sedang dalam pengembangan. Hubungi kami di{' '}
            <a href="mailto:csrisefarm@gmail.com" className="text-emerald-700 font-semibold hover:text-orange-600">
              csrisefarm@gmail.com
            </a>{' '}
            untuk informasi produk ekspor.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
