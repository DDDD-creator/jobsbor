# 🕷️ 全球招聘爬虫智能体系统

## 🎯 系统概述

全自动化的全球职位爬虫系统，支持多数据源并行抓取，自动同步到前端页面，让用户可以直接申请真实职位。

### 核心特性

| 特性 | 描述 |
|------|------|
| 🤖 **智能爬虫** | 并行抓取多个全球招聘平台 |
| 🔄 **自动同步** | 抓取后自动更新前端页面 |
| 🌍 **全球数据源** | RemoteOK、HackerNews、CryptoJobsList 等 |
| ⚡ **实时展示** | 用户可直接在网站申请职位 |
| 🏷️ **智能标签** | 自动提取技术栈和职位类型 |

---

## 📊 当前数据状态

| 数据源 | 职位数 | 状态 | 说明 |
|--------|--------|------|------|
| **RemoteOK** | 87 | ✅ 运行中 | 远程技术职位 |
| **HackerNews** | 0 | ⚠️ 调试中 | 技术招聘帖 |
| **CryptoJobsList** | 0 | ⚠️ 调试中 | Web3/Crypto职位 |
| **总计** | **87** | | |

---

## 🚀 快速开始

### 手动运行爬虫

```bash
cd /root/.openclaw/workspace/recruitment-site
node scripts/crawler/orchestrator.js
```

### 自动运行（推荐）

```bash
# 添加执行权限
chmod +x scripts/crawler/auto-crawl.sh

# 运行
./scripts/crawler/auto-crawl.sh
```

### 设置定时任务（每小时运行）

```bash
# 编辑crontab
crontab -e

# 添加以下行（每小时运行一次）
0 * * * * /bin/bash /root/.openclaw/workspace/recruitment-site/scripts/crawler/auto-crawl.sh >> /var/log/crawler.log 2>&1
```

---

## 🌐 访问职位页面

**职位展示页**: https://jobsbor.vercel.app/real-jobs

页面功能：
- ✅ 显示 87 个真实远程职位
- ✅ 每个职位都有真实申请链接
- ✅ 自动提取技术标签
- ✅ 显示职位来源和发布时间
- ✅ 一键跳转到官方申请页面

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    爬虫调度器 (Orchestrator)                  │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ RemoteOK │  │ HN Jobs  │  │ CryptoJL │   ← 爬虫智能体      │
│  │  智能体   │  │  智能体   │  │  智能体   │                   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                   │
│       └─────────────┴─────────────┘                         │
│                   ↓ 并行抓取                                 │
│            ┌─────────────┐                                   │
│            │  数据去重    │                                   │
│            └──────┬──────┘                                   │
│                   ↓                                          │
│            ┌─────────────┐                                   │
│            │  同步到页面  │  ← 技术智能体                     │
│            └──────┬──────┘                                   │
│                   ↓                                          │
│            ┌─────────────┐                                   │
│            │  构建部署    │                                   │
│            └──────┬──────┘                                   │
│                   ↓                                          │
│            ┌─────────────┐                                   │
│            │  用户申请    │                                   │
│            └─────────────┘                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 智能体协作机制

### 爬虫智能体职责
1. **RemoteOK智能体**: 抓取远程技术职位
2. **HN智能体**: 解析Hacker News招聘帖
3. **CryptoJobsList智能体**: 抓取Web3职位

### 技术智能体职责
1. **数据处理**: 去重、格式化、标签提取
2. **页面生成**: 自动生成React页面代码
3. **构建部署**: 自动化构建和部署流程

---

## 📁 文件结构

```
scripts/crawler/
├── orchestrator.js      # 主调度器
├── auto-crawl.sh        # 自动运行脚本
├── core.js              # 爬虫基类
└── storage/             # 数据存储

src/app/real-jobs/
└── page.tsx             # 自动生成的职位页面

src/data/real-jobs/
└── all-jobs.json        # 所有职位的JSON数据
```

---

## 🌍 数据源详情

### RemoteOK
- **URL**: https://remoteok.com/api
- **类型**: JSON API
- **职位数**: ~100个/批次
- **覆盖领域**: 技术、设计、产品、营销
- **更新频率**: 实时

### Hacker News Who is Hiring
- **URL**: https://news.ycombinator.com/submitted?id=whoishiring
- **类型**: 社区帖子解析
- **职位数**: ~1000个/月
- **覆盖领域**: 技术、创业
- **更新频率**: 每月1日

### CryptoJobsList
- **URL**: https://cryptojobslist.com
- **类型**: HTML爬取
- **职位数**: ~200个
- **覆盖领域**: Web3、区块链、DeFi
- **更新频率**: 每日

---

## 🛠️ 扩展开发

### 添加新数据源

在 `orchestrator.js` 中添加新的爬虫函数：

```javascript
async function crawlNewSource() {
  console.log('🕷️ [智能体] NewSource 爬虫启动...');
  
  try {
    const response = await fetch('https://new-source.com/api');
    const data = await response.json();
    
    const jobs = data.map(item => ({
      id: `newsource-${item.id}`,
      title: item.title,
      company: item.company,
      // ... 其他字段
    }));
    
    return jobs;
  } catch (error) {
    console.error('❌ [智能体] NewSource 失败:', error.message);
    return [];
  }
}
```

然后在 `main()` 函数中调用：

```javascript
const newJobs = await crawlNewSource();
```

---

## 📈 监控指标

查看爬虫报告：

```bash
cat CRAWLER_REPORT.json
```

示例输出：
```json
{
  "timestamp": "2026-04-02T02:24:00.000Z",
  "totalJobs": 87,
  "sources": {
    "remoteok": 87,
    "hackernews": 0,
    "cryptojobslist": 0
  },
  "syncedToPage": 87,
  "duration": "7.64s"
}
```

---

## 🚨 故障排除

### 爬虫返回0个职位
1. 检查网络连接
2. 检查API是否可用
3. 查看错误日志

### 构建失败
1. 检查TypeScript类型错误
2. 确保数据格式正确
3. 检查页面模板语法

### 页面不显示职位
1. 检查数据是否正确同步到页面
2. 检查页面文件是否正确生成
3. 重新运行爬虫

---

## 🎯 未来规划

- [ ] 添加更多数据源（LinkedIn、Indeed、AngelList）
- [ ] 实现职位搜索和筛选功能
- [ ] 添加职位收藏和申请追踪
- [ ] 实现邮件订阅新职位
- [ ] 添加公司信息自动抓取

---

**🕷️ 智能体协作，让招聘更智能！**
