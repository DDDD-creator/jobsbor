/**
 * Long-tail keyword SEO page generator
 * Creates industry × location combination pages for better Google indexing
 */

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Industry keywords that people search for
const INDUSTRIES = [
  { id: 'web3', name: 'Web3', nameZh: 'Web3', jobs: ['Blockchain Developer', 'Smart Contract Engineer', 'DeFi Analyst'] },
  { id: 'fintech', name: 'FinTech', nameZh: '金融科技', jobs: ['Quantitative Analyst', 'Trading Engineer', 'Risk Analyst'] },
  { id: 'ai', name: 'AI/ML', nameZh: '人工智能', jobs: ['ML Engineer', 'AI Researcher', 'Data Scientist'] },
  { id: 'cybersecurity', name: 'Cybersecurity', nameZh: '网络安全', jobs: ['Security Engineer', 'Penetration Tester', 'SOC Analyst'] },
  { id: 'cloud', name: 'Cloud', nameZh: '云计算', jobs: ['Cloud Architect', 'DevOps Engineer', 'SRE'] },
  { id: 'gaming', name: 'Gaming', nameZh: '游戏', jobs: ['Game Developer', 'Unity Engineer', 'Game Designer'] },
  { id: 'ecommerce', name: 'E-commerce', nameZh: '电商', jobs: ['Full Stack Developer', 'Product Manager', 'Growth Hacker'] },
  { id: 'healthtech', name: 'HealthTech', nameZh: '医疗健康科技', jobs: ['Bioinformatics Engineer', 'Health Data Analyst', 'Medical Software Developer'] },
  { id: 'edtech', name: 'EdTech', nameZh: '教育科技', jobs: ['Learning Engineer', 'EdTech Product Manager', 'Curriculum Developer'] },
  { id: 'robotics', name: 'Robotics', nameZh: '机器人', jobs: ['Robotics Engineer', 'Computer Vision Engineer', 'Controls Engineer'] },
];

// Location keywords
const LOCATIONS = [
  { id: 'remote', name: 'Remote', nameZh: '远程', modifier: 'Remote' },
  { id: 'us', name: 'United States', nameZh: '美国', modifier: 'US' },
  { id: 'uk', name: 'United Kingdom', nameZh: '英国', modifier: 'UK' },
  { id: 'singapore', name: 'Singapore', nameZh: '新加坡', modifier: 'Singapore' },
  { id: 'china', name: 'China', nameZh: '中国', modifier: 'China' },
  { id: 'europe', name: 'Europe', nameZh: '欧洲', modifier: 'Europe' },
  { id: 'japan', name: 'Japan', nameZh: '日本', modifier: 'Japan' },
  { id: 'india', name: 'India', nameZh: '印度', modifier: 'India' },
  { id: 'canada', name: 'Canada', nameZh: '加拿大', modifier: 'Canada' },
  { id: 'australia', name: 'Australia', nameZh: '澳大利亚', modifier: 'Australia' },
];

// Generate page content
function generatePage(industry, location, locale = 'en') {
  const isZh = locale === 'zh';
  const title = isZh
    ? `${industry.nameZh}${location.nameZh}${isZh ? '远程职位' : ' Remote Jobs'} - ${isZh ? 'Jobsbor招聘' : 'Jobsbor'}`
    : `${industry.name} ${location.name} Remote Jobs - Jobsbor`;
  
  const description = isZh
    ? `发现最新的${industry.nameZh}${location.nameZh}远程工作机会。${industry.jobs.slice(0, 3).join('、')}等热门职位。`
    : `Discover the latest ${industry.name} remote jobs in ${location.name}. Top roles include ${industry.jobs.join(', ')}.`;
  
  const keywords = [
    isZh ? `${industry.nameZh}招聘` : `${industry.name} jobs`,
    isZh ? `${location.nameZh}远程工作` : `${location.name} remote work`,
    isZh ? `${industry.nameZh}职位` : `${industry.name} careers`,
    ...industry.jobs.map(j => isZh ? j : j),
  ];

  return {
    slug: `${industry.id}-${location.id}`,
    industry: industry.id,
    location: location.id,
    title,
    description,
    keywords,
    industryName: isZh ? industry.nameZh : industry.name,
    locationName: isZh ? location.nameZh : location.name,
    jobTitles: industry.jobs,
    content: isZh
      ? `探索${industry.nameZh}行业在${location.name}的最新远程工作机会。我们聚合了来自全球顶级招聘平台的${industry.nameZh}职位，包括${industry.jobs.join('、')}等热门岗位。`
      : `Explore the latest ${industry.name} remote work opportunities in ${location.name}. We aggregate ${industry.name} positions from top global job boards, including popular roles like ${industry.jobs.join(', ')}.`,
  };
}

async function main() {
  console.log('🔍 Generating long-tail SEO pages...\n');
  
  const pages = { en: [], zh: [] };
  
  for (const industry of INDUSTRIES) {
    for (const location of LOCATIONS) {
      pages.en.push(generatePage(industry, location, 'en'));
      pages.zh.push(generatePage(industry, location, 'zh'));
    }
  }
  
  // Write data files
  const dataDir = join(__dirname, '..', 'src', 'data');
  await fs.mkdir(dataDir, { recursive: true });
  
  await fs.writeFile(
    join(dataDir, 'longtail-pages.json'),
    JSON.stringify(pages, null, 2),
    'utf-8'
  );
  
  const totalPages = pages.en.length + pages.zh.length;
  console.log(`✅ Generated ${totalPages} long-tail pages (${pages.en.length} EN + ${pages.zh.length} ZH)`);
  console.log(`\n📁 Industries: ${INDUSTRIES.map(i => i.name).join(', ')}`);
  console.log(`📍 Locations: ${LOCATIONS.map(l => l.name).join(', ')}`);
  console.log(`\n📄 Sample pages:`);
  pages.en.slice(0, 5).forEach(p => console.log(`  /en/industry/${p.slug} - ${p.title}`));
  console.log(`  ... and ${pages.en.length - 5} more per language`);
}

main().catch(console.error);
