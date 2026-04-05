# Jobsbor Vercel 部署指南

> 🚀 最简单的部署方案，10分钟上线，无需服务器维护

---

## 📋 准备工作

你需要注册两个免费账号：

1. **[GitHub](https://github.com)** - 存放代码
2. **[Vercel](https://vercel.com)** - 托管网站（用GitHub账号登录）
3. **[Neon](https://neon.tech)** - 免费PostgreSQL数据库

---

## 🚀 部署步骤（共4步）

### 第1步：上传代码到GitHub

#### 1.1 注册GitHub并登录
打开 https://github.com → Sign up → 按提示注册

#### 1.2 创建新仓库
1. 点击右上角 `+` → `New repository`
2. 仓库名填：`jobsbor`
3. 选择 `Public`（公开）
4. 点击 `Create repository`

#### 1.3 上传代码（2种方式）

**方式A：网页上传（最简单）**
1. 在仓库页面点击 `uploading an existing file`
2. 把 `/root/.openclaw/workspace/recruitment-site` 的所有文件打包成zip
3. 拖拽上传zip文件
4. 点击 `Commit changes`

**方式B：命令行（如果会用）**
```bash
cd /root/.openclaw/workspace/recruitment-site
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/jobsbor.git
git push -u origin main
```

---

### 第2步：创建免费数据库（Neon）

#### 2.1 注册Neon
1. 打开 https://neon.tech
2. 用GitHub账号登录
3. 创建Project，名称填 `jobsbor`

#### 2.2 获取数据库连接字符串
1. 在Neon控制台，点击项目
2. 找到 `Connection String`，复制下来，格式类似：
   ```
   postgresql://用户名:密码@主机名/数据库名?sslmode=require
   ```
3. **保存好这个字符串，后面要用**

---

### 第3步：部署到Vercel

#### 3.1 导入GitHub仓库
1. 打开 https://vercel.com
2. 用GitHub登录
3. 点击 `Add New...` → `Project`
4. 找到 `jobsbor` 仓库，点击 `Import`

#### 3.2 配置项目
1. **Project Name**: `jobsbor`
2. **Framework Preset**: 选择 `Next.js`
3. **Root Directory**: 保持 `./`
4. 点击 `Environment Variables`，添加：

| 变量名 | 值 |
|--------|-----|
| `DATABASE_URL` | 粘贴Neon的连接字符串 |
| `NEXT_PUBLIC_SITE_URL` | `https://你的域名.com` |
| `NEXT_PUBLIC_SITE_NAME` | `Jobsbor` |

5. 点击 `Deploy`

#### 3.3 等待部署完成
- 等待2-3分钟
- 看到 `Congratulations!` 就是成功了
- 点击 `Visit` 查看网站

---

### 第4步：绑定你的域名

#### 4.1 在Vercel添加域名
1. 在Vercel项目页面，点击 `Settings` → `Domains`
2. 输入你的域名：`jobsbor.com`（换成你的）
3. 点击 `Add`

#### 4.2 在腾讯云配置DNS
1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入 `云解析DNS`
3. 找到你的域名，点击 `解析`
4. 添加两条记录：

| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| CNAME | @ | `cname.vercel-dns.com` |
| CNAME | www | `cname.vercel-dns.com` |

5. 等待5-10分钟生效

#### 4.3 验证
- 访问 `https://你的域名.com`
- 应该能看到Jobsbor网站
- Vercel自动配置了SSL证书（HTTPS）

---

## 📝 后续更新网站

### 更新代码
1. 修改本地代码
2. 上传到GitHub
3. Vercel自动重新部署（不用你操作）

### 添加新职位
1. 修改 `src/data/jobs.ts`
2. 提交到GitHub
3. 自动重新部署

---

## 💰 费用说明

| 服务 | 免费额度 | 超出后 |
|------|---------|--------|
| Vercel | 每月100GB流量 | $0.40/GB |
| Neon | 每月10万查询 | $0.0001/千次 |
| 域名 | 你已有的 | - |

**小网站完全免费**，每月几百访问量一分钱不用花。

---

## 🆘 常见问题

### Q: 部署失败了怎么办？
A: 在Vercel项目页面点击 `View Build Logs`，把错误发给我。

### Q: 数据库连接不上？
A: 检查 `DATABASE_URL` 环境变量是否正确，Neon的连接字符串要完整复制。

### Q: 域名绑定后访问不了？
A: DNS生效需要时间，等10分钟。检查腾讯云DNS记录是否正确。

### Q: 想换域名怎么办？
A: 在Vercel Domains里删除旧的，添加新的，然后更新腾讯云DNS。

---

## 📞 需要帮助？

任何步骤遇到问题，把错误截图或文字发给我，我帮你解决。
