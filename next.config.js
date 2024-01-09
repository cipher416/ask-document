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
    serverComponentsExternalPackages: ['pdfjs-dist'],
    outputFileTracingIgnores: ['**canvas**'],
  },
}

module.exports = nextConfig
