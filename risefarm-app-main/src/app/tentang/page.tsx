import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const SITE_URL = 'https://risefarm.asia'

export const metadata: Metadata = {
  title: 'Tentang RISEFARM',
  description:
    'RISEFARM adalah pelopor agritech ubi di Indonesia yang menggabungkan teknologi pertanian modern dengan pemberdayaan petani lokal. Kami menghadirkan pertanian ubi berkelanjutan di Sukabumi, Jawa Barat.',
  keywords: [
    'RISEFARM agritech',
    'pertanian ubi berkelanjutan Indonesia',
    'agritech ubi Indonesia',
    'pertanian regeneratif ubi',
    'RISEFARM Sukabumi',
    'pelopor agritech ubi nusantara',
    'pemberdayaan petani ubi',
    'tentang RISEFARM',
  ],
  alternates: {
    canonical: `${SITE_URL}/tentang`,
    languages: {
      'id-ID': `${SITE_URL}/tentang`,
      'en-US': `${SITE_URL}/tentang`,
    },
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/tentang`,
    title: 'Tentang RISEFARM — Pelopor Agritech Ubi Indonesia',
    description:
      'Mengenal RISEFARM: visi, misi, dan komitmen kami dalam menghadirkan pertanian ubi yang berkelanjutan dan berdampak bagi petani lokal Indonesia.',
    images: [{ url: `${SITE_URL}/images/og-image.jpg`, width: 1200, height: 630, alt: 'Tentang RISEFARM' }],
    siteName: 'RISEFARM',
    locale: 'id_ID',
    alternateLocale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tentang RISEFARM — Pelopor Agritech Ubi Indonesia',
    description:
      'Pelopor agritech ubi di Indonesia. Pertanian regeneratif, pemberdayaan petani lokal, pasokan stabil untuk pasar ekspor dan supermarket.',
    images: [`${SITE_URL}/images/og-image.jpg`],
  },
}

export default function TentangPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-[#FDFBF7]">
        <section className="container mx-auto px-6 md:px-12 py-20">
          <p className="text-orange-600 font-bold uppercase tracking-wider mb-3">Tentang Kami</p>
          <h1 className="text-4xl md:text-6xl font-bold text-emerald-950 mb-6">
            RISEFARM — Pelopor Agritech Ubi Indonesia
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl">
            Halaman ini sedang dalam pengembangan. Untuk informasi lebih lanjut tentang RISEFARM,
            hubungi kami di{' '}
            <a href="mailto:csrisefarm@gmail.com" className="text-emerald-700 font-semibold hover:text-orange-600">
              csrisefarm@gmail.com
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
