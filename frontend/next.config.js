/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes for contact form
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Remove basePath and assetPrefix for local development
  // basePath: '/PortFolio',
  // assetPrefix: '/PortFolio/',
}

module.exports = nextConfig
