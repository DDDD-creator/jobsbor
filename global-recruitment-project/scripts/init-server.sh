#!/bin/bash
# ============================================
# Jobsbor 服务器初始化脚本
# ============================================
# 
# 使用说明：
# 1. 在新购买的腾讯云服务器上运行此脚本
# 2. 给脚本添加执行权限：chmod +x scripts/init-server.sh
# 3. 运行脚本：sudo ./scripts/init-server.sh
#
# ⚠️ 警告：此脚本需要root权限运行
# ============================================

set -e  # 遇到错误立即退出

# ============================================
# 颜色定义
# ============================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
# 检查root权限
# ============================================

if [ "$EUID" -ne 0 ]; then
    log_error "请使用 sudo 运行此脚本"
    exit 1
fi

echo "🚀 Jobsbor 服务器初始化脚本"
echo "========================================"
echo ""

# ============================================
# 更新系统
# ============================================

log_info "更新系统软件包..."
apt update && apt upgrade -y
log_success "系统更新完成"

# ============================================
# 安装基础工具
# ============================================

log_info "安装基础工具..."
apt install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    ufw \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

log_success "基础工具安装完成"

# ============================================
# 安装Node.js 18.x
# ============================================

log_info "安装Node.js 18.x..."

# 添加NodeSource仓库
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# 安装Node.js
apt install -y nodejs

# 验证安装
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
log_success "Node.js安装完成: $NODE_VERSION"
log_success "NPM安装完成: v$NPM_VERSION"

# ============================================
# 安装PM2
# ============================================

log_info "安装PM2..."
npm install -g pm2

PM2_VERSION=$(pm2 -v)
log_success "PM2安装完成: v$PM2_VERSION"

# ============================================
# 安装Nginx
# ============================================

log_info "安装Nginx..."
apt install -y nginx

# 启动Nginx
systemctl start nginx
systemctl enable nginx

NGINX_VERSION=$(nginx -v 2>&1 | head -1)
log_success "Nginx安装完成: $NGINX_VERSION"

# ============================================
# 安装PostgreSQL
# ============================================

log_info "安装PostgreSQL..."
apt install -y postgresql postgresql-contrib

# 启动PostgreSQL
systemctl start postgresql
systemctl enable postgresql

PSQL_VERSION=$(psql --version)
log_success "PostgreSQL安装完成: $PSQL_VERSION"

# ============================================
# 安装Certbot
# ============================================

log_info "安装Certbot..."
apt install -y certbot python3-certbot-nginx

CERTBOT_VERSION=$(certbot --version)
log_success "Certbot安装完成: $CERTBOT_VERSION"

# ============================================
# 配置防火墙
# ============================================

log_info "配置防火墙..."

# 允许SSH
ufw allow OpenSSH

# 允许HTTP和HTTPS
ufw allow 'Nginx Full'

# 启用防火墙（如果尚未启用）
if ! ufw status | grep -q "Status: active"; then
    echo "y" | ufw enable
fi

log_success "防火墙配置完成"
ufw status

# ============================================
# 创建应用目录
# ============================================

log_info "创建应用目录..."

APP_DIR="/var/www/jobsbor"
LOGS_DIR="$APP_DIR/logs"

mkdir -p $APP_DIR
mkdir -p $LOGS_DIR

# 设置目录权限
chown -R www-data:www-data /var/www
chmod -R 755 /var/www

log_success "应用目录创建完成: $APP_DIR"

# ============================================
# 创建部署用户（可选）
# ============================================

log_info "创建部署用户..."

DEPLOY_USER="deploy"

if ! id "$DEPLOY_USER" &>/dev/null; then
    useradd -m -s /bin/bash $DEPLOY_USER
    usermod -aG sudo $DEPLOY_USER
    log_success "部署用户创建完成: $DEPLOY_USER"
else
    log_warning "部署用户已存在: $DEPLOY_USER"
fi

# 将部署用户添加到www-data组
usermod -aG www-data $DEPLOY_USER

# ============================================
# 配置Git（如果使用Git部署）
# ============================================

log_info "配置Git..."

# 设置全局配置（可选，生产环境通常不需要）
# git config --global user.name "Jobsbor Deploy"
# git config --global user.email "deploy@jobsbor.com"

log_success "Git配置完成"

# ============================================
# 系统优化
# ============================================

log_info "系统优化..."

# 增加文件描述符限制
cat >> /etc/security/limits.conf << EOF
# Jobsbor应用配置
*    soft    nofile    65535
*    hard    nofile    65535
EOF

# 配置sysctl参数
cat >> /etc/sysctl.conf << EOF
# Jobsbor网络优化
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
EOF

sysctl -p

log_success "系统优化完成"

# ============================================
# 完成
# ============================================

echo ""
echo "========================================"
log_success "服务器初始化完成！"
echo "========================================"
echo ""
echo "📋 已安装的软件："
echo "   Node.js: $NODE_VERSION"
echo "   NPM: v$NPM_VERSION"
echo "   PM2: v$PM2_VERSION"
echo "   Nginx: $NGINX_VERSION"
echo "   PostgreSQL: $PSQL_VERSION"
echo "   Certbot: $CERTBOT_VERSION"
echo ""
echo "📁 应用目录："
echo "   $APP_DIR"
echo ""
echo "👤 部署用户："
echo "   用户名: $DEPLOY_USER"
echo "   家目录: /home/$DEPLOY_USER"
echo ""
echo "📝 下一步："
echo "   1. 配置域名解析到服务器IP"
echo "   2. 上传项目代码到 $APP_DIR"
echo "   3. 运行 ./scripts/setup-db.sh 初始化数据库"
echo "   4. 运行 ./scripts/setup-ssl.sh 申请SSL证书"
echo "   5. 运行 ./scripts/deploy.sh 部署应用"
echo ""
log_success "祝部署顺利！🚀"
