import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { GalleryEditor } from '../../../components/GalleryEditor'

export const dynamic = 'force-dynamic'

export default function GalleryEditorPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-stone-100">
        <section className="pb-20">
          <GalleryEditor />
        </section>
      </main>
      <Footer />
    </>
  )
}
