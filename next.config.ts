import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker optimization
  output: 'standalone',
  
  // Optimize for production
  compress: true,
  
  // Image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

