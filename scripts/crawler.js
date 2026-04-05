#!/usr/bin/env node
/**
 * 职位爬虫调度脚本
 * 支持：立即运行 / 定时运行 / 作为Vercel Cron调用
 */

const https = require('https');

const CONFIG = {
  // 爬虫服务地址（你需要部署爬虫后填入）
  CRAWLER_URL: process.env.CRAWLER_URL || '',
  // 通知渠道
  NOTIFY_WEBHOOK: process.env.NOTIFY_WEBHOOK || '',
  // 最小职位数阈值（低于此数告警）
  MIN_JOBS_THRESHOLD: 100,
};

// 日志函数
function log(level, message, data) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, level, message, data };
  console.log(JSON.stringify(logEntry));
}

// HTTP请求封装
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 30000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
          });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

// 主爬虫函数
async function runCrawler() {
  log('info', 'Starting crawler job');
  
  try {
    // 1. 检查是否有配置的爬虫服务
    if (!CONFIG.CRAWLER_URL) {
      log('warn', 'CRAWLER_URL not configured, using fallback data update');
      // 备用：触发本地数据更新逻辑
      await updateFromFallback();
      return { success: true, method: 'fallback', jobs: 0 };
    }

    // 2. 调用爬虫服务
    log('info', 'Calling crawler service', { url: CONFIG.CRAWLER_URL });
    const response = await fetch(CONFIG.CRAWLER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status !== 200) {
      throw new Error(`Crawler returned ${response.status}`);
    }

    const result = response.data;
    log('info', 'Crawler completed', result);

    // 3. 检查职位数量
    if (result.jobs < CONFIG.MIN_JOBS_THRESHOLD) {
      await sendAlert(`职位数量过低: ${result.jobs} < ${CONFIG.MIN_JOBS_THRESHOLD}`);
    }

    // 4. 更新数据库（如果有的话）
    await syncToDatabase(result.jobs);

    return { success: true, method: 'crawler', ...result };

  } catch (error) {
    log('error', 'Crawler failed', { error: error.message });
    await sendAlert(`爬虫失败: ${error.message}`);
    throw error;
  }
}

// 备用数据更新
async function updateFromFallback() {
  // 这里可以读取本地JSON文件并更新
  log('info', 'Updating from local data files');
  // 实际上静态站点直接构建时已经包含数据
  return { jobs: 0 };
}

// 同步到数据库
async function syncToDatabase(jobs) {
  // 如果有数据库，这里更新职位数据
  log('info', 'Syncing to database', { jobCount: jobs });
}

// 发送告警
async function sendAlert(message) {
  if (!CONFIG.NOTIFY_WEBHOOK) {
    log('warn', 'Alert not sent - no webhook configured', { message });
    return;
  }

  try {
    await fetch(CONFIG.NOTIFY_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { text: `[Jobsbor Crawler] ${message}` },
    });
  } catch (error) {
    log('error', 'Failed to send alert', { error: error.message });
  }
}

// API路由处理器（用于Vercel）
async function handler(req, res) {
  // 验证密钥
  const authHeader = req.headers.authorization;
  const expectedKey = process.env.CRAWLER_API_KEY;
  
  if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await runCrawler();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// 命令行运行
if (require.main === module) {
  runCrawler()
    .then(result => {
      console.log('\n✅ Crawler completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Crawler failed:', error.message);
      process.exit(1);
    });
}

module.exports = { handler, runCrawler };
