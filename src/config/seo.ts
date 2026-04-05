/**
 * Jobsbor SEO 全局配置文件
 * 
 * 集中管理所有SEO相关配置，包括站点信息、页面SEO、社交媒体等
 * 便于统一维护和A/B测试
 */

/**
 * 站点基础配置
 */
export const siteConfig = {
  /** 站点名称 */
  name: 'Jobsbor',
  /** 站点副标题/口号 */
  tagline: '专业的互联网、金融、Web3招聘平台',
  /** 站点描述 */
  description: 'Jobsbor是专业的互联网、金融、Web3招聘平台，汇聚顶级金融机构、科技公司、Web3项目的优质职位，精准匹配人才需求，助你找到理想工作。',
  /** 站点URL */
  url: 'https://jobsbor.vercel.app',
  /** 备用域名 */
  alternateUrl: 'https://jobsbor.com',
  /** OG图片路径 */
  ogImage: '/og-image.jpg',
  /** OG图片完整URL */
  ogImageUrl: 'https://jobsbor.vercel.app/og-image.jpg',
  /** 默认语言 */
  locale: 'zh_CN',
  /** 默认语言简写 */
  lang: 'zh-CN',
  /** 站点类型 */
  type: 'website',
  /** 主要关键词 */
  keywords: [
    '招聘',
    '互联网招聘',
    '金融招聘',
    'Web3招聘',
    '高薪职位',
    '求职',
    '找工作',
    '投行招聘',
    '区块链招聘',
    '远程工作',
    '大厂招聘',
    '应届生招聘'
  ],
  /** 作者信息 */
  author: {
    name: 'Jobsbor Team',
    url: 'https://jobsbor.vercel.app',
  },
  /** 社交媒体 */
  social: {
    twitter: '@jobsbor',
    // github: 'https://github.com/jobsbor',
    // linkedin: 'https://linkedin.com/company/jobsbor',
  },
  /** 图标配置 */
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  /** 主题颜色 */
  themeColor: '#0a0f1c',
  /** 背景颜色 */
  backgroundColor: '#0a0f1c',
  /** 应用名称 */
  applicationName: 'Jobsbor',
  /** 生成工具 */
  generator: 'Next.js',
  /** 分类 */
  category: '招聘平台',
};

/**
 * 页面SEO配置接口
 */
export interface PageSeoConfig {
  /** 页面标题（不含品牌后缀） */
  title: string;
  /** 页面描述 */
  description: string;
  /** 关键词数组 */
  keywords: string[];
  /** OG图片路径（可选） */
  ogImage?: string;
  /** OG类型 */
  ogType?: 'website' | 'article' | 'profile';
  /** 优先级（用于sitemap） */
  priority?: number;
  /** 更新频率（用于sitemap） */
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** 是否允许索引 */
  noIndex?: boolean;
  /** 规范URL（可选） */
  canonical?: string;
  /** 面包屑导航 */
  breadcrumbs?: Array<{ name: string; url: string }>;
  /** 结构化数据类型 */
  jsonLdType?: 'WebSite' | 'WebPage' | 'JobPosting' | 'Organization' | 'Article' | 'BreadcrumbList';
}

/**
 * 各页面SEO配置
 */
export const pageSeo: Record<string, PageSeoConfig> = {
  /**
   * 首页 /
   * 核心关键词：金融行业招聘、Web3招聘、互联网招聘
   */
  home: {
    title: '金融行业招聘_Web3招聘_互联网招聘高薪职位 - Jobsbor',
    description: 'Jobsbor是专业的互联网、金融、Web3招聘平台。汇聚顶级金融机构、科技公司、Web3项目优质职位，覆盖投行、券商、区块链、大厂等热门领域。精准匹配人才需求，助你找到理想工作。',
    keywords: [
      '金融行业招聘',
      'Web3招聘',
      '互联网招聘',
      '投行招聘',
      '区块链招聘',
      '远程工作',
      '求职',
      '找工作',
      '高薪职位',
      '大厂招聘',
      '应届生招聘',
      'Web3远程工作',
      '金融求职',
      '科技招聘'
    ],
    ogType: 'website',
    ogImage: '/og-image-home.jpg',
    priority: 1.0,
    changeFrequency: 'daily',
    jsonLdType: 'WebSite',
  },

  /**
   * 职位列表页 /jobs
   * 分页SEO：/jobs?page=2
   */
  jobs: {
    title: '最新招聘职位_全职兼职远程工作 - Jobsbor职位列表',
    description: '浏览Jobsbor最新招聘职位，涵盖金融、Web3、互联网等多个行业。全职、兼职、远程工作机会，支持按行业、地点、薪资等多维度筛选，精准匹配你的职业规划。',
    keywords: [
      '最新招聘',
      '职位列表',
      '全职工作',
      '兼职工作',
      '远程工作',
      '金融职位',
      'Web3职位',
      '互联网职位',
      '高薪工作',
      '急聘职位',
      '找工作',
      '求职'
    ],
    ogType: 'website',
    ogImage: '/og-image-jobs.jpg',
    priority: 0.9,
    changeFrequency: 'daily',
    jsonLdType: 'WebPage',
  },

  /**
   * 公司列表页 /companies
   * 分类SEO：按行业、规模、地区筛选
   */
  companies: {
    title: '热门招聘公司_金融互联网Web3名企 - Jobsbor公司列表',
    description: '发现热门招聘公司，了解企业详情、公司文化、福利待遇。中信证券、字节跳动、阿里巴巴、Uniswap等知名公司招聘信息，助你找到心仪雇主。',
    keywords: [
      '招聘公司',
      '热门公司',
      '企业招聘',
      '金融公司',
      '科技公司',
      '互联网公司',
      'Web3公司',
      '公司介绍',
      '名企招聘',
      '大厂招聘',
      '雇主品牌'
    ],
    ogType: 'website',
    ogImage: '/og-image-companies.jpg',
    priority: 0.8,
    changeFrequency: 'weekly',
    jsonLdType: 'WebPage',
  },

  /**
   * 求职指南 /guide
   * 内容SEO：职业指导、面试技巧
   */
  guide: {
    title: '求职指南_面试技巧_职业规划 - Jobsbor求职攻略',
    description: '专业的求职指南，涵盖简历撰写、面试技巧、职业规划、薪资谈判等实用内容。金融、互联网、Web3三大行业求职攻略，助你职场发展更上一层楼。',
    keywords: [
      '求职指南',
      '面试技巧',
      '职业规划',
      '简历优化',
      '薪资谈判',
      '求职攻略',
      '面试准备',
      '职场发展',
      '求职经验',
      '跳槽指南',
      '转行攻略'
    ],
    ogType: 'website',
    ogImage: '/og-image-guide.jpg',
    priority: 0.7,
    changeFrequency: 'weekly',
    jsonLdType: 'WebPage',
  },

  /**
   * 博客/资讯列表页 /blog
   * 内容SEO：职场资讯、行业动态
   */
  blog: {
    title: '职场资讯_面试技巧_行业动态 - Jobsbor博客',
    description: '获取最新职场资讯、面试技巧、行业动态。金融行业、Web3、互联网行业趋势分析，薪资报告，求职经验分享，助你职业发展更上一层楼。',
    keywords: [
      '职场资讯',
      '面试技巧',
      '行业动态',
      '职业规划',
      '薪资谈判',
      '简历优化',
      '金融职场',
      '科技职场',
      'Web3资讯',
      '行业趋势',
      '职场攻略'
    ],
    ogType: 'website',
    ogImage: '/og-image-blog.jpg',
    priority: 0.7,
    changeFrequency: 'weekly',
    jsonLdType: 'WebPage',
  },

  /**
   * 留言板 /guestbook
   * 交互SEO：用户互动、社区建设
   */
  guestbook: {
    title: '留言板_求职交流_意见反馈 - Jobsbor社区',
    description: 'Jobsbor留言板，与求职者交流经验、分享心得、提出建议。在这里找到志同道合的伙伴，共同探索职业发展的无限可能。',
    keywords: [
      '留言板',
      '求职交流',
      '意见反馈',
      '社区互动',
      '求职经验',
      '职场交流',
      '求职问答',
      '职业发展讨论'
    ],
    ogType: 'website',
    ogImage: '/og-image-guestbook.jpg',
    priority: 0.5,
    changeFrequency: 'weekly',
    jsonLdType: 'WebPage',
  },

  /**
   * 关于我们 /about
   * 品牌SEO：品牌故事、团队介绍
   */
  about: {
    title: '关于我们_Jobsbor专业招聘平台品牌故事',
    description: '了解Jobsbor的愿景、使命和团队。我们致力于连接优秀人才与顶尖企业，打造最专业的金融、Web3、互联网行业招聘平台。发现我们的故事和价值观。',
    keywords: [
      '关于我们',
      'Jobsbor',
      '招聘平台',
      '公司介绍',
      '团队介绍',
      '品牌故事',
      '企业愿景',
      '使命价值观',
      '关于Jobsbor'
    ],
    ogType: 'website',
    ogImage: '/og-image-about.jpg',
    priority: 0.6,
    changeFrequency: 'monthly',
    jsonLdType: 'Organization',
  },

  /**
   * 金融行业招聘 /industries/finance
   */
  finance: {
    title: '金融行业招聘_投行_券商_基金高薪职位 - Jobsbor',
    description: '专注金融行业招聘，汇聚投行、券商、基金、银行、保险等优质职位。中信证券、中金公司、高毅资产等头部机构热招中。找到你的理想金融工作。',
    keywords: [
      '金融行业招聘',
      '投行招聘',
      '券商招聘',
      '基金招聘',
      '银行招聘',
      '保险招聘',
      '分析师招聘',
      '量化招聘',
      '金融求职',
      '高薪金融职位'
    ],
    ogType: 'website',
    ogImage: '/og-image-finance.jpg',
    priority: 0.9,
    changeFrequency: 'daily',
    jsonLdType: 'WebPage',
  },

  /**
   * Web3行业招聘 /industries/web3
   */
  web3: {
    title: 'Web3招聘_区块链招聘_远程工作高薪职位 - Jobsbor',
    description: 'Web3招聘首选平台，提供区块链、智能合约、DeFi、NFT等领域职位。支持全球远程工作，Uniswap、OpenSea、Aave等顶级协议团队等你加入。',
    keywords: [
      'Web3招聘',
      '区块链招聘',
      '远程工作',
      '智能合约招聘',
      'DeFi招聘',
      'NFT招聘',
      '加密货币工作',
      'DAO招聘',
      'Web3求职',
      '全球远程职位'
    ],
    ogType: 'website',
    ogImage: '/og-image-web3.jpg',
    priority: 0.9,
    changeFrequency: 'daily',
    jsonLdType: 'WebPage',
  },

  /**
   * 互联网行业招聘 /industries/internet
   */
  internet: {
    title: '互联网招聘_产品经理_程序员_大厂职位 - Jobsbor',
    description: '互联网大厂招聘专场，阿里巴巴、腾讯、字节跳动、美团等一线公司热招。产品经理、前后端开发、算法、设计、运营等职位等你来投。',
    keywords: [
      '互联网招聘',
      '产品经理招聘',
      '程序员招聘',
      '前端招聘',
      '后端招聘',
      '算法招聘',
      '设计招聘',
      '运营招聘',
      '大厂招聘',
      '互联网求职'
    ],
    ogType: 'website',
    ogImage: '/og-image-internet.jpg',
    priority: 0.9,
    changeFrequency: 'daily',
    jsonLdType: 'WebPage',
  },

  /**
   * 搜索页面 /search
   */
  search: {
    title: '职位搜索_工作搜索_精准匹配 - Jobsbor搜索',
    description: '在Jobsbor搜索你感兴趣的职位，支持关键词、行业、地点、薪资等多维度筛选。快速找到符合你期望的工作机会。',
    keywords: [
      '职位搜索',
      '工作搜索',
      '招聘搜索',
      '找工作',
      '职位筛选',
      '智能匹配',
      '求职搜索'
    ],
    ogType: 'website',
    ogImage: '/og-image-search.jpg',
    priority: 0.6,
    changeFrequency: 'daily',
    jsonLdType: 'WebPage',
  },

  /**
   * 404页面
   */
  notFound: {
    title: '页面未找到_404 - Jobsbor',
    description: '抱歉，您访问的页面不存在。返回Jobsbor首页，发现更多金融、互联网、Web3招聘机会。',
    keywords: ['404', '页面未找到', 'Jobsbor'],
    ogType: 'website',
    noIndex: true,
    priority: 0.1,
    changeFrequency: 'never',
  },
};

/**
 * 默认SEO配置
 */
export const defaultSeo: PageSeoConfig = {
  title: 'Jobsbor - 专业的互联网、金融、Web3招聘平台',
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  ogType: 'website',
  ogImage: siteConfig.ogImage,
  priority: 0.5,
  changeFrequency: 'weekly',
  jsonLdType: 'WebPage',
};

/**
 * 获取页面SEO配置
 * @param pageKey - 页面配置键名
 * @returns 页面SEO配置对象
 */
export function getPageSeo(pageKey: keyof typeof pageSeo): PageSeoConfig {
  return pageSeo[pageKey] || defaultSeo;
}

/**
 * 生成职位详情页SEO配置
 * @param jobTitle - 职位标题
 * @param companyName - 公司名称
 * @param industry - 行业类型
 * @param location - 工作地点
 * @param salary - 薪资范围
 * @returns SEO配置对象
 */
export function generateJobSeo(
  jobTitle: string,
  companyName: string,
  industry?: 'finance' | 'web3' | 'internet',
  location?: string,
  salary?: string
): PageSeoConfig {
  const industryMap = {
    finance: '金融',
    web3: 'Web3',
    internet: '互联网',
  };
  const industryLabel = industry ? industryMap[industry] : '';
  const locationStr = location && location !== '远程' ? `_${location}` : '';
  const salaryStr = salary ? `_月薪${salary}` : '';

  return {
    title: `${jobTitle}招聘_${companyName}${locationStr}${salaryStr} - Jobsbor`,
    description: `${companyName}招聘${jobTitle}${industryLabel ? `，${industryLabel}行业优质职位` : ''}${salary ? `，薪资${salary}` : ''}。了解职位要求、薪资待遇、公司福利，立即投递简历。`,
    keywords: [
      jobTitle,
      `${companyName}招聘`,
      `${industryLabel}招聘`,
      location || '',
      '找工作',
      '求职',
      '高薪职位',
      '急聘',
    ].filter(Boolean),
    ogType: 'article',
    ogImage: '/og-image-job.jpg',
    priority: 0.8,
    changeFrequency: 'weekly',
    jsonLdType: 'JobPosting',
  };
}

/**
 * 生成公司详情页SEO配置
 * @param companyName - 公司名称
 * @param industry - 行业类型
 * @param location - 公司地点
 * @param size - 公司规模
 * @returns SEO配置对象
 */
export function generateCompanySeo(
  companyName: string,
  industry?: 'finance' | 'web3' | 'internet',
  location?: string,
  size?: string
): PageSeoConfig {
  const industryMap = {
    finance: '金融',
    web3: 'Web3',
    internet: '互联网',
  };
  const industryLabel = industry ? industryMap[industry] : '';
  const sizeStr = size ? `_${size}` : '';

  return {
    title: `${companyName}招聘_${industryLabel}公司${sizeStr}_职位列表 - Jobsbor`,
    description: `了解${companyName}公司详情、企业文化、福利待遇。查看最新招聘职位，一键投递简历。${location ? `公司位于${location}。` : ''}`,
    keywords: [
      companyName,
      `${companyName}招聘`,
      `${industryLabel}公司`,
      '企业介绍',
      '公司详情',
      '招聘信息',
      location || '',
    ].filter(Boolean),
    ogType: 'profile',
    ogImage: '/og-image-company.jpg',
    priority: 0.7,
    changeFrequency: 'weekly',
    jsonLdType: 'Organization',
  };
}

/**
 * 生成博客文章页SEO配置
 * @param postTitle - 文章标题
 * @param category - 文章分类
 * @param author - 作者名
 * @param publishedAt - 发布日期
 * @returns SEO配置对象
 */
export function generateBlogSeo(
  postTitle: string,
  category?: string,
  author?: string,
  publishedAt?: string
): PageSeoConfig {
  const categoryMap: Record<string, string> = {
    interview: '面试技巧',
    career: '职业发展',
    industry: '行业动态',
    salary: '薪资分析',
    guide: '求职攻略',
  };
  const categoryLabel = category ? categoryMap[category] || category : '职场资讯';

  return {
    title: `${postTitle}_${categoryLabel} - Jobsbor职场博客`,
    description: `${postTitle}。阅读更多职场资讯、面试技巧、行业动态，助力你的职业发展。${author ? `作者：${author}。` : ''}${publishedAt ? `发布时间：${publishedAt}。` : ''}`,
    keywords: [
      postTitle,
      categoryLabel,
      '职场资讯',
      '职业发展',
      '面试技巧',
      '求职攻略',
      '行业动态',
    ],
    ogType: 'article',
    ogImage: '/og-image-blog-post.jpg',
    priority: 0.6,
    changeFrequency: 'monthly',
    jsonLdType: 'Article',
  };
}

/**
 * 生成分类页面SEO配置（用于分页）
 * @param baseSeo - 基础SEO配置
 * @param pageNumber - 当前页码
 * @param totalPages - 总页数
 * @returns SEO配置对象
 */
export function generatePaginationSeo(
  baseSeo: PageSeoConfig,
  pageNumber: number,
  totalPages: number
): PageSeoConfig {
  if (pageNumber <= 1) return baseSeo;

  return {
    ...baseSeo,
    title: `第${pageNumber}页_${baseSeo.title}`,
    description: `${baseSeo.description} (第${pageNumber}页，共${totalPages}页)`,
    priority: Math.max(0.1, (baseSeo.priority || 0.5) - pageNumber * 0.1),
  };
}

/**
 * 生成面包屑SEO配置
 * @param breadcrumbs - 面包屑数组
 * @returns 结构化数据配置
 */
export function generateBreadcrumbSeo(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    jsonLdType: 'BreadcrumbList' as const,
    breadcrumbs,
  };
}

/**
 * 导出所有配置
 */
export default {
  site: siteConfig,
  pages: pageSeo,
  default: defaultSeo,
  getPageSeo,
  generateJobSeo,
  generateCompanySeo,
  generateBlogSeo,
  generatePaginationSeo,
  generateBreadcrumbSeo,
};
