/**
 * 数据文件索引
 * 统一导出所有数据模块
 */

export { jobs, getJobBySlug, getJobsByIndustry, getRecentJobs, getJobsByCategory, getJobsByTag, getRemoteJobs, searchJobs } from './jobs';
export type { JobSeed } from './jobs';

export { companies, companyStats, industryLabels, getCompanyBySlug, getCompaniesByIndustry, getCompaniesByTag, searchCompanies } from './companies';
export type { CompanySeed } from './companies';

export { posts, getPostBySlug, getPostsByTag, getRecentPosts } from './posts';
export type { PostSeed } from './posts';
