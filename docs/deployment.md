# Jobsbor 部署指南

> 🎯 **目标**：把 Jobsbor 招聘网站从本地开发环境部署到腾讯云服务器，让全世界都能访问

---

## 📋 目录

1. [架构说明](#架构说明)
2. [服务器环境准备](#服务器环境准备)
3. [域名解析配置](#域名解析配置)
4. [SSL证书（HTTPS）](#ssl证书https)
5. [Nginx配置](#nginx配置)
6. [PM2配置](#pm2配置)
7. [数据库配置](#数据库配置)
8. [自动化部署脚本](#自动化部署脚本)
9. [完整操作步骤](#完整操作步骤)

---

## 架构说明

### 什么是静态导出 vs SSR？

简单来说：

| 方案 | 静态导出 (Static Export) | SSR (服务器端渲染) |
|------|------------------------|-------------------|
| **原理** | 提前生成所有HTML文件 | 每次请求动态生成页面 |
| **速度** | ⚡ 极快（直接读文件） | 🔄 需要计算 |
| **成本** | 💰 低（CDN便宜） | 💰 高（需要服务器算力） |
| **SEO** | ✅ 完美 | ✅ 完美 |
| **更新频率** | 需要重新部署 | 实时更新 |

### 推荐方案：静态导出

Jobsbor 使用 **静态导出 + 定时重建** 的架构：

```
用户请求 → CDN/腾讯云 → Nginx → 静态HTML文件
                ↓
         （如果配置了CDN缓存）
```

**为什么选静态导出？**
1. 招聘网站内容更新不频繁（一天几次）
2. 静态文件访问速度极快
3. 服务器成本低，一台低配服务器就能扛住大量访问
4. 部署简单，不容易出错

---

## 服务器环境准备

### 第一步：购买腾讯云服务器

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 购买云服务器 CVM
   - **地域**：选择离你用户最近的地方（国内选上海/广州/北京）
   - **配置**：2核4G起步（约￥200/月）
   - **系统**：Ubuntu 22.04 LTS（推荐）
   - **带宽**：3Mbps起步
3. 记下服务器的 **公网IP地址**

### 第二步：连接服务器

在本地终端执行：

```bash
# 用SSH连接服务器（把1.2.3.4换成你的真实IP）
ssh ubuntu@1.2.3.4

# 第一次连接会提示确认，输入 yes 回车
```

### 第三步：安装基础软件

连接上服务器后，依次执行：

```bash
# 1. 更新系统软件包
sudo apt update && sudo apt upgrade -y

# 2. 安装Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v  # 应该显示 v18.x.x
npm -v   # 应该显示 9.x.x

# 3. 安装PM2（进程管理器）
sudo npm install -g pm2

# 验证安装
pm2 -v

# 4. 安装Nginx（Web服务器）
sudo apt install -y nginx

# 验证安装
nginx -v

# 5. 安装PostgreSQL（数据库）
sudo apt install -y postgresql postgresql-contrib

# 验证安装
psql --version

# 6. 安装Certbot（SSL证书工具）
sudo apt install -y certbot python3-certbot-nginx

# 验证安装
certbot --version
```

### 第四步：配置防火墙

```bash
# 允许HTTP和HTTPS访问
sudo ufw allow 'Nginx Full'

# 允许SSH（如果还没允许）
sudo ufw allow OpenSSH

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

---

## 域名解析配置

### 第一步：购买域名

1. 在腾讯云 [域名注册](https://buy.cloud.tencent.com/domain) 购买域名
   - 推荐：jobsbor.com 或 jobsbor.cn
   - 需要实名认证

### 第二步：添加DNS解析

1. 进入 [腾讯云DNS解析控制台](https://console.cloud.tencent.com/cns)
2. 找到你的域名，点击【解析】
3. 添加两条A记录：

| 主机记录 | 记录类型 | 记录值（你的服务器IP） |
|---------|---------|---------------------|
| @       | A       | 1.2.3.4             |
| www     | A       | 1.2.3.4             |

> 💡 把 `1.2.3.4` 换成你的真实服务器IP

4. 等待5-10分钟让DNS生效

### 可选：配置CDN加速

如果用户分布在全国各地，可以开启腾讯云CDN：

1. 进入 [CDN控制台](https://console.cloud.tencent.com/cdn)
2. 点击【添加域名】
3. 域名配置：
   - 加速域名：jobsbor.com
   - 源站类型：自有源站
   - 源站地址：你的服务器IP
4. 等待CDN部署完成（约15分钟）

---

## SSL证书（HTTPS）

> 🔒 HTTPS 是必须的！现在浏览器会标记HTTP网站为"不安全"

### 使用Let's Encrypt免费证书

```bash
# 申请证书（把域名换成你的真实域名）
sudo certbot --nginx -d jobsbor.com -d www.jobsbor.com

# 按提示操作：
# 1. 输入邮箱（用于证书到期提醒）
# 2. 同意协议
# 3. 选择是否订阅邮件（可选）
```

### 自动续期配置

Let's Encrypt证书有效期只有90天，但Certbot会自动续期：

```bash
# 测试自动续期是否正常
sudo certbot renew --dry-run

# 查看续期定时任务
sudo systemctl status certbot.timer
```

如果显示 `active (waiting)` 就表示配置成功了！

---

## Nginx配置

### 配置文件位置

```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/jobsbor.conf
```

### 完整配置内容

把下面的内容复制进去（把 `jobsbor.com` 换成你的真实域名）：

```nginx
# HTTP服务器 - 重定向到HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name jobsbor.com www.jobsbor.com;
    
    # 所有HTTP请求重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS服务器 - 主配置
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name jobsbor.com www.jobsbor.com;

    # SSL证书配置（Certbot会自动管理）
    ssl_certificate /etc/letsencrypt/live/jobsbor.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jobsbor.com/privkey.pem;
    
    # SSL优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # 日志配置
    access_log /var/log/nginx/jobsbor.access.log;
    error_log /var/log/nginx/jobsbor.error.log;

    # Gzip压缩 - 让网页加载更快
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # 安全响应头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # 静态文件服务 - 这是关键！
    root /var/www/jobsbor/dist;
    index index.html;

    # 静态文件缓存 - 图片/CSS/JS缓存1年
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Next.js静态导出路由处理
    # 尝试匹配文件 -> 匹配.html文件 -> 匹配目录 -> 404
    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # 404页面
    error_page 404 /404.html;
    
    # 50x错误页面
    error_page 500 502 503 504 /50x.html;
}
```

保存并退出（按 `Ctrl+X`，然后按 `Y`，再按 `Enter`）

### 启用配置

```bash
# 创建软链接启用配置
sudo ln -s /etc/nginx/sites-available/jobsbor.conf /etc/nginx/sites-enabled/

# 检查Nginx配置是否正确
sudo nginx -t

# 如果显示 "syntax is ok" 和 "test is successful"，则重启Nginx
sudo systemctl restart nginx
```

---

## PM2配置

PM2是Node.js的进程管理器，可以：
- 保持应用一直运行（崩溃自动重启）
- 管理日志文件
- 监控资源使用

### 配置文件

在项目根目录创建 `pm2.config.js`：

```javascript
module.exports = {
  apps: [{
    // 应用名称
    name: 'jobsbor',
    
    // 启动命令
    script: 'npm',
    args: 'start',
    
    // 工作目录
    cwd: '/var/www/jobsbor',
    
    // 实例数（静态导出不需要多实例，SSR可以开多个）
    instances: 1,
    
    // 自动重启
    autorestart: true,
    
    // 不监视文件变化（生产环境）
    watch: false,
    
    // 内存超过1G自动重启
    max_memory_restart: '1G',
    
    // 环境变量
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    
    // 日志配置
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    
    // 合并日志
    merge_logs: true,
    
    // 日志切割
    log_type: 'json',
    
    // 启动超时时间
    min_uptime: '10s',
    
    // 异常退出后重启延迟
    restart_delay: 3000
  }]
}
```

### PM2常用命令

```bash
# 启动应用
pm2 start pm2.config.js

# 查看状态
pm2 status
pm2 logs

# 重启
pm2 restart jobsbor

# 重载（零停机重启）
pm2 reload jobsbor

# 停止
pm2 stop jobsbor

# 删除
pm2 delete jobsbor

# 保存PM2配置（服务器重启后自动启动）
pm2 save
pm2 startup
```

---

## 数据库配置

### 方案一：本地PostgreSQL（开发/测试用）

```bash
# 1. 切换到postgres用户
sudo -u postgres psql

# 2. 在psql命令行里执行：
# 创建数据库
CREATE DATABASE jobsbor;

# 创建用户（把密码换成你自己的）
CREATE USER jobsbor_user WITH ENCRYPTED PASSWORD '你的安全密码';

# 授权
GRANT ALL PRIVILEGES ON DATABASE jobsbor TO jobsbor_user;

# 退出
\q
```

### 方案二：腾讯云云数据库PostgreSQL（推荐生产用）

1. 进入 [云数据库控制台](https://console.cloud.tencent.com/postgres)
2. 点击【新建】创建PostgreSQL实例
   - 规格：1核2G起步
   - 存储：50GB起步
3. 创建完成后，在【实例列表】找到内网地址
4. 在安全组中允许你的服务器访问5432端口
5. 在数据库中创建 `jobsbor` 数据库和用户

### 环境变量配置

在服务器上创建 `.env.production`：

```bash
cd /var/www/jobsbor
sudo nano .env.production
```

填入以下内容：

```
# ============================================
# 数据库配置 - 【用户需要修改这里】
# ============================================

# 本地数据库
DATABASE_URL="postgresql://jobsbor_user:你的密码@localhost:5432/jobsbor"

# 或者腾讯云云数据库
# DATABASE_URL="postgresql://jobsbor_user:你的密码@10.x.x.x:5432/jobsbor"

# ============================================
# 应用配置 - 【用户需要修改这里】
# ============================================

NEXT_PUBLIC_SITE_URL=https://jobsbor.com
NEXT_PUBLIC_SITE_NAME=Jobsbor

# ============================================
# 可选：分析工具
# ============================================
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

保存并退出。

---

## 自动化部署脚本

### 部署脚本：scripts/deploy.sh

```bash
#!/bin/bash
set -e  # 遇到错误立即退出

echo "🚀 开始部署 Jobsbor..."

# ============================================
# 配置 - 【用户需要修改这里】
# ============================================
APP_DIR="/var/www/jobsbor"
REPO_URL=""  # 填你的Git仓库地址，如 git@github.com:username/jobsbor.git
BRANCH="main"

# ============================================
# 进入应用目录
# ============================================
cd $APP_DIR

# ============================================
# 拉取最新代码（如果使用Git）
# ============================================
if [ -n "$REPO_URL" ]; then
    echo "📥 拉取最新代码..."
    git pull origin $BRANCH
fi

# ============================================
# 安装依赖
# ============================================
echo "📦 安装依赖..."
npm ci

# ============================================
# 生成Prisma客户端
# ============================================
echo "🔧 生成Prisma客户端..."
npx prisma generate

# ============================================
# 运行数据库迁移（如果需要）
# ============================================
echo "🗄️ 检查数据库迁移..."
# 仅在需要时取消注释下面这行
# npx prisma migrate deploy

# ============================================
# 构建项目
# ============================================
echo "🏗️ 构建项目..."
npm run build

# ============================================
# 如果使用SSR模式，重启PM2
# ============================================
# echo "🔄 重启PM2..."
# pm2 reload jobsbor

echo "✅ 部署完成！"
echo "📝 构建输出目录: $APP_DIR/dist"
echo "🌐 访问: https://jobsbor.com"
```

### 给脚本添加执行权限

```bash
chmod +x /var/www/jobsbor/scripts/deploy.sh
```

### 运行部署

```bash
./scripts/deploy.sh
```

---

## 完整操作步骤

### 从0到上线 - 一步一步跟着做

#### ✅ 第一步：准备腾讯云资源（10分钟）

1. **购买云服务器**
   - 登录腾讯云控制台
   - 购买CVM：2核4G，Ubuntu 22.04，3Mbps带宽
   - 记住服务器的公网IP

2. **购买域名**
   - 在腾讯云购买 jobsbor.com（或你喜欢的域名）
   - 完成实名认证

3. **添加DNS解析**
   - 进入DNS解析控制台
   - 添加A记录指向服务器IP

#### ✅ 第二步：连接并初始化服务器（15分钟）

1. **SSH连接服务器**
   ```bash
   ssh ubuntu@你的服务器IP
   ```

2. **运行初始化脚本**
   ```bash
   # 把项目里的初始化脚本复制到服务器，然后执行
   chmod +x scripts/init-server.sh
   ./scripts/init-server.sh
   ```

#### ✅ 第三步：配置Nginx（10分钟）

1. **上传Nginx配置**
   ```bash
   # 在服务器上执行
   sudo cp nginx/jobsbor.conf /etc/nginx/sites-available/
   sudo ln -s /etc/nginx/sites-available/jobsbor.conf /etc/nginx/sites-enabled/
   ```

2. **测试并重载Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

#### ✅ 第四步：申请SSL证书（5分钟）

```bash
sudo certbot --nginx -d jobsbor.com -d www.jobsbor.com
```

按提示输入邮箱，同意协议即可。

#### ✅ 第五步：部署应用代码（10分钟）

1. **上传代码到服务器**
   
   方法一：使用Git
   ```bash
   cd /var/www
   sudo git clone 你的Git仓库地址 jobsbor
   cd jobsbor
   ```
   
   方法二：本地打包上传
   ```bash
   # 在本地执行
   scp -r ./dist ubuntu@你的服务器IP:/var/www/jobsbor/
   ```

2. **配置环境变量**
   ```bash
   cd /var/www/jobsbor
   sudo nano .env.production
   # 填入数据库配置等信息
   ```

3. **运行部署脚本**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

#### ✅ 第六步：验证部署（5分钟）

1. **检查Nginx状态**
   ```bash
   sudo systemctl status nginx
   ```

2. **访问网站**
   - 打开浏览器访问 https://jobsbor.com
   - 确认能看到网站首页

3. **检查SSL证书**
   - 点击地址栏的锁图标
   - 确认证书有效

#### ✅ 第七步：设置自动部署（可选，10分钟）

如果想实现Git推送后自动部署，可以配置Webhook或GitHub Actions。

简单方案：使用GitHub Actions自动部署

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ubuntu
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/jobsbor
          git pull origin main
          ./scripts/deploy.sh
```

然后在GitHub仓库的 Settings -> Secrets 中添加：
- `HOST`: 你的服务器IP
- `SSH_KEY`: 你的SSH私钥

---

## 🎉 恭喜！部署完成

现在你应该可以通过 https://jobsbor.com 访问你的招聘网站了！

### 后续维护

| 任务 | 频率 | 命令 |
|-----|------|------|
| 查看日志 | 随时 | `sudo tail -f /var/log/nginx/jobsbor.access.log` |
| 更新代码 | 按需 | `./scripts/deploy.sh` |
| 检查证书 | 每3个月 | `sudo certbot renew --dry-run` |
| 备份数据库 | 每天 | `pg_dump jobsbor > backup.sql` |
| 系统更新 | 每月 | `sudo apt update && sudo apt upgrade -y` |

### 常见问题

**Q: 网站访问显示404？**
A: 检查 `/var/www/jobsbor/dist` 目录是否存在，以及Nginx配置中的root路径是否正确。

**Q: SSL证书申请失败？**
A: 确认域名解析已经生效（等待5-10分钟），并且服务器80端口可以被外网访问。

**Q: 数据库连接失败？**
A: 检查 `.env.production` 中的 `DATABASE_URL` 配置，确认用户名、密码、数据库名正确。

**Q: 如何更新网站内容？**
A: 修改代码后重新运行 `./scripts/deploy.sh`，静态文件会自动更新。

---

> 💡 **需要帮助？** 保留好这个文档，遇到问题可以一步步对照检查。
