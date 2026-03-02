'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { MoonIcon, SunIcon } from '@/components/Icons'

export default function ThemeToggle () {
  const { resolvedTheme, mounted, setTheme } = useTheme()

  const buttonClass =
    'inline-flex items-center justify-center w-10 h-10 rounded-lg bg-level-2 shadow-inner text-level-6 hover:text-cta hover:bg-level-3/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-level-1'

  return (
    <>
      {!mounted || resolvedTheme === 'light'
        ? (
            <button
              type="button"
              onClick={() => setTheme('dark')}
              aria-label="Switch to dark mode"
              className={buttonClass}
            >
              <MoonIcon className="w-6 h-6" />
            </button>
          )
        : (
            <button
              type="button"
              onClick={() => setTheme('light')}
              aria-label="Switch to light mode"
              className={buttonClass}
            >
              <SunIcon className="w-6 h-6" />
            </button>
          )}
    </>
  )
}
