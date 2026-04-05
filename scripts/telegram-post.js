#!/usr/bin/env node
/**
 * Telegram职位自动发布脚本
 * 每30分钟从职位池随机选择一个职位发布
 */

const fs = require('fs');
const path = require('path');

const BOT_TOKEN = '8627748476:AAH0WTDbfcSN9MLzLw9hxnleQPwrWP27DEY';
const CHANNEL_ID = '@Web3Kairo'; // Web3Kairo频道
const DATA_FILE = path.join(__dirname, '../src/data/real-jobs/all-jobs-final.json');
const STATE_FILE = path.join(__dirname, '.telegram-posted-jobs.json');

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

// 生成职位消息 - 中文求职招聘版
function formatJobMessage(job) {
  // 判断是否适合中文用户
  const isChineseCompany = ['Tencent', 'ByteDance', 'Alibaba'].includes(job.company);
  const isChineseRegion = job.location?.includes('China') || 
                          job.location?.includes('Asia') ||
                          job.location?.includes('Singapore') ||
                          job.location?.includes('Hong Kong') ||
                          job.location?.includes('Shanghai') ||
                          job.location?.includes('Beijing') ||
                          job.location?.includes('Shenzhen');
  
  // 公司emoji映射
  const emojis = {
    '腾讯': '🐧', '字节跳动': '🎵', '阿里巴巴': '🅰️',
    'Google': '🔍', 'Meta': '📘', 'Amazon': '📦',
    'Microsoft': '🪟', 'Apple': '🍎', 'Netflix': '🎬',
    'Stripe': '💳', 'OpenAI': '🤖', 'Twitter': '🐦',
    'LinkedIn': '💼', 'Spotify': '🎵', 'Airbnb': '🏠',
    'Uber': '🚗', 'Lyft': '🚙', 'Coinbase': '₿',
    'Discord': '🎮', 'Slack': '💬', 'Zoom': '📹',
    'Vercel': '▲', 'GitLab': '🦊', 'Shopify': '🛍️',
    'Figma': '🎨', 'Notion': '📝', 'Linear': '📊',
    'Cloudflare': '☁️', 'HashiCorp': '🏗️',
    'Anthropic': '🧠', 'NVIDIA': '🎮', 'Intel': '💻',
    'AMD': '🔧', 'Samsung': '📱', 'Sony': '🎮',
    'Tesla': '🔋', 'SpaceX': '🚀',
    'default': '💼'
  };
  
  const companyEmoji = emojis[job.company] || emojis['default'];
  const remoteText = job.remote ? '🌍 可远程' : '📍 需现场';
  
  // 中文关键词hashtags
  const hashtags = ['#求职', '#招聘', '#找工作'];
  
  if (job.remote) {
    hashtags.push('#远程工作', '#居家办公', '#RemoteWork');
  }
  
  // 职位类型标签
  if (job.title.toLowerCase().includes('engineer') || 
      job.title.toLowerCase().includes('developer') ||
      job.title.toLowerCase().includes('工程师')) {
    hashtags.push('#工程师', '#程序员', '#技术岗');
  }
  if (job.title.toLowerCase().includes('product') ||
      job.title.toLowerCase().includes('产品经理')) {
    hashtags.push('#产品经理', '#PM');
  }
  if (job.title.toLowerCase().includes('design') ||
      job.title.toLowerCase().includes('设计师')) {
    hashtags.push('#设计师', '#UIUX');
  }
  if (job.title.toLowerCase().includes('data') ||
      job.title.toLowerCase().includes('数据')) {
    hashtags.push('#数据分析', '#数据科学');
  }
  if (job.title.toLowerCase().includes('marketing') ||
      job.title.toLowerCase().includes('市场')) {
    hashtags.push('#市场营销', '#运营');
  }
  
  // 大厂标签
  const bigCompanies = ['Google', 'Meta', 'Microsoft', 'Apple', 'Amazon', 
    '腾讯', '字节跳动', '阿里巴巴', 'Netflix', 'OpenAI', 'NVIDIA'];
  if (bigCompanies.includes(job.company)) {
    hashtags.push('#大厂', '#名企');
  }
  
  // 地区标签
  if (isChineseRegion || isChineseCompany) {
    hashtags.push('#中国招聘', '#国内工作');
  } else {
    hashtags.push('#海外工作', '#外企');
  }
  
  // 构建中文消息
  let message = `${companyEmoji} <b>${job.title}</b>\n\n`;
  message += `🏢 <b>${job.company}</b>\n`;
  message += `${remoteText} · ${job.location}\n\n`;
  
  // 职位描述
  const desc = job.description?.substring(0, 200).trim() || '';
  if (desc) {
    message += `📝 ${desc}${job.description?.length > 200 ? '...' : ''}\n\n`;
  }
  
  // 技能要求
  if (job.requirements?.length > 0) {
    message += `🔧 <b>要求:</b> ${job.requirements.slice(0, 3).join(' · ')}\n\n`;
  }
  
  // CTA按钮
  message += `👉 <b><a href="${job.applyUrl}">立即投递简历</a></b>\n\n`;
  
  // 网站引流
  message += `📎 更多职位: jobsbor.vercel.app\n\n`;
  
  // Hashtags
  message += hashtags.slice(0, 10).join(' ');
  
  return message;
}

// 筛选适合中文用户的职位
function filterChineseFriendlyJobs(jobs) {
  return jobs.filter(job => {
    // 中国公司优先
    const chineseCompanies = ['Tencent', 'ByteDance', 'Alibaba'];
    if (chineseCompanies.includes(job.company)) return true;
    
    // 亚洲/中国地区优先
    const asiaKeywords = ['China', 'Asia', 'Singapore', 'Hong Kong', 
      'Shanghai', 'Beijing', 'Shenzhen', 'Tokyo', 'Seoul', 'APAC'];
    if (asiaKeywords.some(kw => job.location?.includes(kw))) return true;
    
    // 远程职位（全球可申请）
    if (job.remote) return true;
    
    // 大厂职位（有全球办公室）
    const globalCompanies = ['Google', 'Meta', 'Microsoft', 'Apple', 'Amazon', 
      'Netflix', 'Stripe', 'OpenAI', 'NVIDIA'];
    if (globalCompanies.includes(job.company)) return true;
    
    return false;
  });
}

// 发送消息到Telegram (带代理支持)
async function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  // 使用Cloudflare Workers代理绕过限制
  const proxyUrls = [
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    `https://tg-api-proxy.openclaw.workers.dev/bot${BOT_TOKEN}/sendMessage`,
  ];
  
  for (const proxyUrl of proxyUrls) {
    try {
      console.log(`📤 尝试发送...`);
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30秒超时
      
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHANNEL_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeout);
      
      const data = await response.json();
      
      if (data.ok) {
        console.log('✅ 消息发送成功');
        return true;
      } else {
        console.error('❌ 发送失败:', data.description);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('❌ 请求超时');
      } else {
        console.error('❌ 网络错误:', error.message);
      }
    }
  }
  
  return false;
}

// 主函数
async function main() {
  console.log('🤖 Telegram中文职位自动发布\n');
  
  const allJobs = loadJobs();
  if (allJobs.length === 0) {
    console.error('❌ 没有职位数据');
    process.exit(1);
  }
  
  // 筛选适合中文用户的职位
  const jobs = filterChineseFriendlyJobs(allJobs);
  console.log(`📊 总职位池: ${allJobs.length} 个`);
  console.log(`🇨🇳 中文友好职位: ${jobs.length} 个`);
  
  if (jobs.length === 0) {
    console.error('❌ 没有适合中文用户的职位');
    process.exit(1);
  }
  
  const postedJobs = loadPostedJobs();
  console.log(`📤 已发布: ${postedJobs.length} 个职位`);
  
  // 过滤未发布的职位
  const postedIds = new Set(postedJobs);
  const availableJobs = jobs.filter(j => !postedIds.has(j.id));
  
  if (availableJobs.length === 0) {
    console.log('⚠️ 所有职位都已发布过，重置记录...');
    postedJobs.length = 0;
  }
  
  // 随机选择一个职位
  const job = availableJobs[Math.floor(Math.random() * availableJobs.length)];
  console.log(`\n🎯 选中职位: ${job.title} @ ${job.company}`);
  
  // 生成消息
  const message = formatJobMessage(job);
  console.log('📝 消息内容:');
  console.log(message);
  
  // 发送到Telegram
  console.log('\n📤 发送中...');
  const success = await sendToTelegram(message);
  
  if (success) {
    // 记录已发布
    postedJobs.push(job.id);
    savePostedJobs(postedJobs);
    console.log(`\n✅ 发布成功！剩余未发布: ${availableJobs.length - 1} 个`);
  } else {
    console.error('\n❌ 发布失败');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('💥 错误:', err.message);
  process.exit(1);
});
