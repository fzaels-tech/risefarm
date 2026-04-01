'use client'

import { useState, useEffect } from 'react'
import { CloudUpload, Loader2, CheckCircle2, AlertCircle, X, Package, Trash2, Edit2, Plus } from 'lucide-react'
import Image from 'next/image'

type ProductTranslation = {
  locale: 'id' | 'en'
  badge: string
  title: string
  desc: string
}

type Product = {
  id: string
  image: string
  badgeColor: string
  link: string | null
  translations: ProductTranslation[]
}

const BADGE_COLORS = [
  { value: 'orange', label: 'Orange', bg: 'bg-orange-500' },
  { value: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
  { value: 'purple', label: 'Purple', bg: 'bg-purple-600' },
  { value: 'blue', label: 'Blue', bg: 'bg-blue-600' },
  { value: 'stone', label: 'Stone', bg: 'bg-stone-600' },
]

export function ProductEditor() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  
  const [imageUrl, setImageUrl] = useState('')
  const [badgeColor, setBadgeColor] = useState('emerald')
  const [link, setLink] = useState('https://wa.me/6281281091257')
  
  const [idTrans, setIdTrans] = useState({ badge: '', title: '', desc: '' })
  const [enTrans, setEnTrans] = useState({ badge: '', title: '', desc: '' })

  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProducts = async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      const res = await fetch('/api/products?admin=true', { signal, cache: 'no-store' })
      const data = await res.json()
      if (res.ok) setProducts(data)
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      showToast('Gagal memuat produk', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchProducts(controller.signal)

    return () => controller.abort()
  }, [])

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        showToast(data.error || 'Gagal upload gambar', 'error')
        return
      }

      setImageUrl(data.url)
      showToast('Gambar berhasil diunggah', 'success')
    } catch (error) {
      showToast('Gagal upload gambar, periksa koneksi internet', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  const resetForm = () => {
    setImageUrl('')
    setBadgeColor('emerald')
    setLink('https://wa.me/6281281091257')
    setIdTrans({ badge: '', title: '', desc: '' })
    setEnTrans({ badge: '', title: '', desc: '' })
    setEditId(null)
    setIsEditing(false)
  }

  const handleEdit = (p: Product) => {
    setEditId(p.id)
    setImageUrl(p.image)
    setBadgeColor(p.badgeColor)
    setLink(p.link || '')
    
    const idT = p.translations.find(t => t.locale === 'id')
    const enT = p.translations.find(t => t.locale === 'en')
    
    if (idT) setIdTrans({ badge: idT.badge, title: idT.title, desc: idT.desc })
    if (enT) setEnTrans({ badge: enT.badge, title: enT.title, desc: enT.desc })
    
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const executeDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      showToast('Produk berhasil dihapus', 'success')
      fetchProducts()
    } catch {
      showToast('Gagal menghapus produk', 'error')
    }
  }

  const handleSave = async () => {
    if (!imageUrl || !idTrans.title || !enTrans.title) {
        showToast('Mohon lengkapi gambar dan judul (ID & EN)', 'error')
        return
    }
    
    try {
      const payload = {
        image: imageUrl,
        badgeColor,
        link,
        translations: [
          { locale: 'id', ...idTrans },
          { locale: 'en', ...enTrans }
        ]
      }

      const url = editId ? `/api/products/${editId}` : '/api/products'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Gagal menyimpan')

      showToast(editId ? 'Produk diperbarui!' : 'Produk ditambahkan!', 'success')
      resetForm()
      fetchProducts()
    } catch (error) {
      showToast('Gagal menyimpan ke database', 'error')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false) }
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleImageUpload(file)
    else showToast('Mohon upload file gambar', 'error')
  }

  return (
    <div className="container mx-auto px-6 md:px-12 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-5 sm:right-10 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span className="font-semibold text-sm">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70 transition-opacity p-1"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-600 font-bold uppercase tracking-wider mb-2">Manajemen</p>
            <h1 className="text-3xl font-bold text-emerald-950 flex items-center gap-3">
              <Package className="w-8 h-8 text-emerald-700" />
              Katalog Produk
            </h1>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors shadow-md">
              <Plus className="w-5 h-5" /> Tambah Produk
            </button>
          )}
        </div>

        {/* Editor Form */}
        {isEditing && (
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8 animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
              <h2 className="text-xl font-bold text-emerald-950">{editId ? 'Edit Produk' : 'Produk Baru'}</h2>
              <button onClick={resetForm} className="text-stone-400 hover:text-stone-600"><X className="w-6 h-6" /></button>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Left Column: Image & Config */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-stone-700">Foto / Banner Produk</label>
                  <div 
                    className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
                      isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {imageUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="relative w-full h-48 rounded-xl shadow-sm mb-4 overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt="Preview"
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button onClick={() => setImageUrl('')} className="text-red-500 font-semibold text-sm hover:underline">Hapus Foto</button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <CloudUpload className="w-10 h-10 text-emerald-600 mb-3" />
                        <p className="text-sm font-semibold text-emerald-950 mb-4">Upload Gambar</p>
                        <label className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold cursor-pointer ${uploadingImage ? 'bg-stone-200' : 'bg-emerald-700 text-white hover:bg-emerald-800'}`}>
                          {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Pilih File'}
                          <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={(e) => {
                            if (e.target.files?.[0]) handleImageUpload(e.target.files[0])
                          }} />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-stone-700">Warna Badge</label>
                    <select 
                      value={badgeColor}
                      onChange={e => setBadgeColor(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-emerald-500 bg-white"
                    >
                      {BADGE_COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-stone-700">Link WhatsApp</label>
                    <input 
                      type="text"
                      value={link}
                      onChange={e => setLink(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:border-emerald-500"
                      placeholder="https://wa.me/..."
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Translations */}
              <div className="space-y-8">
                {/* Bahasa Indonesia */}
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">ID</span>
                    <h3 className="font-bold text-emerald-950">Bahasa Indonesia</h3>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-stone-500">Teks Badge (Contoh: "Ekspor")</label>
                    <input type="text" value={idTrans.badge} onChange={e => setIdTrans({...idTrans, badge: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-stone-500">Judul Produk</label>
                    <input type="text" value={idTrans.title} onChange={e => setIdTrans({...idTrans, title: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-stone-500">Deskripsi Singkat</label>
                    <textarea value={idTrans.desc} onChange={e => setIdTrans({...idTrans, desc: e.target.value})} rows={3} className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 outline-none focus:border-emerald-500 resize-none" />
                  </div>
                </div>

                {/* English */}
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">EN</span>
                    <h3 className="font-bold text-emerald-950">English</h3>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-stone-500">Badge Text (e.g., "Export")</label>
                    <input type="text" value={enTrans.badge} onChange={e => setEnTrans({...enTrans, badge: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-stone-500">Product Title</label>
                    <input type="text" value={enTrans.title} onChange={e => setEnTrans({...enTrans, title: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-stone-500">Short Description</label>
                    <textarea value={enTrans.desc} onChange={e => setEnTrans({...enTrans, desc: e.target.value})} rows={3} className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 outline-none focus:border-emerald-500 resize-none" />
                  </div>
                </div>
                
                <button onClick={handleSave} className="w-full py-4 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors shadow-md">
                  {editId ? 'Simpan Perubahan' : 'Simpan Produk Baru'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
        {!isEditing && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>
            ) : products.length === 0 ? (
              <div className="col-span-full py-20 text-center text-stone-500">Belum ada produk. Klik "Tambah Produk" untuk mulai.</div>
            ) : (
              products.map(p => {
                const idT = p.translations.find(t => t.locale === 'id')
                const badgeStyle = BADGE_COLORS.find(c => c.value === p.badgeColor)?.bg || 'bg-emerald-600'
                
                return (
                  <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200 group flex flex-col">
                    <div className="h-48 overflow-hidden relative border-b border-stone-100">
                      {idT?.badge && <div className={`absolute top-4 right-4 ${badgeStyle} text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full z-10`}>{idT.badge}</div>}
                      <Image
                        src={p.image}
                        alt={idT?.title || 'Product'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-emerald-950 mb-2">{idT?.title || 'No Title'}</h3>
                      <p className="text-sm text-stone-500 line-clamp-2 mb-6">{idT?.desc || 'No description'}</p>
                      
                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-stone-100">
                        <button onClick={() => handleEdit(p)} className="flex-1 px-4 py-2 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 font-semibold text-sm transition-colors flex justify-center items-center gap-2">
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => setDeleteConfirmId(p.id)} className="flex-[0.5] px-4 py-2 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white font-semibold text-sm transition-colors flex justify-center items-center">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-center text-stone-900 mb-2">Hapus Produk?</h3>
            <p className="text-stone-500 text-center text-sm mb-8">
              Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara permanen dari database.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  executeDelete(deleteConfirmId)
                  setDeleteConfirmId(null)
                }}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
