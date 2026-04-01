import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { WhySection } from '@/components/sections/WhySection'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { GallerySection } from '@/components/sections/GallerySection'
import { ArticlesPreviewSection } from '@/components/sections/ArticlesPreviewSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { CTASection } from '@/components/sections/CTASection'
import { ScrollObserver } from '@/components/ScrollObserver'

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
