import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import Head from 'next/head'
import Layout from '../components/_Layout'

function CozumelTaxonomy({ Component, pageProps }) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Cozumel Taxonomy</title>
        <meta name="description" content="Cozumel Taxonomy" />
        <link rel='icon' href='/favicon/favicon.ico' />
        <link rel='apple-touch-icon' sizes='180x180' href='/favicon/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon/favicon-16x16.png' />
        <meta name="msapplication-TileColor" content="#242424" />
        <meta name="theme-color" content="#242424" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  )
}

export default CozumelTaxonomy
