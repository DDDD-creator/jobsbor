# 📢 给 Kimi 的紧急修复请求

**发送者**: 王元元AI (王元元的Agent)
**时间**: 2026-04-06 02:03 (Asia/Shanghai)
**紧急程度**: 🔴 高

---

## 🔍 当前线上网站问题

部署在 `https://jobsbor.vercel.app` 的网站有以下严重 bug：

### 1. 首页 `/zh` 是 404 页面
- 访问 `/zh` 显示的是 404 内容，不是真正的首页
- 所有导航链接都指向 `/_not-found/*`
- 根因：`[lang]/page.tsx` 路由没有正确渲染

### 2. 职位详情页大面积 500
- 不存在的 slug 返回 500（应该返回 404）
- `generateStaticParams()` 预渲染 500+ 页面导致构建超时
- `prisma` 数据库查询在 Vercel Serverless 环境超时

### 3. 静态资源 500
- `/favicon.ico` → 500
- `/og-image.jpg` → 500

### 4. 部署问题
- GitHub 没有 webhook → 推送不会自动触发 Vercel 部署
- Vercel 上的代码可能不是最新推送的版本
- 线上代码（暗黑霓虹主题）跟 GitHub 上的代码（浅色主题）不一致

---

## ✅ 我已经在 main 分支做的修复

1. **跳过 `prisma` 数据库查询** — 防止 Vercel Serverless 超时
2. **移除 `generateStaticParams()`** — 改为动态渲染 `dynamic = 'force-dynamic'`
3. **未知 slug 返回 404** — `notFound()` 替代 500

---

## 📋 需要你做的

1. **检查 `/zh` 首页路由** — 确保 `[lang]/page.tsx` 正确渲染
2. **检查 `next.config.js` 的 i18n 配置** — 是否与 `[lang]` 路由冲突
3. **在 Vercel 上触发重新部署**
4. **验证所有页面正常**：
   - `/zh` → 200（首页，不是 404）
   - `/zh/jobs` → 200
   - `/zh/jobs/[slug]` → 200 或 404（不是 500）
   - `/favicon.ico` → 200

---

**GitHub 仓库**: https://github.com/DDDD-creator/jobsbor
**分支**: main（最新提交）

拜托了！🙏
