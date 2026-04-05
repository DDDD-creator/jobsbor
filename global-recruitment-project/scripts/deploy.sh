#!/bin/bash
# ============================================
# Jobsbor 自动化部署脚本
# ============================================
# 
# 使用说明：
# 1. 给脚本添加执行权限：chmod +x scripts/deploy.sh
# 2. 修改下面的配置项
# 3. 运行脚本：./scripts/deploy.sh
#
# ⚠️ 【用户需要修改这里】根据实际情况修改配置
# ============================================

set -e  # 遇到错误立即退出

echo "🚀 开始部署 Jobsbor..."

# ============================================
# 配置 - 【用户需要修改这里】
# ============================================
APP_DIR="/var/www/jobsbor"
REPO_URL=""  # 填你的Git仓库地址，如：git@github.com:username/jobsbor.git
BRANCH="main"

# 是否使用Git拉取代码（true/false）
USE_GIT=false

# 是否使用SSR模式（true/false，静态导出请设为false）
USE_SSR=false

# ============================================
# 颜色定义（用于美化输出）
# ============================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# 函数定义
# ============================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ============================================
# 前置检查
# ============================================

log_info "检查环境..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    log_error "请在项目根目录运行此脚本"
    exit 1
fi

# 检查Node.js版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js版本过低，需要18.x或更高版本"
    exit 1
fi

log_success "环境检查通过"

# ============================================
# 进入应用目录
# ============================================

log_info "进入应用目录: $APP_DIR"
cd $APP_DIR

# ============================================
# 拉取最新代码（如果使用Git）
# ============================================

if [ "$USE_GIT" = true ] && [ -n "$REPO_URL" ]; then
    log_info "拉取最新代码..."
    
    # 如果是首次部署，需要克隆仓库
    if [ ! -d ".git" ]; then
        log_info "首次部署，克隆仓库..."
        git clone $REPO_URL .
    else
        # 重置本地更改并拉取最新代码
        git reset --hard HEAD
        git clean -fd
        git pull origin $BRANCH
    fi
    
    log_success "代码更新完成"
else
    log_warning "跳过Git拉取（USE_GIT=$USE_GIT 或 REPO_URL未设置）"
fi

# ============================================
# 安装依赖
# ============================================

log_info "安装依赖..."
npm ci
log_success "依赖安装完成"

# ============================================
# 生成Prisma客户端
# ============================================

log_info "生成Prisma客户端..."
npx prisma generate
log_success "Prisma客户端生成完成"

# ============================================
# 运行数据库迁移（如果需要）
# ============================================

# 仅在配置了数据库且需要迁移时取消注释下面这行
# log_info "运行数据库迁移..."
# npx prisma migrate deploy
# log_success "数据库迁移完成"

# ============================================
# 构建项目
# ============================================

log_info "构建项目..."
rm -rf dist  # 清理旧构建
npm run build
log_success "项目构建完成"

# ============================================
# 如果使用SSR模式，重启PM2
# ============================================

if [ "$USE_SSR" = true ]; then
    log_info "重启PM2..."
    pm2 reload jobsbor || pm2 start pm2.config.js
    pm2 save
    log_success "PM2重启完成"
else
    log_info "静态导出模式，跳过PM2"
fi

# ============================================
# 设置文件权限
# ============================================

log_info "设置文件权限..."
chmod -R 755 dist/
log_success "权限设置完成"

# ============================================
# 部署完成
# ============================================

echo ""
echo "=========================================="
echo -e "${GREEN}✅ 部署完成！${NC}"
echo "=========================================="
echo ""
echo "📋 部署信息："
echo "   应用目录: $APP_DIR"
echo "   构建输出: $APP_DIR/dist"
echo "   部署时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

if [ "$USE_SSR" = false ]; then
    echo "🌐 网站访问地址："
    echo "   https://jobsbor.com  （请替换为你的真实域名）"
    echo ""
    echo "📝 下一步："
    echo "   1. 确认 dist 目录已正确部署到服务器"
    echo "   2. 检查Nginx配置指向正确的目录"
    echo "   3. 访问网站验证部署结果"
fi

echo ""
log_success "Good luck! 🚀"
