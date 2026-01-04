// 用户认证相关类型定义

export interface User {
  id: number
  username: string
  nickname?: string
  phone?: string
  icon?: string
  gender?: number
  birthday?: string
  city?: string
  job?: string
  personalizedSignature?: string
  memberLevelId?: number
  memberLevelName?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  telephone: string
  authCode: string
}

export interface AuthResponse {
  code: number
  message: string
  data: {
    token: string
    tokenHead: string
  }
}

export interface UserInfoResponse {
  code: number
  message: string
  data: User
}
