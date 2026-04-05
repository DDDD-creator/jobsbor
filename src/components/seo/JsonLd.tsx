import Script from 'next/script';

/**
 * JSON-LD结构化数据类型
 * 支持多种Schema.org类型
 */
export type JsonLdType = 
  | 'JobPosting'           // 职位发布
  | 'Organization'         // 组织/公司
  | 'WebSite'              // 网站
  | 'BreadcrumbList'       // 面包屑导航
  | 'Article';             // 文章/博客

/**
 * 职位发布结构化数据接口
 * 用于职位详情页的SEO优化
 * 
 * @see https://schema.org/JobPosting
 */
export interface JobPostingData {
  /** 职位标题 */
  title: string;
  /** 职位描述（HTML或纯文本） */
  description: string;
  /** 公司名称 */
  companyName: string;
  /** 公司Logo URL */
  companyLogo?: string;
  /** 公司官网 */
  companyWebsite?: string;
  /** 工作城市 */
  city: string;
  /** 就业类型：FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERNSHIP, VOLUNTEER */
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERNSHIP' | 'VOLUNTEER' | 'REMOTE';
  /** 发布日期（ISO 8601格式） */
  datePosted: string;
  /** 过期日期（可选） */
  validThrough?: string;
  /** 薪资范围 */
  salary?: {
    currency: string;      // 货币代码，如 CNY, USD
    minValue: number;
    maxValue: number;
    unit: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  };
  /** 工作类型映射 */
  jobType?: 'remote' | 'hybrid' | 'onsite';
  /** 申请链接 */
  applyUrl?: string;
}

/**
 * 组织/公司结构化数据接口
 * 用于公司详情页的SEO优化
 * 
 * @see https://schema.org/Organization
 */
export interface OrganizationData {
  /** 公司名称 */
  name: string;
  /** 公司描述 */
  description: string;
  /** 公司Logo URL */
  logo?: string;
  /** 公司官网 */
  url?: string;
  /** 公司所在城市 */
  city?: string;
  /** 成立年份 */
  foundedYear?: number;
  /** 公司规模 */
  size?: string;
  /** 行业 */
  industry?: string;
  /** 社交媒体链接 */
  sameAs?: string[];
}

/**
 * 网站搜索结构化数据接口
 * 用于首页，启用Google站点搜索框
 * 
 * @see https://schema.org/WebSite
 */
export interface WebSiteData {
  /** 网站名称 */
  name: string;
  /** 网站描述 */
  description: string;
  /** 网站URL */
  url: string;
  /** 搜索页面URL，需包含{search_term_string}占位符 */
  searchUrl: string;
}

/**
 * 面包屑导航项
 */
export interface BreadcrumbItem {
  /** 显示名称 */
  name: string;
  /** 链接URL */
  url: string;
}

/**
 * 文章结构化数据接口
 * 用于博客文章页的SEO优化
 * 
 * @see https://schema.org/Article
 */
export interface ArticleData {
  /** 文章标题 */
  title: string;
  /** 文章描述 */
  description: string;
  /** 文章正文（HTML或纯文本） */
  content?: string;
  /** 作者名称 */
  authorName: string;
  /** 发布日期 */
  publishedAt: string;
  /** 修改日期（可选） */
  modifiedAt?: string;
  /** 封面图片URL */
  coverImage?: string;
  /** 文章URL */
  url: string;
}

/**
 * 生成职位发布JSON-LD
 */
function generateJobPostingJsonLd(data: JobPostingData): object {
  const employmentTypeMap: Record<string, string> = {
    'FULL_TIME': 'FULL_TIME',
    'PART_TIME': 'PART_TIME',
    'CONTRACT': 'CONTRACT',
    'TEMPORARY': 'TEMPORARY',
    'INTERNSHIP': 'INTERNSHIP',
    'VOLUNTEER': 'VOLUNTEER',
    'REMOTE': 'FULL_TIME', // Remote是一种工作方式，不是employmentType
  };

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': data.title,
    'description': data.description,
    'hiringOrganization': {
      '@type': 'Organization',
      'name': data.companyName,
      ...(data.companyLogo && { 'logo': data.companyLogo }),
      ...(data.companyWebsite && { 'url': data.companyWebsite }),
    },
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': data.city,
        'addressCountry': 'CN',
      },
    },
    'employmentType': employmentTypeMap[data.employmentType] || 'FULL_TIME',
    'datePosted': data.datePosted,
    ...(data.validThrough && { 'validThrough': data.validThrough }),
    ...(data.jobType === 'remote' && {
      'jobLocationType': 'TELECOMMUTE',
    }),
  };

  // 添加薪资信息
  if (data.salary) {
    jsonLd.baseSalary = {
      '@type': 'MonetaryAmount',
      'currency': data.salary.currency,
      'value': {
        '@type': 'QuantitativeValue',
        'minValue': data.salary.minValue,
        'maxValue': data.salary.maxValue,
        'unitText': data.salary.unit,
      },
    };
  }

  // 添加申请链接
  if (data.applyUrl) {
    jsonLd.directApply = true;
  }

  return jsonLd;
}

/**
 * 生成组织/公司JSON-LD
 */
function generateOrganizationJsonLd(data: OrganizationData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': data.name,
    'description': data.description,
    ...(data.logo && { 'logo': data.logo }),
    ...(data.url && { 'url': data.url }),
    ...(data.city && {
      'location': {
        '@type': 'Place',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': data.city,
          'addressCountry': 'CN',
        },
      },
    }),
    ...(data.foundedYear && { 'foundingDate': `${data.foundedYear}` }),
    ...(data.size && {
      'numberOfEmployees': {
        '@type': 'QuantitativeValue',
        'name': data.size,
      },
    }),
    ...(data.industry && { 'industry': data.industry }),
    ...(data.sameAs && { 'sameAs': data.sameAs }),
  };
}

/**
 * 生成网站JSON-LD（含搜索框Action）
 */
function generateWebSiteJsonLd(data: WebSiteData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': data.name,
    'description': data.description,
    'url': data.url,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': data.searchUrl,
      },
      'query-input': {
        '@type': 'PropertyValueSpecification',
        'valueRequired': true,
        'valueName': 'search_term_string',
      },
    },
  };
}

/**
 * 生成面包屑导航JSON-LD
 */
function generateBreadcrumbJsonLd(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  };
}

/**
 * 生成文章JSON-LD
 */
function generateArticleJsonLd(data: ArticleData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': data.title,
    'description': data.description,
    ...(data.content && { 'articleBody': data.content }),
    'author': {
      '@type': 'Person',
      'name': data.authorName,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Jobsbor',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://jobsbor.com/images/logo.png',
      },
    },
    'datePublished': data.publishedAt,
    ...(data.modifiedAt && { 'dateModified': data.modifiedAt }),
    ...(data.coverImage && {
      'image': {
        '@type': 'ImageObject',
        'url': data.coverImage,
      },
    }),
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': data.url,
    },
  };
}

/**
 * JSON-LD组件属性
 */
export interface JsonLdProps {
  /** 结构化数据类型 */
  type: JsonLdType;
  /** 数据对象 */
  data: JobPostingData | OrganizationData | WebSiteData | BreadcrumbItem[] | ArticleData;
}

/**
 * JSON-LD结构化数据组件
 * 
 * 用于在页面中注入Schema.org结构化数据，帮助搜索引擎理解页面内容
 * 支持职位发布、公司信息、网站搜索、面包屑导航、文章等多种类型
 * 
 * @example
 * // 职位详情页
 * <JsonLd 
 *   type="JobPosting"
 *   data={{
 *     title: "投资银行分析师",
 *     description: "职位描述...",
 *     companyName: "中信证券",
 *     city: "北京",
 *     employmentType: "FULL_TIME",
 *     datePosted: "2024-03-15",
 *     salary: { currency: "CNY", minValue: 25000, maxValue: 40000, unit: "MONTH" }
 *   }}
 * />
 * 
 * @example
 * // 首页网站搜索
 * <JsonLd 
 *   type="WebSite"
 *   data={{
 *     name: "Jobsbor",
 *     description: "专业的招聘平台...",
 *     url: "https://jobsbor.com",
 *     searchUrl: "https://jobsbor.com/jobs?q={search_term_string}"
 *   }}
 * />
 */
export function JsonLd({ type, data }: JsonLdProps) {
  let jsonLdData: object;

  switch (type) {
    case 'JobPosting':
      jsonLdData = generateJobPostingJsonLd(data as JobPostingData);
      break;
    case 'Organization':
      jsonLdData = generateOrganizationJsonLd(data as OrganizationData);
      break;
    case 'WebSite':
      jsonLdData = generateWebSiteJsonLd(data as WebSiteData);
      break;
    case 'BreadcrumbList':
      jsonLdData = generateBreadcrumbJsonLd(data as BreadcrumbItem[]);
      break;
    case 'Article':
      jsonLdData = generateArticleJsonLd(data as ArticleData);
      break;
    default:
      return null;
  }

  return (
    <Script
      id={`jsonld-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}

export default JsonLd;
