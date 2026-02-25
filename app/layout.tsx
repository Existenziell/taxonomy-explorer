import 'tailwindcss/tailwind.css'
import '@/styles/_theme-vars.css'
import '@/styles/globals.css'
import { Gotu } from 'next/font/google'
import Providers from '@/app/Providers'
import Footer from '@/components/Footer'
import { siteMetadata } from '@/lib/metadata'
import type { RootLayoutProps } from '@/types'

const gotu = Gotu({ subsets: ['latin'], weight: '400', display: 'swap' })

export const metadata = siteMetadata

export default function RootLayout ({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${gotu.className} flex min-h-screen flex-col`}>
        <Providers>
          <main className="flex flex-1 flex-col w-full min-h-0 px-4 sm:px-8 pb-20 pt-20 bg-level-1 text-level-6">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
