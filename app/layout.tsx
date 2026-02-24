import 'tailwindcss/tailwind.css'
import '@/styles/_theme-vars.css'
import '@/styles/globals.css'
import { Gotu } from 'next/font/google'
import Providers from '@/app/Providers'
import type { RootLayoutProps } from '@/types'

const gotu = Gotu({ subsets: ['latin'], weight: '400', display: 'swap' })

export const metadata = {
  title: 'Cozumel Taxonomy',
  description: 'Cozumel Taxonomy',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
  other: {
    'msapplication-TileColor': '#242424',
    'theme-color': '#242424',
  },
}

export default function RootLayout ({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={gotu.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
