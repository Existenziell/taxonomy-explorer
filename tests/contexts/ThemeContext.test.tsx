import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'

function Consumer () {
  const ctx = useTheme()
  return (
    <span
      data-testid="consumer"
      data-theme={ctx.theme}
      data-resolved={ctx.resolvedTheme}
      data-mounted={String(ctx.mounted)}
      data-set-theme={ctx.setTheme != null ? 'present' : 'absent'}
    />
  )
}

describe('ThemeContext', () => {
  const storage: Record<string, string> = {}
  const localStorageMock = {
    getItem: vi.fn((key: string) => storage[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { storage[key] = value }),
    removeItem: vi.fn((key: string) => { delete storage[key] }),
    clear: vi.fn(() => { Object.keys(storage).forEach(k => delete storage[k]) }),
    get length () { return Object.keys(storage).length },
    key: vi.fn(() => null),
  }

  let matchMediaMatches = false
  const matchMediaMock = vi.fn((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' ? matchMediaMatches : false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }))

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock)
    vi.stubGlobal('window', {
      ...globalThis.window,
      matchMedia: matchMediaMock,
      localStorage: localStorageMock,
    })
    Object.keys(storage).forEach(k => delete storage[k])
    localStorageMock.getItem.mockImplementation((key: string) => storage[key] ?? null)
    localStorageMock.setItem.mockImplementation((key: string, value: string) => { storage[key] = value })
    matchMediaMatches = false
    matchMediaMock.mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' ? matchMediaMatches : false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }))
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('useTheme throws when used outside ThemeProvider', () => {
    let error: Error | null = null
    const Throwing = () => {
      try {
        useTheme()
        return null
      } catch (e: unknown) {
        error = e instanceof Error ? e : new Error(String(e))
        return null
      }
    }

    render(<Throwing />)

    expect(error).not.toBeNull()
    expect(error!.message).toBe('useTheme must be used within ThemeProvider')
  })

  it('ThemeProvider provides theme, resolvedTheme, mounted, and setTheme', async () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )

    const consumer = await screen.findByTestId('consumer')
    expect(consumer.getAttribute('data-set-theme')).toBe('present')
    // ThemeProvider applies initial theme in a microtask; flush it
    await act(async () => {
      await new Promise<void>(r => queueMicrotask(r))
    })
    expect(consumer.getAttribute('data-resolved')).toBe('light')
  })

  it('setTheme("light") updates theme and removes dark class', async () => {
    let setThemeFn: (mode: 'light' | 'dark' | 'auto') => void = () => {}
    const ConsumerWithRef = () => {
      const ctx = useTheme()
      setThemeFn = ctx.setTheme
      return <span data-testid="consumer" data-theme={ctx.theme} />
    }

    const { container } = render(
      <ThemeProvider>
        <ConsumerWithRef />
      </ThemeProvider>,
    )

    await screen.findByTestId('consumer')
    await act(() => {
      setThemeFn('light')
    })

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(container.querySelector('[data-testid="consumer"]')?.getAttribute('data-theme')).toBe('light')
  })

  it('setTheme("dark") updates theme and adds dark class', async () => {
    let setThemeFn: (mode: 'light' | 'dark' | 'auto') => void = () => {}
    const ConsumerWithRef = () => {
      const ctx = useTheme()
      setThemeFn = ctx.setTheme
      return <span data-testid="consumer" data-theme={ctx.theme} />
    }

    const { container } = render(
      <ThemeProvider>
        <ConsumerWithRef />
      </ThemeProvider>,
    )

    await screen.findByTestId('consumer')
    await act(() => {
      setThemeFn('dark')
    })

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(container.querySelector('[data-testid="consumer"]')?.getAttribute('data-theme')).toBe('dark')
  })

  it('setTheme("auto") uses prefers-color-scheme', async () => {
    matchMediaMatches = true
    matchMediaMock.mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }))

    let setThemeFn: (mode: 'light' | 'dark' | 'auto') => void = () => {}
    const ConsumerWithRef = () => {
      const ctx = useTheme()
      setThemeFn = ctx.setTheme
      return (
        <span
          data-testid="consumer"
          data-theme={ctx.theme}
          data-resolved={ctx.resolvedTheme}
        />
      )
    }

    const { container } = render(
      <ThemeProvider>
        <ConsumerWithRef />
      </ThemeProvider>,
    )

    await screen.findByTestId('consumer')
    await act(() => {
      setThemeFn('auto')
    })

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    const el = container.querySelector('[data-testid="consumer"]')
    expect(el?.getAttribute('data-theme')).toBe('auto')
    expect(el?.getAttribute('data-resolved')).toBe('dark')
  })
})
