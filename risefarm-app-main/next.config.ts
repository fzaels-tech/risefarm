import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary — used for uploaded article/product/gallery images
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/*/image/upload/**",
      },
      // Unsplash — used for fallback product card images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Aggressive browser-side cache: 7 days for optimized images
    minimumCacheTTL: 604800,
  },
};

export default nextConfig;
