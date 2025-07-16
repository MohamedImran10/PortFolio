/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/PortFolio',
  assetPrefix: '/PortFolio/',
}

module.exports = nextConfig
