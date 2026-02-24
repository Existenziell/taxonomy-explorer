import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'farm1.staticflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'farm2.staticflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'farm3.staticflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'farm4.staticflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'farm5.staticflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'farm6.staticflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'farm7.staticflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'farm8.staticflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'farm9.staticflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'farm10.staticflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'static.inaturalist.org', pathname: '/**' },
      { protocol: 'https', hostname: 'inaturalist-open-data.s3.amazonaws.com', pathname: '/**' },
      { protocol: 'https', hostname: 'live.staticflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
    ],
  },
}
