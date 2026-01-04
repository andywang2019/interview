// 环境变量配置和验证

export const env = {
  // API 基础地址，默认指向本地后端
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",

  // 是否为生产环境
  isProduction: process.env.NODE_ENV === "production",

  // 是否为开发环境
  isDevelopment: process.env.NODE_ENV === "development",
} as const

// 验证必需的环境变量
export function validateEnv() {
  if (typeof window === "undefined" && !env.apiBaseUrl) {
    console.warn("[ENV] NEXT_PUBLIC_API_BASE_URL 未设置，使用默认值")
  }

  console.log("[ENV] 配置加载完成:", {
    apiBaseUrl: env.apiBaseUrl,
    environment: process.env.NODE_ENV,
  })
}
