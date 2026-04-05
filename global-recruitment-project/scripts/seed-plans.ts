import { prisma } from '@/lib/prisma'

async function seedSubscriptionPlans() {
  console.log('Seeding subscription plans...')

  const plans = [
    {
      name: 'Free',
      nameKey: 'plan_free',
      description: '适合个人求职者或初创企业',
      price: 0,
      currency: 'USD',
      interval: 'month',
      jobPostingLimit: 3,
      jobPromotionsCount: 0,
      featuredJobsCount: 0,
      prioritySupport: false,
      analyticsAccess: false,
      resumeAccess: false,
      customBranding: false,
      apiAccess: false,
      features: [
        { key: 'job_postings', value: '3', unlimited: false },
        { key: 'active_jobs', value: '3', unlimited: false },
        { key: 'resume_views', value: '10', unlimited: false },
        { key: 'job_promotions', value: '0', unlimited: false },
        { key: 'priority_support', value: 'false', unlimited: false },
        { key: 'analytics', value: 'false', unlimited: false },
      ],
      displayOrder: 0,
    },
    {
      name: 'Pro',
      nameKey: 'plan_pro',
      description: '适合成长型企业',
      price: 49,
      currency: 'USD',
      interval: 'month',
      jobPostingLimit: 20,
      jobPromotionsCount: 5,
      featuredJobsCount: 5,
      prioritySupport: true,
      analyticsAccess: true,
      resumeAccess: true,
      customBranding: false,
      apiAccess: false,
      features: [
        { key: 'job_postings', value: '20', unlimited: false },
        { key: 'active_jobs', value: '20', unlimited: false },
        { key: 'resume_views', value: '100', unlimited: false },
        { key: 'job_promotions', value: '5', unlimited: false },
        { key: 'priority_support', value: 'true', unlimited: false },
        { key: 'analytics', value: 'true', unlimited: false },
      ],
      displayOrder: 1,
    },
    {
      name: 'Enterprise',
      nameKey: 'plan_enterprise',
      description: '适合大型企业和招聘团队',
      price: 199,
      currency: 'USD',
      interval: 'month',
      jobPostingLimit: 999999,
      jobPromotionsCount: 20,
      featuredJobsCount: 20,
      prioritySupport: true,
      analyticsAccess: true,
      resumeAccess: true,
      customBranding: true,
      apiAccess: true,
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
      displayOrder: 2,
    },
  ]

  for (const plan of plans) {
    const existing = await prisma.subscriptionPlan.findUnique({
      where: { nameKey: plan.nameKey },
    })

    if (!existing) {
      await prisma.subscriptionPlan.create({
        data: {
          ...plan,
          features: JSON.stringify(plan.features),
        },
      })
      console.log(`Created plan: ${plan.name}`)
    } else {
      console.log(`Plan already exists: ${plan.name}`)
    }
  }

  console.log('Subscription plans seeded!')
}

async function main() {
  try {
    await seedSubscriptionPlans()
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
