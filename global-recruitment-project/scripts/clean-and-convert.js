#!/usr/bin/env node
/**
 * 只保留真实职位，删除模拟数据
 */

const fs = require('fs');
const path = require('path');

const SOURCE_FILE = path.join(__dirname, '../src/data/real-jobs/all-jobs-final.json');
const TARGET_FILE = path.join(__dirname, '../src/data/jobs.ts');

// 读取源数据
const allJobs = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf8'));
console.log(`📊 总职位数: ${allJobs.length}`);

// 只保留真实API抓取的职位
const REAL_SOURCES = ['RemoteOK', 'Remotive'];
const realJobs = allJobs.filter(job => REAL_SOURCES.includes(job.source));

console.log(`✅ 真实职位: ${realJobs.length}`);
console.log(`🗑️  删除的模拟职位: ${allJobs.length - realJobs.length}`);

// 保存清理后的数据
const CLEAN_FILE = path.join(__dirname, '../src/data/real-jobs/all-jobs-clean.json');
fs.writeFileSync(CLEAN_FILE, JSON.stringify(realJobs, null, 2));
console.log(`💾 已保存清理后的数据到 all-jobs-clean.json`);

// 转换为 JobSeed 格式
function convertJob(job) {
  const title = job.title || 'Unknown Position';
  const company = job.company || 'Unknown Company';
  const location = job.location || 'Remote';
  
  // 生成 slug
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 40)}-${company.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20)}`;
  
  // 解析薪资
  let salaryMin = 10000;
  let salaryMax = 30000;
  if (job.salary) {
    const match = job.salary.match(/(\d+)k?-?(\d+)/i);
    if (match) {
      salaryMin = parseInt(match[1]) * (job.salary.includes('¥') ? 1 : 1000);
      salaryMax = parseInt(match[2]) * (job.salary.includes('¥') ? 1 : 1000);
    }
  }
  
  // 判断行业
  const desc = (job.description || '') + (job.title || '');
  let industry = 'internet';
  if (/crypto|blockchain|web3|defi|nft|bitcoin|ethereum|solidity|smart contract/i.test(desc)) {
    industry = 'web3';
  } else if (/finance|financial|banking|investment|trading|quant|hedge fund/i.test(desc)) {
    industry = 'finance';
  }
  
  // 判断类型
  const type = job.type?.toLowerCase().includes('contract') ? 'contract' : 
               job.type?.toLowerCase().includes('part') ? 'part-time' :
               location.toLowerCase().includes('remote') ? 'remote' : 'full-time';
  
  // 判断分类
  let category = 'engineer';
  if (/product|pm/i.test(title)) category = 'product';
  else if (/design|designer|ui|ux/i.test(title)) category = 'design';
  else if (/marketing|growth/i.test(title)) category = 'marketing';
  else if (/finance|accounting/i.test(title)) category = 'finance';
  else if (/operation|hr|recruit/i.test(title)) category = 'operations';
  else if (/research|scientist/i.test(title)) category = 'research';
  
  // 生成标签
  const tags = job.tags || [];
  if (!tags.includes(industry)) tags.push(industry);
  
  return {
    id: job.id || `job-${Math.random().toString(36).substring(2, 10)}`,
    title,
    slug,
    company,
    companySlug: company.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30),
    companyLogo: job.companyLogo || '',
    description: (job.description || '').substring(0, 500),
    requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''),
    salaryMin,
    salaryMax,
    location,
    type,
    industry,
    category,
    tags: tags.slice(0, 5),
    publishedAt: job.postedAt ? job.postedAt.split('T')[0] : new Date().toISOString().split('T')[0],
    applyUrl: job.applyUrl || '',
    companyWebsite: job.companyWebsite || '',
  };
}

const convertedJobs = realJobs.map(convertJob);

// 生成 TypeScript 内容
const tsContent = `export interface JobSeed {
  id: string;
  title: string;
  slug: string;
  company: string;
  companySlug: string;
  companyLogo: string;
  description: string;
  requirements: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  industry: 'finance' | 'web3' | 'internet';
  category: 'engineer' | 'product' | 'design' | 'marketing' | 'finance' | 'operations' | 'research';
  tags: string[];
  publishedAt: string;
  applyUrl?: string;
  companyWebsite?: string;
}

export const jobs: JobSeed[] = ${JSON.stringify(convertedJobs, null, 2)};

// 辅助函数
export function getJobBySlug(slug: string): JobSeed | undefined {
  return jobs.find(job => job.slug === slug);
}

export function getJobsByIndustry(industry: JobSeed['industry']): JobSeed[] {
  return jobs.filter(job => job.industry === industry);
}

export function getRecentJobs(limit: number = 10): JobSeed[] {
  return [...jobs]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function getJobsByCategory(category: JobSeed['category']): JobSeed[] {
  return jobs.filter(job => job.category === category);
}

export function getJobsByTag(tag: string): JobSeed[] {
  return jobs.filter(job => job.tags.includes(tag));
}

export function getRemoteJobs(): JobSeed[] {
  return jobs.filter(job => job.type === 'remote' || job.location.toLowerCase().includes('remote'));
}

export function searchJobs(query: string): JobSeed[] {
  const lowerQuery = query.toLowerCase();
  return jobs.filter(job =>
    job.title.toLowerCase().includes(lowerQuery) ||
    job.company.toLowerCase().includes(lowerQuery) ||
    job.description.toLowerCase().includes(lowerQuery) ||
    job.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export default jobs;
`;

// 写入文件
fs.writeFileSync(TARGET_FILE, tsContent);
console.log(`✅ 已转换 ${convertedJobs.length} 个真实职位到 jobs.ts`);
console.log(`📁 文件大小: ${(fs.statSync(TARGET_FILE).size / 1024).toFixed(2)} KB`);

// 生成报告
const report = {
  timestamp: new Date().toISOString(),
  totalJobs: convertedJobs.length,
  sources: {
    RemoteOK: realJobs.filter(j => j.source === 'RemoteOK').length,
    Remotive: realJobs.filter(j => j.source === 'Remotive').length,
  },
  industries: {
    web3: convertedJobs.filter(j => j.industry === 'web3').length,
    finance: convertedJobs.filter(j => j.industry === 'finance').length,
    internet: convertedJobs.filter(j => j.industry === 'internet').length,
  },
};

const REPORT_FILE = path.join(__dirname, '../src/data/real-jobs/clean-report.json');
fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
console.log(`📊 报告已保存到 clean-report.json`);
