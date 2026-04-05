#!/bin/bash
# Vercel CLI 一键部署脚本
# 需要预先安装: npm i -g vercel

echo "🚀 Jobsbor Vercel 一键部署"
echo "==========================="
echo ""

# 检查 vercel CLI
if ! command -v vercel >/dev/null 2>&1; then
    echo "📦 安装 Vercel CLI..."
    npm i -g vercel
fi

# 登录 Vercel
echo ""
echo "🔐 检查 Vercel 登录状态..."
vercel whoami >/dev/null 2>&1 || vercel login

# 链接项目（如果是首次）
echo ""
echo "🔗 链接到 Vercel 项目..."
if [ ! -d ".vercel" ]; then
    vercel link
fi

# 设置环境变量
echo ""
echo "⚙️  配置环境变量..."
echo "请确认以下环境变量已在 Vercel Dashboard 中设置:"
echo "  - DATABASE_URL"
echo "  - NEXTAUTH_SECRET"
echo "  - NEXTAUTH_URL"
echo "  - NEXT_PUBLIC_SITE_URL"
echo "  - JWT_SECRET"

echo ""
read -p "环境变量已配置? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "请在 Vercel Dashboard → Project Settings → Environment Variables 中配置"
    echo "访问: https://vercel.com/dashboard"
    exit 1
fi

# 部署到生产环境
echo ""
echo "🚀 开始部署到生产环境..."
vercel --prod

echo ""
echo "==========================="
echo "✅ 部署完成!"
echo ""
echo "查看部署状态:"
echo "  vercel --version"
echo ""
echo "查看日志:"
echo "  vercel logs --production"
echo ""
