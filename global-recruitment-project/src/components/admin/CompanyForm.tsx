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

interface CompanyFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  submitLabel: string
}

const industries = [
  { value: 'finance', label: '金融' },
  { value: 'web3', label: 'Web3' },
  { value: 'internet', label: '互联网' },
]

const sizes = [
  { value: '1-50', label: '1-50人' },
  { value: '50-200', label: '50-200人' },
  { value: '200-500', label: '200-500人' },
  { value: '500-1000', label: '500-1000人' },
  { value: '1000+', label: '1000人以上' },
]

export function CompanyForm({ initialData, onSubmit, submitLabel }: CompanyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    website: initialData?.website || '',
    location: initialData?.location || '',
    address: initialData?.address || '',
    industry: initialData?.industry || 'finance',
    size: initialData?.size || '',
    foundedYear: initialData?.foundedYear || '',
    logo: initialData?.logo || '',
    tags: initialData?.tags?.join(', ') || '',
    benefits: initialData?.benefits?.join('\n') || '',
    culture: initialData?.culture?.join('\n') || '',
    isActive: initialData?.isActive ?? true,
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
      const data = {
        ...formData,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : null,
        tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        benefits: formData.benefits.split('\n').map((b: string) => b.trim()).filter(Boolean),
        culture: formData.culture.split('\n').map((c: string) => c.trim()).filter(Boolean),
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
        {/* 公司名称 */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300">公司名称 *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="例如：腾讯科技"
            required
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* 公司标识 */}
        <div className="space-y-2">
          <Label htmlFor="slug" className="text-gray-300">
            公司标识 *
            <span className="text-gray-500 text-sm ml-2">用于URL，如 tencent</span>
          </Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
            placeholder="tencent"
            required
            disabled={!!initialData}
            className="bg-white/5 border-white/10 text-white disabled:opacity-50"
          />
        </div>

        {/* 行业 */}
        <div className="space-y-2">
          <Label htmlFor="industry" className="text-gray-300">行业 *</Label>
          <Select
            value={formData.industry}
            onValueChange={(value) => handleChange('industry', value)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="选择行业" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind.value} value={ind.value}>{ind.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 公司规模 */}
        <div className="space-y-2">
          <Label htmlFor="size" className="text-gray-300">公司规模</Label>
          <Select
            value={formData.size}
            onValueChange={(value) => handleChange('size', value)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="选择规模" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 成立年份 */}
        <div className="space-y-2">
          <Label htmlFor="foundedYear" className="text-gray-300">成立年份</Label>
          <Input
            id="foundedYear"
            type="number"
            value={formData.foundedYear}
            onChange={(e) => handleChange('foundedYear', e.target.value)}
            placeholder="例如：1998"
            min="1900"
            max={new Date().getFullYear()}
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* 官网 */}
        <div className="space-y-2">
          <Label htmlFor="website" className="text-gray-300">公司官网</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://..."
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* 城市 */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-300">所在城市</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="例如：北京/上海/深圳"
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* 详细地址 */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address" className="text-gray-300">详细地址</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="完整办公地址"
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* Logo */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logo" className="text-gray-300">Logo URL</Label>
          <Input
            id="logo"
            type="url"
            value={formData.logo}
            onChange={(e) => handleChange('logo', e.target.value)}
            placeholder="https://..."
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        {/* 标签 */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tags" className="text-gray-300">标签 (用逗号分隔)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="互联网巨头, 腾讯系, 高薪"
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      {/* 公司简介 */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-300">公司简介</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="介绍公司背景、业务领域、发展历程..."
          rows={4}
          className="bg-white/5 border-white/10 text-white resize-none"
        />
      </div>

      {/* 福利待遇 */}
      <div className="space-y-2">
        <Label htmlFor="benefits" className="text-gray-300">福利待遇 (每行一个)</Label>
        <Textarea
          id="benefits"
          value={formData.benefits}
          onChange={(e) => handleChange('benefits', e.target.value)}
          placeholder="六险一金\n带薪年假\n免费三餐"
          rows={4}
          className="bg-white/5 border-white/10 text-white resize-none"
        />
      </div>

      {/* 公司文化 */}
      <div className="space-y-2">
        <Label htmlFor="culture" className="text-gray-300">公司文化 (每行一个)</Label>
        <Textarea
          id="culture"
          value={formData.culture}
          onChange={(e) => handleChange('culture', e.target.value)}
          placeholder="用户为本\n科技向善\n创新进取"
          rows={4}
          className="bg-white/5 border-white/10 text-white resize-none"
        />
      </div>

      {/* 状态 */}
      <div className="space-y-2">
        <Label className="text-gray-300">状态</Label>
        <Select
          value={formData.isActive.toString()}
          onValueChange={(value) => handleChange('isActive', value === 'true')}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">正常</SelectItem>
            <SelectItem value="false">禁用</SelectItem>
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
