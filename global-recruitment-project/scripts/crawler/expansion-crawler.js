#!/usr/bin/env node
/**
 * 快速扩张爬虫 - 新增10个数据源
 * 目标: 60天内职位数从510到5000+
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../src/data/real-jobs');
const LOG_FILE = path.join(__dirname, '../../logs/expansion-crawler.log');

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
const SOURCES = [
  { name: 'GitHubJobs', url: 'https://jobs.github.com/positions.json', type: 'json', enabled: true },
  { name: 'RemoteOK', url: 'https://remoteok.com/api', type: 'json', enabled: true },
  { name: 'Remotive', url: 'https://remotive.com/api/remote-jobs?limit=100', type: 'json', enabled: true },
  { name: 'Himalayas', url: 'https://himalayas.app/api/jobs?limit=100', type: 'json', enabled: false },
  { name: 'Jobspresso', url: 'https://jobspresso.co/feed/', type: 'rss', enabled: true },
  { name: 'StackOverflow', url: 'https://stackoverflow.com/jobs/feed', type: 'rss', enabled: true },
  { name: 'WeWorkRemotely', url: 'https://weworkremotely.com/remote-jobs.rss', type: 'rss', enabled: false },
];

// 加载现有职位
function loadExistingJobs() {
  try {
    const file = path.join(DATA_DIR, 'all-jobs-final.json');
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch (e) {}
  return [];
}

// 保存职位
function saveJobs(jobs) {
  try {
    fs.writeFileSync(path.join(DATA_DIR, 'all-jobs-final.json'), JSON.stringify(jobs, null, 2));
    log(`💾 已保存 ${jobs.length} 个职位`);
  } catch (e) {
    log(`❌ 保存失败: ${e.message}`);
  }
}

// 解析RSS
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
      company: extractXmlTag(itemXml, 'company'),
    });
  }
  
  return items;
}

function extractXmlTag(xml, tag) {
  const regex = new RegExp(`<${tag}>([^<]*)<\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

// GitHub Jobs
async function crawlGitHubJobs() {
  try {
    const response = await fetch('https://jobs.github.com/positions.json', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const jobs = data.map(job => ({
      id: `github-${job.id}`,
      title: job.title,
      company: job.company,
      location: job.location || 'Remote',
      description: job.description?.replace(/<[^>]*>/g, ' ').substring(0, 500),
      requirements: [],
      jobType: 'FULL_TIME',
      remote: job.location?.toLowerCase().includes('remote') || false,
      applyUrl: job.url,
      postedAt: new Date(job.created_at).toISOString(),
      source: 'GitHubJobs'
    }));

    log(`✅ GitHubJobs: ${jobs.length} 个职位`);
    return jobs;
  } catch (error) {
    log(`❌ GitHubJobs: ${error.message}`);
    return [];
  }
}

// RemoteOK
async function crawlRemoteOK() {
  try {
    const response = await fetch('https://remoteok.com/api', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const jobs = data.slice(1).map(item => ({
      id: `remoteok-${item.id}`,
      title: item.position,
      company: item.company,
      location: item.location || 'Remote',
      description: item.description?.replace(/<[^>]*>/g, ' ').substring(0, 500),
      requirements: item.tags || [],
      jobType: 'FULL_TIME',
      remote: true,
      applyUrl: item.apply_url || `https://remoteok.com/remote-jobs/${item.slug || item.id}`,
      postedAt: new Date(item.date).toISOString(),
      source: 'RemoteOK'
    }));

    log(`✅ RemoteOK: ${jobs.length} 个职位`);
    return jobs;
  } catch (error) {
    log(`❌ RemoteOK: ${error.message}`);
    return [];
  }
}

// Remotive
async function crawlRemotive() {
  try {
    const response = await fetch('https://remotive.com/api/remote-jobs?limit=100', {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const jobs = data.jobs?.map(job => ({
      id: `remotive-${job.id}`,
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || 'Remote',
      description: job.description?.replace(/<[^>]*>/g, ' ').substring(0, 500),
      requirements: [],
      jobType: job.job_type || 'FULL_TIME',
      remote: true,
      applyUrl: job.url,
      postedAt: new Date(job.publication_date).toISOString(),
      source: 'Remotive'
    })) || [];

    log(`✅ Remotive: ${jobs.length} 个职位`);
    return jobs;
  } catch (error) {
    log(`❌ Remotive: ${error.message}`);
    return [];
  }
}

// Jobspresso RSS
async function crawlJobspresso() {
  try {
    const response = await fetch('https://jobspresso.co/feed/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const xml = await response.text();
    const items = parseRSS(xml);
    
    const jobs = items.map((item, idx) => ({
      id: `jobspresso-${idx}-${Date.now()}`,
      title: item.title,
      company: item.company || 'Unknown',
      location: 'Remote',
      description: item.description?.substring(0, 300),
      requirements: [],
      jobType: 'FULL_TIME',
      remote: true,
      applyUrl: item.link,
      postedAt: new Date(item.pubDate || Date.now()).toISOString(),
      source: 'Jobspresso'
    }));

    log(`✅ Jobspresso: ${jobs.length} 个职位`);
    return jobs;
  } catch (error) {
    log(`❌ Jobspresso: ${error.message}`);
    return [];
  }
}

// StackOverflow RSS
async function crawlStackOverflow() {
  try {
    const response = await fetch('https://stackoverflow.com/jobs/feed', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const xml = await response.text();
    const items = parseRSS(xml);
    
    const jobs = items.map((item, idx) => ({
      id: `stackoverflow-${idx}-${Date.now()}`,
      title: item.title,
      company: item.company || 'Unknown',
      location: item.location || 'Remote',
      description: item.description?.substring(0, 300),
      requirements: [],
      jobType: 'FULL_TIME',
      remote: true,
      applyUrl: item.link,
      postedAt: new Date(item.pubDate || Date.now()).toISOString(),
      source: 'StackOverflow'
    }));

    log(`✅ StackOverflow: ${jobs.length} 个职位`);
    return jobs;
  } catch (error) {
    log(`❌ StackOverflow: ${error.message}`);
    return [];
  }
}

// 去重合并
function mergeJobs(existing, newJobs) {
  const seen = new Set(existing.map(j => j.id));
  const merged = [...existing];
  let added = 0;
  
  for (const job of newJobs) {
    if (!seen.has(job.id)) {
      merged.push(job);
      seen.add(job.id);
      added++;
    }
  }
  
  merged.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  return { merged, added };
}

// 主函数
async function main() {
  log('\n🚀 快速扩张爬虫启动');
  log('目标: 60天内职位数 510 → 5000+\n');
  
  const existing = loadExistingJobs();
  log(`📊 现有职位: ${existing.length}`);
  
  const allNewJobs = [];
  
  // 并行抓取所有数据源
  log('\n🔍 开始抓取...\n');
  
  const results = await Promise.all([
    crawlGitHubJobs(),
    crawlRemoteOK(),
    crawlRemotive(),
    crawlJobspresso(),
    crawlStackOverflow(),
  ]);
  
  results.forEach(jobs => allNewJobs.push(...jobs));
  
  log(`\n📥 本次抓取: ${allNewJobs.length} 个职位`);
  
  // 合并去重
  const { merged, added } = mergeJobs(existing, allNewJobs);
  
  // 保存
  saveJobs(merged);
  
  // 统计
  const bySource = {};
  merged.forEach(j => {
    bySource[j.source] = (bySource[j.source] || 0) + 1;
  });
  
  log('\n📊 ===== 数据源统计 =====');
  Object.entries(bySource)
    .sort((a, b) => b[1] - a[1])
    .forEach(([source, count]) => {
      log(`  ${source}: ${count}`);
    });
  log('========================');
  log(`\n✅ 总职位数: ${merged.length} (+${added})`);
  log(`🎯 距离目标: ${5000 - merged.length} 个`);
  log(`📈 完成进度: ${((merged.length / 5000) * 100).toFixed(1)}%`);
}

main().catch(err => {
  log(`💥 错误: ${err.message}`);
  process.exit(1);
});
