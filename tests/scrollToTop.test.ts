import type { MouseEvent } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import scrollToTop from '@/lib/scrollToTop'

describe('scrollToTop', () => {
  const scrollMock = vi.fn()

  beforeEach(() => {
    scrollMock.mockClear()
    window.scroll = scrollMock
  })

  it('calls window.scroll with top 0, left 0, behavior smooth', () => {
    const e = {
      preventDefault: vi.fn(),
    } as unknown as MouseEvent<HTMLElement>
    scrollToTop(e)
    expect(scrollMock).toHaveBeenCalledTimes(1)
    expect(scrollMock).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
    expect(e.preventDefault).toHaveBeenCalledTimes(1)
  })
})
