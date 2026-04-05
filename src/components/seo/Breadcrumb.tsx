'use client';

import { LocalizedLink } from '@/components/i18n/localized-link';
import { ChevronRight, Home } from 'lucide-react';
import { JsonLd, BreadcrumbItem as JsonLdBreadcrumbItem } from './JsonLd';

/**
 * 面包屑导航项接口
 */
export interface BreadcrumbItem {
  /** 显示名称 */
  label: string;
  /** 链接URL（最后一项可为空，表示当前页面） */
  href?: string;
}

/**
 * 面包屑导航组件属性
 */
export interface BreadcrumbProps {
  /** 面包屑项列表 */
  items: BreadcrumbItem[];
  /** 是否显示首页作为根节点（默认true） */
  showHome?: boolean;
  /** 首页显示文本（默认"首页"） */
  homeLabel?: string;
  /** 是否注入JSON-LD结构化数据（默认true） */
  includeJsonLd?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 品牌名称
 */
const BRAND_NAME = 'Jobsbor';

/**
 * 站点域名
 */
const SITE_URL = 'https://jobsbor.com';

/**
 * 面包屑导航组件
 * 
 * 提供可视化的面包屑导航和JSON-LD结构化数据标记
 * 帮助用户理解当前页面位置，同时提升SEO
 * 
 * @example
 * // 基础用法
 * <Breadcrumb 
 *   items={[
 *     { label: '职位', href: '/jobs' },
 *     { label: '金融行业招聘', href: '/jobs/finance' },
 *     { label: '投资银行分析师' }
 *   ]}
 * />
 * 
 * @example
 * // 公司页面
 * <Breadcrumb 
 *   items={[
 *     { label: '公司', href: '/companies' },
 *     { label: '中信证券' }
 *   ]}
 * />
 * 
 * @example
 * // 博客文章
 * <Breadcrumb 
 *   items={[
 *     { label: '职场资讯', href: '/blog' },
 *     { label: '面试技巧', href: '/blog/category/interview' },
 *     { label: '如何准备投行面试' }
 *   ]}
 * />
 */
export function Breadcrumb({
  items,
  showHome = true,
  homeLabel = '首页',
  includeJsonLd = true,
  className = '',
}: BreadcrumbProps) {
  // 构建完整的面包屑列表（包含首页）
  const fullItems: BreadcrumbItem[] = showHome 
    ? [{ label: homeLabel, href: '/' }, ...items]
    : items;

  // 生成JSON-LD数据
  const jsonLdItems: JsonLdBreadcrumbItem[] = fullItems.map((item, index) => {
    // 最后一项如果没有href，使用当前页面URL
    const url = item.href 
      ? `${SITE_URL}${item.href}`
      : index === fullItems.length - 1 
        ? typeof window !== 'undefined' 
          ? window.location.href 
          : SITE_URL
        : SITE_URL;
    
    return {
      name: item.label,
      url,
    };
  });

  return (
    <>
      {/* JSON-LD结构化数据 */}
      {includeJsonLd && <JsonLd type="BreadcrumbList" data={jsonLdItems} />}
      
      {/* 可视化面包屑导航 */}
      <nav 
        aria-label="面包屑导航"
        className={`py-3 ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
          itemScope 
          itemType="https://schema.org/BreadcrumbList"
        >
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;
            const position = index + 1;

            return (
              <li 
                key={index}
                className="flex items-center gap-2"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                
                {isLast || !item.href ? (
                  // 当前页面（不可点击）
                  <span 
                    className="text-gray-900 dark:text-white font-medium"
                    itemProp="name"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  // 可点击链接
                  <LocalizedLink
                    href={item.href}
                    className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors duration-200 flex items-center gap-1"
                    itemProp="item"
                  >
                    {index === 0 && showHome && (
                      <Home className="w-4 h-4" />
                    )}
                    <span itemProp="name">{item.label}</span>
                  </LocalizedLink>
                )}
                
                {/* 隐藏的位置标记 */}
                <meta itemProp="position" content={String(position)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * 预定义的面包屑配置
 * 用于常见页面组合
 */
export const predefinedBreadcrumbs = {
  /** 职位列表页 */
  jobs: { label: '职位', href: '/jobs' },
  /** 金融行业职位 */
  financeJobs: { label: '金融行业招聘', href: '/industries/finance' },
  /** Web3职位 */
  web3Jobs: { label: 'Web3招聘', href: '/industries/web3' },
  /** 互联网职位 */
  internetJobs: { label: '互联网招聘', href: '/industries/internet' },
  /** 公司列表页 */
  companies: { label: '公司', href: '/companies' },
  /** 博客列表页 */
  blog: { label: '职场资讯', href: '/blog' },
};

export default Breadcrumb;
