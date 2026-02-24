import { useEffect, useState } from 'react'

export default function useScrollToTop (threshold = 800): { showButton: boolean } {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handler = (): void => {
      setShowButton(window.scrollY > threshold)
    }
    handler()
    document.addEventListener('scroll', handler)
    return () => document.removeEventListener('scroll', handler)
  }, [threshold])

  return { showButton }
}
