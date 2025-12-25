/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['citd-ttnt-oop-resource-hub-be.vercel.app'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/v1/:path*',
      },
    ]
  },
}

module.exports = nextConfig