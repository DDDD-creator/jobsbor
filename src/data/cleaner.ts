import { JobSeed } from './jobs';

// 清洗后的统一岗位数据结构
export interface CleanedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  salaryFormat: string; // 统一格式: "xxk-xxk"
  description: string;
  requirements: string[];
  tags: string[];
  category: string;
  industry: string;
  source: string;
  publishedAt: string; // 统一格式: YYYY-MM-DD
}

// 标签词库 - 标准化标签
const TAG_NORMALIZATION: Record<string, string> = {
  // 技术标签
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'react': 'React',
  'vue': 'Vue',
  'angular': 'Angular',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'python': 'Python',
  'java': 'Java',
  'go': 'Go',
  'golang': 'Go',
  'c++': 'C++',
  'cpp': 'C++',
  'rust': 'Rust',
  'solidity': 'Solidity',
  
  // 技术方向
  'frontend': '前端开发',
  'front-end': '前端开发',
  'backend': '后端开发',
  'back-end': '后端开发',
  'fullstack': '全栈开发',
  'full-stack': '全栈开发',
  'devops': 'DevOps',
  'sre': 'SRE',
  'ai': 'AI',
  'machine learning': '机器学习',
  'deep learning': '深度学习',
  'blockchain': '区块链',
  'web3': 'Web3',
  
  // 职位标签
  'product manager': '产品经理',
  'pm': '产品经理',
  'architect': '架构师',
  'algorithm': '算法',
  'data': '数据',
  
  // 其他
  'remote': '远程',
  'full-time': '全职',
  'part-time': '兼职',
};

// 城市标准化映射
const CITY_NORMALIZATION: Record<string, string> = {
  '北京·海淀区': '北京',
  '北京·朝阳区': '北京',
  '杭州·余杭区': '杭州',
  '杭州·西湖区': '杭州',
  '杭州·滨江区': '杭州',
  '上海·长宁区': '上海',
  '广州·天河区': '广州',
  '深圳·南山区': '深圳',
  '北京/上海': '北京/上海',
  '杭州/上海': '杭州/上海',
  '深圳/上海': '深圳/上海',
  '北京/上海/深圳': '北京/上海/深圳',
  '成都·武侯·桂溪': '成都',
  '成都·武侯·红牌楼': '成都',
  '成都·郫都·合作街道': '成都',
  '成都·武侯·石羊': '成都',
  '西安·雁塔·丈八沟': '西安',
  '南京·浦口·沿江': '南京',
  '武汉·江岸': '武汉',
  '武汉·洪山·洪山街道': '武汉',
  '杭州·西湖·灵隐': '杭州',
  '杭州·上城·九堡': '杭州',
  '宁波·鄞州·云龙': '宁波',
  '苏州-昆山': '苏州',
  '远程（全球）': '远程',
  '远程（美国时区）': '远程',
};

// 标准化薪资格式
function normalizeSalary(min: number, max: number, unit?: string, currency?: string): { min: number; max: number; format: string } {
  let normalizedMin = min;
  let normalizedMax = max;
  
  // 如果是年薪(USD)，转换为月薪(CNY)的k单位
  if (currency === 'USD' && unit !== 'month') {
    // 美元年薪转人民币月薪 (汇率按7.2计算，除以12个月)
    normalizedMin = Math.round((min * 7.2) / 12 / 1000);
    normalizedMax = Math.round((max * 7.2) / 12 / 1000);
  } else if (unit === 'month' || !unit) {
    // 已经是月薪，转换为k单位
    normalizedMin = Math.round(min / 1000);
    normalizedMax = Math.round(max / 1000);
  }
  
  return {
    min: normalizedMin,
    max: normalizedMax,
    format: `${normalizedMin}k-${normalizedMax}k`
  };
}

// 标准化地点
function normalizeLocation(location: string): string {
  return CITY_NORMALIZATION[location] || location.split('·')[0].split('-')[0].trim();
}

// 标准化标签
function normalizeTags(tags: string[]): string[] {
  const normalized = new Set<string>();
  
  tags.forEach(tag => {
    const lowerTag = tag.toLowerCase().trim();
    if (TAG_NORMALIZATION[lowerTag]) {
      normalized.add(TAG_NORMALIZATION[lowerTag]);
    } else {
      normalized.add(tag.trim());
    }
  });
  
  return Array.from(normalized);
}

// 格式化日期
function normalizeDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr.slice(0, 10); // 尝试直接截取前10个字符
    }
    return date.toISOString().slice(0, 10);
  } catch {
    return dateStr.slice(0, 10);
  }
}

// 生成唯一ID
function generateId(source: string, index: number): string {
  return `${source}-${String(index).padStart(4, '0')}`;
}

// 检查必填字段完整性
function checkRequiredFields(job: Partial<CleanedJob>): boolean {
  return !!(
    job.title &&
    job.company &&
    job.location &&
    job.salaryMin &&
    job.salaryMax &&
    job.description
  );
}

// 相似度计算（用于相似去重）
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 100;
  
  // 使用莱文斯坦距离计算相似度
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix: number[][] = [];
  
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return ((maxLen - distance) / maxLen) * 100;
}

// 去重函数
function deduplicateJobs(jobs: CleanedJob[]): CleanedJob[] {
  const uniqueJobs: CleanedJob[] = [];
  const seenCompanies = new Set<string>();
  
  for (const job of jobs) {
    // 规则3: 相同公司只保留一条记录
    const companyKey = job.company.toLowerCase().trim();
    
    // 检查是否已存在相同公司+职位的完全重复
    const isExactDuplicate = uniqueJobs.some(j => 
      j.company.toLowerCase().trim() === companyKey &&
      j.title.toLowerCase().trim() === job.title.toLowerCase().trim()
    );
    
    if (isExactDuplicate) {
      continue;
    }
    
    // 检查相似度
    const isSimilar = uniqueJobs.some(j => 
      j.company.toLowerCase().trim() === companyKey &&
      calculateSimilarity(j.title, job.title) > 80
    );
    
    if (isSimilar) {
      continue;
    }
    
    // 如果同一公司已有记录，跳过（公司去重）
    if (seenCompanies.has(companyKey)) {
      continue;
    }
    
    seenCompanies.add(companyKey);
    uniqueJobs.push(job);
  }
  
  return uniqueJobs;
}

// 主清洗函数
export function cleanJobData(rawJobs: any[], source: string): CleanedJob[] {
  const cleanedJobs: CleanedJob[] = [];
  
  for (let i = 0; i < rawJobs.length; i++) {
    const raw = rawJobs[i];
    
    // 解析薪资
    let salaryMin = 0;
    let salaryMax = 0;
    let salaryUnit: string | undefined;
    let salaryCurrency: string | undefined;
    
    if (raw.salary) {
      if (typeof raw.salary === 'object') {
        salaryMin = raw.salary.min || raw.salaryMin || 0;
        salaryMax = raw.salary.max || raw.salaryMax || 0;
        salaryUnit = raw.salary.unit;
        salaryCurrency = raw.salary.currency;
      }
    } else {
      salaryMin = raw.salaryMin || 0;
      salaryMax = raw.salaryMax || 0;
      salaryCurrency = raw.currency;
    }
    
    if (salaryMin === 0 || salaryMax === 0) {
      continue; // 跳过没有薪资信息的职位
    }
    
    const normalizedSalary = normalizeSalary(salaryMin, salaryMax, salaryUnit, salaryCurrency);
    
    // 解析地点
    let location = '';
    if (raw.location) {
      if (typeof raw.location === 'object') {
        location = raw.location.remote ? '远程' : (raw.location.city || '未知');
      } else {
        location = normalizeLocation(raw.location);
      }
    }
    
    // 解析描述
    let description = '';
    if (raw.description) {
      description = typeof raw.description === 'string' ? raw.description : '';
    }
    
    // 解析要求
    let requirements: string[] = [];
    if (raw.requirements) {
      if (Array.isArray(raw.requirements)) {
        requirements = raw.requirements.map((r: any) => String(r));
      } else if (typeof raw.requirements === 'string') {
        requirements = raw.requirements.split('\n').filter((r: string) => r.trim());
      }
    }
    
    // 解析标签
    let tags: string[] = [];
    if (raw.tags && Array.isArray(raw.tags)) {
      tags = normalizeTags(raw.tags);
    }
    
    // 解析发布时间
    let publishedAt = '';
    if (raw.publishedAt || raw.publishDate || raw.postedAt) {
      publishedAt = normalizeDate(raw.publishedAt || raw.publishDate || raw.postedAt);
    }
    
    // 解析行业
    let industry = raw.industry || 'internet';
    if (raw.category === 'finance' || tags.some(t => t.includes('金融'))) {
      industry = 'finance';
    } else if (raw.category === 'web3' || tags.some(t => t.includes('区块链') || t.includes('Web3'))) {
      industry = 'web3';
    }
    
    const cleanedJob: CleanedJob = {
      id: raw.id || generateId(source, i),
      title: raw.title || '',
      company: raw.company || raw.companyName || '',
      location,
      salaryMin: normalizedSalary.min,
      salaryMax: normalizedSalary.max,
      salaryFormat: normalizedSalary.format,
      description,
      requirements,
      tags,
      category: raw.category || 'engineer',
      industry,
      source: raw.source || source,
      publishedAt
    };
    
    // 检查必填字段
    if (checkRequiredFields(cleanedJob)) {
      cleanedJobs.push(cleanedJob);
    }
  }
  
  // 去重处理
  return deduplicateJobs(cleanedJobs);
}

// 导出清洗后的数据
export const cleanedJobs: CleanedJob[] = [];
