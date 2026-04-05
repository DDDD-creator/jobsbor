"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Mail, Lock, User, Building2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const pathname = usePathname()
  // Extract language from pathname (e.g., /zh/auth/register -> zh)
  const lang = pathname?.split('/')[1] || 'zh'
  
  const [role, setRole] = useState<"JOBSEEKER" | "RECRUITER">("JOBSEEKER")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // 通用字段
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // HR特有字段
  const [companyName, setCompanyName] = useState("")
  const [companyIndustry, setCompanyIndustry] = useState("互联网")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const payload = {
        name,
        email,
        password,
        role,
        ...(role === "RECRUITER" ? { companyName, companyIndustry } : {})
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "注册失败")
        setIsLoading(false)
        return
      }

      // 注册成功，跳转到登录页
      router.push(`/${lang}/auth/login?registered=true`)
    } catch (error) {
      setError("注册失败，请稍后重试")
      setIsLoading(false)
    }
  }

  const industries = ["互联网", "金融科技", "区块链/Web3", "人工智能", "电子商务", "企业服务", "游戏", "其他"]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c] px-4 py-12">
      <Card className="w-full max-w-md bg-white/5 border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white text-center">
            创建账号
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            选择您的身份，开始使用 Jobsbor
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Tabs value={role} onValueChange={(v) => setRole(v as "JOBSEEKER" | "RECRUITER")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5">
                <TabsTrigger value="JOBSEEKER" className="data-[state=active]:bg-blue-500">
                  我是求职者
                </TabsTrigger>
                <TabsTrigger value="RECRUITER" className="data-[state=active]:bg-purple-500">
                  我是招聘方
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="JOBSEEKER" className="mt-4">
                <p className="text-sm text-gray-400 mb-4">
                  寻找理想工作，一键投递简历
                </p>
              </TabsContent>
              
              <TabsContent value="RECRUITER" className="mt-4">
                <p className="text-sm text-gray-400 mb-4">
                  发布职位，找到优秀人才
                </p>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">姓名</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="name"
                  placeholder="您的姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">邮箱</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="至少6位字符"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            
            {role === "RECRUITER" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-300">企业名称</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="companyName"
                      placeholder="您的企业名称"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required={role === "RECRUITER"}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-gray-300">所属行业</Label>
                  <select
                    id="industry"
                    value={companyIndustry}
                    onChange={(e) => setCompanyIndustry(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white"
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind} className="bg-gray-900">
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  注册中...
                </>
              ) : (
                "创建账号"
              )}
            </Button>
            
            <p className="text-sm text-gray-400 text-center">
              已有账号？{" "}
              <Link
                href={}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                立即登录
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
