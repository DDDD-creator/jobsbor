"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { EmployerLayout } from "@/components/employer/EmployerLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, Upload, Save, Loader2, Globe, MapPin, Phone, Mail, User } from "lucide-react"
import { toast } from "sonner"
import { VerifyStatus } from "@prisma/client"

interface Company {
  id: string
  name: string
  slug: string
  description?: string
  website?: string
  location?: string
  size?: string
  industry: string
  logo?: string
  coverImage?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  verifyStatus: VerifyStatus
  jobCount: number
  activeJobCount: number
}

const companySizes = [
  { value: "STARTUP", label: "初创 (1-20人)" },
  { value: "SMALL", label: "小型 (21-50人)" },
  { value: "MEDIUM", label: "中型 (51-200人)" },
  { value: "LARGE", label: "大型 (201-1000人)" },
  { value: "ENTERPRISE", label: " Enterprise (1000人以上)" },
]

const industries = [
  "互联网/IT",
  "金融",
  "电子商务",
  "游戏",
  "教育",
  "医疗健康",
  "企业服务",
  "人工智能",
  "区块链/Web3",
  "其他",
]

export default function EmployerProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState<Partial<Company>>({})

  useEffect(() => {
    if (status === "loading") return
    
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }

    if (session?.user?.role !== "RECRUITER" && session?.user?.role !== "ADMIN") {
      router.push("/employer/register")
      return
    }

    fetchCompany()
  }, [status, session, router])

  const fetchCompany = async () => {
    try {
      const res = await fetch("/api/employer/company")
      if (!res.ok) throw new Error("获取企业信息失败")
      const data = await res.json()
      setCompany(data.company)
      setFormData(data.company)
    } catch (error) {
      toast.error("获取企业信息失败")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/employer/company", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      if (!res.ok) throw new Error("保存失败")
      toast.success("企业信息已更新")
      fetchCompany()
    } catch (error) {
      toast.error("保存失败")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <EmployerLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </EmployerLayout>
    )
  }

  return (
    <EmployerLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-2xl font-bold text-white">企业资料</h1>
          <p className="text-gray-400 mt-1">管理您的企业信息和品牌形象</p>
        </div>

        {/* 认证状态 */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{company?.name}</h2>
                  <p className="text-gray-400">企业主页: /companies/{company?.slug}</p>
                </div>
              </div>
              <div>
                {company?.verifyStatus === "VERIFIED" ? (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    ✓ 已认证
                  </span>
                ) : company?.verifyStatus === "PENDING" ? (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    审核中
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                    未认证
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 基本信息 */}
          <Card className="bg-white/5 border-white/10 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">企业名称</Label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">企业规模</Label>
                  <Select
                    value={formData.size || ""}
                    onValueChange={(value) => setFormData({ ...formData, size: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="选择企业规模" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">所属行业</Label>
                  <Select
                    value={formData.industry || ""}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="选择行业" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">公司地址</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <Input
                      value={formData.location || ""}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="如：北京市海淀区"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-300">公司官网</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <Input
                      value={formData.website || ""}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-300">企业介绍</Label>
                  <Textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="介绍您的企业、文化、愿景..."
                    rows={4}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 联系信息 */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">联系信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">联系人</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <Input
                    value={formData.contactName || ""}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">联系邮箱</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <Input
                    value={formData.contactEmail || ""}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">联系电话</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <Input
                    value={formData.contactPhone || ""}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                保存修改
              </>
            )}
          </Button>
        </div>
      </div>
    </EmployerLayout>
  )
}