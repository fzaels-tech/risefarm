'use client'

import { useState } from 'react'
import { Leaf, X, Loader2, CheckCircle2 } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (res.ok) {
        setToastMessage('Login berhasil. Cookie sesi admin sudah disimpan.')
        setTimeout(() => {
          window.location.href = '/editor' // force reload to update auth and enter editor
        }, 1000)
      } else {
        const data = await res.json()
        setError(data.error || 'Login failed')
      }
    } catch (e: any) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-stone-100 z-10">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <Leaf className="w-8 h-8" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-emerald-950 text-center mb-2">Login Admin</h2>
          <p className="text-stone-500 text-center mb-8 text-sm">Masuk untuk mengelola portal RISEFARM.</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-2xl mb-6 text-sm font-semibold text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-emerald-900 mb-2">Username</label>
              <input 
                type="text" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-stone-800"
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-emerald-900 mb-2">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-stone-800"
                placeholder="Masukkan password"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-700/20 flex items-center justify-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk Dashboard'}
            </button>
          </form>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed left-4 bottom-4 md:left-6 md:bottom-6 z-[120]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border bg-emerald-50 border-emerald-200 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-sm">{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  )
}
