'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Sparkles, Zap, Monitor, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Promotion {
  id: string
  type: string
  status: string
  durationDays: number
  startAt: string
  endAt: string
  amount: string | null
  viewBoost: number
  applyBoost: number
  job: {
    id: string
    title: string
    slug: string
    company: {
      name: string
    }
  }
}

const TYPE_CONFIG: Record<string, { name: string; icon: any; color: string; bgColor: string }> = {
  FEATURED: {
    name: 'Featured',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  HIGHLIGHT: {
    name: 'Highlight',
    icon: Sparkles,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  URGENT: {
    name: 'Urgent',
    icon: Zap,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  HOMEPAGE: {
    name: 'Homepage',
    icon: Monitor,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
}

export default function PromotionsPage() {
  const router = useRouter()
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/promotions/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch promotions')
        }

        const data = await response.json()
        setPromotions(data.promotions || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'EXPIRED':
      case 'CANCELED':
        return <XCircle className="w-5 h-5 text-gray-400" />
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '推广中'
      case 'EXPIRED':
        return '已过期'
      case 'CANCELED':
        return '已取消'
      case 'PENDING':
        return '待支付'
      default:
        return status
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const isExpired = (endAt: string) => {
    return new Date(endAt) < new Date()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">推广管理</h1>
          <p className="text-muted-foreground">管理和查看您的职位推广</p>
        </div>
        <Button onClick={() => router.push('/employer/jobs')}>推广新职位</Button>
      </div>

      {error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : promotions.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">暂无推广记录</p>
          <Button className="mt-4" onClick={() => router.push('/employer/jobs')}>
            去推广职位
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {promotions.map((promotion) => {
            const config = TYPE_CONFIG[promotion.type]
            const Icon = config?.icon || Star

            return (
              <div
                key={promotion.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${config?.bgColor || 'bg-gray-50'}`}>
                      <Icon className={`w-6 h-6 ${config?.color || 'text-gray-600'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{config?.name || promotion.type}</span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            promotion.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {getStatusIcon(promotion.status)}
                          {getStatusText(promotion.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {promotion.job.title} · {promotion.job.company.name}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>
                          {formatDate(promotion.startAt)} - {formatDate(promotion.endAt)}
                        </span>
                        <span>{promotion.durationDays} 天</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">
                      {promotion.amount ? `$${parseFloat(promotion.amount).toFixed(2)}` : '-'}
                    </div>
                    {promotion.status === 'ACTIVE' && !isExpired(promotion.endAt) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          router.push(`/employer/jobs/${promotion.job.id}/edit`)
                        }
                      >
                        续费
                      </Button>
                    )}
                  </div>
                </div>

                {(promotion.viewBoost > 0 || promotion.applyBoost > 0) && (
                  <div className="mt-4 pt-4 border-t flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm">
                        额外浏览 <strong>{promotion.viewBoost}</strong> 次
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">
                        额外申请 <strong>{promotion.applyBoost}</strong> 次
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
