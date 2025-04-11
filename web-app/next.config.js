/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['coin-images.coingecko.com', 'assets.coingecko.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
