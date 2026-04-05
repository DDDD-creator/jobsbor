#!/bin/bash
# ============================================
# Jobsbor 数据库初始化脚本
# ============================================
# 
# 使用说明：
# 1. 先在 .env.production 中配置好 DATABASE_URL
# 2. 给脚本添加执行权限：chmod +x scripts/setup-db.sh
# 3. 运行脚本：./scripts/setup-db.sh
#
# ⚠️ 警告：此脚本会重置数据库！生产环境慎用！
# ============================================

set -e  # 遇到错误立即退出

echo "🗄️ 开始初始化 Jobsbor 数据库..."

# ============================================
# 检查环境
# ============================================

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查 .env.production 是否存在
if [ ! -f ".env.production" ]; then
    echo "❌ 错误：找不到 .env.production 文件"
    echo "请先复制 .env.production.example 为 .env.production 并配置数据库"
    exit 1
fi

# 加载环境变量
export $(grep -v '^#' .env.production | xargs)

if [ -z "$DATABASE_URL" ]; then
    echo "❌ 错误：DATABASE_URL 未配置"
    exit 1
fi

echo "✅ 环境检查通过"

# ============================================
# 生成Prisma客户端
# ============================================
echo "🔧 生成Prisma客户端..."
npx prisma generate

# ============================================
# 运行数据库迁移
# ============================================
echo "📊 运行数据库迁移..."
npx prisma migrate deploy

# ============================================
# 填充种子数据
# ============================================
echo "🌱 填充种子数据..."
npm run db:seed

echo ""
echo "✅ 数据库初始化完成！"
echo ""
echo "📋 数据库信息："
echo "   数据库URL: $DATABASE_URL"
echo ""
echo "📝 下一步："
echo "   1. 确认数据已正确导入"
echo "   2. 运行 npm run build 构建项目"
echo "   3. 访问网站查看效果"
