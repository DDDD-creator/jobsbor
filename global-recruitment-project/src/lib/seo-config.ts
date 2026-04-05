/**
 * SEO配置映射表
 * 
 * 集中管理所有页面的SEO元数据
 * 包括标题、描述、关键词等
 * 
 * 使用场景：
 * - 页面组件中直接引用
 * - 结合generateTitle等工具函数动态生成
 * - 统一管理SEO文案，便于维护和A/B测试
 */

/**
 * 页面SEO配置接口
 */
export interface PageSeoConfig {
  /** 页面标题（不含品牌后缀） */
  title: string;
  /** 页面描述 */
  description: string;
  /** 关键词（逗号分隔） */
  keywords: string;
  /** OG图片URL（可选） */
  ogImage?: string;
  /** OG类型（可选） */
  ogType?: string;
}

/**
 * 品牌名称
 */
const BRAND_NAME = 'Jobsbor';

/**
 * 页面SEO配置映射表
 */
export const pageSeoConfig: Record<string, PageSeoConfig> = {
  /**
   * 首页
   * 核心关键词：金融行业招聘、Web3招聘、互联网招聘
   */
  home: {
    title: `金融行业招聘_Web3招聘_互联网招聘_${BRAND_NAME}专业招聘平台`,
    description: `${BRAND_NAME}是专业的招聘平台，覆盖金融行业招聘、Web3招聘、互联网招聘等热门领域。汇聚顶级金融机构、科技公司优质职位，精准匹配人才需求。找金融工作、Web3远程工作、互联网大厂职位，就来${BRAND_NAME}。`,
    keywords: '金融行业招聘,Web3招聘,互联网招聘,投行招聘,区块链招聘,远程工作,求职,找工作,金融人才,科技招聘',
    ogType: 'website',
  },

  /**
   * 职位列表页（全部职位）
   */
  jobs: {
    title: `最新招聘职位_${BRAND_NAME}`,
    description: `浏览${BRAND_NAME}最新招聘职位，涵盖金融、Web3、互联网等多个行业。全职、兼职、远程工作机会，精准匹配你的职业规划。`,
    keywords: '最新招聘,职位列表,全职工作,兼职工作,远程工作,金融职位,Web3职位,互联网职位',
    ogType: 'website',
  },

  /**
   * 金融行业职位列表页
   */
  finance: {
    title: `金融行业招聘_投行_券商_基金招聘_${BRAND_NAME}`,
    description: `专注金融行业招聘，汇聚投行、券商、基金、银行、保险等优质职位。中信证券、中金公司、高毅资产等头部机构热招中。找到你的理想金融工作。`,
    keywords: '金融行业招聘,投行招聘,券商招聘,基金招聘,银行招聘,保险招聘,分析师招聘,量化招聘,金融求职',
    ogType: 'website',
  },

  /**
   * Web3行业职位列表页
   */
  web3: {
    title: `Web3招聘_区块链招聘_远程工作_${BRAND_NAME}`,
    description: `Web3招聘首选平台，提供区块链、智能合约、DeFi、NFT等领域职位。支持全球远程工作，Uniswap、OpenSea、Aave等顶级协议团队等你加入。`,
    keywords: 'Web3招聘,区块链招聘,远程工作,智能合约招聘,DeFi招聘,NFT招聘,加密货币工作,DAO招聘',
    ogType: 'website',
  },

  /**
   * 互联网行业职位列表页
   */
  internet: {
    title: `互联网招聘_产品经理_程序员招聘_${BRAND_NAME}`,
    description: `互联网大厂招聘专场，阿里巴巴、腾讯、字节跳动、美团等一线公司热招。产品经理、前后端开发、算法、设计、运营等职位等你来投。`,
    keywords: '互联网招聘,产品经理招聘,程序员招聘,前端招聘,后端招聘,算法招聘,设计招聘,运营招聘,大厂招聘',
    ogType: 'website',
  },

  /**
   * 公司列表页
   */
  companies: {
    title: `热门招聘公司_${BRAND_NAME}`,
    description: `发现热门招聘公司，了解企业详情、公司文化、福利待遇。中信证券、字节跳动、阿里巴巴、Uniswap等知名公司招聘信息。`,
    keywords: '招聘公司,热门公司,企业招聘,金融公司,科技公司,互联网公司,Web3公司,公司介绍',
    ogType: 'website',
  },

  /**
   * 博客/资讯列表页
   */
  blog: {
    title: `职场资讯_面试技巧_行业动态_${BRAND_NAME}`,
    description: `获取最新职场资讯、面试技巧、行业动态。金融行业、Web3、互联网行业趋势分析，助你职业发展更上一层楼。`,
    keywords: '职场资讯,面试技巧,行业动态,职业规划,薪资谈判,简历优化,金融职场,科技职场',
    ogType: 'website',
  },

  /**
   * 搜索页面
   */
  search: {
    title: `职位搜索_${BRAND_NAME}`,
    description: `在${BRAND_NAME}搜索你感兴趣的职位，支持关键词、行业、地点、薪资等多维度筛选。`,
    keywords: '职位搜索,工作搜索,招聘搜索,找工作',
    ogType: 'website',
  },

  /**
   * 关于我们页面
   */
  about: {
    title: `关于我们_${BRAND_NAME}专业招聘平台`,
    description: `了解${BRAND_NAME}的愿景、使命和团队。我们致力于连接优秀人才与顶尖企业，打造最专业的金融、Web3、互联网行业招聘平台。`,
    keywords: '关于我们,招聘平台,Jobsbor,公司介绍,团队介绍',
    ogType: 'website',
  },

  /**
   * 联系我们页面
   */
  contact: {
    title: `联系我们_${BRAND_NAME}`,
    description: `联系${BRAND_NAME}团队，企业招聘合作、广告投放、媒体采访等商务合作。`,
    keywords: '联系我们,商务合作,招聘合作,广告投放',
    ogType: 'website',
  },

  /**
   * 隐私政策页面
   */
  privacy: {
    title: `隐私政策_${BRAND_NAME}`,
    description: `${BRAND_NAME}隐私政策说明，了解我们如何保护您的个人信息和数据安全。`,
    keywords: '隐私政策,隐私保护,数据安全',
    ogType: 'website',
  },

  /**
   * 服务条款页面
   */
  terms: {
    title: `服务条款_${BRAND_NAME}`,
    description: `${BRAND_NAME}服务条款，使用我们服务的规则和条件。`,
    keywords: '服务条款,使用协议,用户协议',
    ogType: 'website',
  },
};

/**
 * 默认SEO配置
 * 当页面没有特定配置时使用
 */
export const defaultSeoConfig: PageSeoConfig = {
  title: BRAND_NAME,
  description: `${BRAND_NAME}是专业的招聘平台，覆盖金融行业招聘、Web3招聘、互联网招聘等热门领域。`,
  keywords: '招聘,求职,找工作,金融行业招聘,Web3招聘,互联网招聘',
  ogType: 'website',
};

/**
 * 获取页面SEO配置
 * 
 * @param pageKey - 页面配置键名
 * @returns 页面SEO配置对象
 */
export function getPageSeoConfig(pageKey: keyof typeof pageSeoConfig): PageSeoConfig {
  return pageSeoConfig[pageKey] || defaultSeoConfig;
}

/**
 * 动态生成职位详情页SEO配置
 * 
 * @param jobTitle - 职位标题
 * @param companyName - 公司名称
 * @param industry - 行业
 * @param location - 工作地点
 * @returns SEO配置对象
 */
export function generateJobSeoConfig(
  jobTitle: string,
  companyName: string,
  industry?: string,
  location?: string
): PageSeoConfig {
  const industryLabel = industry === 'finance' 
    ? '金融' 
    : industry === 'web3' 
      ? 'Web3' 
      : industry === 'internet' 
        ? '互联网' 
        : '';

  const locationStr = location ? `_${location}` : '';

  return {
    title: `${jobTitle}招聘_${companyName}${locationStr}`,
    description: `${companyName}招聘${jobTitle}，${industryLabel ? `${industryLabel}行业` : ''}优质职位。了解职位要求、薪资待遇、公司福利，立即投递简历。`,
    keywords: `${jobTitle},${companyName}招聘,${industryLabel}招聘${location ? `,${location}招聘` : ''},找工作,求职`,
    ogType: 'article',
  };
}

/**
 * 动态生成公司详情页SEO配置
 * 
 * @param companyName - 公司名称
 * @param industry - 行业
 * @param location - 公司地点
 * @returns SEO配置对象
 */
export function generateCompanySeoConfig(
  companyName: string,
  industry?: string,
  location?: string
): PageSeoConfig {
  const industryLabel = industry === 'finance' 
    ? '金融' 
    : industry === 'web3' 
      ? 'Web3' 
      : industry === 'internet' 
        ? '互联网' 
        : '';

  return {
    title: `${companyName}招聘_${industryLabel}公司_${BRAND_NAME}`,
    description: `了解${companyName}公司详情、企业文化、福利待遇。查看最新招聘职位，一键投递简历。`,
    keywords: `${companyName},${companyName}招聘,${industryLabel}公司${location ? `,${location}` : ''},企业介绍,公司详情`,
    ogType: 'profile',
  };
}

/**
 * 动态生成博客文章页SEO配置
 * 
 * @param postTitle - 文章标题
 * @param category - 文章分类
 * @returns SEO配置对象
 */
export function generateBlogSeoConfig(
  postTitle: string,
  category?: string
): PageSeoConfig {
  const categoryLabel = category === 'interview' 
    ? '面试技巧' 
    : category === 'career' 
      ? '职业发展' 
      : category === 'industry' 
        ? '行业动态' 
        : '职场资讯';

  return {
    title: `${postTitle}_${categoryLabel}_${BRAND_NAME}`,
    description: `${postTitle}。阅读更多职场资讯、面试技巧、行业动态，助力你的职业发展。`,
    keywords: `${postTitle},${categoryLabel},职场资讯,职业发展,面试技巧`,
    ogType: 'article',
  };
}

export default pageSeoConfig;
