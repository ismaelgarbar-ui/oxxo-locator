import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow Google Maps CDN images in <Image> components
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: 'maps.gstatic.com' },
    ],
  },
};

export default nextConfig;
