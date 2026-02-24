import 'tailwindcss/tailwind.css'
import '@/styles/_theme-vars.css'
import '@/styles/globals.css'
import { Gotu } from 'next/font/google'
import Providers from '@/app/Providers'
import { siteMetadata } from '@/lib/metadata'
import type { RootLayoutProps } from '@/types'

const gotu = Gotu({ subsets: ['latin'], weight: '400', display: 'swap' })

export const metadata = siteMetadata

export default function RootLayout ({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={gotu.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
