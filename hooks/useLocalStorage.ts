'use client'

import { useState, useCallback } from 'react'

function readFromStorage<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return initialValue
    return JSON.parse(raw) as T
  } catch {
    return initialValue
  }
}

/**
 * Persists state in localStorage under the given key. Uses initialValue for SSR
 * and until client hydration; then restores from localStorage. Updates are
 * written to localStorage and state.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => readFromStorage(key, initialValue))

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value
        try {
          localStorage.setItem(key, JSON.stringify(next))
        } catch {
          // ignore
        }
        return next
      })
    },
    [key]
  )

  return [state, setValue]
}
