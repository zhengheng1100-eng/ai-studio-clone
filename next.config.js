/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    AI_STUDIO_KEY: process.env.AI_STUDIO_KEY
  }
}

module.exports = nextConfig