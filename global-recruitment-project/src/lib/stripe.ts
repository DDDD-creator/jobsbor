import Stripe from 'stripe'

// 初始化 Stripe
const stripeKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeKey 
  ? new Stripe(stripeKey, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    })
  : null as unknown as Stripe

// 检查 Stripe 是否可用
export const isStripeEnabled = () => !!stripeKey

// Stripe Price IDs (需要在 Stripe Dashboard 中创建)
export const STRIPE_PRICE_IDS = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || '',
  enterprise_monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
  enterprise_yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || '',
}

// 推广产品价格 (一次性支付)
export const PROMOTION_PRICES = {
  featured: {
    '7': 9900,   // $99.00 - 7天
    '14': 16900, // $169.00 - 14天
    '30': 29900, // $299.00 - 30天
  },
  highlight: {
    '7': 4900,   // $49.00
    '14': 8900,  // $89.00
    '30': 14900, // $149.00
  },
  urgent: {
    '7': 2900,   // $29.00
    '14': 4900,  // $49.00
    '30': 7900,  // $79.00
  },
  homepage: {
    '1': 49900,  // $499.00 - 1天首页横幅
    '3': 129900, // $1299.00 - 3天
    '7': 249900, // $2499.00 - 7天
  },
}

// 订阅计划配置
export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    nameKey: 'plan_free',
    name: 'Free',
    description: '适合个人求职者或初创企业',
    price: 0,
    interval: 'month',
    features: [
      { key: 'job_postings', value: '3', unlimited: false },
      { key: 'active_jobs', value: '3', unlimited: false },
      { key: 'resume_views', value: '10', unlimited: false },
      { key: 'job_promotions', value: '0', unlimited: false },
      { key: 'priority_support', value: 'false', unlimited: false },
      { key: 'analytics', value: 'false', unlimited: false },
    ],
    jobPostingLimit: 3,
    jobPromotionsCount: 0,
    featuredJobsCount: 0,
    prioritySupport: false,
    analyticsAccess: false,
    resumeAccess: false,
    customBranding: false,
    apiAccess: false,
  },
  {
    id: 'pro',
    nameKey: 'plan_pro',
    name: 'Pro',
    description: '适合成长型企业',
    price: 4900, // $49/month
    yearlyPrice: 47000, // $470/year (20% off)
    interval: 'month',
    popular: true,
    features: [
      { key: 'job_postings', value: '20', unlimited: false },
      { key: 'active_jobs', value: '20', unlimited: false },
      { key: 'resume_views', value: '100', unlimited: false },
      { key: 'job_promotions', value: '5', unlimited: false },
      { key: 'priority_support', value: 'true', unlimited: false },
      { key: 'analytics', value: 'true', unlimited: false },
    ],
    jobPostingLimit: 20,
    jobPromotionsCount: 5,
    featuredJobsCount: 5,
    prioritySupport: true,
    analyticsAccess: true,
    resumeAccess: true,
    customBranding: false,
    apiAccess: false,
  },
  {
    id: 'enterprise',
    nameKey: 'plan_enterprise',
    name: 'Enterprise',
    description: '适合大型企业和招聘团队',
    price: 19900, // $199/month
    yearlyPrice: 191000, // $1910/year (20% off)
    interval: 'month',
    features: [
      { key: 'job_postings', value: 'unlimited', unlimited: true },
      { key: 'active_jobs', value: 'unlimited', unlimited: true },
      { key: 'resume_views', value: 'unlimited', unlimited: true },
      { key: 'job_promotions', value: '20', unlimited: false },
      { key: 'priority_support', value: 'true', unlimited: false },
      { key: 'analytics', value: 'true', unlimited: false },
      { key: 'dedicated_manager', value: 'true', unlimited: false },
      { key: 'api_access', value: 'true', unlimited: false },
    ],
    jobPostingLimit: 999999,
    jobPromotionsCount: 20,
    featuredJobsCount: 20,
    prioritySupport: true,
    analyticsAccess: true,
    resumeAccess: true,
    customBranding: true,
    apiAccess: true,
  },
]

// 获取价格显示文本
export function getPriceDisplay(price: number, currency: string = 'USD'): string {
  const amount = (price / 100).toFixed(2)
  if (currency === 'CNY') {
    return `¥${amount}`
  }
  return `$${amount}`
}

// 获取推广价格
export function getPromotionPrice(type: keyof typeof PROMOTION_PRICES, days: string): number {
  const prices = PROMOTION_PRICES[type]
  return prices[days as keyof typeof prices] || 0
}
