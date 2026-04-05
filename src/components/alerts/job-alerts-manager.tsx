'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Bell, 
  Mail, 
  Trash2, 
  Edit2, 
  Plus,
  Check,
  X,
  Clock,
  Filter,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface JobAlert {
  id: string
  email: string
  name?: string
  filters: {
    keyword?: string
    industry?: string
    location?: string
    type?: string
    remoteOnly?: boolean
    hasSalary?: boolean
  }
  frequency: 'daily' | 'weekly' | 'instant'
  isActive: boolean
  createdAt: string
  lastSentAt?: string
}

interface JobAlertsManagerProps {
  className?: string
}

const frequencyLabels: Record<string, string> = {
  daily: '每日',
  weekly: '每周',
  instant: '实时',
}

const frequencyColors: Record<string, string> = {
  daily: 'blue',
  weekly: 'purple',
  instant: 'green',
}

export function JobAlertsManager({ className }: JobAlertsManagerProps) {
  const [alerts, setAlerts] = useState<JobAlert[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null)
  
  // 新提醒表单
  const [formData, setFormData] = useState<{
    email: string
    name: string
    keyword: string
    industry: string
    location: string
    type: string
    remoteOnly: boolean
    hasSalary: boolean
    frequency: 'daily' | 'weekly' | 'instant'
  }>({
    email: '',
    name: '',
    keyword: '',
    industry: '',
    location: '',
    type: '',
    remoteOnly: false,
    hasSalary: false,
    frequency: 'daily' as const,
  })

  // 从localStorage加载
  useEffect(() => {
    const saved = localStorage.getItem('jobsbor_job_alerts')
    if (saved) {
      try {
        setAlerts(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse alerts:', e)
      }
    }
  }, [])

  // 保存到localStorage
  const saveAlerts = useCallback((newAlerts: JobAlert[]) => {
    setAlerts(newAlerts)
    localStorage.setItem('jobsbor_job_alerts', JSON.stringify(newAlerts))
  }, [])

  // 创建提醒
  const createAlert = () => {
    if (!formData.email) return
    
    const newAlert: JobAlert = {
      id: Date.now().toString(),
      email: formData.email,
      name: formData.name || undefined,
      filters: {
        keyword: formData.keyword || undefined,
        industry: formData.industry || undefined,
        location: formData.location || undefined,
        type: formData.type || undefined,
        remoteOnly: formData.remoteOnly || undefined,
        hasSalary: formData.hasSalary || undefined,
      },
      frequency: formData.frequency,
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    
    saveAlerts([...alerts, newAlert])
    setShowCreateModal(false)
    resetForm()
  }

  // 更新提醒
  const updateAlert = () => {
    if (!editingAlert || !formData.email) return
    
    const updated: JobAlert = {
      ...editingAlert,
      email: formData.email,
      name: formData.name || undefined,
      filters: {
        keyword: formData.keyword || undefined,
        industry: formData.industry || undefined,
        location: formData.location || undefined,
        type: formData.type || undefined,
        remoteOnly: formData.remoteOnly || undefined,
        hasSalary: formData.hasSalary || undefined,
      },
      frequency: formData.frequency,
    }
    
    saveAlerts(alerts.map(a => a.id === updated.id ? updated : a))
    setEditingAlert(null)
    resetForm()
  }

  // 删除提醒
  const deleteAlert = (id: string) => {
    if (confirm('确定要删除这个职位提醒吗？')) {
      saveAlerts(alerts.filter(a => a.id !== id))
    }
  }

  // 切换激活状态
  const toggleActive = (id: string) => {
    saveAlerts(alerts.map(a => 
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ))
  }

  // 编辑提醒
  const startEdit = (alert: JobAlert) => {
    setEditingAlert(alert)
    setFormData({
      email: alert.email,
      name: alert.name || '',
      keyword: alert.filters.keyword || '',
      industry: alert.filters.industry || '',
      location: alert.filters.location || '',
      type: alert.filters.type || '',
      remoteOnly: alert.filters.remoteOnly || false,
      hasSalary: alert.filters.hasSalary || false,
      frequency: alert.frequency,
    })
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      keyword: '',
      industry: '',
      location: '',
      type: '',
      remoteOnly: false,
      hasSalary: false,
      frequency: 'daily',
    })
  }

  // 渲染筛选条件标签
  const renderFilterTags = (filters: JobAlert['filters']) => {
    const tags = []
    if (filters.keyword) tags.push({ label: filters.keyword, color: 'cyan' })
    if (filters.industry) tags.push({ label: filters.industry, color: 'purple' })
    if (filters.location) tags.push({ label: filters.location, color: 'pink' })
    if (filters.type) tags.push({ label: filters.type, color: 'blue' })
    if (filters.remoteOnly) tags.push({ label: '远程', color: 'green' })
    if (filters.hasSalary) tags.push({ label: '有薪资', color: 'yellow' })
    
    return tags.map((tag, i) => (
      <Badge key={i} variant="outline" size="sm" className={cn(
        tag.color === 'cyan' && 'border-cyan-500/30 text-cyan-400',
        tag.color === 'purple' && 'border-purple-500/30 text-purple-400',
        tag.color === 'pink' && 'border-pink-500/30 text-pink-400',
        tag.color === 'blue' && 'border-blue-500/30 text-blue-400',
        tag.color === 'green' && 'border-green-500/30 text-green-400',
        tag.color === 'yellow' && 'border-yellow-500/30 text-yellow-400',
      )}>
        {tag.label}
      </Badge>
    ))
  }

  return (
    <div className={className}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            职位提醒
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            设置筛选条件，有新职位时自动邮件通知
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-purple-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          新建提醒
        </Button>
      </div>

      {/* 提醒列表 */}
      {alerts.length === 0 ? (
        <Card className="p-8 text-center border-white/10 bg-dark-200/50">
          <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">还没有设置职位提醒</p>
          <p className="text-sm text-gray-500 mb-4">
            创建提醒后，当有新职位符合你的条件时，我们会发送邮件通知你
          </p>
          <Button
            variant="outline"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            创建第一个提醒
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={cn(
                "p-4 border-white/10 transition-all",
                alert.isActive ? 'bg-dark-200/50' : 'bg-dark-200/30 opacity-60'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span className="text-white font-medium">{alert.email}</span>
                    {alert.name && (
                      <span className="text-gray-400 text-sm">({alert.name})</span>
                    )}
                    <Badge
                      size="sm"
                      className={cn(
                        alert.frequency === 'instant' && 'bg-green-500/20 text-green-400',
                        alert.frequency === 'daily' && 'bg-blue-500/20 text-blue-400',
                        alert.frequency === 'weekly' && 'bg-purple-500/20 text-purple-400',
                      )}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {frequencyLabels[alert.frequency]}
                    </Badge>
                    {!alert.isActive && (
                      <Badge variant="outline" size="sm" className="border-gray-500/30 text-gray-400">
                        已暂停
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Filter className="w-3 h-3 text-gray-500 mt-1" />
                    {renderFilterTags(alert.filters)}
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    创建于 {new Date(alert.createdAt).toLocaleDateString('zh-CN')}
                    {alert.lastSentAt && ` · 上次发送 ${new Date(alert.lastSentAt).toLocaleDateString('zh-CN')}`}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleActive(alert.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      alert.isActive 
                        ? "text-green-400 hover:bg-green-500/10" 
                        : "text-gray-400 hover:bg-gray-500/10"
                    )}
                    title={alert.isActive ? '暂停' : '启用'}
                  >
                    {alert.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(alert)}
                    className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                    title="编辑"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 创建/编辑弹窗 */}
      {(showCreateModal || editingAlert) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto border-white/10 bg-dark-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-cyan-400" />
                  {editingAlert ? '编辑提醒' : '新建职位提醒'}
                </h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingAlert(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 邮箱 */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    接收邮箱 <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="bg-dark-300/50 border-white/10"
                  />
                </div>

                {/* 名称（可选） */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    提醒名称（可选）
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="如：远程开发职位"
                    className="bg-dark-300/50 border-white/10"
                  />
                </div>

                {/* 筛选条件 */}
                <div className="border-t border-white/10 pt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Filter className="w-4 h-4 inline mr-1" />
                    筛选条件
                  </label>
                  
                  <div className="space-y-3">
                    <Input
                      value={formData.keyword}
                      onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                      placeholder="关键词（职位、公司）"
                      className="bg-dark-300/50 border-white/10"
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="px-3 py-2 rounded-lg bg-dark-300/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                      >
                        <option value="">全部行业</option>
                        <option value="finance">金融</option>
                        <option value="web3">Web3</option>
                        <option value="internet">互联网</option>
                      </select>
                      
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="px-3 py-2 rounded-lg bg-dark-300/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                      >
                        <option value="">全部地点</option>
                        <option value="北京">北京</option>
                        <option value="上海">上海</option>
                        <option value="深圳">深圳</option>
                        <option value="杭州">杭州</option>
                        <option value="广州">广州</option>
                        <option value="远程">远程</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="px-3 py-2 rounded-lg bg-dark-300/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                      >
                        <option value="">全部类型</option>
                        <option value="full-time">全职</option>
                        <option value="part-time">兼职</option>
                        <option value="contract">合同</option>
                        <option value="remote">远程</option>
                      </select>
                    </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.remoteOnly}
                          onChange={(e) => setFormData({ ...formData, remoteOnly: e.target.checked })}
                          className="rounded border-white/10 bg-dark-300/50 text-cyan-500 focus:ring-cyan-500"
                        />
                        仅远程
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hasSalary}
                          onChange={(e) => setFormData({ ...formData, hasSalary: e.target.checked })}
                          className="rounded border-white/10 bg-dark-300/50 text-cyan-500 focus:ring-cyan-500"
                        />
                        有薪资
                      </label>
                    </div>
                  </div>
                </div>

                {/* 发送频率 */}
                <div className="border-t border-white/10 pt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    <Clock className="w-4 h-4 inline mr-1" />
                    发送频率
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['daily', 'weekly', 'instant'] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setFormData({ ...formData, frequency: freq })}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm transition-all",
                          formData.frequency === freq
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : "bg-dark-300/50 text-gray-400 hover:bg-dark-300"
                        )}
                      >
                        {frequencyLabels[freq]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => {
                      setShowCreateModal(false)
                      setEditingAlert(null)
                      resetForm()
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500"
                    onClick={editingAlert ? updateAlert : createAlert}
                    disabled={!formData.email}
                  >
                    {editingAlert ? '保存修改' : '创建提醒'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
