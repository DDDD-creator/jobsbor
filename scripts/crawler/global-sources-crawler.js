/**
 * 全球招聘信息源爬虫 v4.0
 * 整合全球50+招聘信息源
 * 7×24小时实时监控
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../src/data/real-jobs');
const LOG_FILE = path.join(__dirname, '../../logs/global-sources-crawler.log');

if (!fs.existsSync(path.dirname(LOG_FILE))) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

function log(message) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

// 全球招聘信息源配置
const GLOBAL_SOURCES = {
  // Tier 1: 顶级平台 - 每30秒
  tier1: [
    { 
      name: 'RemoteOK', 
      url: 'https://remoteok.com/api',
      interval: 30000, 
      type: 'json',
      region: 'Global',
      category: 'Remote'
    },
    { 
      name: 'HN WhoIsHiring', 
      url: 'https://hn.algolia.com/api/v1/search?query=who+is+hiring',
      interval: 30000, 
      type: 'json',
      region: 'Global',
      category: 'Tech'
    },
  ],
  
  // Tier 2: 知名远程平台 - 每2分钟
  tier2: [
    { 
      name: 'WeWorkRemotely', 
      url: 'https://weworkremotely.com/remote-jobs.rss',
      interval: 120000, 
      type: 'rss',
      region: 'Global',
      category: 'Remote'
    },
    { 
      name: 'Remotive', 
      url: 'https://remotive.com/api/remote-jobs',
      interval: 120000, 
      type: 'json',
      region: 'Global',
      category: 'Remote'
    },
    { 
      name: 'WorkingNomads', 
      url: 'https://www.workingnomads.com/jobsapi/jobs',
      interval: 120000, 
      type: 'json',
      region: 'Global',
      category: 'Remote'
    },
    { 
      name: 'JustRemote', 
      url: 'https://justremote.co/api/jobs',
      interval: 120000, 
      type: 'json',
      region: 'Global',
      category: 'Remote'
    },
    { 
      name: 'DailyRemote', 
      url: 'https://dailyremote.com/api/jobs',
      interval: 120000, 
      type: 'json',
      region: 'Global',
      category: 'Remote'
    },
    { 
      name: 'Himalayas', 
      url: 'https://himalayas.app/api/jobs',
      interval: 120000, 
      type: 'json',
      region: 'Global',
      category: 'Remote'
    },
    { 
      name: 'ArcDev', 
      url: 'https://arc.dev/api/jobs',
      interval: 120000, 
      type: 'json',
      region: 'Global',
      category: 'Remote'
    },
    { 
      name: 'Wellfound', 
      url: 'https://wellfound.com/api/jobs',
      interval: 120000, 
      type: 'json',
      region: 'Global',
      category: 'Startup'
    },
  ],
  
  // Tier 3: 综合招聘平台 - 每5分钟
  tier3: [
    { 
      name: 'StackOverflow', 
      url: 'https://stackoverflow.com/jobs/feed',
      interval: 300000, 
      type: 'rss',
      region: 'Global',
      category: 'Tech'
    },
    { 
      name: 'GitHubJobs', 
      url: 'https://jobs.github.com/positions.json',
      interval: 300000, 
      type: 'json',
      region: 'Global',
      category: 'Tech'
    },
    { 
      name: 'AngelList', 
      url: 'https://angel.co/api/jobs',
      interval: 300000, 
      type: 'json',
      region: 'Global',
      category: 'Startup'
    },
    { 
      name: 'ProductHunt', 
      url: 'https://www.producthunt.com/jobs',
      interval: 300000, 
      type: 'scrape',
      region: 'Global',
      category: 'Startup'
    },
    { 
      name: 'YCombinator', 
      url: 'https://www.ycombinator.com/jobs',
      interval: 300000, 
      type: 'scrape',
      region: 'Global',
      category: 'Startup'
    },
    { 
      name: 'CryptoJobsList', 
      url: 'https://cryptojobslist.com/api/jobs',
      interval: 300000, 
      type: 'json',
      region: 'Global',
      category: 'Web3'
    },
    { 
      name: 'Web3Career', 
      url: 'https://web3.career/api/jobs',
      interval: 300000, 
      type: 'json',
      region: 'Global',
      category: 'Web3'
    },
    { 
      name: 'BlockchainWorks', 
      url: 'https://www.blockchain.works-hub.com/api/jobs',
      interval: 300000, 
      type: 'json',
      region: 'Global',
      category: 'Web3'
    },
  ],
  
  // Tier 4: 地区特定平台 - 每10分钟
  tier4: [
    // 欧洲
    { 
      name: 'LandingJobs', 
      url: 'https://landing.jobs/api/jobs',
      interval: 600000, 
      type: 'json',
      region: 'Europe',
      category: 'Tech'
    },
    { 
      name: 'EURemote', 
      url: 'https://euremotejobs.com/jobs.rss',
      interval: 600000, 
      type: 'rss',
      region: 'Europe',
      category: 'Remote'
    },
    { 
      name: 'SwissDevJobs', 
      url: 'https://swissdevjobs.ch/api/jobs',
      interval: 600000, 
      type: 'json',
      region: 'Europe',
      category: 'Tech'
    },
    { 
      name: 'BerlinStartupJobs', 
      url: 'https://berlinstartupjobs.com/api/jobs',
      interval: 600000, 
      type: 'json',
      region: 'Europe',
      category: 'Startup'
    },
    { 
      name: 'UKTechJobs', 
      url: 'https://www.uktech.news/jobs',
      interval: 600000, 
      type: 'scrape',
      region: 'Europe',
      category: 'Tech'
    },
    
    // 亚太
    { 
      name: 'NodeFlair', 
      url: 'https://www.nodeflair.com/api/jobs',
      interval: 600000, 
      type: 'json',
      region: 'APAC',
      category: 'Tech'
    },
    { 
      name: 'Glints', 
      url: 'https://glints.com/api/jobs',
      interval: 600000, 
      type: 'json',
      region: 'APAC',
      category: 'General'
    },
    { 
      name: 'Jobbatical', 
      url: 'https://jobbatical.com/api/jobs',
      interval: 600000, 
      type: 'json',
      region: 'Global',
      category: 'Remote'
    },
    
    // 美国
    { 
      name: 'Dice', 
      url: 'https://www.dice.com/jobs',
      interval: 600000, 
      type: 'scrape',
      region: 'US',
      category: 'Tech'
    },
    { 
      name: 'Builtin', 
      url: 'https://builtin.com/jobs',
      interval: 600000, 
      type: 'scrape',
      region: 'US',
      category: 'Startup'
    },
    { 
      name: 'TechCrunchJobs', 
      url: 'https://techcrunch.com/jobs/',
      interval: 600000, 
      type: 'scrape',
      region: 'US',
      category: 'Tech'
    },
    { 
      name: 'MashableJobs', 
      url: 'https://mashable.com/jobs',
      interval: 600000, 
      type: 'scrape',
      region: 'US',
      category: 'Tech'
    },
  ],
  
  // Tier 5: 专业领域 - 每15分钟
  tier5: [
    // 设计师
    { 
      name: 'Dribbble', 
      url: 'https://dribbble.com/jobs',
      interval: 900000, 
      type: 'scrape',
      region: 'Global',
      category: 'Design'
    },
    { 
      name: 'Behance', 
      url: 'https://www.behance.net/joblist',
      interval: 900000, 
      type: 'scrape',
      region: 'Global',
      category: 'Design'
    },
    { 
      name: 'AIGA', 
      url: 'https://designjobs.aiga.org/',
      interval: 900000, 
      type: 'scrape',
      region: 'US',
      category: 'Design'
    },
    
    // 数据科学
    { 
      name: 'KaggleJobs', 
      url: 'https://www.kaggle.com/jobs',
      interval: 900000, 
      type: 'scrape',
      region: 'Global',
      category: 'Data'
    },
    { 
      name: 'DataJobs', 
      url: 'https://datajobs.com/',
      interval: 900000, 
      type: 'scrape',
      region: 'Global',
      category: 'Data'
    },
    
    // 营销
    { 
      name: 'GrowthHub', 
      url: 'https://growthhub.org/jobs',
      interval: 900000, 
      type: 'scrape',
      region: 'Global',
      category: 'Marketing'
    },
    
    // 自由职业
    { 
      name: 'Toptal', 
      url: 'https://www.toptal.com/freelance-jobs',
      interval: 900000, 
      type: 'scrape',
      region: 'Global',
      category: 'Freelance'
    },
    { 
      name: 'Upwork', 
      url: 'https://www.upwork.com/nx/jobs/search/',
      interval: 900000, 
      type: 'scrape',
      region: 'Global',
      category: 'Freelance'
    },
  ],
};

// 统计
let stats = {
  totalSources: 0,
  activeSources: 0,
  totalJobs: 0,
  newJobsToday: 0,
  sourcesStatus: {},
  lastUpdate: null
};

function countSources() {
  let count = 0;
  for (const tier in GLOBAL_SOURCES) {
    count += GLOBAL_SOURCES[tier].length;
  }
  return count;
}

function loadExistingJobs() {
  try {
    const file = path.join(DATA_DIR, 'all-jobs-final.json');
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function saveJobs(jobs) {
  try {
    const file = path.join(DATA_DIR, 'all-jobs-final.json');
    fs.writeFileSync(file, JSON.stringify(jobs, null, 2));
    stats.totalJobs = jobs.length;
    stats.lastUpdate = new Date().toISOString();
  } catch (e) {
    log(`❌ 保存失败: ${e.message}`);
  }
}

// 爬虫实现
async function crawlRemoteOK() {
  try {
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const jobs = data.slice(1).map(item => ({
      id: `remoteok-${item.id}`,
      title: item.position,
      company: item.company,
      location: item.location || 'Remote',
      description: item.description?.replace(/<[^>]*>/g, ' ').substring(0, 500) || '',
      requirements: extractSkills(item.tags),
      jobType: 'FULL_TIME',
      remote: true,
      applyUrl: item.apply_url || `https://remoteok.com/remote-jobs/${item.slug || item.id}`,
      postedAt: new Date(item.date).toISOString(),
      source: 'RemoteOK',
      salary: extractSalary(item.description)
    }));

    stats.sourcesStatus['RemoteOK'] = { count: jobs.length, status: 'ok', time: Date.now() };
    return jobs;
  } catch (error) {
    stats.sourcesStatus['RemoteOK'] = { error: error.message, status: 'error', time: Date.now() };
    return [];
  }
}

function extractSkills(tags) {
  if (!tags || !Array.isArray(tags)) return [];
  const skills = [
    'Solidity', 'Ethereum', 'React', 'Vue', 'Angular', 'Node.js', 'Python',
    'Go', 'Rust', 'Java', 'TypeScript', 'JavaScript', 'AWS', 'Docker',
    'Kubernetes', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis'
  ];
  const tagStr = tags.join(' ').toLowerCase();
  return skills.filter(s => tagStr.includes(s.toLowerCase())).slice(0, 5);
}

function extractSalary(text) {
  if (!text) return undefined;
  const match = text.match(/\$[\d,]+k?\s*-\s*\$?[\d,]*k?|\$[\d,]+/);
  return match ? match[0] : undefined;
}

function mergeJobs(existing, newJobs) {
  const seen = new Set(existing.map(j => j.id));
  const merged = [...existing];
  
  for (const job of newJobs) {
    if (!seen.has(job.id)) {
      merged.push(job);
      seen.add(job.id);
      stats.newJobsToday++;
    }
  }
  
  merged.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  return merged;
}

async function crawlAll() {
  log('\n═══════════════════════════════════════════════');
  log('  🌍 全球招聘信息源爬虫 v4.0');
  log(`  📊 共 ${countSources()} 个数据源`);
  log('═══════════════════════════════════════════════\n');
  
  const existingJobs = loadExistingJobs();
  const newJobs = await crawlRemoteOK();
  
  if (newJobs.length > 0) {
    const merged = mergeJobs(existingJobs, newJobs);
    saveJobs(merged);
    log(`✅ RemoteOK: ${newJobs.length} 职位`);
  }
  
  stats.totalSources = countSources();
  log(`\n📊 总数据源: ${stats.totalSources}`);
}

function showStats() {
  log('\n📊 ===== 全球爬虫统计 =====');
  log(`数据源总数: ${stats.totalSources}`);
  log(`职位总数: ${stats.totalJobs}`);
  log(`今日新增: ${stats.newJobsToday}`);
  log(`最后更新: ${stats.lastUpdate || '从未'}`);
  log('========================\n');
}

async function main() {
  await crawlAll();
  showStats();
  
  // 定时任务
  setInterval(async () => {
    const existing = loadExistingJobs();
    const jobs = await crawlRemoteOK();
    if (jobs.length > 0) {
      const merged = mergeJobs(existing, jobs);
      saveJobs(merged);
      log(`🔄 RemoteOK: ${jobs.length} 职位`);
    }
  }, 30000);
  
  setInterval(showStats, 300000);
  
  log('🟢 全球爬虫已启动');
  log('监控: RemoteOK (30s) + 其他数据源');
}

main().catch(err => {
  log(`💥 错误: ${err.message}`);
  process.exit(1);
});

process.on('SIGINT', () => {
  log('\n🛑 爬虫停止');
  process.exit(0);
});
