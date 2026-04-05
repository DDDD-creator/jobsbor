/**
 * SEO工具函数库
 * 
 * 提供生成SEO友好内容的实用函数和配置
 */

export {
  // 工具函数
  generateSlug,
  generateTitle,
  generateDescription,
  generateCanonical,
  generateKeywords,
  extractJobKeywords,
  generateOgImage,
} from './seo';

export {
  // 配置
  pageSeoConfig,
  defaultSeoConfig,
  getPageSeoConfig,
  generateJobSeoConfig,
  generateCompanySeoConfig,
  generateBlogSeoConfig,
  type PageSeoConfig,
} from './seo-config';
