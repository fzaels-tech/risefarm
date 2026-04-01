'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export type Language = 'id' | 'en'
const LANGUAGE_EVENT = 'risefarm:language-change'

const parseCookieLanguage = (cookieString: string): Language => {
  const match = cookieString.match(/(?:^|;\s*)risefarm_lang=([^;]+)/)
  return match?.[1] === 'en' ? 'en' : 'id'
}

const getCookieLanguage = (): Language => {
  if (typeof document === 'undefined') return 'id'
  return parseCookieLanguage(document.cookie)
}

export function useLanguage() {
  const [lang, setLang] = useState<Language>(() => getCookieLanguage())
  const router = useRouter()

  useEffect(() => {
    if (!document.cookie.includes('risefarm_lang=')) {
      document.cookie = 'risefarm_lang=id; path=/; max-age=31536000; samesite=lax'
    }

    const onLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<Language>
      const nextLang = customEvent.detail === 'en' ? 'en' : 'id'
      setLang(nextLang)
    }

    window.addEventListener(LANGUAGE_EVENT, onLanguageChange as EventListener)

    return () => {
      window.removeEventListener(LANGUAGE_EVENT, onLanguageChange as EventListener)
    }
  }, [])

  const changeLanguage = (newLang: Language) => {
    document.cookie = `risefarm_lang=${newLang}; path=/; max-age=31536000; samesite=lax` // 1 year
    setLang(newLang)
    window.dispatchEvent(new CustomEvent<Language>(LANGUAGE_EVENT, { detail: newLang }))
    router.refresh()
  }

  return { lang, changeLanguage }
}
