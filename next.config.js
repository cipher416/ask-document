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
    serverComponentsExternalPackages: ['pdf-text-reader'],
    outputFileTracingIgnores: ['**canvas**'],
  },
}

module.exports = nextConfig
