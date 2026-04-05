'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Star, Sparkles, Zap, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SUBSCRIPTION_PLANS, getPriceDisplay } from '@/lib/stripe'

export default function PricingPage() {
  const router = useRouter()
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = (planId: string) => {
    setIsLoading(planId)
    router.push(`/checkout?plan=${planId}&interval=${billingInterval}`)
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Sparkles className="w-6 h-6" />
      case 'pro':
        return <Star className="w-6 h-6" />
      case 'enterprise':
        return <Building2 className="w-6 h-6" />
      default:
        return <Zap className="w-6 h-6" />
    }
  }

  const getPlanPrice = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    if (plan.price === 0) return { amount: 0, label: '免费' }
    
    if (billingInterval === 'year' && plan.yearlyPrice) {
      return {
        amount: plan.yearlyPrice,
        monthlyAmount: Math.round(plan.yearlyPrice / 12),
        label: '/年',
        monthlyLabel: '/月',
        savings: Math.round((plan.price * 12 - plan.yearlyPrice) / 100),
      }
    }
    
    return {
      amount: plan.price,
      label: '/月',
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">选择适合您的方案</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            无论您是个人求职者、初创企业还是大型公司，我们都有适合您的方案
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${billingInterval === 'month' ? 'text-foreground' : 'text-muted-foreground'}`}>
              月付
            </span>
            <button
              onClick={() => setBillingInterval(billingInterval === 'month' ? 'year' : 'month')}
              className="relative w-14 h-7 bg-primary rounded-full transition-colors"
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                  billingInterval === 'year' ? 'left-8' : 'left-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingInterval === 'year' ? 'text-foreground' : 'text-muted-foreground'}`}>
              年付
              <span className="ml-2 text-xs text-green-600 font-medium">省20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const price = getPlanPrice(plan)
            const isPopular = plan.id === 'pro'

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border bg-card p-8 transition-all hover:shadow-lg ${
                  isPopular ? 'border-primary shadow-lg scale-105' : 'border-border'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                      最受欢迎
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${isPopular ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                      {getPlanIcon(plan.id)}
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      {price.amount === 0 ? '免费' : getPriceDisplay(price.amount)}
                    </span>
                    {price.amount > 0 && (
                      <span className="text-muted-foreground">{price.label}</span>
                    )}
                  </div>
                  {price.monthlyAmount && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      约 {getPriceDisplay(price.monthlyAmount)}/月
                      <span className="ml-2 text-green-600">省 ${price.savings}</span>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full mb-6"
                  variant={isPopular ? 'primary' : 'outline'}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading === plan.id || plan.id === 'free'}
                >
                  {plan.id === 'free' ? '当前方案' : isLoading === plan.id ? '加载中...' : '立即订阅'}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 ${isPopular ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span>
                        {feature.unlimited
                          ? '无限'
                          : feature.value === 'true'
                          ? ''
                          : feature.value === 'false'
                          ? '不支持'
                          : feature.value}
                        {' '}
                        {feature.key === 'job_postings'
                          ? '职位发布'
                          : feature.key === 'active_jobs'
                          ? '活跃职位'
                          : feature.key === 'resume_views'
                          ? '简历查看'
                          : feature.key === 'job_promotions'
                          ? '职位推广'
                          : feature.key === 'priority_support'
                          ? '优先客服支持'
                          : feature.key === 'analytics'
                          ? '数据分析'
                          : feature.key === 'dedicated_manager'
                          ? '专属客户经理'
                          : feature.key === 'api_access'
                          ? 'API 访问'
                          : feature.key}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">常见问题</h2>
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">可以随时取消订阅吗？</h3>
              <p className="text-muted-foreground text-sm">
                是的，您可以随时取消订阅。取消后，您仍可以使用服务直到当前计费周期结束。
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">支持哪些支付方式？</h3>
              <p className="text-muted-foreground text-sm">
                我们支持信用卡、借记卡支付。部分地区还支持支付宝等本地支付方式。
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">可以升级或降级方案吗？</h3>
              <p className="text-muted-foreground text-sm">
                当然可以。您可以随时升级或降级您的订阅方案，费用会按比例计算。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
