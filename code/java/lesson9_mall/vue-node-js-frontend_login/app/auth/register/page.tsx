"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { memberApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    authCode: "",
  })

  // 获取验证码
  const handleGetAuthCode = async () => {
    if (!formData.telephone) {
      toast.error("请输入手机号")
      return
    }

    if (!/^1[3-9]\d{9}$/.test(formData.telephone)) {
      toast.error("请输入正确的手机号")
      return
    }

    try {
      const response = await memberApi.getAuthCode(formData.telephone)
      if (response.code === 200) {
        toast.success("验证码已发送")
        setCountdown(60)

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        toast.error(response.message || "验证码发送失败")
      }
    } catch (error) {
      toast.error("验证码发送失败，请稍后重试")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("两次输入的密码不一致")
      return
    }

    if (formData.password.length < 6) {
      toast.error("密码长度至少6位")
      return
    }

    const success = await register({
      username: formData.username,
      password: formData.password,
      telephone: formData.telephone,
      authCode: formData.authCode,
    })

    if (success) {
      router.push("/auth/login")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">创建账户</CardTitle>
            <CardDescription>加入 Mall，开启购物之旅</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">手机号</Label>
                <Input
                  id="telephone"
                  type="tel"
                  placeholder="请输入手机号"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authCode">验证码</Label>
                <div className="flex gap-2">
                  <Input
                    id="authCode"
                    type="text"
                    placeholder="请输入验证码"
                    value={formData.authCode}
                    onChange={(e) => setFormData({ ...formData, authCode: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetAuthCode}
                    disabled={countdown > 0}
                    className="whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}秒` : "获取验证码"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="至少6位密码"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="再次输入密码"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" size="lg">
                注册
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                已有账户?{" "}
                <Link href="/auth/login" className="text-primary font-medium hover:underline">
                  立即登录
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
