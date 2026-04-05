import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'job'
  publishedAt?: string
  modifiedAt?: string
  author?: string
  locale?: string
  noIndex?: boolean
}

/**
 * 生成完整的SEO元数据
 * 包含Open Graph, Twitter Card, 和标准SEO标签
 */
export function generateSEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedAt,
  modifiedAt,
  author,
  locale = 'zh_CN',
  noIndex = false,
}: SEOProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobsbor.com'
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const ogImage = image || `${siteUrl}/og-image.jpg`

  return {
    title: `${title} | Jobsbor`,
    description,
    keywords: [
      '招聘',
      '求职',
      '工作',
      '金融',
      'Web3',
      '互联网',
      '高薪职位',
      ...keywords,
    ],
    authors: author ? [{ name: author }] : undefined,
    creator: 'Jobsbor',
    publisher: 'Jobsbor',
    
    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical
    alternates: {
      canonical: fullUrl,
      languages: {
        'zh-CN': `${siteUrl}/zh${url || ''}`,
        'en-US': `${siteUrl}/en${url || ''}`,
      },
    },

    // Open Graph
    openGraph: {
      type: type === 'job' ? 'article' : type,
      locale,
      url: fullUrl,
      title: `${title} | Jobsbor`,
      description,
      siteName: 'Jobsbor - 金融/Web3/互联网招聘平台',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(modifiedAt && { modifiedTime: modifiedAt }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: '@jobsbor',
      creator: '@jobsbor',
      title: `${title} | Jobsbor`,
      description,
      images: [ogImage],
    },

    // Other
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
    
    category: '招聘求职',
  }
}

/**
 * 职位页面专用的SEO元数据
 */
export function generateJobSEO({
  title,
  description,
  company,
  location,
  salary,
  slug,
  publishedAt,
  industry,
}: {
  title: string
  description: string
  company: string
  location: string
  salary: string
  slug: string
  publishedAt: string
  industry: string
}): Metadata {
  return generateSEO({
    title: `${title} - ${company}`,
    description: `${company}招聘${title}，工作地点：${location}，薪资待遇：${salary}。${description.slice(0, 100)}...`,
    keywords: [company, location, industry, '招聘', title],
    url: `/jobs/${slug}`,
    type: 'article',
    publishedAt,
    locale: 'zh_CN',
  })
}

/**
 * 首页专用的SEO元数据
 */
export function generateHomeSEO(locale: string = 'zh'): Metadata {
  const isZh = locale === 'zh'
  
  return generateSEO({
    title: isZh ? '金融/Web3/互联网招聘平台' : 'Finance/Web3/Tech Jobs',
    description: isZh 
      ? 'Jobsbor是专注于金融、Web3、互联网行业的高端招聘平台。汇聚510+优质职位，涵盖投行、区块链、产品经理等高薪岗位。'
      : 'Jobsbor is a premium job board for Finance, Web3, and Tech industries. Discover 510+ high-paying jobs in investment banking, blockchain, and product management.',
    keywords: isZh 
      ? ['招聘', '求职', '金融', 'Web3', '互联网', '高薪', '职位', '投行', '区块链']
      : ['jobs', 'finance', 'web3', 'tech', 'career', 'hiring', 'blockchain', 'investment banking'],
    url: '/',
    type: 'website',
    locale: isZh ? 'zh_CN' : 'en_US',
  })
}
