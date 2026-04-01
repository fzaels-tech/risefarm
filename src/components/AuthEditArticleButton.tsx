'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export function AuthEditArticleButton() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  return (
    <Link
      href="/editor"
      className="inline-flex items-center rounded-full px-5 py-2.5 bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition-colors"
    >
      Edit Artikel
    </Link>
  )
}
