'use client'

import { useState } from 'react'
import { CloudUpload, Loader2, CheckCircle2, AlertCircle, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { prepareImageForUpload } from '@/lib/prepare-image-upload'

export function GalleryEditor() {
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [images, setImages] = useState<any[]>([])
  const [loadingImages, setLoadingImages] = useState(true)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery')
      if (res.ok) {
        const data = await res.json()
        setImages(data)
      }
    } catch (error) {
      console.error('Failed to load gallery images', error)
    } finally {
      setLoadingImages(false)
    }
  }

  // Fetch immediately on mount
  useState(() => {
    fetchImages()
  })

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const processedFile = await prepareImageForUpload(file)
      const formData = new FormData()
      formData.append('file', processedFile)

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
      showToast('Foto dokumentasi berhasil diunggah', 'success')
    } catch (error) {
      console.error(error)
      showToast('Gagal upload gambar, periksa koneksi internet', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async () => {
    if (!imageUrl) {
        showToast("Mohon upload foto terlebih dahulu!", "error")
        return
    }
    
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl, caption }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan')

      showToast("Berhasil ditambahkan ke Dokumentasi!", "success")
      setImageUrl("")
      setCaption("")
      fetchImages() // Refresh the list
    } catch (error) {
      console.error(error)
      showToast(error instanceof Error ? error.message : "Gagal menyimpan ke database", "error")
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    } else {
      showToast('Mohon upload file gambar yang valid', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Gagal menghapus gambar')
      
      showToast("Foto berhasil dihapus!", "success")
      setDeleteConfirmId(null)
      fetchImages()
    } catch (error) {
      console.error(error)
      showToast("Gagal menghapus foto", "error")
    } finally {
      setIsDeleting(false)
    }
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
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70 transition-opacity p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-orange-600 font-bold uppercase tracking-wider mb-2">Dokumentasi</p>
              <h1 className="text-3xl font-bold text-emerald-950 flex items-center gap-3">
                <ImageIcon className="w-8 h-8 text-emerald-700" />
                Tambahkan Foto
              </h1>
            </div>
            <button onClick={handleSave} className="px-6 py-3 rounded-2xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors shadow-md">
              Simpan Dokumentasi
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-stone-700">Foto</label>
              <div 
                className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imageUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-full h-64 rounded-xl shadow-sm mb-4 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="h-64 object-cover"
                      />
                    </div>
                    <button onClick={() => setImageUrl("")} className="text-red-500 font-semibold text-sm hover:underline">Hapus Foto</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm mb-4 transition-colors ${isDragging ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-emerald-600'}`}>
                       <CloudUpload className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-lg text-emerald-950 mb-1">Upload Foto Baru</p>
                    <p className="text-sm text-stone-500 mb-6">Pilih file gambar untuk galeri dokumentasi atau drag & drop ke area ini.</p>
                    
                    <label className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${uploadingImage ? 'bg-stone-200 text-stone-600' : 'bg-emerald-700 text-white hover:bg-emerald-800'}`}>
                      {uploadingImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <CloudUpload className="w-5 h-5" />}
                      {uploadingImage ? 'Mengupload...' : 'Pilih Foto'}
                      <input
                        type="file"
                        accept="image/*,.heic,.heif"
                        className="sr-only"
                        disabled={uploadingImage}
                        onChange={(e) => {
                          const selected = e.target.files?.[0]
                          if (selected) handleImageUpload(selected)
                          e.currentTarget.value = ''
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-stone-700">Keterangan / Caption <span className="text-stone-400 font-normal">(Opsional)</span></label>
              <input 
                value={caption} 
                onChange={e => setCaption(e.target.value)} 
                type="text" 
                className="w-full px-4 py-4 rounded-2xl border border-stone-200 outline-none focus:border-emerald-500 bg-white" 
                placeholder="Contoh: Panen bersama kelompok petani" 
              />
            </div>
          </div>
        </div>

        {/* Existing Gallery Grid */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-emerald-950 mb-6 border-b border-stone-200 pb-4">
            Foto Tersimpan
          </h2>
          
          {loadingImages ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 aspect-square">
                  <Image
                    src={img.url}
                    alt={img.caption || 'Gallery'}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="w-full h-full object-cover"
                  />

                  <button
                    onClick={() => setDeleteConfirmId(img.id)}
                    className="absolute top-2 right-2 z-20 sm:hidden bg-red-500/95 text-white p-2 rounded-full shadow-lg"
                    title="Hapus Foto"
                    aria-label="Hapus Foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  {/* Hover Overlay */}
                  <div className="hidden sm:flex absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center p-4">
                    <p className="text-white text-xs text-center line-clamp-2 mb-3 font-semibold">
                      {img.caption || 'Tanpa keterangan'}
                    </p>
                    <button 
                      onClick={() => setDeleteConfirmId(img.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                      title="Hapus Foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 border-dashed">
              <p className="text-stone-500">Belum ada foto yang diunggah.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-center text-stone-900 mb-2">Hapus Foto?</h3>
            <p className="text-stone-500 text-center mb-8 text-sm">
              Apakah Anda yakin ingin menghapus foto ini secara permanen dari galeri? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
