'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, CheckCircle, XCircle, Clock, ArrowLeft, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Payment {
  id: string
  amount: string
  currency: string
  status: string
  type: string
  description: string
  paymentMethod: string | null
  cardLast4: string | null
  cardBrand: string | null
  paidAt: string | null
  failedAt: string | null
  createdAt: string
}

export default function PaymentHistoryPage() {
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/payments/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch payments')
        }

        const data = await response.json()
        setPayments(data.payments || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'PENDING':
      case 'PROCESSING':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <CreditCard className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SUCCEEDED':
        return '支付成功'
      case 'FAILED':
        return '支付失败'
      case 'PENDING':
        return '待支付'
      case 'PROCESSING':
        return '处理中'
      case 'REFUNDED':
        return '已退款'
      default:
        return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'SUBSCRIPTION':
        return '订阅'
      case 'JOB_PROMOTION':
        return '职位推广'
      case 'TOP_UP':
        return '充值'
      case 'REFUND':
        return '退款'
      default:
        return type
    }
  }

  const formatAmount = (amount: string, currency: string) => {
    const num = parseFloat(amount)
    if (currency === 'CNY') {
      return `¥${num.toFixed(2)}`
    }
    return `$${num.toFixed(2)}`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">支付历史</h1>
      </div>

      {error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">暂无支付记录</p>
          <Button className="mt-4" onClick={() => router.push('/pricing')}>
            查看定价方案
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium">日期</th>
                <th className="text-left py-3 px-4 text-sm font-medium">类型</th>
                <th className="text-left py-3 px-4 text-sm font-medium">描述</th>
                <th className="text-left py-3 px-4 text-sm font-medium">金额</th>
                <th className="text-left py-3 px-4 text-sm font-medium">状态</th>
                <th className="text-right py-3 px-4 text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-muted/50">
                  <td className="py-4 px-4 text-sm">{formatDate(payment.createdAt)}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary">
                      {getTypeText(payment.type)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm">{payment.description || '-'}</td>
                  <td className="py-4 px-4 font-medium">
                    {formatAmount(payment.amount, payment.currency)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className="text-sm">{getStatusText(payment.status)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {payment.status === 'SUCCEEDED' && (
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        收据
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
