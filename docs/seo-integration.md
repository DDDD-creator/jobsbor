# Jobsbor SEO 集成说明

本文档说明如何将SEO组件集成到各个页面中。

---

## 已创建的文件清单

### 1. SEO组件 (`src/components/seo/`)

| 文件 | 功能 | 使用场景 |
|------|------|---------|
| `MetaTags.tsx` | Meta标签管理 | 所有页面 |
| `JsonLd.tsx` | JSON-LD结构化数据 | 职位/公司/文章页 |
| `Breadcrumb.tsx` | 面包屑导航 | 所有内容页 |
| `index.ts` | 统一导出 | 组件导入 |

### 2. SEO工具库 (`src/lib/seo/`)

| 文件 | 功能 |
|------|------|
| `seo.ts` | SEO工具函数（slug生成、标题生成等） |
| `seo-config.ts` | 页面SEO配置映射表 |
| `index.ts` | 统一导出 |

### 3. SEO配置文件

| 文件 | 功能 |
|------|------|
| `src/app/sitemap.ts` | 动态sitemap生成 |
| `src/app/robots.ts` | robots.txt配置 |

### 4. 文档 (`docs/`)

| 文件 | 内容 |
|------|------|
| `seo-checklist.md` | 语义化HTML检查清单 |
| `seo-guide.md` | SEO优化实践指南 |

---

## 页面集成示例

### 1. 更新根布局 `src/app/layout.tsx`

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getPageSeoConfig } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

// 使用配置中心获取首页SEO配置
const homeSeo = getPageSeoConfig('home');

export const metadata: Metadata = {
  title: homeSeo.title,
  description: homeSeo.description,
  keywords: homeSeo.keywords,
  metadataBase: new URL('https://jobsbor.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: homeSeo.title,
    description: homeSeo.description,
    url: 'https://jobsbor.com',
    siteName: 'Jobsbor',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: homeSeo.title,
    description: homeSeo.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### 2. 首页 `src/app/page.tsx`

```tsx
import { JsonLd, Breadcrumb } from '@/components/seo';
import { getPageSeoConfig, generateCanonical } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: getPageSeoConfig('home').title,
  description: getPageSeoConfig('home').description,
  alternates: {
    canonical: generateCanonical('/'),
  },
};

export default function HomePage() {
  // 网站结构化数据
  const websiteData = {
    name: 'Jobsbor',
    description: '专业的金融行业招聘、Web3招聘、互联网招聘平台',
    url: 'https://jobsbor.com',
    searchUrl: 'https://jobsbor.com/jobs?q={search_term_string}',
  };

  return (
    <>
      {/* 网站结构化数据 - 启用Google站点搜索 */}
      <JsonLd type="WebSite" data={websiteData} />
      
      {/* 面包屑（首页可省略或使用简化版） */}
      <Breadcrumb items={[{ label: '首页' }]} showHome={false} />
      
      {/* 页面内容 */}
      <main>
        <h1>Jobsbor - 金融行业招聘_Web3招聘_互联网招聘</h1>
        {/* 其他内容 */}
      </main>
    </>
  );
}
```

### 3. 职位分类页 `src/app/jobs/page.tsx`

```tsx
import { Breadcrumb } from '@/components/seo';
import { getPageSeoConfig, generateCanonical } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: getPageSeoConfig('jobs').title,
  description: getPageSeoConfig('jobs').description,
  alternates: {
    canonical: generateCanonical('/jobs'),
  },
};

export default function JobsPage() {
  return (
    <>
      <Breadcrumb items={[{ label: '职位' }]} />
      
      <main>
        <h1>最新招聘职位</h1>
        {/* 职位列表 */}
      </main>
    </>
  );
}
```

### 4. 职位详情页 `src/app/jobs/[slug]/page.tsx`

```tsx
import { notFound } from 'next/navigation';
import { JsonLd, Breadcrumb } from '@/components/seo';
import { generateJobSeoConfig, generateCanonical } from '@/lib/seo';
import { getJobBySlug } from '@/data/jobs';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

// 动态生成Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = getJobBySlug(params.slug);
  if (!job) return {};

  const seoConfig = generateJobSeoConfig(
    job.title,
    job.company,
    job.industry,
    job.location
  );

  return {
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    alternates: {
      canonical: generateCanonical(`/jobs/${params.slug}`),
    },
  };
}

export default function JobDetailPage({ params }: Props) {
  const job = getJobBySlug(params.slug);
  if (!job) return notFound();

  // 准备职位结构化数据
  const jobPostingData = {
    title: job.title,
    description: job.description,
    companyName: job.company,
    city: job.location.split('/')[0],
    employmentType: job.type === 'remote' ? 'REMOTE' : 'FULL_TIME',
    datePosted: job.publishedAt,
    salary: {
      currency: 'CNY',
      minValue: job.salaryMin,
      maxValue: job.salaryMax,
      unit: 'MONTH' as const,
    },
  };

  // 行业标签映射
  const industryLabel = {
    finance: '金融行业招聘',
    web3: 'Web3招聘',
    internet: '互联网招聘',
  }[job.industry];

  return (
    <>
      {/* 职位结构化数据 */}
      <JsonLd type="JobPosting" data={jobPostingData} />
      
      {/* 面包屑导航 */}
      <Breadcrumb
        items={[
          { label: '职位', href: '/jobs' },
          { label: industryLabel, href: `/jobs/${job.industry}` },
          { label: job.title },
        ]}
      />
      
      <main>
        <article>
          <header>
            <h1>{job.title}</h1>
            <p>{job.company} · {job.location}</p>
          </header>
          
          <section>
            <h2>职位描述</h2>
            <p>{job.description}</p>
          </section>
          
          <section>
            <h2>任职要求</h2>
            <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
          </section>
          
          <section>
            <h2>薪资福利</h2>
            <p>{job.salaryMin}-{job.salaryMax} {job.salaryCurrency}</p>
          </section>
        </article>
      </main>
    </>
  );
}
```

### 5. 公司详情页 `src/app/companies/[slug]/page.tsx`

```tsx
import { notFound } from 'next/navigation';
import { JsonLd, Breadcrumb } from '@/components/seo';
import { generateCompanySeoConfig, generateCanonical } from '@/lib/seo';
import { getCompanyBySlug } from '@/data/companies';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const company = getCompanyBySlug(params.slug);
  if (!company) return {};

  const seoConfig = generateCompanySeoConfig(
    company.name,
    company.industry,
    company.location
  );

  return {
    title: seoConfig.title,
    description: seoConfig.description,
    alternates: {
      canonical: generateCanonical(`/companies/${params.slug}`),
    },
  };
}

export default function CompanyPage({ params }: Props) {
  const company = getCompanyBySlug(params.slug);
  if (!company) return notFound();

  // 准备公司结构化数据
  const organizationData = {
    name: company.name,
    description: company.description,
    logo: company.logo,
    url: company.website,
    city: company.location,
    foundedYear: company.foundedYear,
    size: company.size,
    industry: company.industry,
  };

  return (
    <>
      {/* 公司结构化数据 */}
      <JsonLd type="Organization" data={organizationData} />
      
      {/* 面包屑 */}
      <Breadcrumb
        items={[
          { label: '公司', href: '/companies' },
          { label: company.name },
        ]}
      />
      
      <main>
        <article>
          <header>
            <h1>{company.name}</h1>
            {company.logo && (
              <img src={company.logo} alt={`${company.name}公司Logo`} />
            )}
          </header>
          
          <section>
            <h2>公司简介</h2>
            <p>{company.description}</p>
          </section>
          
          <section>
            <h2>公司信息</h2>
            <dl>
              <dt>行业</dt>
              <dd>{company.industry}</dd>
              <dt>规模</dt>
              <dd>{company.size}</dd>
              <dt>地点</dt>
              <dd>{company.location}</dd>
            </dl>
          </section>
        </article>
      </main>
    </>
  );
}
```

### 6. 博客文章页 `src/app/blog/[slug]/page.tsx`

```tsx
import { notFound } from 'next/navigation';
import { JsonLd, Breadcrumb } from '@/components/seo';
import { generateBlogSeoConfig, generateCanonical } from '@/lib/seo';
import { getPostBySlug } from '@/data/posts';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const seoConfig = generateBlogSeoConfig(post.title);

  return {
    title: seoConfig.title,
    description: post.excerpt || seoConfig.description,
    alternates: {
      canonical: generateCanonical(`/blog/${params.slug}`),
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  // 准备文章结构化数据
  const articleData = {
    title: post.title,
    description: post.excerpt,
    content: post.content,
    authorName: post.author || 'Jobsbor内容团队',
    publishedAt: post.publishedAt,
    coverImage: post.coverImage,
    url: `https://jobsbor.com/blog/${post.slug}`,
  };

  return (
    <>
      {/* 文章结构化数据 */}
      <JsonLd type="Article" data={articleData} />
      
      {/* 面包屑 */}
      <Breadcrumb
        items={[
          { label: '职场资讯', href: '/blog' },
          { label: post.title },
        ]}
      />
      
      <main>
        <article>
          <header>
            <h1>{post.title}</h1>
            <div>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
              </time>
              {post.author && <span> · {post.author}</span>}
            </div>
          </header>
          
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
    </>
  );
}
```

---

## API 快速参考

### MetaTags 组件

```tsx
import { MetaTags } from '@/components/seo';

<MetaTags
  title="页面标题"
  description="页面描述"
  keywords="关键词1, 关键词2"
  ogImage="https://jobsbor.com/images/og.jpg"
  ogType="article"
  canonical="/jobs/example"
  noIndex={false}
/>
```

### JsonLd 组件

```tsx
import { JsonLd } from '@/components/seo';

// 职位
<JsonLd type="JobPosting" data={{
  title: '...',
  description: '...',
  companyName: '...',
  city: '...',
  employmentType: 'FULL_TIME',
  datePosted: '...',
  salary: { currency: 'CNY', minValue: 10000, maxValue: 20000, unit: 'MONTH' },
}} />

// 公司
<JsonLd type="Organization" data={{
  name: '...',
  description: '...',
  logo: '...',
  url: '...',
  city: '...',
}} />

// 网站搜索
<JsonLd type="WebSite" data={{
  name: 'Jobsbor',
  description: '...',
  url: 'https://jobsbor.com',
  searchUrl: 'https://jobsbor.com/jobs?q={search_term_string}',
}} />

// 面包屑
<JsonLd type="BreadcrumbList" data={[
  { name: '首页', url: 'https://jobsbor.com/' },
  { name: '职位', url: 'https://jobsbor.com/jobs' },
  { name: '当前页面', url: 'https://jobsbor.com/jobs/example' },
]} />

// 文章
<JsonLd type="Article" data={{
  title: '...',
  description: '...',
  authorName: '...',
  publishedAt: '...',
  url: '...',
}} />
```

### Breadcrumb 组件

```tsx
import { Breadcrumb, predefinedBreadcrumbs } from '@/components/seo';

<Breadcrumb
  items={[
    predefinedBreadcrumbs.jobs,
    predefinedBreadcrumbs.financeJobs,
    { label: '职位标题' },
  ]}
  showHome={true}
  homeLabel="首页"
/>
```

### SEO工具函数

```tsx
import { 
  generateSlug, 
  generateTitle, 
  generateDescription,
  generateCanonical,
  generateKeywords,
  extractJobKeywords,
  generateOgImage,
} from '@/lib/seo';

// 生成URL slug
generateSlug("投资银行分析师"); // "investment-banking-analyst"

// 生成标题（自动添加品牌后缀）
generateTitle("投资银行分析师"); // "投资银行分析师 | Jobsbor"

// 生成描述（自动截断）
generateDescription("很长的描述文本...");

// 生成canonical URL
generateCanonical("/jobs/example"); // "https://jobsbor.com/jobs/example"

// 生成关键词
generateKeywords(["投行", "金融", "分析师"]);

// 从职位数据提取关键词
extractJobKeywords("投行分析师", "finance", "中信证券", "北京");

// 生成OG图片URL
generateOgImage("job", "job-id");
```

### SEO配置

```tsx
import { 
  pageSeoConfig, 
  getPageSeoConfig,
  generateJobSeoConfig,
  generateCompanySeoConfig,
  generateBlogSeoConfig,
} from '@/lib/seo';

// 获取预定义配置
const homeSeo = getPageSeoConfig('home');
const jobsSeo = getPageSeoConfig('jobs');

// 生成动态配置
const jobSeo = generateJobSeoConfig("投行分析师", "中信证券", "finance", "北京");
const companySeo = generateCompanySeoConfig("中信证券", "finance", "北京");
const blogSeo = generateBlogSeoConfig("如何准备投行面试");
```

---

## 后续优化建议

1. **创建OG图片模板**：为不同页面类型设计专门的Open Graph图片
2. **实施搜索关键词追踪**：使用百度统计或Google Analytics监控关键词排名
3. **建立内链策略**：在文章中自动添加相关职位/公司链接
4. **优化页面速度**：使用Next.js Image组件、代码分割等技术
5. **实施A/B测试**：测试不同标题/描述的点击率
6. **定期内容更新**：保持博客内容新鲜度，定期更新旧文章
