# Vercel 部署配置

## 环境变量设置

在 Vercel Dashboard → Project Settings → Environment Variables 中添加以下变量：

### 必需变量

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_iQb3es5xorXN@ep-mute-thunder-an1obgba-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Production |
| `NEXTAUTH_SECRET` | `058a8b86d0d6a8e231e6011a7e4fe2361797a671956c1f3e51eeaae6c92a1f1f` | Production |
| `NEXTAUTH_URL` | `https://jobsbor.vercel.app` | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://jobsbor.vercel.app` | Production |

### 可选变量

| 变量名 | 说明 |
|--------|------|
| `RESEND_API_KEY` | 邮件服务API密钥（用于通知邮件） |
| `RESEND_FROM_EMAIL` | 发件人邮箱 |

## 自动设置（需要Vercel CLI）

```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 运行设置脚本
chmod +x scripts/setup-vercel-env.sh
./scripts/setup-vercel-env.sh

# 4. 部署
vercel --prod
```

## 手动设置步骤

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择 `jobsbor` 项目
3. 点击 **Settings** → **Environment Variables**
4. 添加上面的必需变量
5. 点击 **Save**
6. 在 **Deployments** 页面重新部署最新版本

## 部署后验证

访问以下页面测试：

- 登录页: https://jobsbor.vercel.app/auth/login
- 注册页: https://jobsbor.vercel.app/auth/register

测试步骤：
1. 注册一个新账号（选择"我是求职者"）
2. 登录
3. 检查数据库是否有新用户记录
