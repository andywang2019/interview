import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    // 可以在这里直接配置环境变量（会暴露到客户端）
    NEXT_PUBLIC_API_BASE_URL:  "http://localhost:8085",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
