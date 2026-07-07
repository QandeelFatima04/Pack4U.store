import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

// Pin the workspace root (a stray lockfile exists in the home dir). When running
// from a git worktree, node_modules lives in the main checkout, so walk up until
// we find it — otherwise Turbopack can't resolve the `next` package.
function resolveTurbopackRoot(): string {
  let dir = path.resolve(".");
  while (true) {
    if (fs.existsSync(path.join(dir, "node_modules", "next"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return path.resolve(".");
    dir = parent;
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    root: resolveTurbopackRoot(),
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
