'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface UseFetchOptions {
  /** Keys that trigger a refetch when changed (like deps array). Default: [] */
  deps?: unknown[]
  /** Stale time in ms. If data is older than this, it refetches on next mount. Default: 30s */
  staleTime?: number
}

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  /** Manually trigger a refetch */
  refetch: () => void
}

/**
 * Production-ready data fetching hook.
 * - Automatic AbortController cleanup (no memory leaks)
 * - Stale-while-revalidate: returns cached data instantly, then refetches silently
 * - Typed error state and loading state for proper UI feedback
 */
export function useFetch<T = unknown>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const { deps = [], staleTime = 30_000 } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refetchTick, setRefetchTick] = useState(0)

  // Track when data was last fetched for stale detection
  const lastFetchedAt = useRef<number | null>(null)
  // Cache the last successful data so stale data is shown during background refresh
  const cachedData = useRef<T | null>(null)

  const refetch = useCallback(() => {
    lastFetchedAt.current = null // force stale
    setRefetchTick((t) => t + 1)
  }, [])

  useEffect(() => {
    const isStale =
      lastFetchedAt.current === null ||
      Date.now() - lastFetchedAt.current > staleTime

    // If we have cached data and it's fresh, skip the fetch
    if (!isStale && cachedData.current !== null) {
      setData(cachedData.current)
      setLoading(false)
      return
    }

    const controller = new AbortController()

    // If we have stale cached data, show it immediately while we refetch silently
    if (cachedData.current !== null) {
      setData(cachedData.current)
      setLoading(false) // don't show spinner for background refresh
    } else {
      setLoading(true)
    }
    setError(null)

    const run = async () => {
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        const json: T = await res.json()
        cachedData.current = json
        lastFetchedAt.current = Date.now()
        setData(json)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return // component unmounted — ignore
        setError((err as Error).message ?? 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    run()

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, staleTime, refetchTick, ...deps])

  return { data, loading, error, refetch }
}
