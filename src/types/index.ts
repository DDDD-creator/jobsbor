export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
  location?: string | null;
  industry: string;
  createdAt: Date;
  jobs?: Job[];
  // 扩展字段
  scale?: string | null;
  stage?: string | null;
  address?: string | null;
  benefits?: string[];
  culture?: string[];
  tags?: string[];
  employeeCount?: string | null;
  founders?: { name: string; title: string; avatar?: string }[];
  establishedYear?: number;
  fundingAmount?: string | null;
  source?: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  companyId: string;
  company?: Company;
  description: string;
  requirements: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  industry: 'finance' | 'web3' | 'internet';
  category: 'engineer' | 'product' | 'design' | 'marketing' | 'finance' | 'operations' | 'research';
  tags: string[];
  isActive: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  applyUrl?: string | null;
}

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

export interface JobFilter {
  industry?: string;
  category?: string;
  type?: string;
  location?: string;
  keyword?: string;
}

// 统一的JobWithCompany类型 - 包含公司信息的职位
export interface JobWithCompany extends Job {
  company?: Company
}

// 搜索结果高亮信息
export interface JobHighlight {
  title?: string
  description?: string
  companyName?: string
}

// 带高亮的职位搜索结果
export interface JobSearchResult extends JobWithCompany {
  _highlight?: JobHighlight
}