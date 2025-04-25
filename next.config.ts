import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */ devIndicators: false,
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "192.168.100.96", // Add the IP here
  ],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
