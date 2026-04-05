/**
 * SEO组件库
 * 
 * 提供完整的SEO优化解决方案，包括：
 * - MetaTags: Meta标签管理
 * - JsonLd: JSON-LD结构化数据
 * - Breadcrumb: 面包屑导航
 * 
 * @example
 * ```tsx
 * import { MetaTags, JsonLd, Breadcrumb } from '@/components/seo';
 * 
 * export default function JobPage({ job }) {
 *   return (
 *     <>
 *       <MetaTags
 *         title={job.title}
 *         description={job.description}
 *       />
 *       <JsonLd
 *         type="JobPosting"
 *         data={{
 *           title: job.title,
 *           description: job.description,
 *           // ...
 *         }}
 *       />
 *       <Breadcrumb
 *         items={[
 *           { label: '职位', href: '/jobs' },
 *           { label: job.title }
 *         ]}
 *       />
 *     </>
 *   );
 * }
 * ```
 */

export { MetaTags, type MetaTagsProps } from './MetaTags';
export { JsonLd, type JsonLdProps, type JobPostingData, type OrganizationData, type WebSiteData, type ArticleData, type BreadcrumbItem } from './JsonLd';
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem as BreadcrumbNavItem, predefinedBreadcrumbs } from './Breadcrumb';
