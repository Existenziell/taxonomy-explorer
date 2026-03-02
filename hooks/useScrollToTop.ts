import { useCallback, useEffect, useState } from 'react'

export default function useScrollToTop (threshold = 800): {
  showButton: boolean
  scrollToTop: () => void
} {
  const [showButton, setShowButton] = useState(false)

  const scrollToTop = useCallback(() => {
    const start = window.scrollY
    const startTime = performance.now()
    const duration = 400

    function step (now: number): void {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - ((-2 * progress + 2) ** 3) / 2
      window.scrollTo(0, start * (1 - ease))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    const handler = (): void => {
      setShowButton(window.scrollY > threshold)
    }
    handler()
    document.addEventListener('scroll', handler)
    return () => document.removeEventListener('scroll', handler)
  }, [threshold])

  return { showButton, scrollToTop }
}
