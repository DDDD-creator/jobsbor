"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Trash2,
  Upload,
  FileText,
  Loader2,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  User,
  Save,
} from "lucide-react"
import { toast } from "sonner"

interface Experience {
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
}

interface Education {
  school: string
  degree: string
  field?: string
  startDate: string
  endDate?: string
}

interface Profile {
  id: string
  userId: string
  phone?: string
  location?: string
  headline?: string
  summary?: string
  skills: string[]
  experience: Experience[]
  education: Education[]
  resumeUrl?: string
  resumeName?: string
  expectedSalary?: {
    min?: number
    max?: number
    currency: string
  }
  jobType?: string
  jobLocation?: string
  openToWork: boolean
  user: {
    id: string
    email: string
    name: string
    avatar?: string
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skillInput, setSkillInput] = useState("")

  // 表单状态
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    headline: "",
    summary: "",
    skills: [] as string[],
    experience: [] as Experience[],
    education: [] as Education[],
    expectedSalary: { min: "", max: "", currency: "CNY" },
    jobType: "",
    jobLocation: "",
    openToWork: true,
  })

  // 获取资料
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/jobseeker/profile")
      if (!res.ok) throw new Error("获取失败")
      const data = await res.json()
      setProfile(data.profile)
      
      // 初始化表单
      setFormData({
        phone: data.profile.phone || "",
        location: data.profile.location || "",
        headline: data.profile.headline || "",
        summary: data.profile.summary || "",
        skills: data.profile.skills || [],
        experience: data.profile.experience || [],
        education: data.profile.education || [],
        expectedSalary: {
          min: data.profile.expectedSalary?.min?.toString() || "",
          max: data.profile.expectedSalary?.max?.toString() || "",
          currency: data.profile.expectedSalary?.currency || "CNY",
        },
        jobType: data.profile.jobType || "",
        jobLocation: data.profile.jobLocation || "",
        openToWork: data.profile.openToWork ?? true,
      })
    } catch (error) {
      toast.error("获取资料失败")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // 确保在客户端运行且状态已确定
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated") {
      fetchProfile()
    }
  }, [status, router, fetchProfile])

  // 保存资料
  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/jobseeker/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expectedSalary: {
            min: formData.expectedSalary.min ? parseInt(formData.expectedSalary.min) : undefined,
            max: formData.expectedSalary.max ? parseInt(formData.expectedSalary.max) : undefined,
            currency: formData.expectedSalary.currency,
          },
        }),
      })
      
      if (!res.ok) throw new Error("保存失败")
      toast.success("资料已保存")
    } catch (error) {
      toast.error("保存失败")
    } finally {
      setSaving(false)
    }
  }

  // 上传简历
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("resume", file)

    try {
      const res = await fetch("/api/jobseeker/resume", {
        method: "POST",
        body: formData,
      })
      
      if (!res.ok) throw new Error("上传失败")
      const data = await res.json()
      setProfile(prev => prev ? { ...prev, resumeUrl: data.fileUrl, resumeName: data.fileName } : null)
      toast.success("简历上传成功")
    } catch (error) {
      toast.error("上传失败")
    } finally {
      setUploading(false)
    }
  }

  // 删除简历
  const handleDeleteResume = async () => {
    try {
      const res = await fetch("/api/jobseeker/resume", { method: "DELETE" })
      if (!res.ok) throw new Error("删除失败")
      setProfile(prev => prev ? { ...prev, resumeUrl: undefined, resumeName: undefined } : null)
      toast.success("简历已删除")
    } catch (error) {
      toast.error("删除失败")
    }
  }

  // 添加工作经历
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }))
  }

  // 更新工作经历
  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }))
  }

  // 删除工作经历
  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  // 添加教育经历
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
        },
      ],
    }))
  }

  // 更新教育经历
  const updateEducation = (index: number, field: keyof Education, value: any) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }))
  }

  // 删除教育经历
  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  // 添加技能
  const addSkill = () => {
    if (!skillInput.trim()) return
    if (formData.skills.includes(skillInput.trim())) {
      toast.error("技能已存在")
      return
    }
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()],
    }))
    setSkillInput("")
  }

  // 删除技能
  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">我的简历</h1>
            <p className="text-gray-400">完善您的个人资料，让企业更好地了解您</p>
          </div>

          {/* 基本信息卡片 */}
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-cyan-500" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">姓名</Label>
                  <Input
                    value={profile?.user.name || ""}
                    disabled
                    className="bg-white/5 border-white/10 text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">邮箱</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-400">{profile?.user.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">手机号</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="请输入手机号"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">所在城市</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="如：北京、上海"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">一句话介绍</Label>
                <Input
                  value={formData.headline}
                  onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                  placeholder="如：5年经验的全栈工程师，专注React和Node.js"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">个人简介</Label>
                <Textarea
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="详细介绍您的工作经历、专业技能和职业目标..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* 简历上传 */}
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-500" />
                简历附件
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.resumeUrl ? (
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-cyan-500" />
                    <div>
                      <p className="text-white font-medium">{profile.resumeName}</p>
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cyan-400 hover:underline"
                      >
                        查看简历
                      </a>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteResume}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">支持 PDF、Word 格式，最大 10MB</p>
                  <Label className="cursor-pointer">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <Button variant="outline" disabled={uploading}>
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          上传中...
                        </>
                      ) : (
                        "上传简历"
                      )}
                    </Button>
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 工作经历 */}
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-cyan-500" />
                工作经历
              </CardTitle>
              <Button variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4 mr-1" />
                添加
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.experience.length === 0 ? (
                <p className="text-gray-500 text-center py-4">暂无工作经历</p>
              ) : (
                formData.experience.map((exp, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="职位名称"
                          value={exp.title}
                          onChange={(e) => updateExperience(index, "title", e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <Input
                          placeholder="公司名称"
                          value={exp.company}
                          onChange={(e) => updateExperience(index, "company", e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <Input
                          placeholder="工作地点"
                          value={exp.location}
                          onChange={(e) => updateExperience(index, "location", e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="date"
                            placeholder="开始时间"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                            className="bg-white/5 border-white/10 text-white flex-1"
                          />
                          {!exp.current ? (
                            <Input
                              type="date"
                              placeholder="结束时间"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                              className="bg-white/5 border-white/10 text-white flex-1"
                            />
                          ) : (
                            <span className="text-cyan-400 flex-1">至今</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={exp.current}
                            onCheckedChange={(checked) => updateExperience(index, "current", checked)}
                          />
                          <span className="text-gray-400 text-sm">当前在职</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="工作描述（可选）"
                      value={exp.description}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      rows={2}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* 教育经历 */}
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-cyan-500" />
                教育经历
              </CardTitle>
              <Button variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-1" />
                添加
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.education.length === 0 ? (
                <p className="text-gray-500 text-center py-4">暂无教育经历</p>
              ) : (
                formData.education.map((edu, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="学校名称"
                          value={edu.school}
                          onChange={(e) => updateEducation(index, "school", e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <Input
                          placeholder="学位"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, "degree", e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <Input
                          placeholder="专业"
                          value={edu.field}
                          onChange={(e) => updateEducation(index, "field", e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            type="date"
                            placeholder="入学时间"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                            className="bg-white/5 border-white/10 text-white flex-1"
                          />
                          <Input
                            type="date"
                            placeholder="毕业时间"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                            className="bg-white/5 border-white/10 text-white flex-1"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* 技能 */}
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white">专业技能</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="输入技能名称，如：React、Python"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button onClick={addSkill}>添加</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="neon"
                    color="cyan"
                    className="cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 求职意向 */}
          <Card className="bg-white/5 border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="text-white">求职意向</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">期望薪资范围（CNY/月）</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="最低"
                      value={formData.expectedSalary.min}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          expectedSalary: { ...prev.expectedSalary, min: e.target.value },
                        }))
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      type="number"
                      placeholder="最高"
                      value={formData.expectedSalary.max}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          expectedSalary: { ...prev.expectedSalary, max: e.target.value },
                        }))
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">工作类型</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, jobType: value }))
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="选择工作类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">全职</SelectItem>
                      <SelectItem value="PART_TIME">兼职</SelectItem>
                      <SelectItem value="CONTRACT">合同</SelectItem>
                      <SelectItem value="INTERNSHIP">实习</SelectItem>
                      <SelectItem value="REMOTE">远程</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">工作地点偏好</Label>
                  <Select
                    value={formData.jobLocation}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, jobLocation: value }))
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="选择地点偏好" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONSITE"> onsite </SelectItem>
                      <SelectItem value="REMOTE">远程办公</SelectItem>
                      <SelectItem value="HYBRID">混合办公</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.openToWork}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, openToWork: checked }))
                    }
                  />
                  <span className="text-gray-300">正在找工作（对企业可见）</span>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  保存资料
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
