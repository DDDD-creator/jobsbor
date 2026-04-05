/**
 * 多源实时爬虫 v2.0
 * 7×24小时全网职位监控
 * 同时抓取多个数据源
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../src/data/real-jobs');
const LOG_FILE = path.join(__dirname, '../../logs/multi-source-crawler.log');

// 确保日志目录存在
if (!fs.existsSync(path.dirname(LOG_FILE))) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

function log(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}`;
  console.log(logLine);
  fs.appendFileSync(LOG_FILE, logLine + '\n');
}

// 数据源配置
const SOURCES = {
  // Tier 1: 高优先级 - 每30秒检查
  tier1: [
    { name: 'RemoteOK', url: 'https://remoteok.com/api', interval: 30000 },
  ],
  // Tier 2: 中优先级 - 每2分钟检查
  tier2: [
    { name: 'WeWorkRemotely', url: 'https://weworkremotely.com/remote-jobs.rss', interval: 120000 },
    { name: 'WorkingNomads', url: 'https://www.workingnomads.com/jobsapi/jobs', interval: 120000 },
  ],
  // Tier 3: 公司官网 - 每5分钟检查
  tier3: [
    { name: 'Google', type: 'company', interval: 300000 },
    { name: 'Amazon', type: 'company', interval: 300000 },
    { name: 'Meta', type: 'company', interval: 300000 },
    { name: 'Apple', type: 'company', interval: 300000 },
    { name: 'Microsoft', type: 'company', interval: 300000 },
    { name: 'Netflix', type: 'company', interval: 300000 },
    { name: 'Stripe', type: 'company', interval: 300000 },
    { name: 'OpenAI', type: 'company', interval: 300000 },
    { name: 'Anthropic', type: 'company', interval: 300000 },
    { name: 'Coinbase', type: 'company', interval: 300000 },
  ]
};

// 统计信息
let stats = {
  totalJobs: 0,
  newJobsToday: 0,
  lastUpdate: null,
  sourcesStatus: {}
};

/**
 * 加载现有职位数据
 */
function loadExistingJobs() {
  try {
    const file = path.join(DATA_DIR, 'all-jobs-final.json');
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (e) {
    log(`⚠️ 加载现有职位失败: ${e.message}`);
  }
  return [];
}

/**
 * 保存职位数据
 */
function saveJobs(jobs) {
  try {
    const file = path.join(DATA_DIR, 'all-jobs-final.json');
    fs.writeFileSync(file, JSON.stringify(jobs, null, 2));
    stats.totalJobs = jobs.length;
    stats.lastUpdate = new Date().toISOString();
  } catch (e) {
    log(`❌ 保存职位失败: ${e.message}`);
  }
}

/**
 * 抓取 RemoteOK
 */
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
      applyUrl: item.apply_url || `https://remoteOK.com/remote-jobs/${item.slug || item.id}`,
      postedAt: new Date(item.date).toISOString(),
      source: 'RemoteOK',
      salary: extractSalary(item.description)
    }));

    stats.sourcesStatus['RemoteOK'] = { lastCheck: Date.now(), count: jobs.length, status: 'ok' };
    return jobs;
  } catch (error) {
    stats.sourcesStatus['RemoteOK'] = { lastCheck: Date.now(), error: error.message, status: 'error' };
    log(`❌ RemoteOK 失败: ${error.message}`);
    return [];
  }
}

/**
 * 抓取 WeWorkRemotely (JSON API)
 */
async function crawlWWR() {
  try {
    // 尝试使用WWR的JSON API代替RSS
    const response = await fetch('https://weworkremotely.com/remote-jobs.json', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://weworkremotely.com/',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    if (!response.ok) {
      // 如果JSON API失败，尝试RSS
      return await crawlWWR_RSS();
    }
    
    const data = await response.json();
    const jobs = data.map((item, idx) => ({
      id: `wwr-${item.id || idx}-${Date.now()}`,
      title: item.title || 'Unknown Position',
      company: item.company_name || 'Unknown',
      location: 'Remote',
      description: (item.description || '').substring(0, 300),
      requirements: [],
      jobType: 'FULL_TIME',
      remote: true,
      applyUrl: item.url || `https://weworkremotely.com${item.path}`,
      postedAt: new Date(item.created_at || Date.now()).toISOString(),
      source: 'WeWorkRemotely'
    })).slice(0, 50);

    stats.sourcesStatus['WeWorkRemotely'] = { lastCheck: Date.now(), count: jobs.length, status: 'ok' };
    log(`✅ WeWorkRemotely JSON: ${jobs.length} 个职位`);
    return jobs;
  } catch (error) {
    log(`❌ WeWorkRemotely JSON失败: ${error.message}，尝试RSS...`);
    return await crawlWWR_RSS();
  }
}

/**
 * 抓取 WeWorkRemotely (RSS备用)
 */
async function crawlWWR_RSS() {
  try {
    // 添加延迟避免被屏蔽
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch('https://weworkremotely.com/remote-jobs.rss', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Referer': 'https://weworkremotely.com/remote-jobs'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const xml = await response.text();
    const items = parseRSS(xml);
    
    const jobs = items.map((item, idx) => ({
      id: `wwr-${idx}-${Date.now()}`,
      title: item.title,
      company: item.company || 'Unknown',
      location: 'Remote',
      description: item.description?.substring(0, 300) || '',
      requirements: [],
      jobType: 'FULL_TIME',
      remote: true,
      applyUrl: item.link,
      postedAt: new Date(item.pubDate).toISOString(),
      source: 'WeWorkRemotely'
    }));

    stats.sourcesStatus['WeWorkRemotely'] = { lastCheck: Date.now(), count: jobs.length, status: 'ok' };
    log(`✅ WeWorkRemotely RSS: ${jobs.length} 个职位`);
    return jobs;
  } catch (error) {
    stats.sourcesStatus['WeWorkRemotely'] = { lastCheck: Date.now(), error: error.message, status: 'error' };
    log(`❌ WeWorkRemotely RSS也失败: ${error.message}`);
    return [];
  }
}

/**
 * 简化的RSS解析
 */
function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    items.push({
      title: extractXmlTag(itemXml, 'title'),
      link: extractXmlTag(itemXml, 'link'),
      description: extractXmlTag(itemXml, 'description'),
      pubDate: extractXmlTag(itemXml, 'pubDate'),
      company: extractXmlTag(itemXml, 'company')
    });
  }
  
  return items;
}

function extractXmlTag(xml, tag) {
  const regex = new RegExp(`<${tag}>([^<]*)<\/${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

/**
 * 提取技能标签
 */
function extractSkills(tags) {
  if (!tags || !Array.isArray(tags)) return [];
  const skills = [
    'Solidity', 'Ethereum', 'React', 'Vue', 'Angular', 'Node.js', 'Python',
    'Go', 'Rust', 'Java', 'TypeScript', 'JavaScript', 'AWS', 'Docker',
    'Kubernetes', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'DeFi',
    'Smart Contracts', 'Blockchain', 'Crypto', 'AI', 'ML', 'TensorFlow',
    'PyTorch', 'NLP', 'Data Science', 'Web3', 'Next.js', 'Tailwind'
  ];
  const tagStr = tags.join(' ').toLowerCase();
  return skills.filter(s => tagStr.includes(s.toLowerCase())).slice(0, 5);
}

/**
 * 提取薪资
 */
function extractSalary(text) {
  if (!text) return undefined;
  const match = text.match(/\$[\d,]+k?\s*-\s*\$?[\d,]*k?|\$[\d,]+/);
  return match ? match[0] : undefined;
}

/**
 * 合并职位数据（去重）
 */
function mergeJobs(existingJobs, newJobs) {
  const seen = new Set(existingJobs.map(j => j.id));
  const merged = [...existingJobs];
  
  for (const job of newJobs) {
    if (!seen.has(job.id)) {
      merged.push(job);
      seen.add(job.id);
      stats.newJobsToday++;
    }
  }
  
  // 按发布时间排序
  merged.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  
  return merged;
}

/**
 * 触发部署
 */
async function triggerDeploy() {
  try {
    log('🚀 触发自动部署...');
    const { execSync } = require('child_process');
    
    // 构建
    execSync('npm run build', {
      cwd: path.join(__dirname, '../..'),
      stdio: 'pipe'
    });
    
    log('✅ 部署完成');
  } catch (error) {
    log(`❌ 部署失败: ${error.message}`);
  }
}

/**
 * 主爬虫循环
 */
async function crawlAll() {
  log('🔍 开始全网抓取...');
  
  const existingJobs = loadExistingJobs();
  let newJobsCount = 0;
  
  // Tier 1: RemoteOK
  const remoteokJobs = await crawlRemoteOK();
  if (remoteokJobs.length > 0) {
    log(`✅ RemoteOK: ${remoteokJobs.length} 个职位`);
  }
  
  // Tier 2: WeWorkRemotely
  const wwrJobs = await crawlWWR();
  if (wwrJobs.length > 0) {
    log(`✅ WeWorkRemotely: ${wwrJobs.length} 个职位`);
  }
  
  // 合并所有新职位
  const allNewJobs = [...remoteokJobs, ...wwrJobs];
  
  if (allNewJobs.length > 0) {
    const merged = mergeJobs(existingJobs, allNewJobs);
    saveJobs(merged);
    newJobsCount = allNewJobs.length;
    log(`💾 已保存 ${merged.length} 个职位 (新增 ${newJobsCount})`);
  } else {
    log('⏳ 暂无新职位');
  }
  
  return newJobsCount;
}

/**
 * 显示统计信息
 */
function showStats() {
  log('\n📊 ===== 实时统计 =====');
  log(`总职位数: ${stats.totalJobs}`);
  log(`今日新增: ${stats.newJobsToday}`);
  log(`最后更新: ${stats.lastUpdate || '从未'}`);
  log('数据源状态:');
  Object.entries(stats.sourcesStatus).forEach(([name, status]) => {
    const icon = status.status === 'ok' ? '✅' : '❌';
    log(`  ${icon} ${name}: ${status.count || 0} 职位`);
  });
  log('=====================\n');
}

/**
 * 主循环
 */
async function main() {
  log('\n═══════════════════════════════════════');
  log('  🕷️ 多源实时爬虫 v2.0 - 7×24小时运行');
  log('═══════════════════════════════════════\n');
  
  // 首次运行
  await crawlAll();
  showStats();
  
  // RemoteOK 每30秒
  setInterval(async () => {
    const existing = loadExistingJobs();
    const jobs = await crawlRemoteOK();
    if (jobs.length > 0) {
      const merged = mergeJobs(existing, jobs);
      saveJobs(merged);
      log(`🔄 RemoteOK 更新: ${jobs.length} 个职位`);
    }
  }, 30000);
  
  // WeWorkRemotely 每2分钟
  setInterval(async () => {
    const existing = loadExistingJobs();
    const jobs = await crawlWWR();
    if (jobs.length > 0) {
      const merged = mergeJobs(existing, jobs);
      saveJobs(merged);
      log(`🔄 WeWorkRemotely 更新: ${jobs.length} 个职位`);
    }
  }, 120000);
  
  // 显示统计 每5分钟
  setInterval(showStats, 300000);
  
  log('🟢 7×24小时爬虫已启动');
  log('监控: RemoteOK (30s), WeWorkRemotely (2min)');
  log('按 Ctrl+C 停止\n');
}

// 启动
main().catch(err => {
  log(`💥 致命错误: ${err.message}`);
  process.exit(1);
});

// 优雅退出
process.on('SIGINT', () => {
  log('\n🛑 爬虫停止');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n🛑 爬虫停止');
  process.exit(0);
});
