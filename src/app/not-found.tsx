import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F6F2EA]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-24 right-0 h-80 w-80 rounded-full bg-orange-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="mb-5 inline-flex items-center rounded-full border border-emerald-900/10 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
          Error 404
        </p>

        <h1 className="text-6xl font-black tracking-tight text-emerald-950 sm:text-7xl md:text-8xl">
          Halaman Tidak Ditemukan
        </h1>

        <p className="mt-6 max-w-2xl text-base text-stone-700 sm:text-lg">
          Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
          Coba kembali ke beranda atau buka halaman berita terbaru RISEFARM.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
          >
            Kembali Ke Beranda
          </Link>
          <Link
            href="/news"
            className="inline-flex items-center justify-center rounded-full border border-emerald-900/20 bg-white/80 px-6 py-3 text-sm font-bold text-emerald-900 transition hover:bg-white"
          >
            Buka Halaman Berita
          </Link>
        </div>

        <p className="mt-8 text-sm text-stone-600">
          Butuh bantuan cepat? Hubungi tim kami di{' '}
          <a
            href="https://wa.me/6281281091257"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-orange-700 hover:text-orange-800"
          >
            WhatsApp
          </a>
          .
        </p>
      </section>
    </main>
  )
}
