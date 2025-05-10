import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [
      "pub-2af91482241043e491600e0712bb4806.r2.dev",
      "0e90b5d646de0e6f16996ac1e91a55bb.r2.cloudflarestorage.com",
    ],
    // या फिर (recommended for Next.js 13.3+)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-2af91482241043e491600e0712bb4806.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "0e90b5d646de0e6f16996ac1e91a55bb.r2.cloudflarestorage.com",
        pathname: "/murghimandi/**",
      },
    ],
  },
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "192.168.100.96",
  ],
};

export default nextConfig;
