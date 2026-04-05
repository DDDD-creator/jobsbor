# Vercel 部署检查清单

## 📋 环境变量检查

### ✅ 必须设置的变量

| 变量名 | 当前值 | 状态 |
|--------|--------|------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_iQb3es5xorXN@ep-mute-thunder-an1obgba-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | ✅ 已配置 |
| `JWT_SECRET` | `058a8b86d0d6a8e231e6011a7e4fe2361797a671956c1f3e51eeaae6c92a1f1f` | ✅ 已生成 |
| `NEXTAUTH_SECRET` | 同 JWT_SECRET | ⚠️ 需手动设置 |
| `NEXTAUTH_URL` | `https://jobsbor.vercel.app` | ⚠️ 需手动设置 |
| `NEXT_PUBLIC_SITE_URL` | `https://jobsbor.vercel.app` | ⚠️ 需手动设置 |

---

## 🔍 部署状态检查

### GitHub 推送状态
- ✅ 最新提交: `32940a4` - fix: 修复 useSession 在静态生成时的 undefined 错误
- ✅ 推送时间: Sun 2026-04-05 05:50 GMT+8
- ✅ 分支: main

### Vercel 自动部署
- 🔄 状态: 等待部署完成
- ⏱️ 预计时间: 2-5 分钟

---

## ⚠️ 需要手动完成的步骤

### 1. 设置环境变量 (关键！)

登录 [Vercel Dashboard](https://vercel.com/dashboard) → 选择 `jobsbor` 项目 → **Settings** → **Environment Variables**

添加以下变量：

```
DATABASE_URL=postgresql://neondb_owner:npg_iQb3es5xorXN@ep-mute-thunder-an1obgba-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=058a8b86d0d6a8e231e6011a7e4fe2361797a671956c1f3e51eeaae6c92a1f1f

NEXTAUTH_SECRET=058a8b86d0d6a8e231e6011a7e4fe2361797a671956c1f3e51eeaae6c92a1f1f

NEXTAUTH_URL=https://jobsbor.vercel.app

NEXT_PUBLIC_SITE_URL=https://jobsbor.vercel.app
```

### 2. 重新部署

设置环境变量后，在 Vercel Dashboard → **Deployments** → 点击最新部署 → **Redeploy**

---

## ✅ 本地构建验证

```bash
✓ 编译成功 (Compiled successfully)
✓ 类型检查通过 (Linting and checking validity of types)
✓ 静态页面生成完成 (1045 pages)
```

---

## 🌐 部署后验证清单

部署完成后，请检查以下功能：

- [ ] 首页正常加载: https://jobsbor.vercel.app
- [ ] 职位列表页: https://jobsbor.vercel.app/jobs
- [ ] 登录页面: https://jobsbor.vercel.app/auth/login
- [ ] 注册页面: https://jobsbor.vercel.app/auth/register
- [ ] 职位详情页 (示例): https://jobsbor.vercel.app/jobs/web3-product-manager

---

## 🆘 常见问题

### 如果部署失败

1. **检查构建日志**: Vercel Dashboard → Deployments → 点击失败的部署 → Build Logs
2. **常见错误**:
   - `DATABASE_URL` 未设置 → 添加数据库连接字符串
   - `JWT_SECRET` 未设置 → 添加上面生成的密钥
   - 构建超时 → 检查是否有无限循环或大数据处理

### 如果页面报错

1. **500错误**: 检查 API 路由是否正常
2. **404错误**: 检查页面文件是否存在
3. **登录失败**: 检查 `NEXTAUTH_SECRET` 和 `NEXTAUTH_URL` 是否正确

---

## 📞 需要帮助？

如果部署遇到问题，请提供：
1. Vercel 构建日志截图
2. 浏览器报错信息
3. 访问的页面URL
