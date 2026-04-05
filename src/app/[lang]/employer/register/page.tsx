"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export default function EmployerRegisterPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  
  const [formData, setFormData] = useState({
    companyName: "",
    companySlug: "",
    industry: "",
    companyLocation: "",
  })

  // 检查是否已注册
  useEffect(() => {
    if (status === "loading") return
    
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/employer/register")
      return
    }

    checkExistingRegistration()
  }, [status, session, router])

  const checkExistingRegistration = async () => {
    try {
      const res = await fetch("/api/employer/register")
      if (res.ok) {
        const data = await res.json()
        if (data.hasCompany) {
          // 已注册，跳转到仪表盘
          router.push("/employer/dashboard")
          return
        }
      }
    } catch (error) {
      console.error("检查注册状态失败:", error)
    } finally {
      setChecking(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      companyName: name,
      companySlug: generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.companyName.trim()) {
      toast.error("请输入企业名称")
      return
    }

    setLoading(true)
    
    try {
      const res = await fetch("/api/employer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("注册成功！立即可以发布职位")
        router.push("/employer/dashboard")
      } else {
        toast.error(data.error || "注册失败")
      }
    } catch (error) {
      toast.error("网络错误，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  if (checking || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
      <Header />
      
      <main className="container mx-auto px-4 py-12 pt-32">
        <div className="max-w-lg mx-auto">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-cyan-400" />
              </div>
              <CardTitle className="text-2xl text-white">注册企业账号</CardTitle>
              <p className="text-gray-400 mt-2">
                填写基本信息，立即开始招聘
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 企业名称 */}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-white">
                    企业名称 <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="例如：字节跳动"
                    value={formData.companyName}
                    onChange={handleNameChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                {/* 企业链接 */}
                <div className="space-y-2">
                  <Label htmlFor="companySlug" className="text-white">
                    企业链接 <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm whitespace-nowrap">
                      jobsbor.com/companies/
                    </span>
                    <Input
                      id="companySlug"
                      placeholder="bytedance"
                      value={formData.companySlug}
                      onChange={(e) => setFormData(prev => ({ ...prev, companySlug: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    用于访问您的企业主页
                  </p>
                </div>

                {/* 行业（可选） */}
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-white">
                    所属行业 <span className="text-gray-500">(可选)</span>
                  </Label>
                  <Input
                    id="industry"
                    placeholder="例如：互联网、金融、教育"
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>

                {/* 所在城市（可选） */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">
                    所在城市 <span className="text-gray-500">(可选)</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="例如：北京、上海、深圳"
                    value={formData.companyLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyLocation: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  />
                </div>

                {/* 提示 */}
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <p className="text-sm text-cyan-400">
                    💡 注册后即可立即发布职位，无需等待审核
                  </p>
                </div>

                {/* 提交按钮 */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      注册中...
                    </>
                  ) : (
                    <>
                      立即注册
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-400">
                  已有企业账号？{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/employer/dashboard")}
                    className="text-cyan-400 hover:underline"
                  >
                    进入后台
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
