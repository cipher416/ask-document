/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns:[
      {
        protocol: 'https',
        hostname: '*googleusercontent.com',
        port: '',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@langchain/core','pdf-text-reader', 'pdfjs-dist'],
  },
}

module.exports = nextConfig
