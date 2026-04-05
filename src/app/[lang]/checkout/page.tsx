'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SUBSCRIPTION_PLANS, getPriceDisplay } from '@/lib/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function CheckoutForm({
  plan,
  interval,
  clientSecret,
  onSuccess,
}: {
  plan: typeof SUBSCRIPTION_PLANS[0]
  interval: string
  clientSecret: string
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
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

  const price =
    interval === 'year' && plan.yearlyPrice
      ? plan.yearlyPrice
      : plan.price

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

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            处理中...
          </>
        ) : (
          <>确认支付 {getPriceDisplay(price)}{interval === 'year' ? '/年' : '/月'}</>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        您的支付信息将安全处理。我们支持 SSL 加密传输。
      </p>
    </form>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')
  const interval = searchParams.get('interval') || 'month'

  const [clientSecret, setClientSecret] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId)

  useEffect(() => {
    if (!planId || !plan) {
      router.push('/pricing')
      return
    }

    // 创建支付意图
    const createPaymentIntent = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: 'subscription',
            planId,
            interval,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || '创建支付失败')
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  }, [planId, interval, plan, router])

  if (!plan) {
    return null
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">订阅成功！</h1>
          <p className="text-muted-foreground mb-6">
            感谢您订阅 {plan.name} 方案。您现在可以享受所有高级功能了。
          </p>
          <Button onClick={() => router.push('/employer/dashboard')} className="w-full">
            进入控制台
          </Button>
        </div>
      </div>
    )
  }

  const price =
    interval === 'year' && plan.yearlyPrice
      ? plan.yearlyPrice
      : plan.price

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0f172a',
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-muted/50 rounded-lg p-6 sticky top-8">
              <h2 className="font-semibold mb-4">订单摘要</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{plan.name} 方案</span>
                  <span className="font-medium">{getPriceDisplay(price)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>计费周期</span>
                  <span>{interval === 'year' ? '年付' : '月付'}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>总计</span>
                  <span>{getPriceDisplay(price)}</span>
                </div>
                {interval === 'year' && plan.yearlyPrice && (
                  <div className="text-sm text-green-600">
                    年付可省 ${((plan.price * 12 - plan.yearlyPrice) / 100).toFixed(0)}
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium">包含功能：</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {plan.features.slice(0, 5).map((feature, index) => (
                    <li key={index}>
                      {feature.unlimited
                        ? '无限'
                        : feature.value === 'true'
                        ? '✓'
                        : feature.value === 'false'
                        ? '✗'
                        : feature.value}{' '}
                      {feature.key}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-3">
            <div className="bg-card border rounded-lg p-6">
              <h1 className="text-xl font-bold mb-6">完成支付</h1>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button variant="outline" onClick={() => router.push('/pricing')}>
                    返回定价页
                  </Button>
                </div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm
                    plan={plan}
                    interval={interval}
                    clientSecret={clientSecret}
                    onSuccess={() => setIsSuccess(true)}
                  />
                </Elements>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
