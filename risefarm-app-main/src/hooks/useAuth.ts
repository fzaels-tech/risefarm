'use client'

import { useState, useEffect } from 'react'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setIsAuthenticated(data.authenticated)
        } else {
          setIsAuthenticated(false)
        }
      } catch (e) {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setIsAuthenticated(false)
    window.location.href = '/'
  }

  return { isAuthenticated, logout }
}
