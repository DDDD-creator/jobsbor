import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeEnabled } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type Stripe from 'stripe'
import { PromotionType, SubscriptionStatus } from '@prisma/client'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(req: NextRequest) {
  try {
    // 检查 Stripe 是否配置
    if (!isStripeEnabled()) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
    }

    const payload = await req.text()
    const signature = req.headers.get('stripe-signature') || ''

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // 处理事件
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// 处理支付成功
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { type, userId, jobId, promotionType, durationDays } = paymentIntent.metadata || {}

  // 更新支付记录
  const payment = await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {
      status: 'SUCCEEDED',
      paidAt: new Date(),
      paymentMethod: paymentIntent.payment_method_types?.[0],
    },
  })

  // 如果是职位推广，创建推广记录
  if (type === 'JOB_PROMOTION' && jobId && promotionType && durationDays) {
    const startAt = new Date()
    const endAt = new Date()
    endAt.setDate(endAt.getDate() + parseInt(durationDays))

    await prisma.jobPromotion.create({
      data: {
        jobId,
        userId,
        type: promotionType.toUpperCase() as PromotionType,
        durationDays: parseInt(durationDays),
        status: 'ACTIVE',
        startAt,
        endAt,
        amount: (paymentIntent.amount / 100).toString(),
        currency: paymentIntent.currency.toUpperCase(),
        paymentId: paymentIntent.id,
      },
    })

    // 更新职位状态
    if (promotionType === 'FEATURED') {
      await prisma.job.update({
        where: { id: jobId },
        data: { isFeatured: true },
      })
    } else if (promotionType === 'URGENT') {
      await prisma.job.update({
        where: { id: jobId },
        data: { isUrgent: true },
      })
    }
  }

  // 发送通知
  if (userId) {
    await prisma.notification.create({
      data: {
        userId,
        type: 'PAYMENT_SUCCESS',
        title: 'Payment Successful',
        content: `Your payment of ${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()} was successful.`,
        data: { paymentIntentId: paymentIntent.id },
      },
    })
  }
}

// 处理支付失败
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { userId } = paymentIntent.metadata || {}

  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {
      status: 'FAILED',
      failedAt: new Date(),
    },
  })

  if (userId) {
    await prisma.notification.create({
      data: {
        userId,
        type: 'PAYMENT_FAILED',
        title: 'Payment Failed',
        content: 'Your payment could not be processed. Please try again or use a different payment method.',
        data: { paymentIntentId: paymentIntent.id },
      },
    })
  }
}

// 处理发票支付成功
async function handleInvoicePaid(invoice: Stripe.Invoice & { subscription?: string }) {
  const subscriptionId = invoice.subscription
  if (!subscriptionId) return

  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId as string },
  })

  if (subscription) {
    // 创建支付记录
    await prisma.payment.create({
      data: {
        userId: subscription.userId,
        subscriptionId: subscription.id,
        stripeInvoiceId: invoice.id,
        amount: (invoice.amount_paid / 100).toString(),
        currency: invoice.currency.toUpperCase(),
        status: 'SUCCEEDED',
        type: 'SUBSCRIPTION',
        description: 'Subscription payment',
        paidAt: new Date(),
      },
    })
  }
}

// 处理发票支付失败
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice & { subscription?: string }) {
  const subscriptionId = invoice.subscription
  if (!subscriptionId) return

  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId as string },
    include: { user: true },
  })

  if (subscription) {
    await prisma.notification.create({
      data: {
        userId: subscription.userId,
        type: 'PAYMENT_FAILED',
        title: 'Subscription Payment Failed',
        content: 'Your subscription payment could not be processed. Please update your payment method.',
        data: { invoiceId: invoice.id },
      },
    })
  }
}

// 处理订阅创建
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // 已在创建时处理
  console.log('Subscription created:', subscription.id)
}

// 处理订阅更新
async function handleSubscriptionUpdated(stripeSub: Stripe.Subscription & { current_period_start?: number; current_period_end?: number }) {
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: stripeSub.id },
  })

  if (subscription) {
    const status = stripeSub.status.toUpperCase() as SubscriptionStatus
    const currentPeriodStart = stripeSub.current_period_start
      ? new Date(stripeSub.current_period_start * 1000)
      : null
    const currentPeriodEnd = stripeSub.current_period_end
      ? new Date(stripeSub.current_period_end * 1000)
      : null

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
      },
    })

    // 更新用户的当前订阅
    if (status === 'ACTIVE') {
      await prisma.user.update({
        where: { id: subscription.userId },
        data: { currentSubscriptionId: subscription.id },
      })
    }
  }
}

// 处理订阅删除
async function handleSubscriptionDeleted(stripeSub: Stripe.Subscription) {
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: stripeSub.id },
    include: { user: true },
  })

  if (subscription) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    })

    // 清除用户的当前订阅
    if (subscription.user.currentSubscriptionId === subscription.id) {
      await prisma.user.update({
        where: { id: subscription.userId },
        data: { currentSubscriptionId: null },
      })
    }

    // 发送通知
    await prisma.notification.create({
      data: {
        userId: subscription.userId,
        type: 'SUBSCRIPTION_EXPIRED',
        title: 'Subscription Canceled',
        content: 'Your subscription has been canceled. You can resubscribe at any time.',
      },
    })
  }
}
