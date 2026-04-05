# Bug 修复记录

**修复日期**: 2024-04-01  
**修复人**: CTO (代码审查AI助手)

---

## 已修复的 Bug

### Bug 1: Button 组件 Tailwind 类名错误 (Critical)

**描述**: Button 组件使用了不存在的主色调类名 `bg-primary-600`、`bg-accent-600` 等，导致按钮悬停和激活状态无样式。

**位置**: `src/components/ui/button.tsx`

**修复方案**: 使用正确的 Tailwind 颜色值。

**修复前**:
```tsx
'bg-primary text-white hover:bg-primary-600 active:bg-primary-700': variant === 'primary',
'bg-accent text-white hover:bg-accent-600 active:bg-accent-700': variant === 'secondary',
```

**修复后**:
```tsx
'bg-primary text-white hover:bg-[#162b46] active:bg-[#0e1c2d]': variant === 'primary',
'bg-accent text-white hover:bg-[#ea580c] active:bg-[#c2410c]': variant === 'secondary',
```

---

### Bug 2: types/index.ts 缺少 updatedAt 字段 (High)

**描述**: Post 类型缺少 `updatedAt` 字段，与 sitemap.ts 中的使用不匹配。

**位置**: `src/types/index.ts`

**修复方案**: 在 Post 接口中添加 updatedAt 字段。

**修复前**:
```typescript
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  published: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
}
```

**修复后**:
```typescript
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  published: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### Bug 3: sitemap.ts Post 类型引用错误 (High)

**描述**: sitemap.ts 中引用了 `post.published` 和 `post.updatedAt` 字段，但 data/posts.ts 中的 Post 类型定义不同。

**位置**: `src/app/sitemap.ts`

**修复方案**: 修改 sitemap.ts 适配 data/posts.ts 的实际数据结构。

**修复前**:
```typescript
// 所有博客文章页
const blogPages: MetadataRoute.Sitemap = posts
  .filter((post) =>> post.published)
  .map((post) =>> ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt 
      ? new Date(post.updatedAt) 
      : post.publishedAt 
        ? new Date(post.publishedAt) 
        : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
```

**修复后**:
```typescript
// 所有博客文章页
const blogPages: MetadataRoute.Sitemap = posts.map((post) =>> ({
  url: `${SITE_URL}/blog/${post.slug}`,
  lastModified: new Date(post.publishedAt),
  changeFrequency: 'monthly',
  priority: 0.6,
}));
```

---

### Bug 4: Input 组件 focus ring 颜色错误 (Medium)

**描述**: Input 组件使用了 `focus:ring-primary-500`，该颜色不存在。

**位置**: `src/components/ui/input.tsx`

**修复方案**: 使用正确的颜色值。

**修复前**:
```tsx
'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
```

**修复后**:
```tsx
'focus:outline-none focus:ring-2 focus:ring-[#4777a7] focus:border-transparent',
```

---

### Bug 5: next.config.js 图片配置优化 (Medium)

**描述**: 当前配置 `images: { unoptimized: true }` 不利于性能优化。

**位置**: `next.config.js`

**修复方案**: 添加注释说明，建议生产环境移除该配置。

**修复前**:
```javascript
images: {
  unoptimized: true,
},
```

**修复后**:
```javascript
images: {
  // 静态导出模式下需要设置为 true
  // 如果使用服务器渲染，建议移除以启用图片优化
  unoptimized: true,
},
```

---

### Bug 6: JobCard.tsx 缺少空值处理 (Medium)

**描述**: JobCard 组件中 `job.tags.slice(0, 2)` 可能因 tags 为 undefined 而报错。

**位置**: `src/components/jobs/JobCard.tsx`

**修复方案**: 使用可选链操作符。

**修复前**:
```tsx
{job.tags.slice(0, 2).map((tag) =>> (
```

**修复后**:
```tsx
{job.tags?.slice(0, 2).map((tag) =>> (
```

---

### Bug 7: API 路由参数未验证 (Medium)

**描述**: API 路由中的 slug 参数未进行空值和格式验证。

**位置**: 
- `src/app/api/jobs/[slug]/route.ts`
- `src/app/api/companies/[slug]/route.ts`
- `src/app/api/posts/[slug]/route.ts`

**修复方案**: 添加参数验证逻辑。

**修复后示例**:
```typescript
// 验证 slug 参数
if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
  return NextResponse.json(
    {
      success: false,
      error: '无效的职位标识',
    },
    { status: 400 }
  )
}
```

---

### Bug 8: N+1 查询问题 (Medium)

**描述**: `getCompanies` 函数中对每个公司单独查询职位数，存在 N+1 查询问题。

**位置**: 
- `src/lib/data.ts`
- `src/app/api/companies/route.ts`

**修复方案**: 使用 Prisma 的 `_count` 聚合功能。

**修复后**:
```typescript
const companies = await prisma.company.findMany({
  // ...
  include: {
    _count: {
      select: {
        jobs: {
          where: {
            isActive: true,
          },
        },
      },
    },
  },
})

// 使用 _count 聚合，避免 N+1 查询
const companiesWithJobCount = companies.map((company) =>> ({
  ...company,
  jobCount: company._count.jobs,
}))
```

---

### Bug 9: 数据类型命名冲突 (Medium)

**描述**: data/jobs.ts、data/companies.ts、data/posts.ts 中定义的 Job、Company、Post 类型与 types/index.ts 中的类型冲突。

**位置**: 
- `src/data/jobs.ts`
- `src/data/companies.ts`
- `src/data/posts.ts`
- `src/data/index.ts`

**修复方案**: 将数据文件中的类型重命名为 JobSeed、CompanySeed、PostSeed。

---

### Bug 10: companies.ts 中文引号错误 (Medium)

**描述**: 公司描述中包含中文引号，导致 JavaScript 语法错误。

**位置**: `src/data/companies.ts`

**修复方案**: 将中文引号替换为其他符号或转义。

---

### Bug 11: companies.ts 逻辑运算符优先级错误 (Medium)

**描述**: searchCompanies 函数中 `||` 和 `??` 混合使用没有括号，导致逻辑错误。

**位置**: `src/data/companies.ts`

**修复前**:
```typescript
company.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ?? false
```

**修复后**:
```typescript
(company.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ?? false)
```

---

### Bug 12: pagination.tsx 转义错误 (Medium)

**描述**: HTML 标签被错误转义为 Unicode 编码。

**位置**: `src/components/ui/pagination.tsx`

**修复前**:
```tsx
<span className="px-2 text-gray-400">...\u003c/span>
```

**修复后**:
```tsx
<span className="px-2 text-gray-400">...</span>
```

---

### Bug 13: page.tsx 文件包含乱码字符 (High)

**描述**: 文件中包含 `003e` 乱码字符和错误的 Tailwind 类名。

**位置**: `src/app/page.tsx`, `src/app/jobs/page.tsx`

**修复方案**: 重写文件，移除乱码并修复类名。

---

### Bug 14: layout.tsx 导入路径错误 (Medium)

**描述**: 从 `@/lib/seo` 导入 `getPageSeoConfig`，但该函数在 `@/lib/seo-config` 中。

**位置**: `src/app/layout.tsx`

**修复前**:
```typescript
import { getPageSeoConfig } from '@/lib/seo'
```

**修复后**:
```typescript
import { getPageSeoConfig } from '@/lib/seo-config'
```

---

### Bug 15: companies/[slug]/page.tsx 空值检查 (Medium)

**描述**: `company.description.slice(0, 150)` 可能因 description 为 null 而报错。

**位置**: `src/app/companies/[slug]/page.tsx`

**修复前**:
```typescript
description: company.description.slice(0, 150),
```

**修复后**:
```typescript
description: company.description?.slice(0, 150),
```

---

### Bug 16: seo.ts Set 迭代错误 (Medium)

**描述**: 使用 `[...new Set(keywords)]` 在某些目标环境下不被支持。

**位置**: 
- `src/lib/seo.ts`
- `src/lib/seo/seo.ts`

**修复前**:
```typescript
return [...new Set(keywords)];
```

**修复后**:
```typescript
return Array.from(new Set(keywords));
```

---

### Bug 17: seo-config.ts 拼写错误 (Low)

**描述**: `BRANDAND_NAME` 应为 `BRAND_NAME`。

**位置**: `src/lib/seo-config.ts`

**修复前**:
```typescript
description: `${BRANDAND_NAME}隐私政策说明...
```

**修复后**:
```typescript
description: `${BRAND_NAME}隐私政策说明...
```

---

### Bug 18: tsconfig.json 缺少 target (Low)

**描述**: tsconfig.json 缺少 target 配置，导致 Set 迭代等 ES2015+ 特性报错。

**位置**: `tsconfig.json`

**修复后**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    // ...
  }
}
```

---

## 修复文件列表

| 文件路径 | 修复内容 |
|----------|----------|
| `src/components/ui/button.tsx` | 修复 Tailwind 类名错误 |
| `src/types/index.ts` | 添加 updatedAt 字段 |
| `src/app/sitemap.ts` | 修复 Post 类型引用 |
| `src/components/ui/input.tsx` | 修复 focus ring 颜色 |
| `next.config.js` | 添加图片配置注释 |
| `src/components/jobs/JobCard.tsx` | 添加空值保护 |
| `src/app/api/jobs/[slug]/route.ts` | 添加参数验证 |
| `src/app/api/companies/[slug]/route.ts` | 添加参数验证 |
| `src/app/api/posts/[slug]/route.ts` | 添加参数验证 |
| `src/lib/data.ts` | 修复 N+1 查询问题 |
| `src/app/api/companies/route.ts` | 修复 N+1 查询问题 |
| `src/data/jobs.ts` | 重命名类型为 JobSeed |
| `src/data/companies.ts` | 重命名类型为 CompanySeed，修复引号和运算符错误 |
| `src/data/posts.ts` | 重命名类型为 PostSeed |
| `src/data/index.ts` | 修复导出类型名称 |
| `src/components/ui/pagination.tsx` | 修复 HTML 转义 |
| `src/app/page.tsx` | 移除乱码，修复类名 |
| `src/app/jobs/page.tsx` | 移除乱码，修复类名 |
| `src/app/layout.tsx` | 修复导入路径 |
| `src/app/companies/[slug]/page.tsx` | 添加空值检查 |
| `src/lib/seo.ts` | 修复 Set 迭代 |
| `src/lib/seo/seo.ts` | 修复 Set 迭代 |
| `src/lib/seo-config.ts` | 修复拼写错误 |
| `tsconfig.json` | 添加 target 配置 |
