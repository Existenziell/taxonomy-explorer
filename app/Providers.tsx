'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NextTopLoader from 'nextjs-toploader'
import { ThemeProvider } from '@/contexts/ThemeContext'
import type { ProvidersProps } from '@/types'

export default function Providers ({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NextTopLoader
          color="var(--color-cta)"
          height={3}
          showSpinner={false}
        />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
