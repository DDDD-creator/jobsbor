/**
 * 实时爬虫守护进程
 * 持续监控全球职位源，实时检测新职位
 * 检测到更新时自动构建部署
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHECK_INTERVAL = 5 * 60 * 1000; // 5分钟检查一次
const DATA_FILE = path.join(__dirname, '../../src/data/real-jobs/all-jobs.json');
const STATE_FILE = path.join(__dirname, '.crawler-state.json');

// 数据源配置
const SOURCES = [
  { name: 'RemoteOK', url: 'https://remoteok.com/api', enabled: true },
  { name: 'HN', url: 'https://hn.algolia.com/api/v1/search?query=who+is+hiring', enabled: false },
];

let isRunning = false;
let lastBuildTime = 0;
const BUILD_COOLDOWN = 10 * 60 * 1000; // 构建冷却时间10分钟

/**
 * 加载状态
 */
function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (e) {}
  return { lastCheck: 0, knownIds: [], lastBuild: 0 };
}

/**
 * 保存状态
 */
function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

/**
 * 获取当前所有职位ID
 */
function getCurrentJobIds() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const jobs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return jobs.map(j => j.id);
  } catch (e) {
    return [];
  }
}

/**
 * 爬取 RemoteOK 实时数据
 */
async function crawlRemoteOKRealtime() {
  try {
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const jobs = data.slice(1);

    return jobs.map(item => ({
      id: `remoteok-${item.id || item.slug}`,
      title: item.position,
      company: item.company,
      location: item.location || 'Remote',
      postedAt: item.date,
      isNew: true
    }));
  } catch (error) {
    console.error(`[${new Date().toISOString()}] RemoteOK 失败:`, error.message);
    return [];
  }
}

/**
 * 检查是否有新职位
 */
async function checkForNewJobs() {
  console.log(`\n[${new Date().toISOString()}] 🔍 检查新职位...`);

  const state = loadState();
  const currentIds = getCurrentJobIds();
  const newJobsFound = [];

  // 检查RemoteOK
  const remoteokJobs = await crawlRemoteOKRealtime();

  for (const job of remoteokJobs) {
    if (!currentIds.includes(job.id) && !state.knownIds.includes(job.id)) {
      newJobsFound.push(job);
      state.knownIds.push(job.id);
    }
  }

  // 只保留最近1000个已知ID，防止内存泄漏
  if (state.knownIds.length > 1000) {
    state.knownIds = state.knownIds.slice(-1000);
  }

  state.lastCheck = Date.now();
  saveState(state);

  if (newJobsFound.length > 0) {
    console.log(`✅ 发现 ${newJobsFound.length} 个新职位:`);
    newJobsFound.forEach(job => {
      console.log(`   - ${job.title} @ ${job.company}`);
    });
    return true;
  } else {
    console.log('⏳ 暂无新职位');
    return false;
  }
}

/**
 * 触发爬虫和部署
 */
async function triggerCrawlAndDeploy() {
  if (isRunning) {
    console.log('⚠️ 爬虫正在运行，跳过本次触发');
    return;
  }

  const now = Date.now();
  if (now - lastBuildTime < BUILD_COOLDOWN) {
    console.log(`⏳ 构建冷却中，${Math.ceil((BUILD_COOLDOWN - (now - lastBuildTime)) / 60000)}分钟后重试`);
    return;
  }

  isRunning = true;
  console.log(`\n[${new Date().toISOString()}] 🚀 开始抓取并部署...`);

  try {
    // 运行完整爬虫
    const orchestrator = require('./orchestrator');
    await orchestrator.main();

    // 构建
    console.log('🔨 构建中...');
    execSync('npm run build', {
      cwd: path.join(__dirname, '../..'),
      stdio: 'pipe'
    });

    lastBuildTime = Date.now();
    console.log(`[${new Date().toISOString()}] ✅ 部署完成！`);

  } catch (error) {
    console.error('❌ 构建失败:', error.message);
  } finally {
    isRunning = false;
  }
}

/**
 * 主循环
 */
async function mainLoop() {
  console.log('\n═══════════════════════════════════════');
  console.log('  🕷️ 实时爬虫守护进程启动');
  console.log(`  ⏰ 检查间隔: ${CHECK_INTERVAL / 1000}秒`);
  console.log(`  🔄 构建冷却: ${BUILD_COOLDOWN / 60000}分钟`);
  console.log('═══════════════════════════════════════\n');

  // 首次运行立即检查
  const hasNewJobs = await checkForNewJobs();
  if (hasNewJobs) {
    await triggerCrawlAndDeploy();
  }

  // 定时检查
  setInterval(async () => {
    const found = await checkForNewJobs();
    if (found) {
      await triggerCrawlAndDeploy();
    }
  }, CHECK_INTERVAL);

  console.log(`[${new Date().toISOString()}] 🟢 守护进程运行中...`);
  console.log('按 Ctrl+C 停止\n');
}

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n🛑 守护进程停止');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 守护进程停止');
  process.exit(0);
});

// 启动
mainLoop().catch(console.error);
