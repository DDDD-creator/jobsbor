// 订阅计划配置 - 集中管理所有业务规则
export const SUBSCRIPTION_CONFIG = {
  plans: {
    free: {
      jobPostingLimit: 3,
      jobPromotionsCount: 0,
      featuredJobsCount: 0,
      price: 0,
    },
    basic: {
      jobPostingLimit: 10,
      jobPromotionsCount: 2,
      featuredJobsCount: 2,
      price: 29,
    },
    professional: {
      jobPostingLimit: 50,
      jobPromotionsCount: 5,
      featuredJobsCount: 5,
      price: 99,
    },
    enterprise: {
      jobPostingLimit: Number.MAX_SAFE_INTEGER, // 实际上无限制
      jobPromotionsCount: 20,
      featuredJobsCount: 20,
      price: 199,
    },
  },
  // 其他业务常量
  defaults: {
    paginationLimit: 20,
    maxPaginationLimit: 50,
    searchDebounceMs: 300,
    sseReconnectInterval: 5000,
    notificationStreamTimeout: 30000,
  },
} as const

// 类型导出
export type PlanType = keyof typeof SUBSCRIPTION_CONFIG.plans
