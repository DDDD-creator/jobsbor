# 🌍 Jobsbor 全球收录 & SEO 外链策略

## 一、搜索引擎提交（立即执行）

### 1. Google Search Console
- 访问：https://search.google.com/search-console
- 添加属性：`https://jobsbor.vercel.app`
- 验证方式：推荐 DNS TXT 记录验证
- 提交 Sitemap：`https://jobsbor.vercel.app/sitemap.xml`
- 使用 URL Inspection 工具请求索引核心页面

### 2. Bing Webmaster Tools
- 访问：https://www.bing.com/webmasters
- 添加站点：`https://jobsbor.vercel.app`
- 提交 Sitemap：`https://jobsbor.vercel.app/sitemap.xml`
- 可直接导入 Google Search Console 数据

### 3. Yandex Webmaster（俄罗斯）
- 访问：https://webmaster.yandex.com
- 添加站点验证
- 提交 Sitemap

### 4. Naver Search Advisor（韩国）
- 访问：https://searchadvisor.naver.com
- 适合亚洲市场

### 5. Baidu Webmaster（百度）
- 访问：https://ziyuan.baidu.com
- 已有 `baidu_verify_CODE.html`，需替换为真实验证码
- 提交 Sitemap

---

## 二、高权重反向链接策略

### Tier 1：高 DA 平台（DA 80+）

| 平台 | DA | 操作 |
|------|-----|------|
| GitHub | 96 | 在 README 添加链接，开源项目引用 |
| Product Hunt | 93 | 提交 Jobsbor 上线 Product Hunt |
| Hacker News | 92 | 发布 "Show HN" 帖子 |
| Reddit r/webdev | 91 | 分享建站经历 |
| Reddit r/remotejobs | 91 | 分享招聘平台 |
| Medium | 95 | 撰写 "如何搭建招聘平台" 文章 |
| Dev.to | 88 | 发布技术博客 |
| Hashnode | 85 | 同步发布技术内容 |

### Tier 2：行业相关（DA 50-80）

| 平台 | 操作 |
|------|------|
| AngelList / Wellfound | 创建公司页面，链接回 Jobsbor |
| Clutch.co | 创建招聘平台页面 |
| GoodFirms | 提交产品列表 |
| AlternativeTo | 提交 Jobsbor 作为招聘平台替代方案 |
| Crunchbase | 创建公司档案 |

### Tier 3：内容营销外链

| 策略 | 说明 |
|------|------|
| Guest Posting | 向 HR/招聘类博客投稿 |
| HARO (Help A Reporter Out) | 回应记者关于招聘趋势的提问 |
| 资源页链接 | 联系 "best job boards" 列表页添加链接 |
| Broken Link Building | 找到失效的招聘平台链接，推荐替换为 Jobsbor |
| 新闻稿 | 通过 PRNewswire 或 PRLog 发布上线新闻 |

---

## 三、博客内容 SEO 策略

### 当前状态
- ✅ RSS 自动聚合已上线（TechCrunch, Ars Technica, MIT Tech Review）
- 当前文章数：50+ 篇
- 目标：每周更新 2-3 篇原创内容

### 原创内容方向（高搜索量关键词）

| 主题 | 目标关键词 | 月搜索量 |
|------|-----------|---------|
| 远程工作指南 | "remote jobs 2026" | 40K+ |
| 薪资对比 | "web3 salary guide" | 15K+ |
| 面试准备 | "tech interview prep" | 33K+ |
| 职业转型 | "career change to tech" | 22K+ |
| Web3 职业 | "web3 jobs for beginners" | 8K+ |
| 金融科技 | "fintech career path" | 12K+ |

### 长尾关键词落地页
- 已生成脚本：`scripts/generate-longtail-pages.ts`
- 可生成 500+ 个行业 × 地点组合页面
- 每个页面都有独立的 SEO meta + Schema 标记

---

## 四、技术 SEO 优化清单

### ✅ 已完成
- [x] Sitemap 自动生成（含博客）
- [x] Robots.txt 配置
- [x] 结构化数据（JobPosting Schema）
- [x] 面包屑导航 Schema
- [x] Canonical URL
- [x] Open Graph 社交分享图
- [x] 安全头配置（CSP, HSTS）
- [x] 多语言 hreflang 标签
- [x] 移动端响应式
- [x] 页面加载优化（WebP/AVIF）

### 📋 待优化
- [ ] Core Web Vitals 优化（LCP, FID, CLS）
- [ ] 添加 FAQ Schema（常见问答）
- [ ] 添加 HowTo Schema（教程类内容）
- [ ] 图片 ALT 标签完善
- [ ] 内部链接优化（相关文章推荐）
- [ ] 404 页面添加搜索和推荐

---

## 五、社交媒体引流

| 平台 | 策略 |
|------|------|
| Twitter/X | 每日发布热门职位，带 #RemoteJobs #Web3Jobs 标签 |
| LinkedIn | 发布行业洞察，链接到博客文章 |
| Telegram | Web3Kairo 频道持续更新 |
| Discord | 建立 Jobsbor 社区，实时推送新职位 |
| WeChat 公众号 | 面向中文用户，发布招聘信息 |

---

## 六、执行时间表

### 第 1 周（立即）
- [x] 部署博客 RSS 聚合
- [ ] 提交 Google Search Console
- [ ] 提交 Bing Webmaster
- [ ] 提交百度站长
- [ ] 创建 GitHub README 外链
- [ ] 发布 Product Hunt

### 第 2 周
- [ ] 发布 Hacker News "Show HN"
- [ ] 创建 Medium/Dev.to 技术博客
- [ ] 提交 AngelList/Wellfound
- [ ] 创建 Crunchbase 档案
- [ ] 发布第一篇原创博客

### 第 3-4 周
- [ ] 运行长尾关键词页面生成
- [ ] 开始 Guest Posting
- [ ] 注册 HARO
- [ ] 提交 5-10 个目录/列表网站
- [ ] 分析 Google Search Console 数据

### 第 2 个月
- [ ] 根据搜索数据优化内容
- [ ] 增加原创博客频率
- [ ] 建立合作伙伴关系
- [ ] 监控反向链接增长
- [ ] 优化 Core Web Vitals

---

**目标：3 个月内 DA 达到 20+，6 个月达到 35+，日均有机流量 1000+ UV**
