/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: 'http://localhost:8080/:path*' // Proxy to Backend (For Development)
      }
    ]
  }
}

module.exports = nextConfig
