# Jobsbor 正式环境部署指南

## 🎯 推荐方案：Vercel + 海外域名（一键部署）

**总成本：约 $10-15/年**
- 域名：$10-12/年
- 托管：Vercel Hobby（免费）
- 数据库：Neon（免费额度）

---

## 📋 部署前准备

### 1. 必需账号
- [ ] GitHub 账号（已有）
- [ ] Vercel 账号（免费注册）
- [ ] 域名注册商账号（Namecheap/Cloudflare）

### 2. 必需密钥
```bash
# 数据库
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="随机字符串（openssl rand -base64 32）"
NEXTAUTH_URL="https://你的域名.com"

# 站点URL
NEXT_PUBLIC_SITE_URL="https://你的域名.com"

# JWT
JWT_SECRET="随机字符串"

# Vercel部署（在Vercel Dashboard获取）
VERCEL_TOKEN=""
VERCEL_ORG_ID=""
VERCEL_PROJECT_ID=""
```

---

## 🚀 一键部署流程

### 第一步：购买海外域名（5分钟）

**推荐平台：**
| 平台 | 价格 | 特点 |
|------|------|------|
| **Namecheap** | $10-12/年 | 隐私保护免费，支持支付宝 |
| **Cloudflare** | $9-12/年 | 集成CDN，国内访问快 |
| **Porkbun** | $8-10/年 | 最便宜，界面简洁 |

**推荐域名后缀优先级：**
1. `.com` - 最正规（~$12/年）
2. `.co` - 现代感（~$10/年）
3. `.io` - 科技风（~$35/年）
4. `.pro` - 专业感（~$5/年）

**命名建议：**
- jobhub.pro
- hirefast.co
- jobnexus.com
- workmatch.co

---

### 第二步：Vercel 项目配置（10分钟）

#### 2.1 创建 Vercel 项目
1. 访问 https://vercel.com/new
2. 选择 GitHub 仓库 `DDDD-creator/jobsbor`
3. 点击 "Import"

#### 2.2 配置环境变量
在 Vercel Project Settings → Environment Variables 中添加：

```
DATABASE_URL = postgresql://...
NEXTAUTH_SECRET = [openssl rand -base64 32]
NEXTAUTH_URL = https://你的域名.com
NEXT_PUBLIC_SITE_URL = https://你的域名.com
JWT_SECRET = [openssl rand -base64 32]
```

#### 2.3 配置构建命令
```bash
npm ci
npx prisma generate
npm run build
```

---

### 第三步：连接域名（5分钟）

#### 3.1 在 Vercel 添加域名
1. 进入 Project Settings → Domains
2. 输入你的域名（如 `jobhub.pro`）
3. 点击 "Add"

#### 3.2 配置 DNS 记录
根据 Vercel 提供的记录，在域名注册商处添加：

**Type A 记录：**
```
Name: @
Value: 76.76.21.21
```

**Type CNAME 记录：**
```
Name: www
Value: cname.vercel-dns.com
```

#### 3.3 等待生效（通常 5-30 分钟）

---

## 🔧 自动化部署配置

### GitHub Secrets 设置

在 GitHub 仓库 → Settings → Secrets and variables → Actions 中添加：

```
DATABASE_URL
JWT_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_SITE_URL
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

### 获取 Vercel Token

1. 访问 https://vercel.com/account/tokens
2. 点击 "Create Token"
3. 复制 Token 保存到 GitHub Secrets

### 获取 Vercel Org/Project ID

1. 在 Vercel Dashboard 打开项目
2. 按 F12 打开开发者工具 → Console
3. 输入：`window.__ENV.VERCEL_ORG_ID` 和 `window.__ENV.VERCEL_PROJECT_ID`

---

## 🛡️ 安全加固（部署后必做）

### 1. 强制 HTTPS
在 Vercel Project Settings → Domains 中：
- ✅ 开启 "Redirect HTTP to HTTPS"

### 2. 配置 Web 应用防火墙
使用 Cloudflare（免费）：
1. 将域名 DNS 改为 Cloudflare
2. 开启 "Always Use HTTPS"
3. 开启 "Security Level: Medium"

### 3. 数据库安全
- 确认 Neon 数据库只允许 Vercel IP 访问
- 定期备份数据库

---

## 📊 部署验证清单

### 功能测试
- [ ] 首页正常访问
- [ ] 职位搜索正常
- [ ] 注册/登录功能
- [ ] 收藏职位功能
- [ ] 投递简历功能
- [ ] 后台管理访问

### 性能测试
- [ ] 首屏加载 < 3秒
- [ ] Lighthouse 评分 > 90
- [ ] 图片懒加载正常

### SEO 测试
- [ ] 标题/描述正常显示
- [ ] 结构化数据验证通过
- [ ] sitemap.xml 可访问

---

## 🆘 常见问题

### Q: 域名解析不生效？
A: 等待 24-48 小时，或检查 DNS 记录是否正确

### Q: 构建失败？
A: 检查环境变量是否全部配置，特别是 DATABASE_URL

### Q: 数据库连接失败？
A: 确认 Neon 数据库允许 Vercel IP，或添加到白名单

### Q: 网站访问慢？
A: 开启 Cloudflare CDN，或升级 Vercel Pro ($20/月)

---

## 💰 成本对比

| 方案 | 月成本 | 特点 |
|------|--------|------|
| **Vercel Hobby** | $0 | 免费，100GB带宽，适合初创 |
| Vercel Pro | $20 | 1TB带宽，分析功能 |
| Netlify | $0 | 类似 Vercel |
| Railway | $5+ | 简单部署，自动扩缩容 |

**推荐：先用 Vercel Hobby，流量大了再升级**

---

## 📝 部署后 TODO

- [ ] 设置 Google Analytics
- [ ] 配置错误监控（Sentry）
- [ ] 设置 Uptime 监控
- [ ] 配置自动备份
- [ ] 开启 Cloudflare 缓存

---

**预计部署时间：30-60 分钟**
**维护成本：接近 $0/月（初期）**
