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
  const scrollMock = vi.fn()

  beforeEach(() => {
    scrollMock.mockClear()
    window.scroll = scrollMock
  })

  it('returns scrollToTop that calls window.scroll with top 0, left 0, behavior smooth', () => {
    render(<Wrapper />)

    expect(scrollMock).toHaveBeenCalledTimes(1)
    expect(scrollMock).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  })
})
