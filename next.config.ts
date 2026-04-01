import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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
    // Keep generated image variants at practical quality levels.
    qualities: [50, 60, 70, 75],
    // Aggressive browser-side cache: 7 days for optimized images
    minimumCacheTTL: 604800,
  },
};

export default nextConfig;
