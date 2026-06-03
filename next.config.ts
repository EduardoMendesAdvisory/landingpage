import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set the project root to suppress the workspace root
    // detection warning caused by a package-lock.json in the parent
    // home directory being picked up alongside the platform lockfile.
    root: process.cwd(),
  },
};

export default nextConfig;
