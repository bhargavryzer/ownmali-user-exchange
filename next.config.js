/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable typed route validator to avoid .next/dev/types 'never' errors
    typedRoutes: false,
  },
  images: {
    // Replace deprecated `domains` with `remotePatterns`
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
