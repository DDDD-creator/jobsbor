'use client'

import { usePathname } from 'next/navigation'

// 客户端翻译hooks - 用于'use client'组件

const translations = {
  zh: {
    // 通用
    loading: '加载中...',
    error: '出错了',
    retry: '重试',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    close: '关闭',
    
    // 导航
    home: '首页',
    jobs: '职位',
    companies: '公司',
    guide: '指南',
    about: '关于我们',
    
    // 职位页面
    jobList: {
      title: '发现你的理想工作',
      subtitle: '探索金融、Web3、互联网领域的顶尖职位机会，开启你的职业新篇章',
      hotJobs: '热招职位',
      totalJobs: '共 {count} 个职位',
      updatedToday: '今日更新 {count} 个',
      remoteJobs: '远程职位 {count} 个',
      highSalary: '高薪职位 {count} 个',
      filters: '筛选条件',
      clearFilters: '清除',
      industry: '行业',
      allIndustries: '全部行业',
      finance: '金融',
      web3: 'Web3',
      internet: '互联网',
      jobType: '工作类型',
      allTypes: '全部类型',
      fullTime: '全职',
      partTime: '兼职',
      contract: '合同',
      remote: '远程',
      internship: '实习',
      salary: '薪资范围',
      allSalary: '全部薪资',
      searchPlaceholder: '搜索职位、公司或关键词...',
      searchButton: '搜索职位',
      noResults: '没有找到符合条件的职位',
      tryAdjusting: '尝试调整筛选条件或搜索关键词',
      clearAll: '清除全部条件',
      latest: '最新发布',
    },
    
    // 公司页面
    companyList: {
      title: '热门公司',
      subtitle: '发现金融、Web3、互联网领域的顶尖公司，开启职业新篇章',
      allCompanies: '全部公司',
      companyCount: '共 {count} 家公司',
      explore: '探索',
      excellent: '优秀企业',
    },
    
    // 筛选标签
    filters: {
      industry: '行业',
      type: '类型',
      salary: '薪资',
      location: '地点',
      experience: '经验',
      sort: '排序',
    }
  },
  
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    
    // Navigation
    home: 'Home',
    jobs: 'Jobs',
    companies: 'Companies',
    guide: 'Guide',
    about: 'About',
    
    // Job page
    jobList: {
      title: 'Discover Your Dream Job',
      subtitle: 'Explore top opportunities in Finance, Web3, and Internet industries',
      hotJobs: 'Hot Jobs',
      totalJobs: '{count} jobs available',
      updatedToday: '{count} updated today',
      remoteJobs: '{count} remote jobs',
      highSalary: '{count} high-salary jobs',
      filters: 'Filters',
      clearFilters: 'Clear',
      industry: 'Industry',
      allIndustries: 'All Industries',
      finance: 'Finance',
      web3: 'Web3',
      internet: 'Internet',
      jobType: 'Job Type',
      allTypes: 'All Types',
      fullTime: 'Full-time',
      partTime: 'Part-time',
      contract: 'Contract',
      remote: 'Remote',
      internship: 'Internship',
      salary: 'Salary Range',
      allSalary: 'All Salaries',
      searchPlaceholder: 'Search jobs, companies, or keywords...',
      searchButton: 'Search Jobs',
      noResults: 'No jobs found',
      tryAdjusting: 'Try adjusting filters or search keywords',
      clearAll: 'Clear all filters',
      latest: 'Latest',
    },
    
    // Company page
    companyList: {
      title: 'Top Companies',
      subtitle: 'Discover leading companies in Finance, Web3, and Internet',
      allCompanies: 'All Companies',
      companyCount: '{count} companies',
      explore: 'Explore',
      excellent: 'Excellent Companies',
    },
    
    // Filter labels
    filters: {
      industry: 'Industry',
      type: 'Type',
      salary: 'Salary',
      location: 'Location',
      experience: 'Experience',
      sort: 'Sort',
    }
  }
}

export function useClientLocale(): 'zh' | 'en' {
  const pathname = usePathname()
  const locale = pathname?.split('/')[1]
  return locale === 'zh' || locale === 'en' ? locale : 'zh'
}

export function useClientTranslations() {
  const locale = useClientLocale()
  return translations[locale]
}

// 简单的翻译函数，支持插值
export function t(key: string, params?: Record<string, string | number>): string {
  const locale = useClientLocale()
  const keys = key.split('.')
  let value: any = translations[locale]
  
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      return key // 返回原始key作为fallback
    }
  }
  
  if (typeof value !== 'string') {
    return key
  }
  
  // 简单的插值替换 {variable}
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, key) => {
      return String(params[key] ?? match)
    })
  }
  
  return value
}
