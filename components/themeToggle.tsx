'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { MoonIcon, SunIcon } from '@/components/Icons'

export default function ThemeToggle () {
  const { resolvedTheme, mounted, setTheme } = useTheme()

  return (
    <div className=' absolute top-6 right-8'>
      {!mounted || resolvedTheme === 'light'
        ? (
            <button
              type="button"
              onClick={() => setTheme('dark')}
              aria-label="Switch to dark mode"
              className="h-8 w-8 md:h-6 md:w-6 flex items-center justify-center"
            >
              <MoonIcon className='h-8 w-8 md:h-6 md:w-6 cursor-pointer text-level-6 hover:text-cta transition-colors' />
            </button>
          )
        : (
            <button
              type="button"
              onClick={() => setTheme('light')}
              aria-label="Switch to light mode"
              className="h-8 w-8 md:h-6 md:w-6 flex items-center justify-center"
            >
              <SunIcon className='h-8 w-8 md:h-6 md:w-6 cursor-pointer text-level-6 hover:text-cta transition-colors' />
            </button>
          )}
    </div>
  )
}
