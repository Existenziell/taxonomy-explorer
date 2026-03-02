import { describe, it, expect, vi, beforeEach } from 'vitest'
import React, { useEffect } from 'react'
import { render } from '@testing-library/react'
import useScrollToTop from '@/hooks/useScrollToTop'
import { SCROLL_TO_TOP_THRESHOLD } from '@/lib/constants'

function Wrapper () {
  const { scrollToTop } = useScrollToTop(SCROLL_TO_TOP_THRESHOLD)
  useEffect(() => {
    scrollToTop()
  }, [scrollToTop])
  return null
}

describe('useScrollToTop', () => {
  const scrollToMock = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    scrollToMock.mockClear()
    window.scrollTo = scrollToMock
    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true })
    let now = 0
    vi.stubGlobal('performance', { ...performance, now: () => now })
    vi.stubGlobal('requestAnimationFrame', (cb: (t: number) => void) => {
      const t = now
      now += 150
      setTimeout(() => cb(t), 0)
      return 0
    })
  })

  it('returns scrollToTop that smoothly scrolls to top via requestAnimationFrame', () => {
    render(<Wrapper />)
    vi.runAllTimers()

    expect(scrollToMock).toHaveBeenCalled()
    expect(scrollToMock).toHaveBeenLastCalledWith(0, 0)
  })
})
