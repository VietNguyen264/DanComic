import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Optimize for Vercel
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  
  // Build optimization
  productionBrowserSourceMaps: false,
  
  // Suppress hydration warnings
  reactStrictMode: true,
};

export default nextConfig;
