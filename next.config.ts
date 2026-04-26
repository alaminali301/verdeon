import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: false },
  experimental: { typedRoutes: true },
}

export default config
