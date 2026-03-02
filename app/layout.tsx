import 'tailwindcss/tailwind.css'
import '@/styles/_theme-vars.css'
import '@/styles/globals.css'
import { Gotu } from 'next/font/google'
import Providers from '@/app/Providers'
import Footer from '@/components/Footer'
import AppLink from '@/components/AppLink'
import ThemeToggle from '@/components/themeToggle'
import { QuestionMarkIcon } from '@/components/Icons'
import { siteMetadata } from '@/lib/metadata'
import type { RootLayoutProps } from '@/types'

const gotu = Gotu({ subsets: ['latin'], weight: '400', display: 'swap' })

export const metadata = siteMetadata

export default function RootLayout ({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${gotu.className} flex min-h-screen flex-col`}>
        <Providers>
          <div className="fixed top-4 left-4 z-10 flex flex-row items-center gap-2">
            <AppLink
              href="/nomenclature"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-level-2 shadow-inner text-level-6 hover:text-cta hover:bg-level-3/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-level-1"
              aria-label="Nomenclature and taxonomy help"
            >
              <QuestionMarkIcon className="w-6 h-6" />
            </AppLink>
            <ThemeToggle />
          </div>
          <main className="flex flex-1 flex-col w-full min-h-0 px-4 sm:px-8 pb-20 pt-20 bg-level-1 text-level-6">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
