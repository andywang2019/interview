"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { User, LoginRequest, RegisterRequest } from "@/types/auth"
import { memberApi } from "@/lib/api"
import { toast } from "sonner"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 获取用户信息
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      const response = await memberApi.getInfo()
      if (response.code === 200) {
        setUser(response.data)
      } else {
        localStorage.removeItem("token")
        localStorage.removeItem("tokenHead")
        setUser(null)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch user info:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("tokenHead")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 登录
  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      try {
        setIsLoading(true)
        const response = await memberApi.login(credentials)

        if (response.code === 200 && response.data?.token) {
          // 保存 token
          localStorage.setItem("token", response.data.token)
          localStorage.setItem("tokenHead", response.data.tokenHead || "Bearer")

          // 获取用户信息
          await refreshUser()

          toast.success("登录成功")
          return true
        } else {
          toast.error(response.message || "登录失败")
          return false
        }
      } catch (error: any) {
        console.error("[v0] Login error:", error)
        toast.error(error.message || "登录失败，请稍后重试")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [refreshUser],
  )

  // 注册
  const register = useCallback(async (data: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await memberApi.register(data)

      if (response.code === 200) {
        toast.success("注册成功，请登录")
        return true
      } else {
        toast.error(response.message || "注册失败")
        return false
      }
    } catch (error: any) {
      console.error("[v0] Register error:", error)
      toast.error(error.message || "注册失败，请稍后重试")
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 登出
  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("tokenHead")
    setUser(null)
    toast.success("已退出登录")
  }, [])

  // 初始化：检查登录状态
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
