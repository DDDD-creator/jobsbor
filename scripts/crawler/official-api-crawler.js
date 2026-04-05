#!/usr/bin/env node
/**
 * 🎯 官方招聘API爬虫
 * 自动获取各大公司官方招聘数据
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ============ 官方API配置 ============
const OFFICIAL_APIS = [
  // 腾讯招聘API
  {
    name: 'Tencent',
    url: 'https://careers.tencent.com/tencentcareer/api/post/Query',
    method: 'GET',
    params: { timestamp: Date.now(), countryId: '', cityId: '', bgIds: '', productId: '', categoryId: '', parentCategoryId: '', attrId: '', keyword: '', pageIndex: 1, pageSize: 100, language: 'zh-cn', area: '' },
    parser: (data) => {
      if (!data.Data || !data.Data.Posts) return [];
      return data.Data.Posts.map(post => ({
        id: `tencent-${post.PostId}`,
        title: post.RecruitPostName,
        company: '腾讯',
        location: post.LocationName || '深圳',
        type: 'Full-time',
        description: post.Responsibility || '',
        requirements: post.Requirement ? post.Requirement.split('\n') : [],
        applyUrl: `https://careers.tencent.com/jobdesc.html?postId=${post.PostId}`,
        postedAt: new Date().toISOString(),
        source: 'Tencent Official'
      }));
    }
  },
  
  // 字节跳动招聘API
  {
    name: 'ByteDance',
    url: 'https://jobs.bytedance.com/api/v1/job/list',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit: 100, offset: 0 }),
    parser: (data) => {
      if (!data.data || !data.data.job_post_list) return [];
      return data.data.job_post_list.map(job => ({
        id: `bytedance-${job.id}`,
        title: job.title,
        company: '字节跳动',
        location: job.city_info?.name || '北京',
        type: job.job_category?.name || 'Full-time',
        description: job.description || '',
        requirements: job.requirement ? job.requirement.split('\n') : [],
        applyUrl: `https://jobs.bytedance.com/referral/pc/position/${job.id}`,
        postedAt: job.create_time || new Date().toISOString(),
        source: 'ByteDance Official'
      }));
    }
  },
  
  // GitHub Jobs API (官方)
  {
    name: 'GitHubJobs',
    url: 'https://api.github.com/jobs',
    method: 'GET',
    parser: (data) => {
      if (!Array.isArray(data)) return [];
      return data.map(job => ({
        id: `github-${job.id}`,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type || 'Full-time',
        description: job.description || '',
        applyUrl: job.url,
        postedAt: job.created_at,
        source: 'GitHub Jobs'
      }));
    }
  },
  
  // RemoteOK API (官方)
  {
    name: 'RemoteOK',
    url: 'https://remoteok.com/api',
    method: 'GET',
    parser: (data) => {
      if (!Array.isArray(data)) return [];
      return data.filter(j => j.id).map(job => ({
        id: `remoteok-${job.id}`,
        title: job.position,
        company: job.company,
        location: job.location || 'Remote',
        type: job.tags?.includes('contract') ? 'Contract' : 'Full-time',
        description: job.description || '',
        applyUrl: job.apply_url || job.url,
        postedAt: new Date(job.date).toISOString(),
        source: 'RemoteOK'
      }));
    }
  },
  
  // Remotive API (官方)
  {
    name: 'Remotive',
    url: 'https://remotive.com/api/remote-jobs',
    method: 'GET',
    parser: (data) => {
      if (!data.jobs) return [];
      return data.jobs.map(job => ({
        id: `remotive-${job.id}`,
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location || 'Remote',
        type: job.job_type || 'Full-time',
        description: job.description || '',
        applyUrl: job.url,
        postedAt: job.publication_date,
        source: 'Remotive'
      }));
    }
  }
];

// ============ HTTP请求工具 ============
function fetchJSON(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {}
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// ============ 主程序 ============
async function crawlOfficialAPIs() {
  console.log('🚀 启动官方API爬虫...\n');
  
  const allJobs = [];
  const results = [];
  
  for (const source of OFFICIAL_APIS) {
    try {
      console.log(`🔍 抓取 ${source.name}...`);
      
      const data = await fetchJSON(source.url, {
        method: source.method,
        headers: source.headers,
        body: source.body
      });
      
      const jobs = source.parser(data);
      allJobs.push(...jobs);
      results.push({ name: source.name, count: jobs.length, status: '✅' });
      console.log(`  ✅ ${source.name}: ${jobs.length} 个职位`);
      
    } catch (err) {
      results.push({ name: source.name, count: 0, status: '❌', error: err.message });
      console.log(`  ❌ ${source.name}: ${err.message}`);
    }
  }
  
  console.log('\n📊 ===== 抓取结果 =====');
  results.forEach(r => {
    console.log(`${r.status} ${r.name}: ${r.count} 个职位 ${r.error ? `(${r.error})` : ''}`);
  });
  console.log(`\n✅ 总计: ${allJobs.length} 个职位`);
  console.log('======================\n');
  
  return allJobs;
}

// ============ 保存职位 ============
function saveJobs(jobs) {
  if (jobs.length === 0) {
    console.log('⚠️ 没有抓取到职位，跳过保存');
    return;
  }
  
  const jobsFile = path.join(__dirname, '../../src/data/real-jobs/index.ts');
  
  // 读取现有职位
  let existingJobs = [];
  try {
    const content = fs.readFileSync(jobsFile, 'utf8');
    const match = content.match(/export const realJobs: Job\[\] = ([\s\S]+?);$/);
    if (match) {
      existingJobs = eval(match[1]);
    }
  } catch (e) {
    console.log('⚠️ 无法读取现有职位，创建新文件');
  }
  
  // 去重
  const existingIds = new Set(existingJobs.map(j => j.id));
  const newJobs = jobs.filter(j => !existingIds.has(j.id));
  
  // 合并
  const allJobs = [...existingJobs, ...newJobs];
  
  // 生成TypeScript
  const tsContent = `import { Job } from '@/types/job';\n\nexport const realJobs: Job[] = ${JSON.stringify(allJobs, null, 2)};\n\nexport const jobsCount = ${allJobs.length};\n`;
  
  fs.writeFileSync(jobsFile, tsContent);
  console.log(`💾 已保存 ${allJobs.length} 个职位 (新增 ${newJobs.length})`);
}

// ============ 运行 ============
crawlOfficialAPIs()
  .then(jobs => {
    saveJobs(jobs);
    console.log('\n🎉 官方API爬虫完成！');
  })
  .catch(err => {
    console.error('❌ 爬虫失败:', err);
    process.exit(1);
  });
