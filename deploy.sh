#!/bin/bash
# Jobsbor 一键部署脚本
# 使用方式: ./deploy.sh

set -e

echo "🚀 Jobsbor 正式环境部署脚本"
echo "=============================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查必要工具
echo ""
echo "📋 检查必要工具..."

if ! command_exists node; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请先安装 Node.js 20+: https://nodejs.org/"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm 未安装${NC}"
    exit 1
fi

if ! command_exists git; then
    echo -e "${RED}❌ git 未安装${NC}"
    exit 1
fi

# 检查 Node 版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 版本过低 (需要 >= 18)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 工具检查通过${NC}"

# 检查环境变量
echo ""
echo "🔐 检查环境变量..."

if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  警告: DATABASE_URL 未设置${NC}"
    echo "请在 Vercel Dashboard 中配置"
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo -e "${YELLOW}⚠️  警告: NEXTAUTH_SECRET 未设置${NC}"
    echo "生成随机密钥: openssl rand -base64 32"
fi

# 安装依赖
echo ""
echo "📦 安装依赖..."
npm ci

# 生成 Prisma Client
echo ""
echo "🔧 生成 Prisma Client..."
npx prisma generate

# 运行测试
echo ""
echo "🧪 运行测试..."
npm run lint || echo -e "${YELLOW}⚠️  Lint 检查有警告${NC}"

# 构建项目
echo ""
echo "🏗️  构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 构建成功${NC}"
else
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi

# 检查构建输出
echo ""
echo "📁 检查构建输出..."
if [ -d ".next" ]; then
    echo -e "${GREEN}✅ .next 目录存在${NC}"
else
    echo -e "${RED}❌ .next 目录不存在${NC}"
    exit 1
fi

echo ""
echo "=============================="
echo -e "${GREEN}🎉 本地构建完成！${NC}"
echo ""
echo "下一步操作:"
echo ""
echo "1. 确保代码已推送到 GitHub:"
echo "   git push origin main"
echo ""
echo "2. 在 Vercel Dashboard 中检查部署状态:"
echo "   https://vercel.com/dashboard"
echo ""
echo "3. 配置自定义域名（如需要）"
echo ""
echo "4. 访问网站验证部署:"
echo "   https://你的域名.com"
echo ""
echo "=============================="
