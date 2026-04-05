import Head from 'next/head';

/**
 * MetaTags 组件属性接口
 * 用于动态生成页面的SEO相关Meta标签
 */
export interface MetaTagsProps {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  description: string;
  /** 关键词（可选） */
  keywords?: string;
  /** Open Graph图片URL（可选） */
  ogImage?: string;
  /** Open Graph类型（可选，默认website） */
  ogType?: string;
  /** 规范URL（可选） */
  canonical?: string;
  /** 是否不索引此页面（可选） */
  noIndex?: boolean;
}

/**
 * 品牌名称
 */
const BRAND_NAME = 'Jobsbor';

/**
 * 默认OG图片
 */
const DEFAULT_OG_IMAGE = 'https://jobsbor.com/images/og-default.jpg';

/**
 * 网站域名
 */
const SITE_URL = 'https://jobsbor.com';

/**
 * MetaTags 组件
 * 
 * 可复用的SEO Meta标签组件，支持动态生成各类SEO标签：
 * - 基础Meta标签（title, description, keywords）
 * - Open Graph标签（Facebook, LinkedIn等社交平台用）
 * - Twitter Card标签
 * - Canonical链接
 * 
 * @example
 * ```tsx
 * <MetaTags 
 *   title="投资银行分析师招聘"
 *   description="中信证券招聘投资银行分析师，月薪25k-40k..."
 *   keywords="投行招聘,金融招聘,分析师"
 *   canonical="https://jobsbor.com/jobs/investment-banking-analyst"
 * />
 * ```
 */
export function MetaTags({
  title,
  description,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  canonical,
  noIndex = false,
}: MetaTagsProps) {
  // 自动添加品牌后缀到title
  const fullTitle = title.includes(BRAND_NAME) 
    ? title 
    : `${title} | ${BRAND_NAME}`;

  // 截断description到160字符（SEO最佳实践）
  const truncatedDescription = description.length > 160 
    ? `${description.slice(0, 157)}...` 
    : description;

  // 生成完整的canonical URL
  const fullCanonical = canonical?.startsWith('http') 
    ? canonical 
    : canonical ? `${SITE_URL}${canonical}` : undefined;

  return (
    <Head>
      {/* 基础Meta标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={truncatedDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* 机器人控制 */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph标签 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      <meta property="og:site_name" content={BRAND_NAME} />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter Card标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={truncatedDescription} />
      <meta name="twitter:image" content={ogImage} />
      {/* 如有Twitter账号，可取消注释 */}
      {/* <meta name="twitter:site" content="@jobsbor" /> */}
      {/* <meta name="twitter:creator" content="@jobsbor" /> */}
      
      {/* Canonical链接 - 防止重复内容问题 */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* 移动设备优化 */}
      <meta name="format-detection" content="telephone=no" />
      
      {/* 主题颜色（浏览器地址栏） */}
      <meta name="theme-color" content="#2563eb" />
    </Head>
  );
}

export default MetaTags;
