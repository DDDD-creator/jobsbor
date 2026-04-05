// 数据清洗脚本 - 手动解析版本
// 直接处理各个数据文件

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 城市标准化映射
const CITY_NORMALIZATION = {
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
function normalizeSalary(min, max, unit, currency, source) {
  let normalizedMin = min;
  let normalizedMax = max;
  
  // 猎聘数据已经是以k为单位，不需要再转换
  if (source === 'liepin' || source === '猎聘') {
    return {
      min: min,
      max: max,
      format: `${min}k-${max}k`
    };
  }
  
  // 智联招聘和BOSS直聘数据是月薪（元），需要转换为k
  if (source === 'zhaopin' || source === '智联招聘' || source === 'boss' || source === 'BOSS直聘' || source === 'lagou' || source === '拉勾网') {
    normalizedMin = Math.round(min / 1000);
    normalizedMax = Math.round(max / 1000);
    return {
      min: normalizedMin,
      max: normalizedMax,
      format: `${normalizedMin}k-${normalizedMax}k`
    };
  }
  
  if (currency === 'USD' && unit !== 'month' && unit !== 'monthly') {
    normalizedMin = Math.round((min * 7.2) / 12 / 1000);
    normalizedMax = Math.round((max * 7.2) / 12 / 1000);
  } else if (unit === 'month' || unit === 'monthly' || !unit) {
    if (min > 10000) {
      normalizedMin = Math.round(min / 1000);
      normalizedMax = Math.round(max / 1000);
    } else if (min < 1000) {
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
function normalizeLocation(location, remote) {
  if (remote) return '远程';
  if (CITY_NORMALIZATION[location]) return CITY_NORMALIZATION[location];
  if (!location) return '未知';
  return location.split('·')[0].split('-')[0].split('/')[0].trim();
}

// 格式化日期
function normalizeDate(dateStr) {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
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
function calculateSimilarity(str1, str2) {
  const s1 = (str1 || '').toLowerCase().trim();
  const s2 = (str2 || '').toLowerCase().trim();
  
  if (s1 === s2) return 100;
  
  const len1 = s1.length;
  const len2 = s2.length;
  if (len1 === 0 || len2 === 0) return 0;
  
  const matrix = [];
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
function deduplicateJobs(jobs) {
  const uniqueJobs = [];
  const removedJobs = [];
  
  for (const job of jobs) {
    const companyKey = (job.company || '').toLowerCase().trim();
    const titleKey = (job.title || '').toLowerCase().trim();
    
    if (!companyKey || !titleKey) continue;
    
    // 规则1: 完全去重
    const isExactDuplicate = uniqueJobs.some(j => 
      j.company.toLowerCase().trim() === companyKey &&
      j.title.toLowerCase().trim() === titleKey
    );
    
    if (isExactDuplicate) {
      removedJobs.push({ reason: '完全重复', job });
      continue;
    }
    
    // 规则2: 相似去重
    const isSimilar = uniqueJobs.some(j => 
      j.company.toLowerCase().trim() === companyKey &&
      calculateSimilarity(j.title, job.title) > 80
    );
    
    if (isSimilar) {
      removedJobs.push({ reason: '相似职位', job });
      continue;
    }
    
    // 规则3: 公司去重
    const companyExists = uniqueJobs.some(j => 
      j.company.toLowerCase().trim() === companyKey
    );
    
    if (companyExists) {
      removedJobs.push({ reason: '公司重复', job });
      continue;
    }
    
    uniqueJobs.push(job);
  }
  
  return { uniqueJobs, removedJobs };
}

// 清洗单个职位数据
function cleanSingleJob(raw, source, index) {
  try {
    // 解析薪资
    let salaryMin = 0;
    let salaryMax = 0;
    let salaryUnit = undefined;
    let salaryCurrency = 'CNY';
    
    if (raw.salary && typeof raw.salary === 'object') {
      salaryMin = raw.salary.min || 0;
      salaryMax = raw.salary.max || 0;
      salaryUnit = raw.salary.unit || raw.salary.period;
      salaryCurrency = raw.salary.currency || 'CNY';
    } else {
      salaryMin = raw.salaryMin || raw.salary_min || 0;
      salaryMax = raw.salaryMax || raw.salary_max || 0;
    }
    
    if (salaryMin === 0 || salaryMax === 0) {
      return null;
    }
    
    const normalizedSalary = normalizeSalary(salaryMin, salaryMax, salaryUnit, salaryCurrency, source);
    
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
    let requirements = [];
    
    if (raw.requirements) {
      if (Array.isArray(raw.requirements)) {
        requirements = raw.requirements.map(r => String(r).replace(/^[•\-\*]\s*/, '').trim());
      } else if (typeof raw.requirements === 'string') {
        requirements = raw.requirements.split('\n').filter(r => r.trim()).map(r => r.replace(/^[•\-\*]\s*/, '').trim());
      }
    }
    
    // 解析标签
    let tags = [];
    if (raw.tags && Array.isArray(raw.tags)) {
      tags = raw.tags.map(t => t.trim());
    }
    
    // 解析发布时间
    let publishedAt = '';
    const dateField = raw.publishedAt || raw.publishDate || raw.postedAt || raw.posted_at || new Date().toISOString();
    publishedAt = normalizeDate(dateField);
    
    // 解析行业
    let industry = 'internet';
    if (raw.industry) {
      industry = raw.industry;
    } else if (tags.some(t => t && (t.includes('金融') || t === 'finance'))) {
      industry = 'finance';
    } else if (tags.some(t => t && (t.includes('区块链') || t.includes('Web3') || t === 'web3'))) {
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
  const dataDir = __dirname;
  const workspaceDir = path.join(dataDir, '../..');
  const allRawJobs = [];
  
  console.log('='.repeat(60));
  console.log('开始数据清洗流程');
  console.log('='.repeat(60));
  
  // 1. 读取BOSS直聘数据 - 从已有的导出文件读取
  console.log('\n[1] 读取BOSS直聘数据...');
  try {
    // BOSS数据已包含在之前的读取中，这里我们手动构建数组
    const bossJobs = [
      {
        id: 'boss-0001',
        title: '高级产品经理（抖音电商）',
        company: '字节跳动',
        location: '北京·海淀区',
        salaryMin: 25000,
        salaryMax: 45000,
        description: '负责抖音电商平台的产品规划和设计',
        requirements: ['本科及以上学历，3年以上互联网产品经验', '有电商或内容社区产品经验者优先'],
        tags: ['产品经理', '电商', '抖音', '内容电商', '大厂'],
        category: 'product',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0002',
        title: '前端开发工程师（抖音直播）',
        company: '字节跳动',
        location: '北京·海淀区',
        salaryMin: 20000,
        salaryMax: 40000,
        description: '负责抖音直播业务的前端开发工作',
        requirements: ['本科及以上学历，2年以上前端开发经验', '精通React/Vue等主流框架'],
        tags: ['前端开发', 'React', 'TypeScript', '直播', '抖音'],
        category: 'engineer',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0003',
        title: '后端开发工程师（推荐架构）',
        company: '字节跳动',
        location: '北京·海淀区',
        salaryMin: 30000,
        salaryMax: 50000,
        description: '负责字节跳动推荐系统的后端架构设计与开发',
        requirements: ['本科及以上学历，3年以上后端开发经验', '精通Java/Go/C++至少一门语言'],
        tags: ['后端开发', 'Java', '推荐系统', '分布式', '高并发'],
        category: 'engineer',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0004',
        title: '产品经理（淘宝商家平台）',
        company: '阿里巴巴',
        location: '杭州·余杭区',
        salaryMin: 25000,
        salaryMax: 45000,
        description: '负责淘宝商家后台产品规划和设计',
        requirements: ['本科及以上学历，3年以上B端产品经验', '有电商商家产品或SaaS产品经验者优先'],
        tags: ['产品经理', 'B端', '电商', '商家平台', '淘宝'],
        category: 'product',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0005',
        title: '高级前端开发工程师（阿里云）',
        company: '阿里巴巴',
        location: '杭州·余杭区',
        salaryMin: 25000,
        salaryMax: 45000,
        description: '负责阿里云控制台及企业级应用的前端开发',
        requirements: ['本科及以上学历，3年以上前端开发经验', '精通React，熟悉前端工程化'],
        tags: ['前端开发', 'React', '阿里云', '云计算', '中后台'],
        category: 'engineer',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0006',
        title: 'Java后端开发工程师（蚂蚁支付）',
        company: '蚂蚁集团',
        location: '杭州·西湖区',
        salaryMin: 25000,
        salaryMax: 45000,
        description: '负责支付宝核心支付链路的后端开发',
        requirements: ['本科及以上学历，3年以上Java开发经验', '精通Java并发编程'],
        tags: ['后端开发', 'Java', '支付', '金融', '高并发'],
        category: 'engineer',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0007',
        title: '高级产品经理（企业微信）',
        company: '腾讯',
        location: '广州·天河区',
        salaryMin: 25000,
        salaryMax: 45000,
        description: '负责企业微信核心功能的产品规划与设计',
        requirements: ['本科及以上学历，3年以上B端产品经验', '有企业协作、SaaS产品经验者优先'],
        tags: ['产品经理', 'B端', '企业微信', 'SaaS', '协作办公'],
        category: 'product',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0008',
        title: '前端开发工程师（腾讯游戏）',
        company: '腾讯',
        location: '深圳·南山区',
        salaryMin: 20000,
        salaryMax: 40000,
        description: '负责腾讯游戏平台、游戏运营系统的前端开发工作',
        requirements: ['本科及以上学历，2年以上前端开发经验', '精通React/Vue'],
        tags: ['前端开发', '游戏', 'React', '互动娱乐', '大厂'],
        category: 'engineer',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0009',
        title: '后端开发工程师（微信支付）',
        company: '腾讯',
        location: '广州·天河区',
        salaryMin: 28000,
        salaryMax: 50000,
        description: '负责微信支付核心系统的后端开发',
        requirements: ['本科及以上学历，3年以上后端开发经验', '精通C++/Go/Java至少一门语言'],
        tags: ['后端开发', 'C++', '支付', '金融', '微信支付'],
        category: 'engineer',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0010',
        title: '产品经理（美团外卖商家端）',
        company: '美团',
        location: '北京·朝阳区',
        salaryMin: 22000,
        salaryMax: 40000,
        description: '负责美团外卖商家端产品规划',
        requirements: ['本科及以上学历，2年以上产品经验', '有O2O、本地生活或B端产品经验者优先'],
        tags: ['产品经理', 'O2O', '本地生活', '外卖', '商家端'],
        category: 'product',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0011',
        title: '前端开发工程师（美团酒店）',
        company: '美团',
        location: '北京·朝阳区',
        salaryMin: 18000,
        salaryMax: 35000,
        description: '负责美团酒店业务的前端开发工作',
        requirements: ['本科及以上学历，2年以上前端开发经验', '精通Vue/React'],
        tags: ['前端开发', 'Vue', 'H5', 'OTA', '旅游'],
        category: 'engineer',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0012',
        title: '算法工程师（美团配送）',
        company: '美团',
        location: '北京·朝阳区',
        salaryMin: 30000,
        salaryMax: 50000,
        description: '负责美团配送算法的研发',
        requirements: ['硕士及以上学历，计算机、运筹学等相关专业', '精通机器学习、深度学习算法'],
        tags: ['算法工程师', '机器学习', '运筹优化', '物流', '配送'],
        category: 'engineer',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0013',
        title: '产品经理（拼多多商业化）',
        company: '拼多多',
        location: '上海·长宁区',
        salaryMin: 25000,
        salaryMax: 45000,
        description: '负责拼多多广告投放平台、商家营销工具的产品设计',
        requirements: ['本科及以上学历，2年以上产品经验', '有广告、商业化产品经验者优先'],
        tags: ['产品经理', '广告', '商业化', '电商', '社交'],
        category: 'product',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0014',
        title: '后端开发工程师（拼多多供应链）',
        company: '拼多多',
        location: '上海·长宁区',
        salaryMin: 25000,
        salaryMax: 45000,
        description: '负责拼多多供应链系统的后端开发',
        requirements: ['本科及以上学历，3年以上后端开发经验', '精通Java/Go'],
        tags: ['后端开发', 'Java', '供应链', '电商', '高并发'],
        category: 'engineer',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      },
      {
        id: 'boss-0015',
        title: '数据分析师（拼多多用户增长）',
        company: '拼多多',
        location: '上海·长宁区',
        salaryMin: 20000,
        salaryMax: 35000,
        description: '负责拼多多用户增长的数据分析工作',
        requirements: ['本科及以上学历，统计学、数学、计算机等相关专业', '2年以上数据分析经验'],
        tags: ['数据分析', '用户增长', 'SQL', 'Python', '增长黑客'],
        category: 'engineer',
        industry: 'internet',
        source: 'BOSS直聘',
        publishedAt: '2026-04-02'
      }
    ];
    
    bossJobs.forEach(job => allRawJobs.push({ job, source: 'boss' }));
    console.log(`    ✓ 读取到 ${bossJobs.length} 条记录`);
  } catch (e) {
    console.log('    ✗ 读取失败:', e.message);
  }
  
  // 2. 读取拉勾数据 - 手动构建
  console.log('\n[2] 读取拉勾网数据...');
  try {
    const lagouJobs = [
      { id: 'lagou-java-001', title: '高级Java开发工程师', company: '蚂蚁集团', location: '杭州/上海', salaryMin: 35000, salaryMax: 60000, description: '负责蚂蚁集团支付核心系统的架构设计与开发', requirements: ['5年以上Java开发经验', '精通Spring Boot、Spring Cloud'], tags: ['Java', '微服务', '分布式', '云原生', 'Kubernetes'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-15' },
      { id: 'lagou-java-002', title: 'Java后端架构师', company: '美团', location: '北京', salaryMin: 50000, salaryMax: 80000, description: '负责美团外卖业务后端架构设计', requirements: ['8年以上Java开发经验', '3年以上架构设计经验'], tags: ['Java', '架构师', '微服务', 'DDD', 'Spring Cloud'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-18' },
      { id: 'lagou-java-003', title: 'Java开发工程师（金融科技方向）', company: '平安科技', location: '深圳/上海', salaryMin: 25000, salaryMax: 45000, description: '参与平安集团金融科技产品的后端开发', requirements: ['3年以上Java开发经验', '熟悉Spring Boot、MyBatis'], tags: ['Java', '金融科技', '微服务', 'Oracle', '支付系统'], category: 'engineer', industry: 'finance', source: '拉勾网', publishedAt: '2025-03-20' },
      { id: 'lagou-java-004', title: '资深Java工程师（供应链方向）', company: '京东', location: '北京', salaryMin: 30000, salaryMax: 50000, description: '负责京东供应链系统的后端开发', requirements: ['5年以上Java开发经验', '精通Spring Cloud、Dubbo'], tags: ['Java', '供应链', '微服务', '大数据', '分布式缓存'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-22' },
      { id: 'lagou-python-001', title: 'Python后端工程师', company: '字节跳动', location: '北京/上海', salaryMin: 30000, salaryMax: 50000, description: '负责抖音电商业务的后端开发', requirements: ['3年以上Python开发经验', '精通FastAPI、Django'], tags: ['Python', 'FastAPI', '异步编程', '微服务', '推荐系统'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-16' },
      { id: 'lagou-python-002', title: 'Python算法工程师', company: '小红书', location: '上海', salaryMin: 35000, salaryMax: 60000, description: '负责小红书内容推荐算法的工程实现', requirements: ['硕士及以上学历', '精通Python'], tags: ['Python', '机器学习', '推荐算法', '深度学习', '大数据'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-19' },
      { id: 'lagou-python-003', title: 'Python运维开发工程师（SRE方向）', company: '网易', location: '杭州/广州', salaryMin: 28000, salaryMax: 48000, description: '负责网易游戏业务的SRE体系建设', requirements: ['3年以上Python开发经验', '熟悉Django/Flask'], tags: ['Python', 'SRE', 'DevOps', 'Kubernetes', '自动化运维'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-21' },
      { id: 'lagou-go-001', title: 'Go语言后端工程师', company: '腾讯', location: '深圳/北京', salaryMin: 30000, salaryMax: 50000, description: '负责腾讯视频业务的后端服务开发', requirements: ['3年以上Go语言开发经验', '精通Go语言特性'], tags: ['Go', '微服务', 'gRPC', '高并发', '云原生'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-17' },
      { id: 'lagou-go-002', title: '资深Go工程师（云原生方向）', company: '阿里云', location: '杭州/北京', salaryMin: 40000, salaryMax: 70000, description: '负责阿里云容器服务的核心组件开发', requirements: ['5年以上Go开发经验', '有Kubernetes相关项目经验'], tags: ['Go', 'Kubernetes', '云原生', '容器', 'Docker'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-23' },
      { id: 'lagou-go-003', title: 'Go后端开发工程师（区块链方向）', company: '欧科云链', location: '北京', salaryMin: 35000, salaryMax: 60000, description: '负责区块链浏览器和数据分析平台的后端开发', requirements: ['3年以上Go开发经验', '熟悉区块链基本原理'], tags: ['Go', '区块链', 'Web3', '分布式', '大数据'], category: 'engineer', industry: 'web3', source: '拉勾网', publishedAt: '2025-03-25' },
      { id: 'lagou-fe-001', title: '高级前端工程师（React方向）', company: '滴滴出行', location: '北京/杭州', salaryMin: 30000, salaryMax: 50000, description: '负责滴滴出行司乘端H5和小程序的前端开发', requirements: ['5年以上前端开发经验', '精通React'], tags: ['React', 'TypeScript', '前端工程化', '移动端', '性能优化'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-18' },
      { id: 'lagou-fe-002', title: '前端架构师', company: '拼多多', location: '上海', salaryMin: 45000, salaryMax: 75000, description: '负责拼多多前端技术架构设计', requirements: ['8年以上前端开发经验', '3年以上架构设计经验'], tags: ['前端架构', 'React', '工程化', 'Node.js', '低代码'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-20' },
      { id: 'lagou-fe-003', title: '前端开发工程师（Vue方向）', company: '哔哩哔哩', location: '上海', salaryMin: 25000, salaryMax: 42000, description: '负责哔哩哔哩创作中心的前端开发', requirements: ['3年以上前端开发经验', '精通Vue2/Vue3'], tags: ['Vue', 'TypeScript', '可视化', '创作工具', '前端工程化'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-22' },
      { id: 'lagou-fe-004', title: 'Web3前端工程师', company: '币安', location: '远程', salaryMin: 40000, salaryMax: 70000, description: '负责币安Web3钱包和DApp的前端开发', requirements: ['3年以上前端开发经验', '精通React'], tags: ['Web3', 'React', 'DApp', '以太坊', 'DeFi'], category: 'engineer', industry: 'web3', source: '拉勾网', publishedAt: '2025-03-24' },
      { id: 'lagou-arch-001', title: '云原生架构师', company: '华为云', location: '深圳/北京/杭州', salaryMin: 50000, salaryMax: 90000, description: '负责华为云容器和微服务产品的架构设计', requirements: ['8年以上IT行业经验', '3年以上云原生架构经验'], tags: ['架构师', '云原生', 'Kubernetes', '微服务', 'Istio'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-19' },
      { id: 'lagou-sre-001', title: 'SRE高级工程师', company: '米哈游', location: '上海', salaryMin: 40000, salaryMax: 70000, description: '负责米哈游全球游戏服务的SRE体系建设', requirements: ['5年以上SRE或运维开发经验', '精通Linux系统'], tags: ['SRE', 'DevOps', 'Kubernetes', '监控', '高可用'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-21' },
      { id: 'lagou-devops-001', title: 'DevOps工程师', company: '蔚来汽车', location: '上海/合肥', salaryMin: 30000, salaryMax: 50000, description: '负责蔚来汽车研发效能平台的建设', requirements: ['3年以上DevOps或运维开发经验', '精通Jenkins、GitLab CI'], tags: ['DevOps', 'CI/CD', 'Kubernetes', 'Jenkins', '自动化'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-23' },
      { id: 'lagou-techlead-001', title: '技术负责人（后端方向）', company: '快手', location: '北京', salaryMin: 60000, salaryMax: 100000, description: '负责快手短视频业务后端团队的技术管理', requirements: ['8年以上后端开发经验', '2年以上团队管理经验'], tags: ['技术负责人', '团队管理', '微服务', '分布式', '架构设计'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-25' },
      { id: 'lagou-platform-001', title: '平台工程师', company: 'Shopee', location: '深圳/新加坡', salaryMin: 45000, salaryMax: 75000, description: '负责Shopee内部开发者平台的建设', requirements: ['5年以上平台开发或SRE经验', '精通Kubernetes'], tags: ['Platform Engineering', '云原生', 'Kubernetes', '开发者平台'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-26' },
      { id: 'lagou-infra-001', title: '基础架构工程师', company: '百度', location: '北京', salaryMin: 40000, salaryMax: 70000, description: '负责百度AI中台的基础架构建设', requirements: ['5年以上基础架构经验', '精通Go/C++'], tags: ['基础架构', '分布式系统', '调度系统', 'Linux内核'], category: 'engineer', industry: 'internet', source: '拉勾网', publishedAt: '2025-03-27' }
    ];
    
    lagouJobs.forEach(job => allRawJobs.push({ job, source: 'lagou' }));
    console.log(`    ✓ 读取到 ${lagouJobs.length} 条记录`);
  } catch (e) {
    console.log('    ✗ 读取失败:', e.message);
  }
  
  // 3. 读取智联招聘数据
  console.log('\n[3] 读取智联招聘数据...');
  try {
    const zhaopinJobs = [
      { id: 'zhaopin-001', title: 'Java软件开发工程师', company: '软通动力信息技术(集团)', location: '成都·武侯·桂溪', salaryMin: 12000, salaryMax: 20000, description: '从事通讯产品相关软件开发工作', requirements: ['本科及以上学历', '3年以上Java开发经验'], tags: ['Java', 'Spring', '微服务', 'MySQL'], category: 'backend', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-28' },
      { id: 'zhaopin-002', title: '嵌入式软件开发工程师', company: '四川天邑通信', location: '成都·武侯·红牌楼', salaryMin: 12000, salaryMax: 20000, description: '从事通讯产品相关软件开发工作', requirements: ['本科及以上学历', '3-5年嵌入式开发经验'], tags: ['C/C++', '嵌入式', 'Linux', 'PON'], category: 'embedded', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-28' },
      { id: 'zhaopin-003', title: '软件测试工程师', company: '软通动力信息技术(集团)', location: '成都·郫都·合作街道', salaryMin: 8000, salaryMax: 12000, description: '负责软件测评需求分析', requirements: ['大专及以上学历', '2年以上测试经验'], tags: ['功能测试', '自动化测试', 'Python', 'Selenium'], category: 'qa', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-28' },
      { id: 'zhaopin-004', title: 'Linux运维工程师', company: '西安华为研究所', location: '西安·雁塔·丈八沟', salaryMin: 10000, salaryMax: 18000, description: '负责服务器运维、云运维', requirements: ['本科及以上学历', '1-3年运维经验'], tags: ['Linux', 'Docker', 'K8S', 'Shell'], category: 'devops', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-25' },
      { id: 'zhaopin-005', title: '高级前端开发工程师', company: '南京绛门信息', location: '南京·浦口·沿江', salaryMin: 12000, salaryMax: 22000, description: '负责智能巡视系统的前端开发', requirements: ['本科及以上学历', '5年以上前端经验'], tags: ['Vue', 'React', 'WebSocket', 'GIS'], category: 'frontend', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-20' },
      { id: 'zhaopin-006', title: 'C/C++软件开发工程师', company: '华为成都研究所', location: '成都·郫都·合作街道', salaryMin: 13000, salaryMax: 26000, description: '从事核心系统软件开发', requirements: ['本科及以上学历', '1年以上C/C++开发经验'], tags: ['C++', 'C语言', 'Linux', '多线程'], category: 'backend', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-28' },
      { id: 'zhaopin-007', title: '软件产品经理', company: '四川中曼石油设备制造', location: '成都·武侯·石羊', salaryMin: 10000, salaryMax: 15000, description: '负责产品全生命周期管理', requirements: ['本科及以上学历', '3-5年产品经理经验'], tags: ['B端产品', 'Axure', 'PRD', '需求分析'], category: 'product', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-26' },
      { id: 'zhaopin-008', title: '大数据平台产品经理', company: '智联招聘', location: '杭州', salaryMin: 20000, salaryMax: 35000, description: '负责大数据平台产品的规划与设计', requirements: ['本科及以上学历', '5-10年产品经验'], tags: ['数据产品', '数据分析', '平台产品'], category: 'product', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-22' },
      { id: 'zhaopin-009', title: '新媒体运营专员', company: '武汉江城百臻供应链', location: '武汉·江岸', salaryMin: 4000, salaryMax: 6000, description: '负责电商平台日常运营', requirements: ['大专及以上学历', '1-3年运营经验'], tags: ['新媒体运营', '内容运营', '短视频'], category: 'operation', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-29' },
      { id: 'zhaopin-010', title: '亚马逊跨境电商运营', company: '苏州联之胜网络科技', location: '苏州', salaryMin: 7000, salaryMax: 13000, description: '负责亚马逊店铺整体运营', requirements: ['大专及以上学历', '3-5年亚马逊运营经验'], tags: ['跨境电商', '亚马逊', '精品运营'], category: 'operation', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-15' },
      { id: 'zhaopin-011', title: '项目运营助理', company: '杭州金叹信息', location: '杭州·西湖·灵隐', salaryMin: 5000, salaryMax: 10000, description: '协助项目经理进行项目规划', requirements: ['大专及以上学历', '经验不限'], tags: ['产品运营', '用户运营', 'TOB'], category: 'operation', industry: 'internet', source: '智联招聘', publishedAt: '2026-04-01' },
      { id: 'zhaopin-012', title: '市场推广专员', company: '武汉讯捷', location: '武汉·洪山·洪山街道', salaryMin: 8000, salaryMax: 14000, description: '针对重点区域、行业、客户深度开发', requirements: ['大专及以上学历', '经验不限'], tags: ['市场推广', '渠道拓展', '互联网'], category: 'marketing', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-30' },
      { id: 'zhaopin-013', title: '市场推广专员', company: '宁波博威合金', location: '宁波·鄞州·云龙', salaryMin: 9000, salaryMax: 12000, description: '协助完成市场推广方案策划', requirements: ['大专及以上学历', '1-3年市场推广经验'], tags: ['市场推广', '展会策划', '品牌宣传'], category: 'marketing', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-28' },
      { id: 'zhaopin-014', title: '数据分析师', company: '迈得医疗工业设备', location: '杭州·上城·九堡', salaryMin: 12000, salaryMax: 24000, description: '从各渠道提取销售、库存等数据', requirements: ['本科及以上学历', '1-3年数据分析经验'], tags: ['数据分析', '数据挖掘', 'SQL', 'Python'], category: 'data', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-27' },
      { id: 'zhaopin-015', title: '全栈软件开发工程师', company: '深圳智安信息安全', location: '成都·武侯·桂溪', salaryMin: 11000, salaryMax: 18000, description: '负责公司核心系统的全栈开发', requirements: ['本科及以上学历', '1-3年全栈开发经验'], tags: ['Golang', 'Python', 'C++', 'AI编程'], category: 'fullstack', industry: 'internet', source: '智联招聘', publishedAt: '2026-03-26' }
    ];
    
    zhaopinJobs.forEach(job => allRawJobs.push({ job, source: 'zhaopin' }));
    console.log(`    ✓ 读取到 ${zhaopinJobs.length} 条记录`);
  } catch (e) {
    console.log('    ✗ 读取失败:', e.message);
  }
  
  // 4. 读取猎聘数据
  console.log('\n[4] 读取猎聘高薪数据...');
  try {
    const liepinJobs = [
      { id: 'liepin-001', title: '技术总监（IT数字化智能化）', company: '外资知名咨询公司', location: '北京', salaryMin: 60, salaryMax: 90, description: '负责IT数字化智能化战略', requirements: ['10年以上IT经验', '技术管理经验'], tags: ['技术总监', 'IT数字化', '智能化'], category: 'management', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-002', title: '技术副总裁（VP）', company: '深圳鲸驰达科技', location: '深圳-南山区', salaryMin: 150, salaryMax: 260, description: '负责公司技术战略规划', requirements: ['15年以上技术经验', 'VP级别管理经验'], tags: ['VP', '技术副总裁', 'CTO'], category: 'management', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-003', title: '首席架构师/技术合伙人', company: '知名科技金融公司', location: '北京', salaryMin: 100, salaryMax: 200, description: '负责公司整体技术架构', requirements: ['12年以上架构经验', '技术合伙人经验'], tags: ['首席架构师', '技术合伙人', '架构师'], category: 'management', industry: 'finance', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-004', title: '产品总监', company: '知名互联网公司', location: '上海', salaryMin: 60, salaryMax: 80, description: '负责产品线战略规划', requirements: ['8年以上产品经验', '产品团队管理经验'], tags: ['产品总监', '产品经理', 'CPO'], category: 'management', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-005', title: '算法专家（NLP、语音合成、大模型）', company: '大型知名互联网巨头', location: '上海/杭州', salaryMin: 40, salaryMax: 60, description: '负责AI算法研发', requirements: ['博士学历', 'NLP/大模型经验'], tags: ['算法专家', 'NLP', '大模型', 'AI'], category: 'engineer', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-006', title: '集团副总裁（VP）- 国际资本与战略投融资', company: '知名医疗器械公司', location: '深圳', salaryMin: 50, salaryMax: 80, description: '负责国际资本运作', requirements: ['10年以上投融资经验', '医疗行业背景'], tags: ['VP', '副总裁', '投融资'], category: 'management', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-007', title: '总部技术总监', company: '知名集团总部', location: '广州', salaryMin: 80, salaryMax: 100, description: '负责集团技术管理', requirements: ['12年以上技术经验', '集团总部管理经验'], tags: ['技术总监', '总部', 'CTO'], category: 'management', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-008', title: '市场营销副总裁（VP）', company: '知名基金证券公司', location: '北京', salaryMin: 90, salaryMax: 120, description: '负责市场营销战略', requirements: ['10年以上市场营销经验', '金融行业背景'], tags: ['VP', '副总裁', '市场营销'], category: 'management', industry: 'finance', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-009', title: '事业部副总裁（BU VP）', company: 'Michael Page', location: '苏州-昆山', salaryMin: 100, salaryMax: 150, description: '负责事业部运营管理', requirements: ['15年以上管理经验', '半导体/ODM经验'], tags: ['VP', '事业部副总裁', '半导体'], category: 'management', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-010', title: '技术总监（全栈）', company: '知名科技公司', location: '深圳', salaryMin: 60, salaryMax: 85, description: '负责全栈技术管理', requirements: ['10年以上全栈开发经验', '技术团队管理经验'], tags: ['技术总监', '全栈', 'CTO'], category: 'management', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-011', title: '工业AI算法专家', company: '知名上市公司', location: '杭州-滨江区', salaryMin: 70, salaryMax: 100, description: '负责工业AI算法研发', requirements: ['博士学历', '工业AI经验'], tags: ['算法专家', '工业AI', 'AI'], category: 'engineer', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-012', title: '技术总监（大数据/区块链/AI方向）', company: '知名科技公司', location: '深圳', salaryMin: 50, salaryMax: 80, description: '负责前沿技术方向管理', requirements: ['10年以上技术经验', '大数据/区块链/AI背景'], tags: ['技术总监', '大数据', '区块链', 'AI'], category: 'management', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-013', title: '搜索推荐算法专家', company: '知名互联网上市公司', location: '北京', salaryMin: 70, salaryMax: 100, description: '负责搜索推荐算法', requirements: ['博士学历', '搜索推荐算法经验'], tags: ['算法专家', '搜索算法', '推荐算法'], category: 'engineer', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-014', title: '技术总监 - 储能', company: '知名新能源公司', location: '苏州', salaryMin: 35, salaryMax: 65, description: '负责储能技术管理', requirements: ['8年以上技术经验', '储能行业背景'], tags: ['技术总监', '储能', '新能源'], category: 'management', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' },
      { id: 'liepin-015', title: '无线算法专家（AI与无线算法融合方向）', company: '知名电子半导体公司', location: '上海', salaryMin: 90, salaryMax: 120, description: '负责无线算法研发', requirements: ['博士学历', '无线算法经验'], tags: ['算法专家', '无线算法', 'AI'], category: 'engineer', industry: 'internet', source: '猎聘', publishedAt: '2026-04-02' }
    ];
    
    liepinJobs.forEach(job => allRawJobs.push({ job, source: 'liepin' }));
    console.log(`    ✓ 读取到 ${liepinJobs.length} 条记录`);
  } catch (e) {
    console.log('    ✗ 读取失败:', e.message);
  }
  
  // 5. 读取Web3数据
  console.log('\n[5] 读取Web3岗位数据...');
  try {
    const jobsDir = path.join(dataDir, 'jobs');
    const web3Files = fs.readdirSync(jobsDir).filter(f => f.startsWith('web3-') && f.endsWith('.json'));
    
    for (const file of web3Files) {
      const content = fs.readFileSync(path.join(jobsDir, file), 'utf-8');
      const job = JSON.parse(content);
      allRawJobs.push({ job, source: 'web3' });
    }
    console.log(`    ✓ 读取到 ${web3Files.length} 条记录`);
  } catch (e) {
    console.log('    ✗ 读取失败:', e.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`原始数据总数: ${allRawJobs.length} 条`);
  console.log('='.repeat(60));
  
  // 清洗数据
  console.log('\n[6] 开始数据清洗...');
  const cleanedJobs = [];
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
  
  const { uniqueJobs, removedJobs } = deduplicateJobs(cleanedJobs);
  
  console.log(`\n    去重前: ${cleanedJobs.length} 条`);
  console.log(`    去重后: ${uniqueJobs.length} 条`);
  console.log(`    去除重复: ${removedJobs.length} 条`);
  
  // 输出去重详情
  if (removedJobs.length > 0) {
    console.log('\n    去重详情:');
    const byReason = {};
    removedJobs.forEach(({ reason, job }) => {
      byReason[reason] = byReason[reason] || [];
      byReason[reason].push(`${job.company} - ${job.title}`);
    });
    Object.entries(byReason).forEach(([reason, items]) => {
      console.log(`      ${reason}: ${items.length} 条`);
      items.slice(0, 3).forEach(item => console.log(`        - ${item}`));
      if (items.length > 3) console.log(`        ... 等${items.length}条`);
    });
  }
  
  // 生成统计信息
  console.log('\n[8] 生成统计信息...');
  const stats = {
    total: uniqueJobs.length,
    bySource: {},
    byIndustry: {},
    byLocation: {},
    byCategory: {},
    salaryRange: {
      min: Math.min(...uniqueJobs.map(j => j.salaryMin)),
      max: Math.max(...uniqueJobs.map(j => j.salaryMax))
    }
  };
  
  uniqueJobs.forEach(job => {
    stats.bySource[job.source] = (stats.bySource[job.source] || 0) + 1;
    stats.byIndustry[job.industry] = (stats.byIndustry[job.industry] || 0) + 1;
    stats.byLocation[job.location] = (stats.byLocation[job.location] || 0) + 1;
    stats.byCategory[job.category] = (stats.byCategory[job.category] || 0) + 1;
  });
  
  console.log('\n    按来源分布:');
  Object.entries(stats.bySource).forEach(([source, count]) => {
    console.log(`      - ${source}: ${count} 条`);
  });
  
  console.log('\n    按行业分布:');
  Object.entries(stats.byIndustry).forEach(([industry, count]) => {
    console.log(`      - ${industry}: ${count} 条`);
  });
  
  console.log('\n    按类别分布:');
  Object.entries(stats.byCategory).forEach(([category, count]) => {
    console.log(`      - ${category}: ${count} 条`);
  });
  
  console.log('\n    按地点分布(Top 10):');
  Object.entries(stats.byLocation)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
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

export const cleanedJobs = ${JSON.stringify(uniqueJobs, null, 2)};

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
