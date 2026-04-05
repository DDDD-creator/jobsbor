'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface JobFormProps {
  initialData?: any
  companies: any[]
  onSubmit: (data: any) => Promise<void>
  submitLabel: string
}

const jobTypes = [
  { value: 'full-time', label: '全职' },
  { value: 'part-time', label: '兼职' },
  { value: 'contract', label: '合同' },
  { value: 'remote', label: '远程' },
]

const industries = [
  { value: 'finance', label: '金融' },
  { value: 'web3', label: 'Web3' },
  { value: 'internet', label: '互联网' },
]

const categories = [
  { value: 'engineer', label: '技术' },
  { value: 'product', label: '产品' },
  { value: 'design', label: '设计' },
  { value: 'marketing', label: '市场' },
  { value: 'finance', label: '金融' },
  { value: 'operations', label: '运营' },
  { value: 'research', label: '研究' },
]

const statuses = [
  { value: 'ACTIVE', label: '立即上架' },
  { value: 'PENDING', label: '待审核' },
  { value: 'INACTIVE', label: '保存为草稿' },
]

export function JobForm({ initialData, companies, onSubmit, submitLabel }: JobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    companyId: initialData?.companyId || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    location: initialData?.location || '',
    type: initialData?.type || 'full-time',
    industry: initialData?.industry || 'finance',
    category: initialData?.category || 'engineer',
    salaryMin: initialData?.salaryMin || '',
    salaryMax: initialData?.salaryMax || '',
    tags: initialData?.tags?.join(', ') || '',
    status: initialData?.status || 'PENDING',
    applyUrl: initialData?.applyUrl || '',
  })

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // 处理标签
      const tags = formData.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)

      const data = {
        ...formData,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        tags,
      }

      await onSubmit(data)
    } catch (err: any) {
      setError(err.message || '提交失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 职位名称 */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-300">
            职位名称 *
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="例如：高级前端工程师"
            required
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* 所属公司 */}
        <div className="space-y-2">
          <Label htmlFor="company" className="text-gray-300">
            所属公司 *
          </Label>
          <Select
            value={formData.companyId}
            onValueChange={(value) => handleChange('companyId', value)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="选择公司" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 工作地点 */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-300">
            工作地点 *
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="例如：北京/上海/远程"
            required
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* 工作类型 */}
        <div className="space-y-2">
          <Label htmlFor="type" className="text-gray-300">
            工作类型 *
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="选择类型" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 行业 */}
        <div className="space-y-2">
          <Label htmlFor="industry" className="text-gray-300">
            行业 *
          </Label>
          <Select
            value={formData.industry}
            onValueChange={(value) => handleChange('industry', value)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="选择行业" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 职位类别 */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-gray-300">
            职位类别 *
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="选择类别" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 最低薪资 */}
        <div className="space-y-2">
          <Label htmlFor="salaryMin" className="text-gray-300">
            最低薪资 (CNY/月)
          </Label>
          <Input
            id="salaryMin"
            type="number"
            value={formData.salaryMin}
            onChange={(e) => handleChange('salaryMin', e.target.value)}
            placeholder="例如：20000"
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* 最高薪资 */}
        <div className="space-y-2">
          <Label htmlFor="salaryMax" className="text-gray-300">
            最高薪资 (CNY/月)
          </Label>
          <Input
            id="salaryMax"
            type="number"
            value={formData.salaryMax}
            onChange={(e) => handleChange('salaryMax', e.target.value)}
            placeholder="例如：40000"
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* 申请链接 */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="applyUrl" className="text-gray-300">
            申请链接
          </Label>
          <Input
            id="applyUrl"
            type="url"
            value={formData.applyUrl}
            onChange={(e) => handleChange('applyUrl', e.target.value)}
            placeholder="https://..."
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* 标签 */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tags" className="text-gray-300">
            标签 (用逗号分隔)
          </Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="React, TypeScript, 前端开发"
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      {/* 职位描述 */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-300">
          职位描述 *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="详细描述职位内容、团队介绍、发展前景..."
          required
          rows={6}
          className="bg-white/5 border-white/10 text-white resize-none"
        />
      </div>

      {/* 任职要求 */}
      <div className="space-y-2">
        <Label htmlFor="requirements" className="text-gray-300">
          任职要求 *
        </Label>
        <Textarea
          id="requirements"
          value={formData.requirements}
          onChange={(e) => handleChange('requirements', e.target.value)}
          placeholder="列出学历、经验、技能等要求..."
          required
          rows={6}
          className="bg-white/5 border-white/10 text-white resize-none"
        />
      </div>

      {/* 状态 */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-gray-300">
          发布状态
        </Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleChange('status', value)}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="选择状态" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500 font-semibold px-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              提交中...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
