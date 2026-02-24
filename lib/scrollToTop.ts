import type { MouseEvent } from 'react'

const scrollToTop = (e: MouseEvent<HTMLElement>): void => {
  e.preventDefault()
  window.scroll({ top: 0, left: 0, behavior: 'smooth' })
}

export default scrollToTop
