// 数据整合与清洗脚本
// 读取所有爬虫数据，进行去重和清洗，输出统一格式的数据

import * as fs from 'fs';
import * as path from 'path';

// 清洗后的统一岗位数据结构
export interface CleanedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  salaryFormat: string;
  description: string;
  requirements: string[];
  tags: string[];
  category: string;
  industry: string;
  source: string;
  publishedAt: string;
}

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
  '深圳-南山区': '深圳',
  '杭州-滨江区': '杭州',
};

// 标准化薪资格式
function normalizeSalary(min: number, max: number, unit?: string, currency?: string): { min: number; max: number; format: string } {
  let normalizedMin = min;
  let normalizedMax = max;
  
  // 如果是年薪(USD)，转换为月薪(CNY)的k单位
  if (currency === 'USD' && unit !== 'month') {
    normalizedMin = Math.round((min * 7.2) / 12 / 1000);
    normalizedMax = Math.round((max * 7.2) / 12 / 1000);
  } else if (unit === 'month' || !unit) {
    // 如果是月薪且数值大于10000，说明是元，需要转换为k
    if (min > 10000) {
      normalizedMin = Math.round(min / 1000);
      normalizedMax = Math.round(max / 1000);
    }
    // 如果数值已经很小（比如猎聘数据的60-90），说明已经是k为单位
    else if (min < 1000) {
      normalizedMin = min;
      normalizedMax = max;
    }
  }
  
  return {
    min: normalizedMin,
    max: normalizedMax,
    format: `${normalizedMin}k-${normalizedMax}k`
  };
}

// 标准化地点
function normalizeLocation(location: string, remote?: boolean): string {
  if (remote) return '远程';
  if (CITY_NORMALIZATION[location]) return CITY_NORMALIZATION[location];
  // 提取主要城市名
  return location.split('·')[0].split('-')[0].split('/')[0].trim();
}

// 格式化日期
function normalizeDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr.slice(0, 10);
    }
    return date.toISOString().slice(0, 10);
  } catch {
    return dateStr.slice(0, 10);
  }
}

// 相似度计算
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 100;
  
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
  
  for (const job of jobs) {
    const companyKey = job.company.toLowerCase().trim();
    const titleKey = job.title.toLowerCase().trim();
    
    // 规则1: 完全去重 - 相同公司 + 相同职位名称
    const isExactDuplicate = uniqueJobs.some(j => 
      j.company.toLowerCase().trim() === companyKey &&
      j.title.toLowerCase().trim() === titleKey
    );
    
    if (isExactDuplicate) {
      console.log(`[去重-完全重复] ${job.company} - ${job.title}`);
      continue;
    }
    
    // 规则2: 相似去重 - 职位相似度 > 80%
    const isSimilar = uniqueJobs.some(j => 
      j.company.toLowerCase().trim() === companyKey &&
      calculateSimilarity(j.title, job.title) > 80
    );
    
    if (isSimilar) {
      console.log(`[去重-相似职位] ${job.company} - ${job.title}`);
      continue;
    }
    
    // 规则3: 公司去重 - 相同公司只保留一条记录
    const companyExists = uniqueJobs.some(j => 
      j.company.toLowerCase().trim() === companyKey
    );
    
    if (companyExists) {
      console.log(`[去重-公司重复] ${job.company} - ${job.title}`);
      continue;
    }
    
    uniqueJobs.push(job);
  }
  
  return uniqueJobs;
}

// 解析BOSS直聘数据
function parseBossInternetJobs(content: string): any[] {
  const jobs: any[] = [];
  const regex = /\{\s*title:[\s\S]*?source:[\s\S]*?'BOSS直聘'[\s\S]*?\}/g;
  let match;
  
  // 使用eval安全地解析JS对象（这里简化处理，实际应该使用更安全的解析方式）
  try {
    // 提取数组内容
    const arrayMatch = content.match(/export const bossInternetJobs[\s\S]*?=\s*(\[[\s\S]*?\]);/);
    if (arrayMatch) {
      // 将TypeScript对象转换为JSON格式
      const jsonStr = arrayMatch[1]
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"')
        .replace(/,\s*\}/g, '}')
        .replace(/,\s*\]/g, ']');
      return JSON.parse(jsonStr);
    }
  } catch (e) {
    console.error('解析BOSS数据失败:', e);
  }
  
  return jobs;
}

// 解析拉勾数据
function parseLagouJobs(content: string): any[] {
  try {
    const arrayMatch = content.match(/export const jobs[\s\S]*?=\s*(\[[\s\S]*?\]);/);
    if (arrayMatch) {
      const jsonStr = arrayMatch[1]
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"')
        .replace(/,\s*\}/g, '}')
        .replace(/,\s*\]/g, ']');
      return JSON.parse(jsonStr);
    }
  } catch (e) {
    console.error('解析拉勾数据失败:', e);
  }
  return [];
}

// 解析智联招聘数据
function parseZhaopinJobs(content: string): any[] {
  try {
    const arrayMatch = content.match(/export const jobSeeds[\s\S]*?=\s*(\[[\s\S]*?\]);?/);
    if (arrayMatch) {
      const jsonStr = arrayMatch[1]
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"')
        .replace(/,\s*\}/g, '}')
        .replace(/,\s*\]/g, ']');
      return JSON.parse(jsonStr);
    }
  } catch (e) {
    console.error('解析智联数据失败:', e);
  }
  return [];
}

// 清洗单个职位数据
function cleanSingleJob(raw: any, source: string, index: number): CleanedJob | null {
  try {
    // 解析薪资
    let salaryMin = 0;
    let salaryMax = 0;
    let salaryUnit: string | undefined;
    let salaryCurrency: string | undefined = 'CNY';
    
    if (raw.salary && typeof raw.salary === 'object') {
      salaryMin = raw.salary.min || 0;
      salaryMax = raw.salary.max || 0;
      salaryUnit = raw.salary.unit;
      salaryCurrency = raw.salary.currency || 'CNY';
    } else {
      salaryMin = raw.salaryMin || raw.salary_min || 0;
      salaryMax = raw.salaryMax || raw.salary_max || 0;
    }
    
    if (salaryMin === 0 || salaryMax === 0) {
      return null;
    }
    
    const normalizedSalary = normalizeSalary(salaryMin, salaryMax, salaryUnit, salaryCurrency);
    
    // 解析地点
    let location = '未知';
    if (raw.location) {
      if (typeof raw.location === 'object') {
        location = raw.location.remote ? '远程' : (raw.location.city || '未知');
      } else {
        location = normalizeLocation(String(raw.location), raw.location?.remote);
      }
    }
    
    // 解析描述和要求
    let description = raw.description || '';
    let requirements: string[] = [];
    
    if (raw.requirements) {
      if (Array.isArray(raw.requirements)) {
        requirements = raw.requirements.map((r: any) => String(r).replace(/^[•\-\*]\s*/, '').trim());
      } else if (typeof raw.requirements === 'string') {
        requirements = raw.requirements.split('\n').filter((r: string) => r.trim()).map((r: string) => r.replace(/^[•\-\*]\s*/, '').trim());
      }
    }
    
    // 解析标签
    let tags: string[] = [];
    if (raw.tags && Array.isArray(raw.tags)) {
      tags = raw.tags.map((t: string) => t.trim());
    }
    
    // 解析发布时间
    let publishedAt = '';
    const dateField = raw.publishedAt || raw.publishDate || raw.postedAt || raw.posted_at || new Date().toISOString();
    publishedAt = normalizeDate(dateField);
    
    // 解析行业
    let industry = 'internet';
    if (raw.industry) {
      industry = raw.industry;
    } else if (tags.some((t: string) => t.includes('金融') || t === 'finance')) {
      industry = 'finance';
    } else if (tags.some((t: string) => t.includes('区块链') || t.includes('Web3') || t === 'web3')) {
      industry = 'web3';
    }
    
    const company = raw.company || raw.companyName || raw.company_name || '';
    const title = raw.title || '';
    
    if (!company || !title) {
      return null;
    }
    
    return {
      id: raw.id || `${source}-${String(index).padStart(4, '0')}`,
      title,
      company,
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
  } catch (e) {
    console.error('清洗数据失败:', e);
    return null;
  }
}

// 主函数
function main() {
  const dataDir = path.join(__dirname);
  const allRawJobs: { job: any; source: string }[] = [];
  
  console.log('='.repeat(60));
  console.log('开始数据清洗流程');
  console.log('='.repeat(60));
  
  // 1. 读取BOSS直聘数据
  console.log('\n[1] 读取BOSS直聘数据...');
  try {
    const bossContent = fs.readFileSync(path.join(dataDir, 'boss-internet-jobs.ts'), 'utf-8');
    const bossJobs = parseBossInternetJobs(bossContent);
    bossJobs.forEach((job, i) => allRawJobs.push({ job: { ...job, id: job.id || `boss-${String(i).padStart(4, '0')}` }, source: 'boss' }));
    console.log(`    ✓ 读取到 ${bossJobs.length} 条记录`);
  } catch (e) {
    console.log('    ✗ 读取失败:', (e as Error).message);
  }
  
  // 2. 读取拉勾数据
  console.log('\n[2] 读取拉勾网数据...');
  try {
    const lagouContent = fs.readFileSync(path.join(dataDir, 'lagou-jobs.ts'), 'utf-8');
    const lagouJobs = parseLagouJobs(lagouContent);
    lagouJobs.forEach((job) => allRawJobs.push({ job, source: 'lagou' }));
    console.log(`    ✓ 读取到 ${lagouJobs.length} 条记录`);
  } catch (e) {
    console.log('    ✗ 读取失败:', (e as Error).message);
  }
  
  // 3. 读取智联招聘数据
  console.log('\n[3] 读取智联招聘数据...');
  try {
    const zhaopinContent = fs.readFileSync(path.join(dataDir, '../../zhaopin-jobs-seed.ts'), 'utf-8');
    const zhaopinJobs = parseZhaopinJobs(zhaopinContent);
    zhaopinJobs.forEach((job, i) => allRawJobs.push({ job: { ...job, id: job.id || `zhaopin-${String(i).padStart(4, '0')}` }, source: 'zhaopin' }));
    console.log(`    ✓ 读取到 ${zhaopinJobs.length} 条记录`);
  } catch (e) {
    console.log('    ✗ 读取失败:', (e as Error).message);
  }
  
  // 4. 读取猎聘数据
  console.log('\n[4] 读取猎聘高薪数据...');
  try {
    const liepinContent = fs.readFileSync(path.join(dataDir, '../../liepin_highpay_jobs.json'), 'utf-8');
    const liepinJobs = JSON.parse(liepinContent);
    liepinJobs.forEach((job: any, i: number) => allRawJobs.push({ 
      job: { 
        ...job, 
        id: job.id || `liepin-${String(i).padStart(4, '0')}`,
        salary: { min: job.salaryMin * 1000, max: job.salaryMax * 1000, unit: 'month', currency: job.currency || 'CNY' }
      }, 
      source: 'liepin' 
    }));
    console.log(`    ✓ 读取到 ${liepinJobs.length} 条记录`);
  } catch (e) {
    console.log('    ✗ 读取失败:', (e as Error).message);
  }
  
  // 5. 读取Web3数据
  console.log('\n[5] 读取Web3岗位数据...');
  const jobsDir = path.join(dataDir, 'jobs');
  try {
    const web3Files = fs.readdirSync(jobsDir).filter(f => f.startsWith('web3-') && f.endsWith('.json'));
    for (const file of web3Files) {
      const content = fs.readFileSync(path.join(jobsDir, file), 'utf-8');
      const job = JSON.parse(content);
      allRawJobs.push({ job, source: 'web3' });
    }
    console.log(`    ✓ 读取到 ${web3Files.length} 条记录`);
  } catch (e) {
    console.log('    ✗ 读取失败:', (e as Error).message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`原始数据总数: ${allRawJobs.length} 条`);
  console.log('='.repeat(60));
  
  // 清洗数据
  console.log('\n[6] 开始数据清洗...');
  const cleanedJobs: CleanedJob[] = [];
  let skipCount = 0;
  
  for (let i = 0; i < allRawJobs.length; i++) {
    const { job, source } = allRawJobs[i];
    const cleaned = cleanSingleJob(job, source, i);
    if (cleaned) {
      cleanedJobs.push(cleaned);
    } else {
      skipCount++;
    }
  }
  
  console.log(`    ✓ 清洗后有效数据: ${cleanedJobs.length} 条`);
  console.log(`    ✗ 跳过无效数据: ${skipCount} 条`);
  
  // 去重处理
  console.log('\n[7] 开始去重处理...');
  console.log('    去重规则:');
  console.log('    - 规则1: 相同公司 + 相同职位名称 = 重复');
  console.log('    - 规则2: 职位相似度 > 80% = 重复');
  console.log('    - 规则3: 相同公司只保留一条记录');
  
  const uniqueJobs = deduplicateJobs(cleanedJobs);
  
  console.log(`\n    去重前: ${cleanedJobs.length} 条`);
  console.log(`    去重后: ${uniqueJobs.length} 条`);
  console.log(`    去除重复: ${cleanedJobs.length - uniqueJobs.length} 条`);
  
  // 生成统计信息
  console.log('\n[8] 生成统计信息...');
  const stats = {
    total: uniqueJobs.length,
    bySource: {} as Record<string, number>,
    byIndustry: {} as Record<string, number>,
    byLocation: {} as Record<string, number>,
    salaryRange: {
      min: Math.min(...uniqueJobs.map(j => j.salaryMin)),
      max: Math.max(...uniqueJobs.map(j => j.salaryMax))
    }
  };
  
  uniqueJobs.forEach(job => {
    stats.bySource[job.source] = (stats.bySource[job.source] || 0) + 1;
    stats.byIndustry[job.industry] = (stats.byIndustry[job.industry] || 0) + 1;
    stats.byLocation[job.location] = (stats.byLocation[job.location] || 0) + 1;
  });
  
  console.log('\n    按来源分布:');
  Object.entries(stats.bySource).forEach(([source, count]) => {
    console.log(`      - ${source}: ${count} 条`);
  });
  
  console.log('\n    按行业分布:');
  Object.entries(stats.byIndustry).forEach(([industry, count]) => {
    console.log(`      - ${industry}: ${count} 条`);
  });
  
  console.log('\n    按地点分布(Top 5):');
  Object.entries(stats.byLocation)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([location, count]) => {
      console.log(`      - ${location}: ${count} 条`);
    });
  
  console.log(`\n    薪资范围: ${stats.salaryRange.min}k - ${stats.salaryRange.max}k`);
  
  // 输出清洗后的数据文件
  console.log('\n[9] 输出清洗后的数据文件...');
  
  const outputContent = `// 清洗后的岗位数据
// 生成时间: ${new Date().toISOString()}
// 数据总数: ${uniqueJobs.length} 条
// 来源: boss(BOSS直聘), lagou(拉勾网), zhaopin(智联招聘), liepin(猎聘), web3(Web3岗位)

import { CleanedJob } from './cleaner';

export const cleanedJobs: CleanedJob[] = ${JSON.stringify(uniqueJobs, null, 2)};

// 统计数据
export const jobStats = ${JSON.stringify(stats, null, 2)};
`;
  
  const outputPath = path.join(dataDir, 'cleaned-jobs.ts');
  fs.writeFileSync(outputPath, outputContent);
  console.log(`    ✓ 输出文件: ${outputPath}`);
  
  // 同时输出JSON格式
  const jsonOutputPath = path.join(dataDir, 'cleaned-jobs.json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify({
    meta: {
      generatedAt: new Date().toISOString(),
      total: uniqueJobs.length,
      stats
    },
    jobs: uniqueJobs
  }, null, 2));
  console.log(`    ✓ 输出文件: ${jsonOutputPath}`);
  
  console.log('\n' + '='.repeat(60));
  console.log('数据清洗完成!');
  console.log('='.repeat(60));
}

main();
