'use client'

import { useEffect, useRef } from 'react'

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    })

    const selectors = ['.fade-in-up', '.fade-in-left', '.fade-in-right']
    
    // Slight delay to allow DOM mapping if used on unmounted pages
    setTimeout(() => {
      const elements = document.querySelectorAll(selectors.join(', '))
      elements.forEach(el => observer.observe(el))
    }, 100)

    return () => {
      observer.disconnect()
    }
  }, [])

  return ref
}
