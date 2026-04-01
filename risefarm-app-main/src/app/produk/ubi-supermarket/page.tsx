import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const SITE_URL = 'https://risefarm.asia'

export const metadata: Metadata = {
  title: 'Ubi Segar untuk Supermarket & B2B',
  description:
    'RISEFARM menyediakan pasokan ubi segar harian yang stabil untuk supermarket, retailer modern, dan kebutuhan B2B. Ubi Cilembu, ubi ungu, TW, dan sayuran organik siap distribusi.',
  keywords: [
    'supplier ubi supermarket',
    'ubi segar B2B',
    'pasokan ubi supermarket Indonesia',
    'ubi Cilembu supermarket',
    'supplier ubi harian',
    'ubi segar retail',
    'agritech ubi B2B',
    'RISEFARM supermarket',
  ],
  alternates: {
    canonical: `${SITE_URL}/produk/ubi-supermarket`,
    languages: {
      'id-ID': `${SITE_URL}/produk/ubi-supermarket`,
      'en-US': `${SITE_URL}/produk/ubi-supermarket`,
    },
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/produk/ubi-supermarket`,
    title: 'Ubi Segar untuk Supermarket & B2B | RISEFARM',
    description:
      'Pasokan ubi segar stabil untuk supermarket dan kebutuhan B2B. Kualitas terjaga, distribusi terukur, langsung dari kebun RISEFARM.',
    images: [{ url: `${SITE_URL}/images/og-image.jpg`, width: 1200, height: 630, alt: 'Ubi Supermarket RISEFARM' }],
    siteName: 'RISEFARM',
    locale: 'id_ID',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ubi Segar untuk Supermarket & B2B | RISEFARM',
    description: 'Supplier ubi segar terpercaya untuk supermarket dan kebutuhan bisnis B2B Indonesia.',
    images: [`${SITE_URL}/images/og-image.jpg`],
  },
}

export default function UbiSupermarketPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FDFBF7]">
        <section className="container mx-auto px-6 md:px-12 py-20">
          <p className="text-orange-600 font-bold uppercase tracking-wider mb-3">Produk</p>
          <h1 className="text-4xl md:text-6xl font-bold text-emerald-950 mb-6">
            Ubi Segar untuk Supermarket & B2B
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl">
            Halaman ini sedang dalam pengembangan. Hubungi kami di{' '}
            <a href="mailto:csrisefarm@gmail.com" className="text-emerald-700 font-semibold hover:text-orange-600">
              csrisefarm@gmail.com
            </a>{' '}
            untuk informasi pasokan ke supermarket dan kebutuhan B2B.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
