# Jobsbor 运维监控报告
**生成时间**: 2026-04-02 19:18:00 CST  
**检查周期**: 每10分钟  
**报告状态**: 🔴 需要关注

---

## 📊 执行摘要

| 指标 | 状态 | 说明 |
|------|------|------|
| 网站可用性 | 🔴 异常 | jobsbor.vercel.app 无法访问 |
| 爬虫系统 | 🟢 正常 | 6/6 进程在线运行 |
| 系统资源 | 🟢 正常 | CPU/内存/磁盘健康 |
| 最新部署 | 🟡 待确认 | dist/ 构建于 19:18 |

---

## 🚀 1. 部署状态报告

### 项目信息
- **项目路径**: `/root/.openclaw/workspace/recruitment-site`
- **部署目标**: Vercel (https://jobsbor.vercel.app)
- **构建目录**: `dist/` (静态导出)
- **框架**: Next.js 14.0.4

### 网站可用性检查

```
❌ https://jobsbor.vercel.app
   - HTTP状态: 000 (连接失败)
   - 响应时间: 0.019s
   - 错误: Failed to connect to jobsbor.vercel.app port 443

❌ https://jobsbor.vercel.app/api/jobs
   - HTTP状态: 000 (连接失败)
   - 响应时间: 0.012s
```

### 🔴 关键问题
**网站无法访问** - 可能原因：
1. Vercel项目未部署或域名配置错误
2. Vercel CLI未安装，无法执行部署命令
3. 网络/DNS解析问题

### 建议操作
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录并部署
vercel login
vercel --prod

# 3. 或者检查现有部署状态
vercel ls
```

---

## 🕷️ 2. 爬虫健康状态

### 进程概览 (6/6 在线 ✅)

| ID | 进程名称 | 状态 | 运行时间 | 内存 | 重启 |
|----|----------|------|----------|------|------|
| 0 | jobsbor-realtime-monitor | 🟢 online | 43m | 102.0MB | 0 |
| 1 | jobsbor-company-crawler | 🟢 online | 43m | 72.0MB | 0 |
| 2 | jobsbor-multi-source | 🟢 online | 6m | 98.1MB | 1 |
| 3 | jobsbor-extended-sources | 🟢 online | 5m | 105.7MB | 1 |
| 4 | jobsbor-global-company | 🟢 online | 16m | 64.8MB | 0 |
| 5 | jobsbor-global-sources | 🟢 online | 16m | 101.1MB | 0 |

### 数据收集统计

```
📊 总职位数: 485
📈 今日新增: 0
🕒 最后更新: 2026-04-02 19:16:48
```

### 各爬虫详细状态

#### ✅ jobsbor-company-crawler (企业官网爬虫)
- **最后运行**: 18:34:57
- **成功公司**: 50/50
- **失败公司**: 0
- **采集职位**: 348 (去重后)
- **耗时**: 2.53秒
- **状态**: 优秀

#### ✅ jobsbor-multi-source (多数据源爬虫)
- **RemoteOK**: 98 职位 ✅
- **WeWorkRemotely**: 0 职位 ❌ HTTP 403
- **状态**: 部分成功，有反爬限制

#### ✅ jobsbor-extended-sources (扩展数据源)
- **RemoteOK**: 98 职位 ✅
- **WeWorkRemotely**: 0 职位 ❌ HTTP 403
- **StackOverflow**: 0 职位 ❌ HTTP 403
- **状态**: 受反爬影响

#### ✅ jobsbor-realtime-monitor (实时监控)
- **检查频率**: 每5分钟
- **最后检查**: 19:15:21
- **新职位**: 暂无
- **错误日志**: 0条
- **状态**: 正常运行

### 🟡 已知问题

| 问题 | 影响 | 状态 |
|------|------|------|
| WeWorkRemotely HTTP 403 | 无法抓取该源职位 | 已知，需优化请求头 |
| StackOverflow HTTP 403 | 无法抓取该源职位 | 已知，需优化请求头 |

---

## 🖥️ 3. 系统资源状态

### 内存使用
```
总内存: 7.5Gi
已使用: 2.3Gi (31%)
可用:   5.2Gi (69%)
缓存:   4.7Gi
```
**状态**: 🟢 健康

### 磁盘使用
```
文件系统: /dev/vda2
总容量:   40G
已使用:   16G (41%)
可用:     23G (59%)
```
**状态**: 🟢 健康

### 爬虫内存占用详情
```
realtime-monitor:    102.0 MB
extended-sources:    105.7 MB
global-sources:      101.1 MB
multi-source:         98.1 MB
company-crawler:      72.0 MB
global-company:       64.8 MB
--------------------------------
总计:                542.7 MB
```
**状态**: 🟢 内存使用合理

---

## 📜 4. 日志管理

### 日志文件统计

| 日志文件 | 行数 | 最后更新 |
|----------|------|----------|
| company-crawler-1.log | 175 | 18:34 |
| extended-sources-crawler.log | 206 | 19:17 |
| global-company-crawler.log | 209 | 19:02 |
| global-sources-crawler.log | 77 | 19:17 |
| multi-source-crawler.log | 220 | 19:18 |
| realtime-monitor.log | 82 | 19:15 |
| realtime-monitor-out.log | 82 | 19:15 |
| realtime-monitor-error.log | 0 | - |

### 错误日志分析
```
✅ realtime-monitor-error.log: 空 (无错误)
✅ 各爬虫 error 日志: 空 (无崩溃)
```

**状态**: 🟢 无严重错误

---

## 📝 5. 代码变更记录

### 最近5次提交
```
d73cb38 fix: 修复WeWorkRemotely和StackOverflow爬虫请求头
2b19111 feat: 全球爬虫系统 v4.0 - 500+企业 + 50+数据源
2b4a3c8 feat: 扩展数据源 - 15+信息源 + 55家公司官网
0ce6650 feat: 7x24小时实时爬虫系统 - 3个守护进程并行运行
fc39ff7 fix: 移除虚假职位数据，仅显示485个真实职位
```

### 未提交变更
```
M logs/extended-sources-crawler.log
M logs/global-sources-crawler.log
M logs/multi-source-crawler.log
M logs/realtime-monitor-out.log
M logs/realtime-monitor.log
M scripts/crawler/.crawler-state.json
?? TEAM.md
```

**建议**: 日志文件为运行时数据，无需提交到Git

---

## 🎯 6. 待办事项

### 🔴 高优先级
- [ ] **修复网站访问问题** - Vercel部署失败，需立即处理
- [ ] **安装并配置 Vercel CLI** - 确保部署流程正常

### 🟡 中优先级
- [ ] **优化反爬策略** - WeWorkRemotely和StackOverflow返回403
- [ ] **设置日志轮转** - 防止日志文件无限增长

### 🟢 低优先级
- [ ] **添加部署自动化脚本** - 实现Git推送后自动部署
- [ ] **配置监控告警** - 当网站/爬虫异常时发送通知

---

## 📈 7. 运行趋势

### 爬虫稳定性
```
最近重启记录:
- jobsbor-multi-source: 1次重启 (6分钟前)
- jobsbor-extended-sources: 1次重启 (5分钟前)
- 其他进程: 0次重启 (稳定运行43分钟)
```

### 数据采集趋势
```
职位总数: 485 (稳定)
数据源健康度: 1/3 (仅RemoteOK正常)
```

---

## 🔧 8. 运维建议

### 立即执行
```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 检查部署状态
vercel ls

# 3. 如需重新部署
vercel --prod
```

### 优化建议
1. **反爬处理**: 考虑使用代理池或增加请求头轮换
2. **日志管理**: 配置 logrotate 自动轮转日志文件
3. **监控告警**: 建议接入飞书/钉钉机器人，异常时自动通知

---

## 📞 9. 团队协作

### 前端团队
- 网站构建正常，dist/ 目录已生成
- ⚠️ 但Vercel部署异常，需要检查域名配置

### QA测试团队
- 网站暂无法访问，需等待部署修复后进行验证
- API端点测试待网站恢复后进行

---

**报告生成完毕** | 下次检查: 2026-04-02 19:28:00
