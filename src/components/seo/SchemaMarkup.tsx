import Script from 'next/script';

/**
 * SchemaMarkup - 全面的结构化数据组件
 * 
 * 提供招聘平台所需的完整Schema.org结构化数据支持：
 * - JobPosting: 职位发布
 * - Organization: 公司/组织信息
 * - WebSite: 网站信息（含搜索功能）
 * - WebPage: 网页基本信息
 * - BreadcrumbList: 面包屑导航
 * - Article: 博客文章
 * - FAQPage: FAQ页面
 * - ItemList: 列表页（职位列表、公司列表）
 * - LocalBusiness: 本地企业
 * 
 * @see https://schema.org/docs/schemas.html
 */

// ============================================================================
// 类型定义
// ============================================================================

export type SchemaType = 
  | 'JobPosting'
  | 'Organization'
  | 'WebSite'
  | 'WebPage'
  | 'BreadcrumbList'
  | 'Article'
  | 'FAQPage'
  | 'ItemList'
  | 'LocalBusiness'
  | 'ContactPage'
  | 'AboutPage'
  | 'SearchResultsPage';

/** 职位发布结构化数据 */
export interface JobPostingSchema {
  type: 'JobPosting';
  title: string;
  description: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  city: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERNSHIP';
  workMode?: 'onsite' | 'remote' | 'hybrid';
  datePosted: string;
  validThrough?: string;
  salary?: {
    currency: string;
    minValue: number;
    maxValue: number;
    unit: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  };
  applyUrl?: string;
  experienceRequirements?: string;
  educationRequirements?: string;
  skills?: string[];
}

/** 组织/公司结构化数据 */
export interface OrganizationSchema {
  type: 'Organization';
  name: string;
  description: string;
  logo?: string;
  url?: string;
  city?: string;
  foundedYear?: number;
  size?: string;
  industry?: string;
  email?: string;
  phone?: string;
  sameAs?: string[];
}

/** 网站结构化数据 */
export interface WebSiteSchema {
  type: 'WebSite';
  name: string;
  description: string;
  url: string;
  searchUrl: string;
  author?: string;
  publisher?: string;
}

/** 网页结构化数据 */
export interface WebPageSchema {
  type: 'WebPage';
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  speakable?: {
    cssSelector: string[];
  };
}

/** 面包屑项 */
export interface BreadcrumbSchemaItem {
  name: string;
  url: string;
}

/** 面包屑结构化数据 */
export interface BreadcrumbListSchema {
  type: 'BreadcrumbList';
  items: BreadcrumbSchemaItem[];
}

/** 文章结构化数据 */
export interface ArticleSchema {
  type: 'Article';
  title: string;
  description: string;
  content?: string;
  authorName: string;
  authorUrl?: string;
  publishedAt: string;
  modifiedAt?: string;
  coverImage?: string;
  url: string;
  category?: string;
  tags?: string[];
}

/** FAQ项 */
export interface FAQItem {
  question: string;
  answer: string;
}

/** FAQ页面结构化数据 */
export interface FAQPageSchema {
  type: 'FAQPage';
  faqs: FAQItem[];
}

/** 列表项 */
export interface ListItemData {
  name: string;
  url: string;
  description?: string;
}

/** 列表页结构化数据 */
export interface ItemListSchema {
  type: 'ItemList';
  itemListElement: ListItemData[];
}

/** 本地企业结构化数据 */
export interface LocalBusinessSchema {
  type: 'LocalBusiness';
  name: string;
  description: string;
  image?: string;
  url?: string;
  address: {
    street?: string;
    city: string;
    region?: string;
    postalCode?: string;
    country: string;
  };
  telephone?: string;
  email?: string;
  openingHours?: string[];
  priceRange?: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
}

/** 联系页面结构化数据 */
export interface ContactPageSchema {
  type: 'ContactPage';
  title: string;
  description: string;
  url: string;
}

/** 关于页面结构化数据 */
export interface AboutPageSchema {
  type: 'AboutPage';
  title: string;
  description: string;
  url: string;
}

/** 搜索结果页面结构化数据 */
export interface SearchResultsPageSchema {
  type: 'SearchResultsPage';
  title: string;
  description: string;
  url: string;
  query: string;
  totalResults: number;
}

type SchemaData = 
  | JobPostingSchema
  | OrganizationSchema
  | WebSiteSchema
  | WebPageSchema
  | BreadcrumbListSchema
  | ArticleSchema
  | FAQPageSchema
  | ItemListSchema
  | LocalBusinessSchema
  | ContactPageSchema
  | AboutPageSchema
  | SearchResultsPageSchema;

// ============================================================================
// 生成器函数
// ============================================================================

const SITE_NAME = 'Jobsbor';
const SITE_LOGO = 'https://jobsbor.com/images/logo.png';

/** 生成JobPosting结构化数据 */
function generateJobPosting(data: JobPostingSchema): object {
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: data.title,
    description: data.description,
    hiringOrganization: {
      '@type': 'Organization',
      name: data.companyName,
      logo: data.companyLogo || SITE_LOGO,
      url: data.companyWebsite,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: data.city,
        addressCountry: 'CN',
      },
    },
    employmentType: data.employmentType,
    datePosted: data.datePosted,
  };

  if (data.validThrough) {
    jsonLd.validThrough = data.validThrough;
  }

  if (data.workMode === 'remote') {
    jsonLd.jobLocationType = 'TELECOMMUTE';
  }

  if (data.salary) {
    jsonLd.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: data.salary.currency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: data.salary.minValue,
        maxValue: data.salary.maxValue,
        unitText: data.salary.unit,
      },
    };
  }

  if (data.applyUrl) {
    jsonLd.directApply = true;
  }

  if (data.experienceRequirements) {
    jsonLd.experienceRequirements = data.experienceRequirements;
  }

  if (data.educationRequirements) {
    jsonLd.educationRequirements = data.educationRequirements;
  }

  if (data.skills && data.skills.length > 0) {
    jsonLd.skills = data.skills.join(', ');
  }

  return jsonLd;
}

/** 生成Organization结构化数据 */
function generateOrganization(data: OrganizationSchema): object {
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    description: data.description,
  };

  if (data.logo) jsonLd.logo = data.logo;
  if (data.url) jsonLd.url = data.url;
  if (data.email) jsonLd.email = data.email;
  if (data.phone) jsonLd.telephone = data.phone;
  if (data.foundedYear) jsonLd.foundingDate = `${data.foundedYear}`;
  if (data.industry) jsonLd.industry = data.industry;
  if (data.sameAs) jsonLd.sameAs = data.sameAs;

  if (data.city) {
    jsonLd.location = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: data.city,
        addressCountry: 'CN',
      },
    };
  }

  if (data.size) {
    jsonLd.numberOfEmployees = {
      '@type': 'QuantitativeValue',
      name: data.size,
    };
  }

  return jsonLd;
}

/** 生成WebSite结构化数据 */
function generateWebSite(data: WebSiteSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    description: data.description,
    url: data.url,
    author: data.author || SITE_NAME,
    publisher: data.publisher || SITE_NAME,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: data.searchUrl,
      },
      'query-input': {
        '@type': 'PropertyValueSpecification',
        valueRequired: true,
        valueName: 'search_term_string',
      },
    },
  };
}

/** 生成WebPage结构化数据 */
function generateWebPage(data: WebPageSchema): object {
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data.title,
    description: data.description,
    url: data.url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: data.url.split('/').slice(0, 3).join('/'),
    },
  };

  if (data.image) jsonLd.image = data.image;
  if (data.datePublished) jsonLd.datePublished = data.datePublished;
  if (data.dateModified) jsonLd.dateModified = data.dateModified;
  if (data.author) jsonLd.author = { '@type': 'Person', name: data.author };
  if (data.speakable) jsonLd.speakable = data.speakable;

  return jsonLd;
}

/** 生成BreadcrumbList结构化数据 */
function generateBreadcrumbList(data: BreadcrumbListSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** 生成Article结构化数据 */
function generateArticle(data: ArticleSchema): object {
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    url: data.url,
    author: {
      '@type': data.authorUrl ? 'Organization' : 'Person',
      name: data.authorName,
      ...(data.authorUrl && { url: data.authorUrl }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: SITE_LOGO,
      },
    },
    datePublished: data.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
  };

  if (data.content) jsonLd.articleBody = data.content;
  if (data.modifiedAt) jsonLd.dateModified = data.modifiedAt;
  if (data.coverImage) jsonLd.image = data.coverImage;
  if (data.category) jsonLd.articleSection = data.category;
  if (data.tags) jsonLd.keywords = data.tags.join(', ');

  return jsonLd;
}

/** 生成FAQPage结构化数据 */
function generateFAQPage(data: FAQPageSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** 生成ItemList结构化数据 */
function generateItemList(data: ItemListSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: data.itemListElement.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.description && { description: item.description }),
    })),
  };
}

/** 生成LocalBusiness结构化数据 */
function generateLocalBusiness(data: LocalBusinessSchema): object {
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    description: data.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.address.city,
      addressCountry: data.address.country,
      ...(data.address.street && { streetAddress: data.address.street }),
      ...(data.address.region && { addressRegion: data.address.region }),
      ...(data.address.postalCode && { postalCode: data.address.postalCode }),
    },
  };

  if (data.image) jsonLd.image = data.image;
  if (data.url) jsonLd.url = data.url;
  if (data.telephone) jsonLd.telephone = data.telephone;
  if (data.email) jsonLd.email = data.email;
  if (data.openingHours) jsonLd.openingHours = data.openingHours;
  if (data.priceRange) jsonLd.priceRange = data.priceRange;

  if (data.geo) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: data.geo.latitude,
      longitude: data.geo.longitude,
    };
  }

  return jsonLd;
}

/** 生成ContactPage结构化数据 */
function generateContactPage(data: ContactPageSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: data.title,
    description: data.description,
    url: data.url,
  };
}

/** 生成AboutPage结构化数据 */
function generateAboutPage(data: AboutPageSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: data.title,
    description: data.description,
    url: data.url,
  };
}

/** 生成SearchResultsPage结构化数据 */
function generateSearchResultsPage(data: SearchResultsPageSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: data.title,
    description: data.description,
    url: data.url,
    about: {
      '@type': 'Thing',
      name: data.query,
    },
    totalResults: data.totalResults,
  };
}

// ============================================================================
// 组件属性
// ============================================================================

export interface SchemaMarkupProps {
  /** 结构化数据类型 */
  schema: SchemaData;
  /** 是否启用调试模式（打印生成的JSON-LD） */
  debug?: boolean;
}

// ============================================================================
// 主组件
// ============================================================================

/**
 * SchemaMarkup - 全面的Schema.org结构化数据组件
 * 
 * 支持12种结构化数据类型，满足招聘平台的完整SEO需求：
 * - JobPosting: 职位详情页，提高在Google Jobs中的展示
 * - Organization: 公司信息页，展示企业形象
 * - WebSite: 首页，启用站点搜索功能
 * - WebPage: 所有页面，定义页面基本信息
 * - BreadcrumbList: 面包屑导航，改善搜索结果展示
 * - Article: 博客文章，提高内容可读性
 * - FAQPage: FAQ页面，启用富媒体搜索结果
 * - ItemList: 列表页，职位/公司列表
 * - LocalBusiness: 本地企业信息
 * - ContactPage: 联系页面
 * - AboutPage: 关于页面
 * - SearchResultsPage: 搜索结果页
 * 
 * @example
 * // 职位详情页
 * <SchemaMarkup schema={{
 *   type: 'JobPosting',
 *   title: '高级前端工程师',
 *   description: '负责核心业务前端开发...',
 *   companyName: '字节跳动',
 *   city: '北京',
 *   employmentType: 'FULL_TIME',
 *   datePosted: '2024-04-01',
 *   salary: { currency: 'CNY', minValue: 30000, maxValue: 50000, unit: 'MONTH' }
 * }} />
 * 
 * @example
 * // 公司信息页
 * <SchemaMarkup schema={{
 *   type: 'Organization',
 *   name: '腾讯科技',
 *   description: '全球领先的互联网科技公司...',
 *   city: '深圳',
 *   foundedYear: 1998,
 *   size: '10000+',
 *   industry: '互联网'
 * }} />
 * 
 * @example
 * // 首页
 * <SchemaMarkup schema={{
 *   type: 'WebSite',
 *   name: 'Jobsbor',
 *   description: '专业的招聘平台，连接优秀人才与顶尖企业',
 *   url: 'https://jobsbor.com',
 *   searchUrl: 'https://jobsbor.com/jobs?q={search_term_string}'
 * }} />
 */
export function SchemaMarkup({ schema, debug = false }: SchemaMarkupProps) {
  let jsonLdData: object;

  switch (schema.type) {
    case 'JobPosting':
      jsonLdData = generateJobPosting(schema);
      break;
    case 'Organization':
      jsonLdData = generateOrganization(schema);
      break;
    case 'WebSite':
      jsonLdData = generateWebSite(schema);
      break;
    case 'WebPage':
      jsonLdData = generateWebPage(schema);
      break;
    case 'BreadcrumbList':
      jsonLdData = generateBreadcrumbList(schema);
      break;
    case 'Article':
      jsonLdData = generateArticle(schema);
      break;
    case 'FAQPage':
      jsonLdData = generateFAQPage(schema);
      break;
    case 'ItemList':
      jsonLdData = generateItemList(schema);
      break;
    case 'LocalBusiness':
      jsonLdData = generateLocalBusiness(schema);
      break;
    case 'ContactPage':
      jsonLdData = generateContactPage(schema);
      break;
    case 'AboutPage':
      jsonLdData = generateAboutPage(schema);
      break;
    case 'SearchResultsPage':
      jsonLdData = generateSearchResultsPage(schema);
      break;
    default:
      return null;
  }

  if (debug) {
    console.log('[SchemaMarkup] Generated JSON-LD:', jsonLdData);
  }

  return (
    <Script
      id={`schema-${schema.type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}

/**
 * 多Schema组合组件
 * 
 * 用于需要同时注入多个结构化数据的页面
 */
export interface MultiSchemaMarkupProps {
  schemas: SchemaData[];
}

export function MultiSchemaMarkup({ schemas }: MultiSchemaMarkupProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <SchemaMarkup key={`${schema.type}-${index}`} schema={schema} />
      ))}
    </>
  );
}

export default SchemaMarkup;
