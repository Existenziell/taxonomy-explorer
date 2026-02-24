'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { MoonIcon, SunIcon } from '@/components/Icons'

export default function DarkModeToggle () {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className=' absolute top-4 right-4'>
      {resolvedTheme === 'light'
        ? (
            <button
              type="button"
              onClick={() => setTheme('dark')}
              aria-label="Switch to dark mode"
              className="h-8 w-8 md:h-6 md:w-6 flex items-center justify-center"
            >
              <MoonIcon className='h-8 w-8 md:h-6 md:w-6 cursor-pointer text-brand-dark hover:text-cta transition-colors' />
            </button>
          )
        : (
            <button
              type="button"
              onClick={() => setTheme('light')}
              aria-label="Switch to light mode"
              className="h-8 w-8 md:h-6 md:w-6 flex items-center justify-center"
            >
              <SunIcon className='h-8 w-8 md:h-6 md:w-6 cursor-pointer text-brand hover:text-cta transition-colors' />
            </button>
          )}
    </div>
  )
}
