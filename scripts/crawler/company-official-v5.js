/**
 * 互联网公司官网直抓系统 v5.0
 * 直接抓取各大科技公司官网招聘页面
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(__dirname, '../../src/data/real-jobs');

// 知名互联网公司配置
const COMPANIES = [
  {
    name: 'OpenAI',
    url: 'https://openai.com/careers',
    apiUrl: 'https://openai.com/careers',
    type: 'html',
    parser: 'openai'
  },
  {
    name: 'Stripe',
    url: 'https://stripe.com/jobs',
    apiUrl: 'https://stripe.com/jobs/search?office_locations=Remote',
    type: 'html',
    parser: 'stripe'
  },
  {
    name: 'Airbnb',
    url: 'https://careers.airbnb.com/',
    apiUrl: 'https://careers.airbnb.com/wp-json/api/v2/job-postings/?categories=Engineering%2CData+Science+%26+Analytics%2CIT%2CInfrastructure+%26+Security',
    type: 'json',
    parser: 'airbnb'
  },
  {
    name: 'Coinbase',
    url: 'https://www.coinbase.com/careers',
    apiUrl: 'https://www.coinbase.com/careers/positions',
    type: 'html',
    parser: 'coinbase'
  },
  {
    name: 'Netflix',
    url: 'https://jobs.netflix.com/',
    apiUrl: 'https://jobs.netflix.com/api/search?q=&location=Remote',
    type: 'json',
    parser: 'netflix'
  },
  {
    name: 'Spotify',
    url: 'https://www.lifeatspotify.com/jobs',
    apiUrl: 'https://www.lifeatspotify.com/jobs?l=remote',
    type: 'html',
    parser: 'spotify'
  },
  {
    name: 'GitLab',
    url: 'https://about.gitlab.com/jobs/',
    apiUrl: 'https://about.gitlab.com/jobs/all-jobs.json',
    type: 'json',
    parser: 'gitlab'
  },
  {
    name: 'Shopify',
    url: 'https://www.shopify.com/careers',
    apiUrl: 'https://www.shopify.com/careers/search?teams[0]=Engineering%20%26%20Data',
    type: 'html',
    parser: 'shopify'
  },
  {
    name: 'Figma',
    url: 'https://www.figma.com/careers/',
    apiUrl: 'https://boards.greenhouse.io/embed/job_board?for=figma',
    type: 'html',
    parser: 'greenhouse'
  },
  {
    name: 'Notion',
    url: 'https://www.notion.so/careers',
    apiUrl: 'https://boards.greenhouse.io/embed/job_board?for=notion',
    type: 'html',
    parser: 'greenhouse'
  },
  {
    name: 'Linear',
    url: 'https://linear.app/careers',
    apiUrl: 'https://linear.app/careers',
    type: 'html',
    parser: 'linear'
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com/careers',
    apiUrl: 'https://vercel.com/careers',
    type: 'html',
    parser: 'vercel'
  },
  {
    name: 'Supabase',
    url: 'https://supabase.com/careers',
    apiUrl: 'https://supabase.com/careers',
    type: 'html',
    parser: 'supabase'
  },
  {
    name: 'Prisma',
    url: 'https://www.prisma.io/careers',
    apiUrl: 'https://www.prisma.io/careers',
    type: 'html',
    parser: 'prisma'
  },
  {
    name: 'HashiCorp',
    url: 'https://www.hashicorp.com/careers',
    apiUrl: 'https://www.hashicorp.com/careers',
    type: 'html',
    parser: 'hashicorp'
  },
  {
    name: 'Cloudflare',
    url: 'https://www.cloudflare.com/careers/',
    apiUrl: 'https://www.cloudflare.com/careers/jobs/',
    type: 'html',
    parser: 'cloudflare'
  },
  {
    name: 'Plaid',
    url: 'https://plaid.com/careers/',
    apiUrl: 'https://plaid.com/careers/',
    type: 'html',
    parser: 'plaid'
  },
  {
    name: 'Scale AI',
    url: 'https://scale.com/careers',
    apiUrl: 'https://scale.com/careers',
    type: 'html',
    parser: 'scale'
  },
  {
    name: 'Anthropic',
    url: 'https://www.anthropic.com/careers',
    apiUrl: 'https://www.anthropic.com/careers',
    type: 'html',
    parser: 'anthropic'
  },
  {
    name: 'Cohere',
    url: 'https://cohere.com/careers',
    apiUrl: 'https://cohere.com/careers',
    type: 'html',
    parser: 'cohere'
  }
];

/**
 * 通用HTTP请求
 */
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/html, application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
        ...options.headers
      },
      timeout: 30000,
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        ok: res.statusCode >= 200 && res.statusCode < 300,
        status: res.statusCode,
        text: () => Promise.resolve(data),
        json: () => Promise.resolve(JSON.parse(data))
      }));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 解析GitLab JSON
 */
function parseGitLabJobs(data) {
  return (data.jobs || []).map(job => ({
    id: `gitlab-${job.id}`,
    title: job.title,
    company: 'GitLab',
    location: job.location || 'Remote',
    description: job.description?.substring(0, 300) || '',
    requirements: extractSkills([], job.description),
    jobType: 'FULL_TIME',
    remote: job.location?.toLowerCase().includes('remote') || true,
    applyUrl: job.url || 'https://about.gitlab.com/jobs/',
    postedAt: new Date().toISOString(),
    source: 'GitLab'
  }));
}

/**
 * 解析Netflix JSON
 */
function parseNetflixJobs(data) {
  return (data.records || []).map(job => ({
    id: `netflix-${job.id}`,
    title: job.text,
    company: 'Netflix',
    location: job.location || 'Remote',
    description: job.description?.substring(0, 300) || '',
    requirements: extractSkills([], job.description),
    jobType: 'FULL_TIME',
    remote: true,
    applyUrl: job.url || 'https://jobs.netflix.com/',
    postedAt: new Date().toISOString(),
    source: 'Netflix'
  }));
}

/**
 * 解析Airbnb JSON
 */
function parseAirbnbJobs(data) {
  return (data || []).slice(0, 20).map((job, idx) => ({
    id: `airbnb-${idx}-${Date.now()}`,
    title: job.title,
    company: 'Airbnb',
    location: job.location || 'Remote',
    description: job.description?.substring(0, 300) || '',
    requirements: extractSkills([], job.description),
    jobType: 'FULL_TIME',
    remote: job.location?.toLowerCase().includes('remote'),
    applyUrl: job.application_url || 'https://careers.airbnb.com/',
    postedAt: new Date().toISOString(),
    source: 'Airbnb'
  }));
}

/**
 * 解析Greenhouse (Figma, Notion等)
 */
function parseGreenhouseJobs(html, company) {
  const jobs = [];
  const sections = html.match(/section[^>]*class="level-0"[^>]*>([\s\S]*?)<\/section>/g) || [];
  
  sections.forEach((section, idx) => {
    const department = section.match(/>([^<]+)<\/h3>/)?.[1] || 'Engineering';
    const jobLinks = section.match(/<a[^>]*href="([^"]*\/jobs\/[^"]*)"[^>]*>([^<]*)<\/a>/g) || [];
    
    jobLinks.forEach((link, linkIdx) => {
      const urlMatch = link.match(/href="([^"]*)"/);
      const titleMatch = link.match(/>([^<]*)</);
      
      if (urlMatch && titleMatch) {
        jobs.push({
          id: `${company.toLowerCase()}-${idx}-${linkIdx}`,
          title: titleMatch[1].trim(),
          company: company,
          location: 'Remote / Multiple',
          description: `${titleMatch[1].trim()} at ${company}. ${department} team.`,
          requirements: extractSkills([], titleMatch[1]),
          jobType: 'FULL_TIME',
          remote: true,
          applyUrl: urlMatch[1].startsWith('http') ? urlMatch[1] : `https://boards.greenhouse.io${urlMatch[1]}`,
          postedAt: new Date().toISOString(),
          source: company
        });
      }
    });
  });
  
  return jobs;
}

/**
 * 通用HTML解析（用于简单页面）
 */
function parseGenericHTML(html, company, url) {
  const jobs = [];
  
  // 尝试提取职位卡片
  const jobCards = html.match(/<a[^>]*class="[^"]*(?:job|position|opening|role)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi) || [];
  
  jobCards.slice(0, 10).forEach((card, idx) => {
    const urlMatch = card.match(/href="([^"]*)"/);
    const textMatch = card.match(/>([^<]+)</);
    
    if (urlMatch && textMatch) {
      const title = textMatch[1].trim();
      if (title.length > 5 && title.length < 100) {
        jobs.push({
          id: `${company.toLowerCase()}-${idx}-${Date.now()}`,
          title: title,
          company: company,
          location: 'Remote / Global',
          description: `${title} at ${company}. Join the team.`,
          requirements: extractSkills([], title),
          jobType: 'FULL_TIME',
          remote: true,
          applyUrl: urlMatch[1].startsWith('http') ? urlMatch[1] : `${url}${urlMatch[1]}`,
          postedAt: new Date().toISOString(),
          source: company
        });
      }
    }
  });
  
  return jobs;
}

// 工具函数
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<![CDATA[|]]>/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&lt;|&gt;|&amp;|&quot;|&#x27;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSkills(tags, description) {
  const skills = [
    'Solidity', 'Ethereum', 'React', 'Vue', 'Angular', 'Node.js', 'Python',
    'Go', 'Rust', 'Java', 'TypeScript', 'JavaScript', 'AWS', 'Docker',
    'Kubernetes', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'DeFi',
    'Smart Contracts', 'Web3.js', 'Ethers.js', 'Hardhat', 'Foundry',
    'Blockchain', 'Crypto', 'Bitcoin', 'Layer2', 'Zero Knowledge',
    'React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin',
    'Product Manager', 'UX', 'UI', 'Design', 'Marketing', 'Sales',
    'AI', 'ML', 'TensorFlow', 'PyTorch', 'NLP', 'Data Science',
    'Engineering', 'Backend', 'Frontend', 'Full Stack', 'DevOps',
    'SRE', 'Security', 'Data', 'Analytics', 'Infrastructure'
  ];
  
  const text = `${Array.isArray(tags) ? tags.join(' ') : tags || ''} ${description || ''}`.toLowerCase();
  return skills.filter(skill => text.includes(skill.toLowerCase())).slice(0, 5);
}

/**
 * 抓取单个公司
 */
async function crawlCompany(company) {
  console.log(`🕷️ [${company.name}] 抓取中...`);
  
  try {
    const res = await fetch(company.apiUrl || company.url);
    const contentType = res.headers?.get?.('content-type') || '';
    
    let jobs = [];
    
    if (company.parser === 'gitlab' || contentType.includes('json')) {
      try {
        const data = await res.json();
        jobs = parseGitLabJobs(data);
      } catch (e) {
        console.log(`   ⚠️ ${company.name}: JSON解析失败`);
      }
    } else if (company.parser === 'netflix') {
      try {
        const data = await res.json();
        jobs = parseNetflixJobs(data);
      } catch (e) {
        console.log(`   ⚠️ ${company.name}: Netflix解析失败`);
      }
    } else if (company.parser === 'airbnb') {
      try {
        const data = await res.json();
        jobs = parseAirbnbJobs(data);
      } catch (e) {
        console.log(`   ⚠️ ${company.name}: Airbnb解析失败`);
      }
    } else if (company.parser === 'greenhouse') {
      const html = await res.text();
      jobs = parseGreenhouseJobs(html, company.name);
    } else {
      const html = await res.text();
      jobs = parseGenericHTML(html, company.name, company.url);
    }
    
    console.log(`   ✅ ${company.name}: ${jobs.length} 个职位`);
    return jobs;
    
  } catch (e) {
    console.log(`   ❌ ${company.name}: ${e.message}`);
    return [];
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('     🏢 互联网公司官网直抓系统 v5.0');
  console.log('     直接抓取20+科技公司官网招聘页面');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const startTime = Date.now();
  const allJobs = [];
  const stats = {};
  
  // 串行抓取（避免被封）
  for (const company of COMPANIES) {
    const jobs = await crawlCompany(company);
    allJobs.push(...jobs);
    stats[company.name] = jobs.length;
    await sleep(1000); // 礼貌间隔
  }
  
  // 去重
  const uniqueJobs = [];
  const seen = new Set();
  
  for (const job of allJobs) {
    const key = `${job.title}-${job.company}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueJobs.push(job);
    }
  }
  
  console.log('\n📊 抓取统计:');
  console.table(stats);
  console.log(`\n✅ 总职位数: ${allJobs.length}`);
  console.log(`✅ 去重后: ${uniqueJobs.length}`);
  
  // 保存数据
  if (uniqueJobs.length > 0) {
    fs.writeFileSync(
      path.join(DATA_DIR, 'company-jobs-v5.json'),
      JSON.stringify(uniqueJobs, null, 2)
    );
    
    fs.writeFileSync(
      path.join(DATA_DIR, 'company-crawler-v5-report.json'),
      JSON.stringify({
        timestamp: new Date().toISOString(),
        totalJobs: uniqueJobs.length,
        companies: stats,
        duration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`
      }, null, 2)
    );
  }
  
  console.log(`\n⏱️ 耗时: ${((Date.now() - startTime) / 1000).toFixed(2)}秒`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  return uniqueJobs;
}

// 运行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, COMPANIES };
