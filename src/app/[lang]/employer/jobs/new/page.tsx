"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { EmployerLayout } from "@/components/employer/EmployerLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Loader2, Briefcase } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const remoteTypes = [
  { value: "ONSITE", label: "办公室办公" },
  { value: "REMOTE", label: "远程办公" },
  { value: "HYBRID", label: "混合办公" },
]

const jobTypes = [
  { value: "FULLTIME", label: "全职" },
  { value: "PARTTIME", label: "兼职" },
  { value: "CONTRACT", label: "合同" },
  { value: "INTERNSHIP", label: "实习" },
]

const jobLevels = [
  { value: "JUNIOR", label: "初级" },
  { value: "MID", label: "中级" },
  { value: "SENIOR", label: "高级" },
  { value: "LEAD", label: "主管/经理" },
  { value: "EXECUTIVE", label: "总监/高管" },
]

const categories = [
  "技术",
  "产品",
  "设计",
  "运营",
  "销售",
  "市场",
  "人事/HR",
  "财务",
  "行政",
  "其他",
]

export default function NewJobPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // 表单状态
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    salaryMin: "",
    salaryMax: "",
    salaryNegotiable: false,
    location: "",
    remote: "ONSITE",
    type: "FULLTIME",
    level: "MID",
    category: "",
    industry: "",
    tags: [] as string[],
    skills: [] as string[],
    isUrgent: false,
  })
  
  const [tagInput, setTagInput] = useState("")
  const [skillInput, setSkillInput] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.requirements || !formData.location) {
      toast.error("请填写必填字段")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
          salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        }),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "创建失败")
      }
      
      const data = await res.json()
      toast.success("职位发布成功")
      router.push("/employer/jobs")
    } catch (error: any) {
      toast.error(error.message || "发布失败")
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (!tagInput.trim()) return
    if (formData.tags.includes(tagInput.trim())) {
      toast.error("标签已存在")
      return
    }
    setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })
  }

  const addSkill = () => {
    if (!skillInput.trim()) return
    if (formData.skills.includes(skillInput.trim())) {
      toast.error("技能已存在")
      return
    }
    setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] })
    setSkillInput("")
  }

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })
  }

  return (
    <EmployerLayout>
      <div className="space-y-6">
        {/* 头部 */}
        <div className="flex items-center gap-4">
          <Link href="/employer/jobs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">发布新职位</h1>
            <p className="text-gray-400 mt-1">填写职位信息，吸引更多优秀人才</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-cyan-500" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-300">
                    职位名称 *
                  </Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="如：高级前端工程师"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">职位分类</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">工作城市 *</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="如：北京、上海"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">工作方式</Label>
                  <Select
                    value={formData.remote}
                    onValueChange={(value) => setFormData({ ...formData, remote: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {remoteTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">工作类型</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">经验要求</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {jobLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 薪资信息 */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">薪资信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <Switch
                  checked={formData.salaryNegotiable}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, salaryNegotiable: checked })
                  }
                />
                <span className="text-gray-300">薪资面议</span>
              </div>

              {!formData.salaryNegotiable && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">最低薪资 (K/月)</Label>
                    <Input
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                      placeholder="如：20"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">最高薪资 (K/月)</Label>
                    <Input
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                      placeholder="如：40"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 职位描述 */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">职位描述</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">职位描述 *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="详细描述这个职位的职责、团队、项目..."
                  rows={6}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">任职要求 *</Label>
                <Textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="列出应聘者需要具备的技能、经验、学历等要求..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">岗位职责</Label>
                <Textarea
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  placeholder="具体描述这个职位的日常工作内容..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">福利待遇</Label>
                <Textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  placeholder="描述公司提供的福利，如五险一金、带薪年假、股票期权..."
                  rows={4}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* 技能要求 */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">技能要求</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">技能标签</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="输入技能，如：React、Python"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="neon"
                      color="cyan"
                      className="cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} <X className="h-3 w-3 ml-1 inline" />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 其他设置 */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">其他设置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Switch
                  checked={formData.isUrgent}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, isUrgent: checked })
                  }
                />
                <div>
                  <p className="text-white">标记为急招</p>
                  <p className="text-sm text-gray-400">职位将显示"急招"标签，吸引更多关注</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 提交按钮 */}
          <div className="flex gap-4">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="min-w-[160px] bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  发布中...
                </>
              ) : (
                "发布职位"
              )}
            </Button>
            <Link href="/employer/jobs">
              <Button type="button" variant="outline" size="lg">
                取消
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </EmployerLayout>
  )
}