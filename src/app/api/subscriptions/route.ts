import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeEnabled } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// 获取当前用户的订阅
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: payload.userId,
        status: { in: ['ACTIVE', 'TRIALING', 'PAST_DUE'] },
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 获取支付历史
    const payments = await prisma.payment.findMany({
      where: {
        userId: payload.userId,
        type: 'SUBSCRIPTION',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    return NextResponse.json({
      subscription,
      payments,
    })
  } catch (error: any) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get subscription' },
      { status: 500 }
    )
  }
}

// 更新订阅（升级/降级/取消）
export async function PATCH(req: NextRequest) {
  try {
    // 检查 Stripe 是否配置
    if (!isStripeEnabled()) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
    }

    const token = req.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    const { action, planId, interval = 'month' } = body

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: payload.userId,
        status: { in: ['ACTIVE', 'TRIALING'] },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
    }

    if (action === 'cancel') {
      // 取消订阅（在周期结束时）
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      })

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { cancelAtPeriodEnd: true },
      })

      return NextResponse.json({ message: 'Subscription will be canceled at period end' })
    } else if (action === 'reactivate') {
      // 重新激活订阅
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: false,
      })

      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { cancelAtPeriodEnd: false },
      })

      return NextResponse.json({ message: 'Subscription reactivated' })
    } else if (action === 'upgrade' || action === 'downgrade') {
      // 升级/降级订阅
      const newPriceId = interval === 'year'
        ? (planId === 'pro' ? process.env.STRIPE_PRICE_PRO_YEARLY : process.env.STRIPE_PRICE_ENTERPRISE_YEARLY)
        : (planId === 'pro' ? process.env.STRIPE_PRICE_PRO_MONTHLY : process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY)

      if (!newPriceId) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
      }

      // 获取当前订阅的 item ID
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)
      const itemId = stripeSubscription.items.data[0].id

      // 更新订阅
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        items: [{ id: itemId, price: newPriceId }],
        proration_behavior: 'create_prorations',
      })

      return NextResponse.json({ message: 'Subscription updated' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Update subscription error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

// 取消订阅（立即）
export async function DELETE(req: NextRequest) {
  try {
    // 检查 Stripe 是否配置
    if (!isStripeEnabled()) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
    }

    const token = req.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: payload.userId,
        status: { in: ['ACTIVE', 'TRIALING'] },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
    }

    // 立即取消订阅
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Subscription canceled immediately' })
  } catch (error: any) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
