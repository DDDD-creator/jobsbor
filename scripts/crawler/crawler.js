/**
 * 全球职位爬虫系统 - 真实数据
 * 支持多数据源：RemoteOK、WeWorkRemotely等
 */

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// 数据存储路径
const DATA_DIR = path.join(__dirname, '../../src/data/real-jobs');
const REPORT_PATH = path.join(__dirname, '../../CRAWLER_REPORT.json');

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * RemoteOK 爬虫
 */
async function crawlRemoteOK() {
  console.log('🕷️ 爬取 RemoteOK...');
  
  try {
    const response = await fetch('https://remoteok.com/api?tags=web3,crypto,blockchain,finance');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // 第一个是法律信息，跳过
    const jobs = data.slice(1).map(item => ({
      id: `remoteok-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: item.position,
      company: item.company,
      location: item.location || 'Remote',
      salary: item.salary || null,
      description: item.description?.replace(/\u003c[^\u003e]*\u003e/g, '').substring(0, 1000) || '',
      requirements: extractKeywords(item.description),
      jobType: detectJobType(item.tags),
      remote: true,
      applyUrl: item.apply_url || item.url,
      postedAt: new Date(item.date).toISOString(),
      source: 'RemoteOK',
      scrapedAt: new Date().toISOString()
    }));

    // 保存
    fs.writeFileSync(
      path.join(DATA_DIR, 'remoteok.json'),
      JSON.stringify(jobs, null, 2)
    );

    console.log(`✅ RemoteOK: ${jobs.length} 个职位`);
    return jobs.length;
  } catch (error) {
    console.error('❌ RemoteOK 失败:', error.message);
    return 0;
  }
}

/**
 * We Work Remotely 爬虫
 */
async function crawlWeWorkRemotely() {
  console.log('🕷️ 爬取 We Work Remotely...');
  
  const categories = ['programming', 'devops', 'finance', 'product'];
  const allJobs = [];

  for (const category of categories) {
    try {
      const rssUrl = `https://weworkremotely.com/categories/${category}/jobs.rss`;
      const response = await fetch(rssUrl);
      const xml = await response.text();
      
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(xml);
      
      const items = result.rss?.channel?.[0]?.item || [];
      
      for (const item of items) {
        allJobs.push({
          id: `wwr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: item.title?.[0] || 'Unknown',
          company: extractCompany(item.title?.[0]),
          location: 'Remote',
          description: item.description?.[0]?.replace(/\u003c[^\u003e]*\u003e/g, '').substring(0, 500) || '',
          requirements: [],
          jobType: 'FULL_TIME',
          remote: true,
          applyUrl: item.link?.[0] || '',
          postedAt: new Date(item.pubDate?.[0] || Date.now()).toISOString(),
          source: 'WeWorkRemotely',
          scrapedAt: new Date().toISOString()
        });
      }
      
      // 遵守rate limit
      await sleep(1000);
    } catch (err) {
      console.warn(`⚠️ ${category} 失败:`, err.message);
    }
  }

  fs.writeFileSync(
    path.join(DATA_DIR, 'weworkremotely.json'),
    JSON.stringify(allJobs, null, 2)
  );

  console.log(`✅ WeWorkRemotely: ${allJobs.length} 个职位`);
  return allJobs.length;
}

/**
 * 提取关键词
 */
function extractKeywords(description) {
  if (!description) return [];
  const keywords = [
    'Solidity', 'React', 'Python', 'TypeScript', 'Ethereum', 
    'DeFi', 'Smart Contracts', 'Blockchain', 'Node.js', 'Rust',
    'Go', 'Java', 'AWS', 'Kubernetes', 'Docker'
  ];
  return keywords.filter(kw => 
    description.toLowerCase().includes(kw.toLowerCase())
  );
}

/**
 * 检测工作类型
 */
function detectJobType(tags) {
  if (!tags) return 'FULL_TIME';
  const tagStr = tags.join(',').toLowerCase();
  if (tagStr.includes('contract')) return 'CONTRACT';
  if (tagStr.includes('part')) return 'PART_TIME';
  if (tagStr.includes('intern')) return 'INTERNSHIP';
  return 'FULL_TIME';
}

/**
 * 提取公司名
 */
function extractCompany(title) {
  if (!title) return 'Unknown';
  const match = title.match(/at\s+(.+)$/i);
  return match ? match[1].trim() : 'Unknown Company';
}

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 生成报告
 */
function generateReport(results) {
  const total = Object.values(results).reduce((a, b) => a + b, 0);
  
  const report = {
    timestamp: new Date().toISOString(),
    totalJobs: total,
    sources: results,
    summary: `共爬取 ${total} 个真实职位`,
    note: '数据来自 RemoteOK 和 We Work Remotely'
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  
  console.log('\n📊 爬虫报告:');
  console.log(JSON.stringify(report, null, 2));
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 启动全球职位爬虫系统...\n');
  
  const results = {};
  
  results.remoteok = await crawlRemoteOK();
  results.weworkremotely = await crawlWeWorkRemotely();
  
  generateReport(results);
  
  console.log('\n✅ 爬虫运行完成！');
}

main().catch(err => {
  console.error('❌ 爬虫系统错误:', err);
  process.exit(1);
});

/**
 * 扩展爬虫 - 添加更多数据源
 */

/**
 * 模拟更多真实职位数据
 * 注意：实际生产环境应该替换为真实API调用
 */
async function crawlAdditionalSources() {
  console.log('🕷️ 爬取其他数据源...');
  
  // 这里可以添加更多真实爬虫
  // 例如：AngelList API, Hacker News "Who is hiring", etc.
  
  const additionalJobs = [
    {
      id: `angel-${Date.now()}-1`,
      title: 'Senior Smart Contract Engineer',
      company: 'Aave',
      location: 'Remote / London',
      salary: '$180,000 - $280,000',
      description: 'Aave is looking for a Senior Smart Contract Engineer to join our protocol team. You will be responsible for designing and implementing core protocol features.',
      requirements: ['Solidity', 'Ethereum', 'DeFi', 'Smart Contracts'],
      jobType: 'FULL_TIME',
      remote: true,
      applyUrl: 'https://aave.com/careers',
      postedAt: new Date().toISOString(),
      source: 'AngelList',
      scrapedAt: new Date().toISOString()
    },
    {
      id: `hn-${Date.now()}-1`,
      title: 'Blockchain Security Researcher',
      company: 'OpenZeppelin',
      location: 'Remote',
      salary: '$150,000 - $220,000',
      description: 'Join our security research team to audit smart contracts for top DeFi protocols.',
      requirements: ['Security', 'Solidity', 'Auditing'],
      jobType: 'FULL_TIME',
      remote: true,
      applyUrl: 'https://openzeppelin.com/careers',
      postedAt: new Date().toISOString(),
      source: 'HackerNews',
      scrapedAt: new Date().toISOString()
    }
  ];
  
  console.log(`✅ 其他数据源: ${additionalJobs.length} 个职位`);
  return additionalJobs.length;
}
