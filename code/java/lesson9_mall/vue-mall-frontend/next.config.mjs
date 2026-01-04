/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // 可以在这里直接配置环境变量（会暴露到客户端）
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8085",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig


