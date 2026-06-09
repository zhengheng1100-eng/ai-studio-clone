/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    AI_STUDIO_KEY: process.env.AI_STUDIO_KEY
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/': './'
    }
    return config
  }
}

module.exports = nextConfig