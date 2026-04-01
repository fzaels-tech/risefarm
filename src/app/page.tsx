import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/sections/HeroSection'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { ScrollObserver } from '@/components/ScrollObserver'

const AboutSection = dynamic(() => import('@/components/sections/AboutSection').then((m) => m.AboutSection))
const WhySection = dynamic(() => import('@/components/sections/WhySection').then((m) => m.WhySection))
const ProcessSection = dynamic(() => import('@/components/sections/ProcessSection').then((m) => m.ProcessSection))
const GallerySection = dynamic(() => import('@/components/sections/GallerySection').then((m) => m.GallerySection))
const ArticlesPreviewSection = dynamic(() => import('@/components/sections/ArticlesPreviewSection').then((m) => m.ArticlesPreviewSection))
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection').then((m) => m.TestimonialsSection))
const CTASection = dynamic(() => import('@/components/sections/CTASection').then((m) => m.CTASection))

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="home-page">
        <ScrollObserver />
        <HeroSection />
        <AboutSection />
        <WhySection />
        <ProductsSection />
        <ProcessSection />
        <GallerySection />
        <ArticlesPreviewSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
