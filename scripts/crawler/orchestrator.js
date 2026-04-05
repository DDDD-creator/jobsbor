/**
 * 全球招聘爬虫调度器 - 智能体协作中枢
 * 协调多个爬虫智能体，自动抓取、处理、同步全球职位数据
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 数据源配置
const SOURCES = [
  {
    name: 'RemoteOK',
    url: 'https://remoteok.com/api?tags=web3,crypto,blockchain,finance,engineering,marketing,sales,design,product',
    type: 'json',
    enabled: true,
    priority: 1
  },
  {
    name: 'WeWorkRemotely',
    url: 'https://weworkremotely.com/categories/remote-programming-jobs.rss',
    type: 'rss',
    enabled: true,
    priority: 2
  },
  {
    name: 'CryptoJobsList',
    url: 'https://cryptojobslist.com/?format=json',
    type: 'json',
    enabled: true,
    priority: 3
  },
  {
    name: 'AngelList',
    url: 'https://angel.co/api/jobs',
    type: 'json',
    enabled: false, // 需要API key
    priority: 4
  },
  {
    name: 'HN WhoIsHiring',
    url: 'https://hn.algolia.com/api/v1/search?query=who+is+hiring&tags=story',
    type: 'json',
    enabled: true,
    priority: 5
  }
];

const DATA_DIR = path.join(__dirname, '../../src/data/real-jobs');
const PAGE_FILE = path.join(__dirname, '../../src/app/real-jobs/page.tsx');

/**
 * 爬取 RemoteOK
 */
async function crawlRemoteOK() {
  console.log('🕷️ [智能体] RemoteOK 爬虫启动...');
  
  try {
    // 获取所有职位，不过滤标签（API不支持多标签过滤）
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    
    // 过滤技术相关职位
    const techKeywords = ['web3', 'crypto', 'blockchain', 'engineering', 'software', 'developer', 
      'solidity', 'ethereum', 'finance', 'quant', 'trading', 'defi', 'bitcoin', 'layer2',
      'react', 'node', 'python', 'go', 'rust', 'typescript', 'javascript'];
    
    const jobs = data.slice(1)
      .filter(item => {
        const text = `${item.position} ${item.description || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
        return techKeywords.some(kw => text.includes(kw));
      })
      .map(item => {
        const job = {
          id: `remoteok-${item.id || Date.now()}`,
          title: item.position,
          company: item.company,
          location: item.location || 'Remote',
          description: cleanDescription(item.description),
          requirements: extractTechStack(item.tags, item.description),
          jobType: detectJobType(item.tags),
          remote: true,
          applyUrl: item.apply_url || item.url,
          postedAt: new Date(item.date).toISOString(),
          source: 'RemoteOK',
          tags: item.tags || []
        };
        // 只在有值时添加salary字段
        const salary = extractSalary(item.description);
        if (salary) {
          job.salary = salary;
        }
        return job;
      }).filter(j => j.title && j.company);

    console.log(`✅ [智能体] RemoteOK: ${jobs.length} 个职位 (从 ${data.length - 1} 个总职位中筛选)`);
    return jobs;
  } catch (error) {
    console.error('❌ [智能体] RemoteOK 失败:', error.message);
    return [];
  }
}

/**
 * 爬取 Hacker News Who is Hiring
 */
async function crawlHNJobs() {
  console.log('🕷️ [智能体] HN WhoIsHiring 爬虫启动...');
  
  try {
    // 获取最新的"Who is hiring"帖子
    const searchResponse = await fetch(
      'https://hn.algolia.com/api/v1/search_by_date?query=%22who%20is%20hiring%22&tags=story&numericFilters=created_at_i>1700000000&hitsPerPage=1'
    );
    const searchData = await searchResponse.json();
    
    if (!searchData.hits || searchData.hits.length === 0) {
      console.log('⚠️ [智能体] 未找到HN招聘帖');
      return [];
    }

    const postId = searchData.hits[0].objectID;
    
    // 获取评论（职位信息）
    const commentsResponse = await fetch(
      `https://hn.algolia.com/api/v1/search?tags=comment,story_${postId}&hitsPerPage=100`
    );
    const commentsData = await commentsResponse.json();
    
    const jobs = commentsData.hits
      .filter(hit => hit.text && hit.text.length > 100)
      .slice(0, 20)
      .map((hit, idx) => ({
        id: `hn-${hit.objectID}`,
        title: extractJobTitle(hit.text) || 'Software Engineer',
        company: extractCompanyName(hit.text) || 'HN Company',
        location: extractLocation(hit.text) || 'Remote',
        description: cleanDescription(hit.text).substring(0, 500),
        requirements: extractTechStack([], hit.text),
        jobType: 'FULL_TIME',
        remote: hit.text.toLowerCase().includes('remote'),
        applyUrl: `https://news.ycombinator.com/item?id=${hit.objectID}`,
        postedAt: new Date(hit.created_at).toISOString(),
        source: 'HackerNews',
        salary: extractSalary(hit.text),
        tags: ['tech', 'startup']
      }));

    console.log(`✅ [智能体] HN: ${jobs.length} 个职位`);
    return jobs;
  } catch (error) {
    console.error('❌ [智能体] HN 失败:', error.message);
    return [];
  }
}

/**
 * 爬取 CryptoJobsList
 */
async function crawlCryptoJobsList() {
  console.log('🕷️ [智能体] CryptoJobsList 爬虫启动...');
  
  try {
    // 使用备用方法 - 爬取HTML
    const categories = ['engineering', 'marketing', 'design', 'sales', 'operations'];
    const allJobs = [];
    
    for (const category of categories) {
      try {
        const response = await fetch(`https://cryptojobslist.com/${category}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html'
          }
        });
        
        const html = await response.text();
        
        // 提取职位信息（简化版）
        const jobMatches = html.match(/job-title[^>]*>([^<]+)/g) || [];
        const companyMatches = html.match(/company-name[^>]*>([^<]+)/g) || [];
        
        for (let i = 0; i < Math.min(jobMatches.length, 5); i++) {
          const title = jobMatches[i]?.replace(/.*>/, '').trim();
          const company = companyMatches[i]?.replace(/.*>/, '').trim() || 'Crypto Company';
          
          if (title) {
            allJobs.push({
              id: `cjl-${Date.now()}-${i}`,
              title: title,
              company: company,
              location: 'Remote / Global',
              description: `${title} at ${company}. Web3 and blockchain position.`,
              requirements: ['Blockchain', 'Web3'],
              jobType: 'FULL_TIME',
              remote: true,
              applyUrl: `https://cryptojobslist.com/${category}`,
              postedAt: new Date().toISOString(),
              source: 'CryptoJobsList',
              salary: null,
              tags: ['web3', 'crypto', category]
            });
          }
        }
        
        await sleep(1000);
      } catch (err) {
        console.warn(`⚠️ [智能体] ${category} 失败:`, err.message);
      }
    }

    console.log(`✅ [智能体] CryptoJobsList: ${allJobs.length} 个职位`);
    return allJobs;
  } catch (error) {
    console.error('❌ [智能体] CryptoJobsList 失败:', error.message);
    return [];
  }
}

/**
 * 工具函数
 */
function cleanDescription(desc) {
  if (!desc) return '';
  return desc
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTechStack(tags, description) {
  const techKeywords = [
    'Solidity', 'Ethereum', 'React', 'Vue', 'Angular', 'Node.js', 'Python',
    'Go', 'Rust', 'Java', 'TypeScript', 'JavaScript', 'AWS', 'Docker',
    'Kubernetes', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'DeFi',
    'Smart Contracts', 'Web3.js', 'Ethers.js', 'Hardhat', 'Foundry',
    'Blockchain', 'Crypto', 'Bitcoin', 'Layer2', 'Zero Knowledge',
    'React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin',
    'Product Manager', 'UX', 'UI', 'Design', 'Marketing', 'Sales'
  ];
  
  const text = `${tags?.join(' ') || ''} ${description || ''}`.toLowerCase();
  return techKeywords.filter(tech => 
    text.includes(tech.toLowerCase())
  ).slice(0, 5);
}

function detectJobType(tags) {
  if (!tags) return 'FULL_TIME';
  const tagStr = Array.isArray(tags) ? tags.join(',').toLowerCase() : tags.toLowerCase();
  if (tagStr.includes('contract')) return 'CONTRACT';
  if (tagStr.includes('part')) return 'PART_TIME';
  if (tagStr.includes('intern')) return 'INTERNSHIP';
  if (tagStr.includes('freelance')) return 'FREELANCE';
  return 'FULL_TIME';
}

function extractSalary(text) {
  if (!text) return null;
  const patterns = [
    /\$[\d,]+\s*-\s*\$[\d,]+/,
    /\$[\d,]+k?\s*-?\s*\$?[\d,]*k?/i,
    /[\d,]+\s*USD/,
    /[\d,]+\s*-\s*[\d,]+\s*\$?k/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
}

function extractJobTitle(text) {
  const patterns = [
    /^(.*?)(?:\s*\||\s*-\s*|\s*at\s+)/i,
    /(senior|junior|lead|principal|staff)?\s*(software|frontend|backend|full.?stack|devops|blockchain|solidity|react|node)\s*(engineer|developer|architect)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }
  return null;
}

function extractCompanyName(text) {
  const patterns = [
    /(?:at|@)\s+([A-Z][A-Za-z0-9\s]+?)(?:\s*[\|\(\[\n]|$)/,
    /([A-Z][A-Za-z0-9]+(?:\s[A-Z][A-Za-z0-9]+)?)\s+(?:is|are)\s+hiring/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1]?.trim();
  }
  return null;
}

function extractLocation(text) {
  const patterns = [
    /(?:remote|hybrid|onsite|on-site)[\s\w,]*(?:\||\n|$)/i,
    /(?:location|based in)[:\s]*([^\n\|]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }
  return 'Remote';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 同步数据到页面
 */
async function syncToPage(allJobs) {
  console.log('🔄 [智能体] 同步数据到前端页面...');
  
  // 去重
  const uniqueJobs = [];
  const seen = new Set();
  
  for (const job of allJobs) {
    const key = `${job.title}-${job.company}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueJobs.push(job);
    }
  }
  
  // 保存到JSON
  fs.writeFileSync(
    path.join(DATA_DIR, 'all-jobs.json'),
    JSON.stringify(uniqueJobs, null, 2)
  );
  
  // 更新页面文件
  const jobsData = JSON.stringify(uniqueJobs, null, 2)
    .replace(/"/g, '"')
    .replace(/`/g, '\`');
  
  const pageTemplate = `import { ExternalLink, MapPin, Building2, Clock } from 'lucide-react';

interface RealJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  jobType: string;
  remote: boolean;
  applyUrl: string;
  postedAt: string;
  source: string;
  salary?: string;
  tags?: string[];
}

// 全球爬虫自动抓取的真实职位数据
// 最后更新: ${new Date().toLocaleString('zh-CN')}
const REAL_JOBS: RealJob[] = ${jobsData};

export default function RealJobsPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                🔴 实时更新
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                🌍 全球职位
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30">
                🤖 AI爬虫
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              全球真实职位
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple"> · 实时抓取</span>
            </h1>
            <p className="text-gray-400 text-lg mb-2">
              来自 RemoteOK、HackerNews、CryptoJobsList 等平台的真实职位
            </p>
            <p className="text-sm text-gray-500">
              当前共有 <span className="text-neon-cyan font-bold">{REAL_JOBS.length}</span> 个职位 ·
              最后更新: ${new Date().toLocaleString('zh-CN')}
            </p>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6">
          {REAL_JOBS.map((job) => (
            <div key={job.id} className="glass-card rounded-2xl p-6 hover:border-neon-cyan/30 transition-all group">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors">
                      {job.title}
                    </h2>
                    {job.remote && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs border border-green-500/30">
                        远程
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(job.postedAt).toLocaleDateString('zh-CN')}
                    </span>
                    <span className="text-xs text-gray-500">来源: {job.source}</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req) => (
                      <span key={req} className="px-2 py-1 bg-white/5 text-gray-300 rounded text-xs border border-white/10">
                        {req}
                      </span>
                    ))}
                    {job.salary && (
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs border border-green-500/20">
                        💰 {job.salary}
                      </span>
                    )}
                  </div>
                </div>
                
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-500 font-semibold rounded-xl hover:shadow-neon-cyan transition-all whitespace-nowrap"
                >
                  申请职位
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        {REAL_JOBS.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🕷️</div>
            <p className="text-gray-400 text-lg">爬虫智能体正在抓取数据...</p>
            <p className="text-gray-500 text-sm mt-2">请稍后再试</p>
          </div>
        )}
      </div>
    </div>
  );
}
`;
  
  fs.writeFileSync(PAGE_FILE, pageTemplate);
  
  console.log(`✅ [智能体] 已同步 ${uniqueJobs.length} 个职位到页面`);
  return uniqueJobs.length;
}

/**
 * 构建并部署
 */
async function buildAndDeploy() {
  console.log('🚀 [智能体] 构建并部署...');
  
  try {
    execSync('npm run build', { 
      cwd: path.join(__dirname, '../..'),
      stdio: 'inherit'
    });
    console.log('✅ [智能体] 构建成功');
    return true;
  } catch (error) {
    console.error('❌ [智能体] 构建失败:', error.message);
    return false;
  }
}

/**
 * 主调度器
 */
async function main() {
  console.log('\n═══════════════════════════════════════');
  console.log('  🕷️ 全球招聘爬虫智能体系统 v2.0');
  console.log('  📡 技术智能体全力支持中...');
  console.log('═══════════════════════════════════════\n');
  
  const startTime = Date.now();
  const results = {};
  
  // 并行爬取多个数据源
  const [remoteokJobs, hnJobs, cryptoJobs] = await Promise.all([
    crawlRemoteOK(),
    crawlHNJobs(),
    crawlCryptoJobsList()
  ]);
  
  results.remoteok = remoteokJobs.length;
  results.hackernews = hnJobs.length;
  results.cryptojobslist = cryptoJobs.length;
  
  // 合并所有职位
  const allJobs = [...remoteokJobs, ...hnJobs, ...cryptoJobs];
  
  console.log('\n📊 [智能体] 爬取统计:');
  console.table(results);
  console.log(`总计: ${allJobs.length} 个职位`);
  
  // 同步到页面
  const syncedCount = await syncToPage(allJobs);
  
  // 保存报告
  const report = {
    timestamp: new Date().toISOString(),
    totalJobs: allJobs.length,
    sources: results,
    syncedToPage: syncedCount,
    duration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../../CRAWLER_REPORT.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n✅ [智能体] 爬虫任务完成!');
  console.log(`⏱️ 耗时: ${report.duration}`);
  console.log('═══════════════════════════════════════\n');
  
  return report;
}

// 运行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, crawlRemoteOK, crawlHNJobs, crawlCryptoJobsList };
