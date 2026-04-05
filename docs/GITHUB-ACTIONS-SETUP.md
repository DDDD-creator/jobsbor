# GitHub 自动部署配置指南

## 🎯 目标
配置 GitHub Actions，实现每次 push 到 main 分支时自动部署到 Vercel。

---

## 📋 前置条件

1. ✅ 代码已在 GitHub 仓库
2. ✅ Vercel 项目已创建
3. ✅ 有 Vercel 账号访问权限

---

## 🔑 步骤 1：获取 Vercel Token

### 方法 A：通过 Vercel Dashboard

1. 访问 https://vercel.com/dashboard
2. 点击右上角头像 → **Settings**
3. 左侧菜单 → **Tokens**
4. 点击 **Create Token**
5. 名称：`GitHub Actions Deploy`
6. 点击 **Create**
7. **复制生成的 Token**（只显示一次！）

### 方法 B：通过 Vercel CLI（如果已登录）

```bash
vercel tokens create
# 输入名称：github-actions
# 复制生成的 token
```

---

## 📁 步骤 2：获取 Vercel Project ID 和 Org ID

### 方法 A：通过 Vercel Dashboard

1. 访问 https://vercel.com/dashboard
2. 进入 `jobsbor` 项目
3. 点击 **Settings** → **General**
4. 找到 **Project ID**，复制
5. 在 URL 中可以看到 Org ID，或点击左侧组织名称查看

### 方法 B：本地获取（如果已配置 .vercel）

```bash
cat .vercel/project.json
# 输出示例：
# {
#   "orgId": "team_xxxxxxxxxxxx",
#   "projectId": "prj_xxxxxxxxxxxx"
# }
```

---

## 🔐 步骤 3：配置 GitHub Secrets

### 打开 GitHub Secrets 页面

```
https://github.com/DDDD-creator/jobsbor/settings/secrets/actions
```

### 添加以下 Secrets

点击 **New repository secret** 按钮，逐个添加：

#### 必需 Secrets

| Secret Name | 值 | 说明 |
|-------------|-----|------|
| `VERCEL_TOKEN` | 步骤1获取的 Token | Vercel API Token |
| `VERCEL_ORG_ID` | 步骤2获取的 Org ID | Vercel 组织ID |
| `VERCEL_PROJECT_ID` | 步骤2获取的 Project ID | Vercel 项目ID |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_iQb3es5xorXN@ep-mute-thunder-an1obgba-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | 数据库连接 |
| `JWT_SECRET` | `058a8b86d0d6a8e231e6011a7e4fe2361797a671956c1f3e51eeaae6c92a1f1f` | JWT签名密钥 |
| `NEXTAUTH_SECRET` | 同 JWT_SECRET | NextAuth密钥 |
| `NEXTAUTH_URL` | `https://jobsbor.vercel.app` | 认证回调URL |
| `NEXT_PUBLIC_SITE_URL` | `https://jobsbor.vercel.app` | 网站URL |

---

## 🚀 步骤 4：测试自动部署

### 触发部署

1. 确保所有 Secrets 已添加
2. 推送任意更改到 main 分支：

```bash
git add .
git commit -m "chore: 配置 GitHub Actions 自动部署"
git push origin main
```

### 查看部署状态

1. 打开 GitHub 仓库 → **Actions** 标签
2. 查看 **Deploy to Vercel** 工作流运行状态
3. 绿色 ✅ 表示部署成功
4. 点击可以查看详细日志

---

## ✅ 验证部署

部署成功后，访问以下链接验证：

```
https://jobsbor.vercel.app
```

---

## 🐛 常见问题

### 问题1：Workflow 没有触发

**解决**：
- 检查文件路径是否正确：`.github/workflows/deploy.yml`
- 检查是否 push 到了 main 分支
- 检查 GitHub Actions 是否已启用（Settings → Actions → General）

### 问题2：部署失败 - "Error: No token found"

**解决**：
- 检查 `VERCEL_TOKEN` Secret 是否正确设置
- Token 是否已过期，需要重新生成

### 问题3：构建失败 - "Database connection error"

**解决**：
- 检查 `DATABASE_URL` Secret 是否正确
- 确认 Neon 数据库允许 Vercel IP 访问

### 问题4：认证不工作

**解决**：
- 检查 `NEXTAUTH_SECRET` 和 `NEXTAUTH_URL` 是否设置
- `NEXTAUTH_URL` 必须与生产环境域名完全一致

---

## 📊 部署状态监控

配置完成后，你可以在以下位置监控部署：

| 平台 | 链接 |
|------|------|
| GitHub Actions | https://github.com/DDDD-creator/jobsbor/actions |
| Vercel Dashboard | https://vercel.com/dashboard |
| 生产环境 | https://jobsbor.vercel.app |

---

## 🎉 完成！

配置完成后，每次你执行 `git push origin main`，代码会自动：
1. ✅ 运行构建检查
2. ✅ 部署到 Vercel 生产环境
3. ✅ 发送部署通知（如果配置了）

无需再手动登录 Vercel 部署！
