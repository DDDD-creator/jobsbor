/**
 * ServerSchema - 服务器端结构化数据组件
 * 
 * 用于在页面中注入Schema.org结构化数据，支持静态生成
 * 无需客户端JavaScript
 * 
 * @see https://schema.org/docs/schemas.html
 */

import type { ReactNode } from 'react';

// ============================================================================
// 类型定义
// ============================================================================

export type ServerSchemaType = 
  | 'JobPosting'
  | 'Organization'
  | 'WebSite'
  | 'WebPage'
  | 'BreadcrumbList'
  | 'Article';

interface BaseSchema {
  '@context': 'https://schema.org';
  '@type': string;
}

/** 职位发布Schema */
export interface ServerJobPostingSchema {
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

/** 面包屑项 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** 面包屑Schema */
export interface ServerBreadcrumbListSchema {
  type: 'BreadcrumbList';
  items: BreadcrumbItem[];
}

/** 组织Schema */
export interface ServerOrganizationSchema {
  type: 'Organization';
  name: string;
  description: string;
  logo?: string;
  url?: string;
  city?: string;
  foundedYear?: number;
  size?: string;
  industry?: string;
  sameAs?: string[];
}

/** 网站Schema */
export interface ServerWebSiteSchema {
  type: 'WebSite';
  name: string;
  description: string;
  url: string;
  searchUrl: string;
}

/** 网页Schema */
export interface ServerWebPageSchema {
  type: 'WebPage';
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

type ServerSchemaData = 
  | ServerJobPostingSchema
  | ServerBreadcrumbListSchema
  | ServerOrganizationSchema
  | ServerWebSiteSchema
  | ServerWebPageSchema;

// ============================================================================
// Schema生成器
// ============================================================================

const SITE_NAME = 'Jobsbor';
const SITE_LOGO = 'https://jobsbor.com/images/logo.png';

function generateJobPostingSchema(data: ServerJobPostingSchema): object {
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

  if (data.validThrough) jsonLd.validThrough = data.validThrough;
  if (data.workMode === 'remote') jsonLd.jobLocationType = 'TELECOMMUTE';
  
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

  if (data.applyUrl) jsonLd.directApply = true;
  if (data.experienceRequirements) jsonLd.experienceRequirements = data.experienceRequirements;
  if (data.educationRequirements) jsonLd.educationRequirements = data.educationRequirements;
  if (data.skills?.length) jsonLd.skills = data.skills.join(', ');

  return jsonLd;
}

function generateBreadcrumbListSchema(data: ServerBreadcrumbListSchema): object {
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

function generateOrganizationSchema(data: ServerOrganizationSchema): object {
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    description: data.description,
  };

  if (data.logo) jsonLd.logo = data.logo;
  if (data.url) jsonLd.url = data.url;
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

function generateWebSiteSchema(data: ServerWebSiteSchema): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    description: data.description,
    url: data.url,
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

function generateWebPageSchema(data: ServerWebPageSchema): object {
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

  return jsonLd;
}

function generateSchema(data: ServerSchemaData): object | null {
  switch (data.type) {
    case 'JobPosting':
      return generateJobPostingSchema(data);
    case 'BreadcrumbList':
      return generateBreadcrumbListSchema(data);
    case 'Organization':
      return generateOrganizationSchema(data);
    case 'WebSite':
      return generateWebSiteSchema(data);
    case 'WebPage':
      return generateWebPageSchema(data);
    default:
      return null;
  }
}

// ============================================================================
// 组件
// ============================================================================

export interface ServerSchemaProps {
  schema: ServerSchemaData;
}

/**
 * 服务器端Schema组件
 * 生成静态JSON-LD结构化数据，无需客户端JS
 */
export function ServerSchema({ schema }: ServerSchemaProps): ReactNode {
  const jsonLdData = generateSchema(schema);
  
  if (!jsonLdData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}

/**
 * 多Schema组合组件
 */
export interface MultiServerSchemaProps {
  schemas: ServerSchemaData[];
}

export function MultiServerSchema({ schemas }: MultiServerSchemaProps): ReactNode {
  return (
    <>
      {schemas.map((schema, index) => (
        <ServerSchema key={`${schema.type}-${index}`} schema={schema} />
      ))}
    </>
  );
}

export default ServerSchema;
