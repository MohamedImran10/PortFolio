/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Remove basePath and assetPrefix for local development
  // basePath: '/PortFolio',
  // assetPrefix: '/PortFolio/',
}

module.exports = nextConfig
