'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ThemeMode, ThemeContextValue } from '@/types'

export type { ThemeMode } from '@/types'

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'theme'

function applyTheme (resolved: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return
  if (resolved === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function getResolvedFromPreference (): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider ({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<ThemeMode | undefined>(undefined)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  const setTheme = useCallback((mode: ThemeMode) => {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, mode)
    setThemeState(mode)
    if (mode === 'auto') {
      const resolved = getResolvedFromPreference()
      setResolvedTheme(resolved)
      applyTheme(resolved)
    } else {
      setResolvedTheme(mode)
      applyTheme(mode)
    }
  }, [])

  useEffect(() => {
    if (typeof localStorage === 'undefined' || typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    const applyStored = (): void => {
      if (stored === 'dark' || stored === 'light' || stored === 'auto') {
        setThemeState(stored)
        if (stored === 'auto') {
          const resolved = getResolvedFromPreference()
          setResolvedTheme(resolved)
          applyTheme(resolved)
        } else {
          setResolvedTheme(stored)
          applyTheme(stored)
        }
      } else {
        const resolved = getResolvedFromPreference()
        setThemeState('auto')
        setResolvedTheme(resolved)
        applyTheme(resolved)
      }
      setMounted(true)
    }
    queueMicrotask(applyStored)
  }, [])

  useEffect(() => {
    if (theme !== 'auto') return
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)')
    const handler = (): void => {
      const resolved = getResolvedFromPreference()
      setResolvedTheme(resolved)
      applyTheme(resolved)
    }
    mql?.addEventListener('change', handler)
    return () => mql?.removeEventListener('change', handler)
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, mounted, setTheme }),
    [theme, resolvedTheme, mounted, setTheme],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme (): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (ctx == null) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
