#!/usr/bin/env node
/**
 * Telegram职位发布脚本 - 代理修复版
 * 支持通过代理服务器访问Telegram API
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BOT_TOKEN = '8627748476:AAH0WTDbfcSN9MLzLw9hxnleQPwrWP27DEY';
const CHANNEL_ID = '@Web3Kairo';

// 代理配置 (从环境变量读取或使用默认值)
const PROXY_HOST = process.env.HTTPS_PROXY_HOST || process.env.HTTP_PROXY_HOST;
const PROXY_PORT = process.env.HTTPS_PROXY_PORT || process.env.HTTP_PROXY_PORT || 443;

// 数据文件路径
const DATA_FILE = path.join(__dirname, '../src/data/real-jobs/all-jobs-final.json');
const STATE_FILE = path.join(__dirname, '.telegram-posted-jobs.json');

// 使用代理发送HTTP请求
function fetchWithProxy(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    
    // 如果有代理配置，使用代理
    if (PROXY_HOST) {
      const proxyReq = http.request({
        host: PROXY_HOST,
        port: PROXY_PORT,
        method: 'CONNECT',
        path: `${urlObj.hostname}:${isHttps ? 443 : 80}`,
      });
      
      proxyReq.on('connect', (res, socket) => {
        if (res.statusCode === 200) {
          const request = https.request({
            host: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {},
            socket: socket,
          }, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve({
              ok: response.statusCode < 400,
              status: response.statusCode,
              json: () => Promise.resolve(JSON.parse(data)),
              text: () => Promise.resolve(data),
            }));
          });
          
          if (options.body) request.write(options.body);
          request.end();
        } else {
          reject(new Error(`Proxy connection failed: ${res.statusCode}`));
        }
      });
      
      proxyReq.on('error', reject);
      proxyReq.end();
    } else {
      // 无代理，直接请求
      const client = isHttps ? https : http;
      const req = client.request(url, {
        method: options.method || 'GET',
        headers: options.headers || {},
        timeout: 30000,
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({
          ok: res.statusCode < 400,
          status: res.statusCode,
          json: () => Promise.resolve(JSON.parse(data)),
          text: () => Promise.resolve(data),
        }));
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      if (options.body) req.write(options.body);
      req.end();
    }
  });
}

// 加载职位数据
function loadJobs() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error('❌ 加载职位数据失败:', e.message);
    return [];
  }
}

// 加载已发布记录
function loadPostedJobs() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

// 保存已发布记录
function savePostedJobs(posted) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(posted, null, 2));
  } catch (e) {
    console.error('❌ 保存发布记录失败:', e.message);
  }
}

// 生成职位消息
function formatJobMessage(job) {
  const isChineseCompany = ['Tencent', 'ByteDance', 'Alibaba', '美团', '京东', '百度', '拼多多', '小米', '网易', '华为', '快手', '哔哩哔哩', '滴滴', '携程', '饿了么'].includes(job.company);
  
  let message = '';
  
  // 标题 + 公司
  message += `💼 <b>${job.title}</b>\n\n`;
  message += `🏢 <b>${job.company}</b>\n`;
  
  // 地点
  const location = job.location || 'Remote';
  message += `🌍 ${location}`;
  
  // 薪资
  if (job.salary) {
    message += ` · 💰 ${job.salary}`;
  }
  message += '\n\n';
  
  // 描述
  if (job.description) {
    const desc = job.description.slice(0, 200).replace(/\n/g, ' ');
    message += `📝 ${desc}${job.description.length > 200 ? '...' : ''}\n\n`;
  }
  
  // 申请链接
  if (job.applyUrl) {
    message += `👉 <b><a href="${job.applyUrl}">立即投递简历</a></b>\n\n`;
  }
  
  // 网站引流
  message += `📎 更多职位: https://jobsbor.vercel.app\n\n`;
  
  // Hashtags
  const hashtags = isChineseCompany 
    ? ['#求职', '#招聘', '#找工作', '#大厂', '#互联网', '#' + job.company]
    : ['#求职', '#招聘', '#找工作', '#远程工作', '#RemoteWork', '#外企'];
  message += hashtags.join(' ');
  
  return message;
}

// 筛选适合中文用户的职位
function filterChineseFriendlyJobs(jobs) {
  const chineseCompanies = ['腾讯', '字节跳动', '阿里巴巴', '字节', '阿里', '美团', '京东', '百度', '拼多多', '小米', '网易', '华为', '快手', '哔哩哔哩', 'B站', '滴滴', '携程', '饿了么', 'Tencent', 'ByteDance', 'Alibaba'];
  const asiaKeywords = ['China', '中国', 'Asia', '亚洲', 'Singapore', '新加坡', 'Hong Kong', '香港', 'Shanghai', '上海', 'Beijing', '北京', 'Shenzhen', '深圳', 'Tokyo', '东京', 'Seoul', '首尔', 'Remote', '远程'];
  
  return jobs.filter(job => {
    if (chineseCompanies.includes(job.company)) return true;
    if (asiaKeywords.some(kw => job.location?.includes(kw))) return true;
    if (job.remote === true) return true;
    return false;
  });
}

// 发送消息到Telegram
async function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  try {
    console.log('📤 发送消息到Telegram...');
    
    const response = await fetchWithProxy(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHANNEL_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });
    
    const data = await response.json();
    
    if (data.ok) {
      console.log('✅ 消息发送成功！');
      return true;
    } else {
      console.error('❌ Telegram API错误:', data.description);
      return false;
    }
  } catch (error) {
    console.error('❌ 网络错误:', error.message);
    console.log('\n💡 提示: 如果在中国大陆服务器，需要配置代理');
    console.log('   设置环境变量: export HTTPS_PROXY_HOST=your-proxy.com');
    console.log('   或联系管理员配置代理服务器');
    return false;
  }
}

// 主函数
async function main() {
  console.log('🤖 Telegram中文职位自动发布\n');
  
  // 检查代理配置
  if (PROXY_HOST) {
    console.log(`🌐 使用代理: ${PROXY_HOST}:${PROXY_PORT}\n`);
  } else {
    console.log('⚠️ 未配置代理服务器，直接连接可能失败\n');
  }
  
  // 加载数据
  const jobs = loadJobs();
  const postedJobs = loadPostedJobs();
  
  console.log(`📊 总职位池: ${jobs.length} 个`);
  
  // 筛选中文友好职位
  const chineseJobs = filterChineseFriendlyJobs(jobs);
  console.log(`🇨🇳 中文友好职位: ${chineseJobs.length} 个`);
  console.log(`📤 已发布: ${postedJobs.length} 个职位\n`);
  
  if (chineseJobs.length === 0) {
    console.log('❌ 没有可用的中文友好职位');
    process.exit(1);
  }
  
  // 随机选择一个未发布的职位
  const availableJobs = chineseJobs.filter(j => !postedJobs.includes(j.id));
  if (availableJobs.length === 0) {
    console.log('📝 所有中文职位都已发布过，重置记录');
    postedJobs.length = 0;
  }
  
  const job = availableJobs[0] || chineseJobs[Math.floor(Math.random() * chineseJobs.length)];
  console.log(`🎯 选中职位: ${job.title} @ ${job.company}\n`);
  
  // 生成消息
  const message = formatJobMessage(job);
  console.log('📝 消息内容预览:');
  console.log(message.slice(0, 200) + '...\n');
  
  // 发送
  const success = await sendToTelegram(message);
  
  if (success) {
    // 记录已发布
    if (!postedJobs.includes(job.id)) {
      postedJobs.push(job.id);
      savePostedJobs(postedJobs);
    }
    console.log(`\n✅ 完成！已发布 ${postedJobs.length} 个职位`);
  } else {
    console.log('\n❌ 发布失败，请检查网络和代理配置');
    process.exit(1);
  }
}

// 运行
main().catch(err => {
  console.error('❌ 程序错误:', err);
  process.exit(1);
});
