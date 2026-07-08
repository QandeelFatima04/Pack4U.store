import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to the main project so the shared node_modules
  // (linked from the parent folder) resolves within the Turbopack root.
  turbopack: {
    root: path.resolve(__dirname, "..", "..", ".."),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async redirects() {
    return [
      // Short / alternate slugs → canonical blueprint slugs
      { source: "/cosmetic-packaging", destination: "/custom-cosmetic-packaging", permanent: true },
      { source: "/skincare-packaging", destination: "/custom-cosmetic-packaging", permanent: true },
      { source: "/beauty-packaging", destination: "/custom-cosmetic-packaging", permanent: true },
      { source: "/food-packaging", destination: "/custom-food-packaging", permanent: true },
      { source: "/bakery-packaging", destination: "/custom-food-packaging", permanent: true },
      { source: "/fashion-packaging", destination: "/custom-fashion-packaging", permanent: true },
      { source: "/clothing-packaging", destination: "/custom-fashion-packaging", permanent: true },
      { source: "/ecommerce-packaging", destination: "/custom-ecommerce-packaging", permanent: true },
      { source: "/gift-packaging", destination: "/custom-gift-packaging", permanent: true },
      { source: "/retail-packaging", destination: "/custom-retail-packaging", permanent: true },
      { source: "/boxes", destination: "/custom-boxes", permanent: true },
      { source: "/paper-bags", destination: "/custom-paper-bags", permanent: true },
      { source: "/tags-labels", destination: "/custom-tags-labels", permanent: true },
      { source: "/quote", destination: "/get-quote", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
