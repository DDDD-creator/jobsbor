import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICE_IDS, PROMOTION_PRICES, getPromotionPrice, isStripeEnabled } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// 创建支付意图
export async function POST(req: NextRequest) {
  try {
    // 检查 Stripe 是否配置
    if (!isStripeEnabled()) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
    }

    // 验证用户
    const token = req.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    const { type, planId, interval = 'month', jobId, promotionType, durationDays } = body

    // 获取用户
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 确保 Stripe 客户存在
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      })
      stripeCustomerId = customer.id
      
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      })
    }

    // 根据类型创建支付意图
    if (type === 'subscription') {
      // 订阅支付
      const priceId = interval === 'year' 
        ? (planId === 'pro' ? STRIPE_PRICE_IDS.pro_yearly : STRIPE_PRICE_IDS.enterprise_yearly)
        : (planId === 'pro' ? STRIPE_PRICE_IDS.pro_monthly : STRIPE_PRICE_IDS.enterprise_monthly)

      if (!priceId) {
        return NextResponse.json({ error: 'Invalid plan or price not configured' }, { status: 400 })
      }

      // 创建订阅
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId: user.id,
          planId,
          interval,
        },
      })

      // 在数据库中创建订阅记录
      await prisma.subscription.create({
        data: {
          userId: user.id,
          planId: planId, // 注意：这里需要关联到 SubscriptionPlan 表的 ID
          stripeSubscriptionId: subscription.id,
          stripeCustomerId,
          stripePriceId: priceId,
          status: 'INCOMPLETE',
        },
      })

      const invoice = subscription.latest_invoice as Stripe.Invoice & { payment_intent?: string }
      const paymentIntentId = invoice?.payment_intent
      
      if (!paymentIntentId) {
        return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
      }
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        subscriptionId: subscription.id,
      })
    } else if (type === 'promotion') {
      // 职位推广支付
      if (!jobId || !promotionType || !durationDays) {
        return NextResponse.json({ error: 'Missing promotion parameters' }, { status: 400 })
      }

      const price = getPromotionPrice(promotionType as keyof typeof PROMOTION_PRICES, durationDays)
      if (!price) {
        return NextResponse.json({ error: 'Invalid promotion type or duration' }, { status: 400 })
      }

      // 创建支付意图
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price,
        currency: 'usd',
        customer: stripeCustomerId,
        automatic_payment_methods: { enabled: true },
        metadata: {
          type: 'JOB_PROMOTION',
          userId: user.id,
          jobId,
          promotionType,
          durationDays,
        },
      })

      // 在数据库中创建支付记录
      await prisma.payment.create({
        data: {
          userId: user.id,
          stripePaymentIntentId: paymentIntent.id,
          amount: price / 100,
          currency: 'USD',
          status: 'PENDING',
          type: 'JOB_PROMOTION',
          description: `${promotionType} promotion for ${durationDays} days`,
          metadata: {
            jobId,
            promotionType,
            durationDays,
          },
        },
      })

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      })
    }

    return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 })
  } catch (error: any) {
    console.error('Create payment intent error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}

// 导入 Stripe 类型
import type Stripe from 'stripe'
