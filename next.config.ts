import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  // A stray package-lock.json in the home directory would otherwise be taken as the workspace root.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
