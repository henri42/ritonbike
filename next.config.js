/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'api.riton.bike'],
  },
}

const { withPlaiceholder } = require('@plaiceholder/next')

module.exports = withPlaiceholder(nextConfig)
