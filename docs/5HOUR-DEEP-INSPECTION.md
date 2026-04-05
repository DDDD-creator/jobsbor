# 🔥 特种小组5小时深度检查计划

## 📋 检查目标
全站系统性检查，确保零404、所有功能正常、用户体验完美

---

## ⏱️ 5小时时间线

### 第1小时：全面404扫描 (14:00-15:00)

#### 任务清单
- [ ] 扫描所有路由文件 (src/app/[lang]/)
- [ ] 检查Footer所有链接
- [ ] 检查Header所有导航
- [ ] 检查职位卡片链接
- [ ] 检查公司卡片链接
- [ ] 检查博客文章链接
- [ ] 检查工具页面链接

#### 扫描脚本
```bash
# 生成所有预期URL列表
node scripts/generate-url-list.js

# 批量检查URL状态
node scripts/bulk-url-check.js
```

#### 关键检查点
| 页面类型 | 数量 | 检查方式 |
|---------|------|---------|
| 职位详情页 | 400+ | 检查每个slug是否可访问 |
| 公司详情页 | 15+ | 检查每个公司slug |
| 博客文章 | 10+ | 检查/blog/[slug] |
| 工具页面 | 4 | 检查/tools/* |
| 静态页面 | 10+ | about/guide/privacy/terms/contact |

---

### 第2小时：链接跳转验证 (15:00-16:00)

#### 检查所有LocalizedLink
```bash
grep -rn "from 'next/link'" src/ --include="*.tsx" --include="*.ts"
```

#### 必须修复的文件清单
- [ ] Footer.tsx - 所有Link改为LocalizedLink
- [ ] Header.tsx - 所有Link改为LocalizedLink
- [ ] JobCard.tsx - 所有Link改为LocalizedLink
- [ ] CompanyCard.tsx - 所有Link改为LocalizedLink
- [ ] optimized-job-card.tsx - 所有Link改为LocalizedLink
- [ ] 所有页面文件中的内部链接

#### 标签点击检查
- [ ] 职位详情页标签 → /jobs?keyword=xxx
- [ ] 公司标签 → /companies?industry=xxx
- [ ] 行业标签 → /jobs?industry=xxx

---

### 第3小时：数据渲染检查 (16:00-17:00)

#### 职位数据检查
- [ ] 职位描述格式 (不能显示代码)
- [ ] 岗位要求格式
- [ ] 薪资格式化显示
- [ ] 发布时间显示
- [ ] 公司信息完整性

#### 数据类型检查
```typescript
// 检查所有数据类型匹配
interface JobCheck {
  id: string ✅
  title: string ✅
  slug: string ✅
  description: string (不能是代码) ❓
  requirements: string (不能是代码) ❓
  salaryMin: number ✅
  salaryMax: number ✅
  tags: string[] ✅
}
```

#### 真实职位数据检查
- [ ] realJobs 485个职位数据完整性
- [ ] crawledJobs 爬虫数据格式
- [ ] seedJobs 种子数据格式
- [ ] 三种数据源合并后的一致性

---

### 第4小时：功能测试 (17:00-18:00)

#### 搜索功能
- [ ] 关键词搜索
- [ ] 标签点击搜索
- [ ] 筛选器联动
- [ ] 搜索结果分页

#### 收藏功能
- [ ] 点击收藏
- [ ] localStorage存储
- [ ] 收藏列表显示
- [ ] 取消收藏

#### 申请功能
- [ ] 有applyUrl时显示"立即申请"
- [ ] 无applyUrl时显示"即将开放"
- [ ] 外部链接跳转

#### 语言切换
- [ ] 中文/英文切换
- [ ] URL前缀正确切换
- [ ] 内容正确显示

---

### 第5小时：性能优化与修复 (18:00-19:00)

#### 构建优化
- [ ] 移除console.log
- [ ] 优化图片加载
- [ ] 检查bundle大小
- [ ] 静态生成优化

#### 错误处理
- [ ] 404页面美化
- [ ] 错误边界处理
- [ ] 加载状态优化

#### 最终验证
- [ ] 全量构建测试
- [ ] 部署验证
- [ ] 监控配置检查

---

## 🛠️ 自动化检查脚本

### 1. URL扫描器
```javascript
// scripts/url-scanner.js
const pages = [
  '/zh', '/en',
  '/zh/jobs', '/en/jobs',
  '/zh/companies', '/en/companies',
  // ... 所有页面
];

for (const page of pages) {
  const res = await fetch(`https://jobsbor.vercel.app${page}`);
  if (res.status === 404) {
    console.error(`❌ 404: ${page}`);
  }
}
```

### 2. 链接检查器
```javascript
// scripts/link-checker.js
// 检查所有<a>和<Link>标签的href
// 验证是否为LocalizedLink
```

### 3. 数据验证器
```javascript
// scripts/data-validator.js
// 验证所有职位数据格式
// 检查description/requirements是否为纯文本
```

---

## 🚨 问题分级

### P0 - 致命错误 (立即修复)
- [ ] 主要页面404
- [ ] 构建失败
- [ ] 数据无法加载

### P1 - 严重错误 (1小时内修复)
- [ ] 职位描述显示代码
- [ ] 标签点击404
- [ ] 链接跳转失败

### P2 - 一般问题 (2小时内修复)
- [ ] 样式问题
- [ ] 文字错误
- [ ] 性能问题

### P3 - 优化建议 (后续处理)
- [ ] UI微调
- [ ] 动画优化
- [ ] SEO增强

---

## 📊 检查报告模板

```markdown
## 检查时间: 2026-04-03 14:00

### 404检查
- 总页面: 468
- 正常: xxx
- 404: xxx
- 修复: xxx

### 链接检查
- 总链接: xxx
- 正常: xxx
- 异常: xxx
- 修复: xxx

### 数据检查
- 职位数: 510
- 正常显示: xxx
- 显示异常: xxx
- 修复: xxx

### 功能检查
- 搜索: ✅/❌
- 筛选: ✅/❌
- 收藏: ✅/❌
- 申请: ✅/❌

### 发现问题
1. [P0/P1/P2] 问题描述 → 修复方案
2. ...

### 修复进度
- [ ] 问题1
- [ ] 问题2
- [ ] ...
```

---

## 🎯 成功标准

### 必须达成
- [ ] 零404页面
- [ ] 所有链接正常跳转
- [ ] 职位描述正常显示 (无代码)
- [ ] 标签点击正常
- [ ] 搜索功能正常

### 加分项
- [ ] 性能评分 > 90
- [ ] SEO评分 > 90
- [ ] 用户体验评分 > 90

---

## 📞 紧急联系

发现问题立即报告：
- API: sk-5iEZ4x4cwvjrMH-cI3T4Pmbj7mcK4XH5dYdzgkztwtA
- URL: https://api.monitor.jobsbor.com/report

---

**开始时间**: 2026-04-03 14:00  
**结束时间**: 2026-04-03 19:00  
**负责人**: 特种小组组长  
**状态**: 🟡 准备中
