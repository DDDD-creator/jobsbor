'use client'

import { useState, useEffect } from 'react'
import { Settings, Globe, Mail, Bell, Shield, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

interface SystemSettings {
  siteName: string
  siteUrl: string
  siteDescription: string
  logoUrl: string
  faviconUrl: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  googleAnalyticsId: string
  baiduAnalyticsId: string
  contactEmail: string
  contactPhone: string
  telegram: string
  wechat: string
  address: string
  loginRetryLimit: number
  sessionExpiryHours: number
}

const defaultSettings: SystemSettings = {
  siteName: 'Jobsbor',
  siteUrl: 'https://jobsbor.com',
  siteDescription: '专注于金融、Web3、互联网行业的高端招聘平台',
  logoUrl: '',
  faviconUrl: '',
  seoTitle: 'Jobsbor - 金融/Web3/互联网招聘平台',
  seoDescription: 'Jobsbor是专注于金融、Web3、互联网行业的高端招聘平台，连接顶尖人才与优质企业。',
  seoKeywords: '招聘,金融,Web3,互联网,求职,找工作',
  googleAnalyticsId: '',
  baiduAnalyticsId: '',
  contactEmail: 'support@jobsbor.com',
  contactPhone: '',
  telegram: '@Web3Kairo',
  wechat: '',
  address: '',
  loginRetryLimit: 5,
  sessionExpiryHours: 168,
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const { toast } = useToast()

  // 加载设置
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/admin/settings')
        const data = await response.json()
        
        if (data.settings) {
          setSettings({ ...defaultSettings, ...data.settings })
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
        toast({
          title: '加载失败',
          description: '无法加载系统设置',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [toast])

  const handleChange = (field: keyof SystemSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: '保存成功',
          description: '系统设置已更新',
        })
      } else {
        throw new Error(data.error || '保存失败')
      }
    } catch (error: any) {
      console.error('Failed to save settings:', error)
      toast({
        title: '保存失败',
        description: error.message || '无法保存系统设置',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">系统设置</h1>
        <p className="text-gray-400 mt-1">配置网站基本信息和功能选项</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border-white/10 mb-6">
          <TabsTrigger value="general" className="data-[state=active]:bg-white/10">
            <Globe className="w-4 h-4 mr-2" />
            基础设置
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-white/10">
            <Settings className="w-4 h-4 mr-2" />
            SEO设置
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-white/10">
            <Mail className="w-4 h-4 mr-2" />
            联系方式
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white/10">
            <Shield className="w-4 h-4 mr-2" />
            安全设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-300">网站名称</Label>
                <Input 
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">网站URL</Label>
                <Input 
                  value={settings.siteUrl}
                  onChange={(e) => handleChange('siteUrl', e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">网站简介</Label>
              <Textarea 
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                rows={3}
                className="bg-white/5 border-white/10 text-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Logo URL</Label>
              <Input 
                value={settings.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="https://..."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Favicon URL</Label>
              <Input 
                value={settings.faviconUrl}
                onChange={(e) => handleChange('faviconUrl', e.target.value)}
                placeholder="https://..."
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo">
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-300">首页标题</Label>
              <Input 
                value={settings.seoTitle}
                onChange={(e) => handleChange('seoTitle', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Meta Description</Label>
              <Textarea 
                value={settings.seoDescription}
                onChange={(e) => handleChange('seoDescription', e.target.value)}
                rows={3}
                className="bg-white/5 border-white/10 text-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Meta Keywords</Label>
              <Input 
                value={settings.seoKeywords}
                onChange={(e) => handleChange('seoKeywords', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Google Analytics ID</Label>
              <Input 
                value={settings.googleAnalyticsId}
                onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">百度统计 ID</Label>
              <Input 
                value={settings.baiduAnalyticsId}
                onChange={(e) => handleChange('baiduAnalyticsId', e.target.value)}
                placeholder="xxxxxxxxxxxxxxxx"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-300">联系邮箱</Label>
              <Input 
                value={settings.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">客服电话</Label>
              <Input 
                value={settings.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+86 xxx-xxxx-xxxx"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Telegram</Label>
              <Input 
                value={settings.telegram}
                onChange={(e) => handleChange('telegram', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">微信公众号</Label>
              <Input 
                value={settings.wechat}
                onChange={(e) => handleChange('wechat', e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">公司地址</Label>
              <Textarea 
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={2}
                className="bg-white/5 border-white/10 text-white resize-none"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-300">登录失败重试次数</Label>
              <Input 
                type="number"
                value={settings.loginRetryLimit}
                onChange={(e) => handleChange('loginRetryLimit', parseInt(e.target.value) || 5)}
                min={1}
                max={10}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Session 过期时间 (小时)</Label>
              <Input 
                type="number"
                value={settings.sessionExpiryHours}
                onChange={(e) => handleChange('sessionExpiryHours', parseInt(e.target.value) || 168)}
                min={1}
                max={720}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-yellow-400 text-sm">
                安全提示：请定期更换 JWT Secret 并确保生产环境使用强密码。
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500 font-semibold px-8"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              保存设置
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
