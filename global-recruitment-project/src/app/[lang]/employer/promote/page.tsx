'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Star, Sparkles, Zap, Monitor, Check, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPriceDisplay, PROMOTION_PRICES, getPromotionPrice } from '@/lib/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const PROMOTION_TYPES = [
  {
    id: 'featured',
    name: 'Featured',
    description: '在首页和职位列表页置顶展示，获得更多曝光',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  {
    id: 'highlight',
    name: 'Highlight',
    description: '高亮显示，让您的职位在众多列表中脱颖而出',
    icon: Sparkles,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'urgent',
    name: 'Urgent',
    description: '添加急聘标记，吸引急需工作的求职者',
    icon: Zap,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    id: 'homepage',
    name: 'Homepage',
    description: '首页横幅广告位，最大化品牌曝光',
    icon: Monitor,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
]

const DURATIONS = [
  { days: '7', label: '7天', popular: false },
  { days: '14', label: '14天', popular: true },
  { days: '30', label: '30天', popular: false },
]

function PaymentForm({
  clientSecret,
  onSuccess,
  amount,
}: {
  clientSecret: string
  onSuccess: () => void
  amount: number
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsLoading(true)
    setErrorMessage('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/employer/promote/success`,
      },
      redirect: 'if_required',
    })

    if (error) {
      setErrorMessage(error.message || '支付失败，请重试')
    } else {
      onSuccess()
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-lg p-6">
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={!stripe || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            处理中...
          </>
        ) : (
          <>确认支付 {getPriceDisplay(amount)}</>
        )}
      </Button>
    </form>
  )
}

export default function PromoteJobPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get('jobId')

  const [selectedType, setSelectedType] = useState('featured')
  const [selectedDuration, setSelectedDuration] = useState('14')
  const [clientSecret, setClientSecret] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const selectedTypeConfig = PROMOTION_TYPES.find((t) => t.id === selectedType)
  const price = getPromotionPrice(selectedType as keyof typeof PROMOTION_PRICES, selectedDuration)

  const handleCreatePayment = async () => {
    if (!jobId) {
      setError('请先选择要推广的职位')
      return
    }

    setIsCreatingPayment(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'promotion',
          jobId,
          promotionType: selectedType,
          durationDays: selectedDuration,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '创建支付失败')
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
      setShowPayment(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsCreatingPayment(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">推广创建成功！</h1>
          <p className="text-muted-foreground mb-6">
            您的职位推广已激活，预计将在几分钟内生效。
          </p>
          <Button onClick={() => router.push('/employer/jobs')} className="w-full">
            查看我的职位
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">推广您的职位</h1>
        <p className="text-muted-foreground mb-8">选择推广类型和时长，让更多求职者看到您的职位</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Promotion Types */}
            <div>
              <h2 className="text-lg font-semibold mb-4">选择推广类型</h2>
              <div className="space-y-3">
                {PROMOTION_TYPES.map((type) => {
                  const Icon = type.icon
                  const isSelected = selectedType === type.id

                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full flex items-start gap-4 p-4 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${type.bgColor}`}>
                        <Icon className={`w-5 h-5 ${type.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{type.name}</div>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-primary" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Duration Selection */}
            <div>
              <h2 className="text-lg font-semibold mb-4">选择推广时长</h2>
              <div className="grid grid-cols-3 gap-3">
                {DURATIONS.map((duration) => {
                  const isSelected = selectedDuration === duration.days
                  const price = getPromotionPrice(selectedType as keyof typeof PROMOTION_PRICES, duration.days)

                  return (
                    <button
                      key={duration.days}
                      onClick={() => setSelectedDuration(duration.days)}
                      className={`relative p-4 rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      {duration.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                          推荐
                        </span>
                      )}
                      <div className="font-medium">{duration.label}</div>
                      <div className="text-sm text-muted-foreground">{getPriceDisplay(price)}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div>
            <div className="bg-card border rounded-lg p-6 sticky top-8">
              {!showPayment ? (
                <>
                  <h2 className="text-lg font-semibold mb-6">订单摘要</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedTypeConfig?.bgColor}`}>
                        {selectedTypeConfig && (
                          <selectedTypeConfig.icon className={`w-5 h-5 ${selectedTypeConfig.color}`} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{selectedTypeConfig?.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedDuration} 天</div>
                      </div>
                    </div>

                    <hr />

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">推广费用</span>
                      <span className="text-xl font-bold">{getPriceDisplay(price)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCreatePayment}
                    disabled={isCreatingPayment}
                  >
                    {isCreatingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      '立即支付'
                    )}
                  </Button>

                  <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      立即生效，无需等待审核
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      推广期间可随时查看效果
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      安全支付，数据加密传输
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-6">支付</h2>

                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: { theme: 'stripe' },
                    }}
                  >
                    <PaymentForm
                      clientSecret={clientSecret}
                      amount={price}
                      onSuccess={() => setIsSuccess(true)}
                    />
                  </Elements>

                  <Button
                    variant="ghost"
                    className="w-full mt-4"
                    onClick={() => setShowPayment(false)}
                  >
                    返回修改
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
