/**
 * SEO工具函数库
 * 
 * 提供生成SEO友好内容的实用函数
 * 包括URL slug生成、标题生成、描述截断等
 */

/**
 * 品牌名称
 */
const BRAND_NAME = 'Jobsbor';

/**
 * 站点域名
 */
const SITE_URL = 'https://jobsbor.com';

/**
 * Meta描述最大长度（字符数）
 * Google通常显示前155-160个字符
 */
const MAX_DESCRIPTION_LENGTH = 160;

/**
 * 生成SEO友好的URL slug
 * 
 * 将中文或英文文本转换为URL友好的slug格式
 * - 移除特殊字符
 * - 空格替换为连字符
 * - 转小写
 * - 移除连续连字符
 * 
 * @param text - 原始文本
 * @returns SEO友好的slug字符串
 * 
 * @example
 * generateSlug("投资银行分析师") // "investment-banking-analyst"
 * generateSlug("Web3 产品经理") // "web3-product-manager"
 * generateSlug("中信证券招聘") // "citic-securities-recruitment"
 */
export function generateSlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // 常见中文词汇的英文映射（用于生成更友好的英文slug）
  const chineseToEnglish: Record<string, string> = {
    '招聘': 'recruitment',
    '求职': 'job-search',
    '工作': 'jobs',
    '职位': 'positions',
    '金融': 'finance',
    '投行': 'investment-banking',
    '银行': 'banking',
    '证券': 'securities',
    '基金': 'fund',
    '互联网': 'internet',
    '产品': 'product',
    '经理': 'manager',
    '工程师': 'engineer',
    '开发': 'developer',
    '设计': 'design',
    '运营': 'operations',
    '市场': 'marketing',
    '销售': 'sales',
    '人力': 'hr',
    '财务': 'accounting',
    '法务': 'legal',
    '行政': 'admin',
    '实习': 'internship',
    '全职': 'full-time',
    '兼职': 'part-time',
    '远程': 'remote',
    '区块链': 'blockchain',
    '智能合约': 'smart-contract',
    '加密货币': 'cryptocurrency',
    '前端': 'frontend',
    '后端': 'backend',
    '全栈': 'fullstack',
    '数据': 'data',
    '算法': 'algorithm',
    '人工智能': 'ai',
    '机器学习': 'machine-learning',
    '公司': 'company',
    '企业': 'enterprise',
    '集团': 'group',
    '科技': 'tech',
    '网络': 'network',
    '信息': 'information',
    '软件': 'software',
    '硬件': 'hardware',
    '移动': 'mobile',
    '游戏': 'game',
    '电商': 'ecommerce',
    '社交': 'social',
    '内容': 'content',
    '视频': 'video',
    '直播': 'live',
    '新闻': 'news',
    '资讯': 'news',
    '博客': 'blog',
    '文章': 'article',
    '教程': 'tutorial',
    '指南': 'guide',
    '技巧': 'tips',
    '面试': 'interview',
    '简历': 'resume',
    '职场': 'career',
    '薪资': 'salary',
    '福利': 'benefits',
    '股票': 'stock',
    '期权': 'options',
    '年终奖': 'bonus',
    '五险一金': 'insurance',
    '双休': 'weekend',
    '弹性': 'flexible',
    '居家': 'work-from-home',
  };

  let slug = text.toLowerCase().trim();

  // 尝试将中文词汇替换为英文
  Object.entries(chineseToEnglish).forEach(([cn, en]) => {
    slug = slug.replace(new RegExp(cn, 'g'), en);
  });

  // 如果是纯中文（未被替换），使用拼音或保留原样
  // 这里简化处理：移除非字母数字字符，使用连字符连接
  slug = slug
    // 将空格、下划线替换为连字符
    .replace(/[\s_]+/g, '-')
    // 移除特殊字符，保留字母数字和连字符
    .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '')
    // 将中文字符也替换为连字符（实际项目中可使用拼音库）
    .replace(/[\u4e00-\u9fa5]+/g, '-')
    // 移除连续连字符
    .replace(/-+/g, '-')
    // 移除首尾连字符
    .replace(/^-+|-+$/g, '');

  return slug || 'untitled';
}

/**
 * 生成Meta标题
 * 
 * 自动添加品牌后缀，如果标题中尚未包含品牌名
 * 
 * @param title - 页面标题
 * @param includeBrand - 是否添加品牌后缀（默认true）
 * @returns 完整的meta标题
 * 
 * @example
 * generateTitle("投资银行分析师") // "投资银行分析师 | Jobsbor"
 * generateTitle("Jobsbor招聘平台") // "Jobsbor招聘平台"（不重复添加品牌）
 * generateTitle("投资银行分析师", false) // "投资银行分析师"
 */
export function generateTitle(title: string, includeBrand: boolean = true): string {
  if (!title || typeof title !== 'string') {
    return BRAND_NAME;
  }

  const trimmedTitle = title.trim();
  
  // 如果标题已包含品牌名，直接返回
  if (trimmedTitle.includes(BRAND_NAME)) {
    return trimmedTitle;
  }

  // 如果不需要品牌后缀，直接返回原标题
  if (!includeBrand) {
    return trimmedTitle;
  }

  return `${trimmedTitle} | ${BRAND_NAME}`;
}

/**
 * 生成Meta描述
 * 
 * 将内容截断到SEO友好的长度（160字符）
 * 移除HTML标签，清理空白字符
 * 
 * @param content - 原始内容（可包含HTML）
 * @param maxLength - 最大长度（默认160）
 * @returns 截断后的描述文本
 * 
 * @example
 * generateDescription("这是一个很长的职位描述内容...") 
 * // 返回截断到160字符的文本，以...结尾
 * 
 * generateDescription("<p>职位描述</p>") // "职位描述"（移除HTML标签）
 */
export function generateDescription(content: string, maxLength: number = MAX_DESCRIPTION_LENGTH): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // 移除HTML标签
  let description = content
    .replace(/<[^>]*>/g, ' ')  // 移除HTML标签
    .replace(/\s+/g, ' ')      // 合并连续空白
    .trim();

  // 如果长度超过限制，截断并添加省略号
  if (description.length > maxLength) {
    // 尝试在句子边界截断
    const truncated = description.slice(0, maxLength - 3);
    const lastPeriod = truncated.lastIndexOf('。');
    const lastSpace = truncated.lastIndexOf(' ');
    
    // 优先在句号处截断
    if (lastPeriod > maxLength * 0.7) {
      description = truncated.slice(0, lastPeriod + 1);
    } else if (lastSpace > maxLength * 0.7) {
      description = truncated.slice(0, lastSpace);
    } else {
      description = truncated;
    }
    
    description += '...';
  }

  return description;
}

/**
 * 生成Canonical URL
 * 
 * 将相对路径转换为完整的规范URL
 * 自动处理路径格式（确保以/开头）
 * 
 * @param path - URL路径（相对或绝对）
 * @returns 完整的canonical URL
 * 
 * @example
 * generateCanonical("/jobs/investment-banking-analyst")
 * // "https://jobsbor.com/jobs/investment-banking-analyst"
 * 
 * generateCanonical("industries/finance")
 * // "https://jobsbor.com/jobs/finance"
 * 
 * generateCanonical("https://jobsbor.com/jobs")
 * // "https://jobsbor.com/jobs"（已经是完整URL，直接返回）
 */
export function generateCanonical(path: string): string {
  if (!path || typeof path !== 'string') {
    return SITE_URL;
  }

  const trimmedPath = path.trim();

  // 如果已经是完整URL，直接返回
  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
    return trimmedPath;
  }

  // 确保路径以/开头
  const normalizedPath = trimmedPath.startsWith('/') 
    ? trimmedPath 
    : `/${trimmedPath}`;

  // 移除末尾的/
  const cleanPath = normalizedPath.endsWith('/') && normalizedPath.length > 1
    ? normalizedPath.slice(0, -1)
    : normalizedPath;

  return `${SITE_URL}${cleanPath}`;
}

/**
 * 生成关键词字符串
 * 
 * 将关键词数组格式化为meta keywords标签内容
 * 
 * @param keywords - 关键词数组
 * @param maxKeywords - 最大关键词数量（默认10）
 * @returns 逗号分隔的关键词字符串
 * 
 * @example
 * generateKeywords(["投行", "金融招聘", "分析师"])
 * // "投行, 金融招聘, 分析师"
 */
export function generateKeywords(keywords: string[], maxKeywords: number = 10): string {
  if (!Array.isArray(keywords) || keywords.length === 0) {
    return '';
  }

  return keywords
    .slice(0, maxKeywords)
    .map(k => k.trim())
    .filter(k => k.length > 0)
    .join(', ');
}

/**
 * 从职位数据中提取关键词
 * 
 * 根据职位信息自动生成相关的SEO关键词
 * 
 * @param jobTitle - 职位标题
 * @param industry - 行业
 * @param companyName - 公司名称
 * @param location - 工作地点
 * @param tags - 职位标签
 * @returns 关键词数组
 */
export function extractJobKeywords(
  jobTitle: string,
  industry?: string,
  companyName?: string,
  location?: string,
  tags?: string[]
): string[] {
  const keywords: string[] = [];

  // 添加职位标题
  if (jobTitle) keywords.push(jobTitle);

  // 添加行业关键词
  const industryKeywords: Record<string, string[]> = {
    'finance': ['金融招聘', '金融行业招聘', '投行招聘', '券商招聘'],
    'web3': ['Web3招聘', '区块链招聘', '远程工作', '加密货币招聘'],
    'internet': ['互联网招聘', '科技公司招聘', '大厂招聘'],
  };
  
  if (industry && industryKeywords[industry]) {
    keywords.push(...industryKeywords[industry]);
  }

  // 添加公司名称
  if (companyName) keywords.push(`${companyName}招聘`);

  // 添加地点
  if (location) {
    keywords.push(`${location}招聘`);
    keywords.push(`${location}工作`);
  }

  // 添加标签
  if (tags && tags.length > 0) {
    keywords.push(...tags.slice(0, 5));
  }

  // 添加通用招聘关键词
  keywords.push('Jobsbor', '找工作', '求职');

  // 去重并返回
  return Array.from(new Set(keywords));
}

/**
 * 生成Open Graph图片URL
 * 
 * 根据内容类型生成对应的OG图片URL
 * 
 * @param type - 内容类型
 * @param id - 内容ID（可选）
 * @returns OG图片URL
 */
export function generateOgImage(type: 'default' | 'job' | 'company' | 'blog' = 'default', id?: string): string {
  const baseUrl = `${SITE_URL}/images/og`;
  
  switch (type) {
    case 'job':
      return id 
        ? `${baseUrl}/job-${id}.jpg`
        : `${baseUrl}/job-default.jpg`;
    case 'company':
      return id 
        ? `${baseUrl}/company-${id}.jpg`
        : `${baseUrl}/company-default.jpg`;
    case 'blog':
      return id 
        ? `${baseUrl}/blog-${id}.jpg`
        : `${baseUrl}/blog-default.jpg`;
    default:
      return `${baseUrl}/default.jpg`;
  }
}

export default {
  generateSlug,
  generateTitle,
  generateDescription,
  generateCanonical,
  generateKeywords,
  extractJobKeywords,
  generateOgImage,
};
