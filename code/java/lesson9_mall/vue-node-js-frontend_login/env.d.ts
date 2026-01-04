declare namespace NodeJS {
  interface ProcessEnv {
    // 后端 API 基础地址
    NEXT_PUBLIC_API_BASE_URL: string

    // 默认值配置
    readonly NODE_ENV: "development" | "production" | "test"
  }
}

// 扩展 Window 对象（如需在客户端使用）
type Window = {}
