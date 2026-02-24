import { useCallback, useEffect, useState } from 'react'

export default function useScrollToTop (threshold = 800): {
  showButton: boolean
  scrollToTop: () => void
} {
  const [showButton, setShowButton] = useState(false)

  const scrollToTop = useCallback(() => {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
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
