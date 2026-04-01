import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProductEditor } from '@/components/ProductEditor'

export const dynamic = 'force-dynamic'

export default function ProductEditorPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 min-h-screen bg-stone-100 pb-20">
        <ProductEditor />
      </main>
      <Footer />
    </>
  )
}
