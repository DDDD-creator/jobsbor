# 真实职位爬虫系统

## 🎯 系统说明

此爬虫系统专门抓取**真实的职位数据**，不再生成虚假职位。

## 🕷️ 当前数据源

| 数据源 | 状态 | 职位数 | 数据类型 |
|--------|------|--------|----------|
| **RemoteOK** | ✅ 运行中 | 3 | 远程加密/Web3职位 |
| **We Work Remotely** | ⚠️ 调试中 | 0 | 远程技术职位 |
| **其他数据源** | ⏳ 待添加 | - | - |

## 📊 已抓取的真实职位

### 1. Crypto Trader - ELEMENTAL TERRA
- **地点**: Remote
- **申请链接**: https://remoteOK.com/remote-jobs/remote-crypto-trader-elemental-terra-1130867
- **发布日期**: 2026-03-24

### 2. Junior Crypto Analyst & Trader - Begini
- **地点**: Remote
- **申请链接**: https://remoteOK.com/remote-jobs/remote-junior-crypto-analyst-trader-begini-1130809
- **发布日期**: 2026-03-17

### 3. Entry Level Crypto Market Specialist - ELEMENTAL TERRA
- **地点**: Remote
- **申请链接**: https://remoteOK.com/remote-jobs/remote-entry-level-crypto-market-specialist-elemental-terra-1130759
- **发布日期**: 2026-03-13

## 🚀 运行爬虫

```bash
# 手动运行
node scripts/crawler/crawler.js

# 查看结果
cat src/data/real-jobs/remoteok.json
cat CRAWLER_REPORT.json
```

## 📝 数据结构

```json
{
  "id": "唯一标识",
  "title": "职位名称",
  "company": "公司名称",
  "location": "工作地点",
  "salary": "薪资范围（可选）",
  "description": "职位描述",
  "requirements": ["技能要求"],
  "jobType": "FULL_TIME|PART_TIME|CONTRACT",
  "remote": true|false,
  "applyUrl": "真实申请链接",
  "postedAt": "发布日期",
  "source": "数据来源",
  "scrapedAt": "抓取时间"
}
```

## 🔧 计划添加的数据源

1. **AngelList/Wellfound** - 初创公司职位
2. **Hacker News "Who is hiring"** - 技术职位
3. **LinkedIn Jobs API** - 需要申请API权限
4. **Indeed API** - 需要申请API权限
5. **公司官网直接抓取** - Coinbase, Binance, Aave等

## ⚠️ 注意事项

- 遵守各网站的robots.txt和API使用限制
- 设置合理的请求间隔（rate limiting）
- 只抓取公开的职位信息
- 职位数据会定期更新（建议每天1-2次）

## 🔄 自动化计划

设置定时任务（cron）定期运行爬虫：
```bash
# 每天运行2次
0 9,21 * * * cd /path/to/project && node scripts/crawler/crawler.js
```

---

*真实数据，真实价值*
