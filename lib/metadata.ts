import type { Metadata } from 'next'

export const SITE_TITLE = 'Taxonomy Explorer'

export const siteMetadata: Metadata = {
  title: SITE_TITLE,
  description: 'Browse and explore species taxonomy from iNaturalist.',
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
