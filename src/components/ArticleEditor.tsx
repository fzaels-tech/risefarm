'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, CloudUpload, Loader2, X, AlertCircle } from 'lucide-react'
import Image from 'next/image'

type LangTab = 'id' | 'en'

const emptyForm = () => ({
  category: '',
  author: '',
  image: '',
  id_title: '',
  id_excerpt: '',
  id_content: '',
  en_title: '',
  en_excerpt: '',
  en_content: '',
})

export function ArticleEditor({ initialArticles }: { initialArticles: any[] }) {
  const [articles, setArticles] = useState(initialArticles)
  const [currentId, setCurrentId] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [activeTab, setActiveTab] = useState<LangTab>('id')
  const [form, setForm] = useState(emptyForm())
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  
  const DRAFT_KEY = 'risefarm_draft_v1'
  const [showDraftPrompt, setShowDraftPrompt] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (saved) setShowDraftPrompt(true)
  }, [])

  useEffect(() => {
    if (!currentId) {
      const isNotEmpty = form.id_title || form.id_content || form.en_title || form.en_content || form.image || form.category || form.author
      if (isNotEmpty) {
        const timer = setTimeout(() => localStorage.setItem(DRAFT_KEY, JSON.stringify(form)), 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [form, currentId])

  const restoreDraft = () => {
    try { setForm(JSON.parse(localStorage.getItem(DRAFT_KEY) || '')) } catch {}
    setShowDraftPrompt(false)
  }

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    setShowDraftPrompt(false)
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const refreshArticles = async () => {
    const res = await fetch('/api/articles?admin=true')
    if (res.ok) setArticles(await res.json())
  }

  const handleCreateNew = () => {
    setCurrentId('')
    setForm(emptyForm())
    setActiveTab('id')
  }

  const handleEdit = (article: any) => {
    setCurrentId(article.id)
    // `translations` is included from getAllArticlesForAdmin / API responses
    const translations: any[] = article.translations ?? []
    const id = translations.find((t: any) => t.locale === 'id')
    const en = translations.find((t: any) => t.locale === 'en')
    setForm({
      category: article.category || '',
      author: article.author || '',
      image: article.image || '',
      id_title: id?.title ?? article.title ?? '',
      id_excerpt: id?.excerpt ?? article.excerpt ?? '',
      id_content: id?.content ?? article.content ?? '',
      en_title: en?.title ?? '',
      en_excerpt: en?.excerpt ?? '',
      en_content: en?.content ?? '',
    })
    setActiveTab('id')
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!form.id_title && !form.en_title) {
      showToast('Judul artikel (minimal satu bahasa) tidak boleh kosong!', 'error')
      return
    }

    const url = currentId ? `/api/articles/${currentId}` : '/api/articles'
    const method = currentId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, status }),
    })

    if (res.ok) {
      if (!currentId) localStorage.removeItem(DRAFT_KEY)
      showToast(currentId ? 'Artikel diperbarui' : 'Artikel baru berhasil disimpan', 'success')
      handleCreateNew()
      refreshArticles()
    } else {
      showToast('Gagal menyimpan artikel. Periksa koneksi Anda.', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
    if (res.ok) {
      if (currentId === id) handleCreateNew()
      refreshArticles()
    }
    setDeleteConfirmId(null)
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload-image', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { showToast(data.error || 'Gagal upload gambar', 'error'); return }
      setForm((prev) => ({ ...prev, image: data.url }))
      showToast('Gambar berhasil diunggah', 'success')
    } catch {
      showToast('Gagal upload gambar, periksa koneksi internet', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  // Preview uses active tab
  const previewTitle = activeTab === 'id' ? form.id_title : form.en_title
  const previewExcerpt = activeTab === 'id' ? form.id_excerpt : form.en_excerpt

  return (
    <div className="container mx-auto px-6 md:px-12 relative">
      {toast && (
        <div className="fixed top-24 right-5 sm:right-10 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span className="font-semibold text-sm">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70 transition-opacity p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-stone-100 p-8 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 border border-red-100 mb-5 mx-auto">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-emerald-950 text-center mb-2">Hapus Artikel?</h3>
            <p className="text-stone-500 text-sm text-center mb-7">Artikel ini akan dihapus secara permanen dan tidak bisa dikembalikan.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-5 py-3 rounded-2xl border border-stone-200 font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 px-5 py-3 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <p className="text-orange-600 font-bold uppercase tracking-wider mb-2">Editor</p>
                <h1 className="text-3xl md:text-4xl font-bold text-emerald-950">Tulis Artikel / Berita</h1>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleCreateNew} className="px-5 py-3 rounded-2xl border border-stone-300 font-semibold hover:bg-stone-50">Artikel Baru</button>
                <button onClick={() => handleSave('draft')} className="px-5 py-3 rounded-2xl bg-stone-900 text-white font-semibold hover:bg-stone-800">Simpan Draft</button>
                <button onClick={() => handleSave('published')} className="px-5 py-3 rounded-2xl bg-orange-500 text-white font-semibold hover:bg-orange-600">Publish</button>
              </div>
            </div>

            {showDraftPrompt && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-blue-900 font-bold text-sm mb-1">Draft Tersimpan Ditemukan</h4>
                  <p className="text-blue-700 text-xs shadow-none">Anda memiliki draft tulisan sebelumnya yang belum tersimpan ke server.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={discardDraft} className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors">Abaikan</button>
                  <button onClick={restoreDraft} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">Pulihkan Draft</button>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Shared fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Kategori</label>
                  <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} type="text" className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500" placeholder="Berita" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Penulis</label>
                  <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} type="text" className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500" placeholder="Tim RISEFARM" />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-semibold mb-2">Cover Image</label>
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${uploadingImage ? 'bg-stone-200 text-stone-600' : 'bg-stone-900 text-white hover:bg-stone-800'}`}>
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-5 h-5" />}
                      {uploadingImage ? 'Mengupload...' : 'Upload Photo'}
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.currentTarget.value = '' }} />
                    </label>
                    <div className="text-xs text-stone-500">Pilih file gambar untuk cover artikel.</div>
                  </div>
                  {form.image && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 font-medium bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5" />
                      <div>
                        <p>Gambar berhasil ditambahkan</p>
                        <p className="text-xs text-emerald-600 font-normal truncate max-w-[200px] sm:max-w-xs mt-0.5">{form.image.split('/').pop()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Language Tabs */}
              <div>
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('id')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${activeTab === 'id' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-400'}`}
                  >
                    🇮🇩 Indonesia
                    {form.id_title && <span className="w-2 h-2 rounded-full bg-emerald-300"></span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('en')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${activeTab === 'en' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-400'}`}
                  >
                    🇬🇧 English
                    {form.en_title && <span className="w-2 h-2 rounded-full bg-emerald-300"></span>}
                  </button>
                </div>

                {/* ID Fields */}
                {activeTab === 'id' && (
                  <div className="space-y-4 p-5 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Judul Artikel <span className="text-stone-400 font-normal">(Indonesia)</span></label>
                      <input value={form.id_title} onChange={e => setForm({ ...form, id_title: e.target.value })} type="text" className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500 bg-white" placeholder="Contoh: Panen Ubi Cilembu Meningkat..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Ringkasan Singkat <span className="text-stone-400 font-normal">(Indonesia)</span></label>
                      <textarea value={form.id_excerpt} onChange={e => setForm({ ...form, id_excerpt: e.target.value })} rows={3} className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500 bg-white" placeholder="Ringkasan dalam bahasa Indonesia..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Isi Artikel <span className="text-stone-400 font-normal">(Indonesia)</span></label>
                      <textarea value={form.id_content} onChange={e => setForm({ ...form, id_content: e.target.value })} rows={16} className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500 bg-white" placeholder="Pisahkan paragraf dengan baris kosong. Awali ## untuk judul." />
                    </div>
                  </div>
                )}

                {/* EN Fields */}
                {activeTab === 'en' && (
                  <div className="space-y-4 p-5 rounded-2xl border border-blue-100 bg-blue-50/30">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Article Title <span className="text-stone-400 font-normal">(English)</span></label>
                      <input value={form.en_title} onChange={e => setForm({ ...form, en_title: e.target.value })} type="text" className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500 bg-white" placeholder="Example: Cilembu Sweet Potato Harvest Grows..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Short Summary <span className="text-stone-400 font-normal">(English)</span></label>
                      <textarea value={form.en_excerpt} onChange={e => setForm({ ...form, en_excerpt: e.target.value })} rows={3} className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500 bg-white" placeholder="Short summary in English..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Article Content <span className="text-stone-400 font-normal">(English)</span></label>
                      <textarea value={form.en_content} onChange={e => setForm({ ...form, en_content: e.target.value })} rows={16} className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500 bg-white" placeholder="Separate paragraphs with blank lines. Start ## for headings." />
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-xl font-bold text-emerald-950 mb-1">Preview Cepat</h2>
            <p className="text-xs text-stone-400 mb-4">Tab aktif: {activeTab === 'id' ? '🇮🇩 Indonesia' : '🇬🇧 English'}</p>
            <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
              <div className="h-44 bg-stone-200 flex items-center justify-center text-stone-500 overflow-hidden relative">
                {form.image ? (
                  <Image
                    src={form.image}
                    alt="preview"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="w-full h-full object-cover"
                  />
                ) : 'Cover artikel'}
              </div>
              <div className="p-5">
                <span className="inline-flex px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-3">Draft</span>
                <h3 className="text-xl font-bold text-emerald-950 mb-2 line-clamp-2">{previewTitle || 'Judul artikel akan tampil di sini'}</h3>
                <p className="text-stone-600 text-sm line-clamp-3">{previewExcerpt || 'Ringkasan artikel akan muncul sebagai preview card.'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-emerald-950">Daftar Artikel</h2>
              <span className="text-sm text-stone-500">{articles.length} artikel</span>
            </div>
            <div className="space-y-3 max-h-[520px] overflow-auto pr-2">
              {articles.map((article: any) => (
                <div key={article.id} className="text-left p-4 rounded-2xl border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group" onClick={() => handleEdit(article)}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${article.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-700'}`}>
                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      </span>
                      {/* Show available locale badges */}
                      {(article.translations ?? []).map((t: any) => (
                        <span key={t.locale} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-500 uppercase">{t.locale}</span>
                      ))}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(article.id) }} className="text-xs text-red-500 opacity-0 group-hover:opacity-100">Hapus</button>
                  </div>
                  <h3 className="font-bold text-emerald-950 line-clamp-2 mb-1">{article.title}</h3>
                  <p className="text-sm text-stone-500 line-clamp-2">{article.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
