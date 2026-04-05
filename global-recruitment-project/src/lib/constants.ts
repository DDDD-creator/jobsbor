// 全局常量定义
// 集中管理localStorage keys、API endpoints等

// ====== localStorage Keys ======
export const FAVORITES_KEY = 'jobsbor-favorites'
export const APPLICATIONS_KEY = 'jobsbor-applications'
export const SEARCH_HISTORY_KEY = 'jobsbor-search-history'
export const THEME_KEY = 'jobsbor-theme'

// ====== API Endpoints ======
export const API_ENDPOINTS = {
  jobs: {
    list: '/api/jobs',
    search: '/api/jobs/search',
    apply: '/api/jobs/apply',
    favorite: '/api/jobs/favorite',
    detail: (slug: string) => `/api/jobs/${slug}`,
  },
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    session: '/api/auth/session',
  },
  employer: {
    dashboard: '/api/employer/dashboard',
    jobs: '/api/employer/jobs',
    applications: '/api/employer/applications',
  },
  jobseeker: {
    profile: '/api/jobseeker/profile',
    resume: '/api/jobseeker/resume',
    applications: '/api/jobseeker/applications',
  },
  payments: {
    createIntent: '/api/payments/create-intent',
    history: '/api/payments/history',
    webhook: '/api/payments/webhook',
  },
} as const

// ====== 业务常量 ======
export const BUSINESS_CONSTANTS = {
  // 分页
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50,
  
  // 搜索
  SEARCH_DEBOUNCE_MS: 300,
  SEARCH_HISTORY_MAX: 10,
  
  // 收藏
  FAVORITES_MAX: 100,
  
  // 缓存
  CACHE_TTL_SECONDS: 300, // 5分钟
  
  // SSE
  SSE_RECONNECT_INTERVAL: 5000,
  SSE_MAX_RECONNECT_ATTEMPTS: 5,
} as const

// ====== UI常量 ======
export const UI_CONSTANTS = {
  // 动画时长
  ANIMATION_DURATION_MS: 300,
  
  // Toast显示时长
  TOAST_DURATION_MS: 3000,
  
  // 进度条最小显示时间
  PROGRESS_MIN_DURATION_MS: 500,
} as const
