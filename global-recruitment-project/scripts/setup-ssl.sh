#!/bin/bash
# ============================================
# Jobsbor SSL证书申请脚本
# ============================================
# 
# 使用说明：
# 1. 给脚本添加执行权限：chmod +x scripts/setup-ssl.sh
# 2. 确保域名已解析到服务器
# 3. 确保Nginx已安装并运行
# 4. 修改下面的域名配置
# 5. 运行脚本：./scripts/setup-ssl.sh
#
# ⚠️ 【用户需要修改这里】把域名换成你的真实域名
# ============================================

set -e  # 遇到错误立即退出

# ============================================
# 配置 - 【用户需要修改这里】
# ============================================
DOMAIN="jobsbor.com"              # 主域名
WWW_DOMAIN="www.jobsbor.com"      # www子域名
EMAIL="admin@jobsbor.com"         # 用于接收证书到期提醒的邮箱

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
# 前置检查
# ============================================

echo "🔒 Jobsbor SSL证书申请脚本"
echo "========================================"

log_info "检查环境..."

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then
    log_error "请使用 sudo 运行此脚本"
    exit 1
fi

# 检查Certbot是否安装
if ! command -v certbot &> /dev/null; then
    log_error "Certbot未安装，请先安装："
    log_error "  sudo apt install -y certbot python3-certbot-nginx"
    exit 1
fi

# 检查Nginx是否运行
if ! systemctl is-active --quiet nginx; then
    log_warning "Nginx未运行，尝试启动..."
    systemctl start nginx
fi

log_success "环境检查通过"

# ============================================
# 检查域名解析
# ============================================

log_info "检查域名解析..."
log_info "主域名: $DOMAIN"
log_info "WWW域名: $WWW_DOMAIN"

SERVER_IP=$(curl -s ifconfig.me)
log_info "服务器IP: $SERVER_IP"

log_warning "请确保以下域名已解析到服务器IP:"
echo "  - $DOMAIN -> $SERVER_IP"
echo "  - $WWW_DOMAIN -> $SERVER_IP"
echo ""

read -p "域名解析已确认？(y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "请先配置DNS解析，然后重新运行脚本"
    exit 0
fi

# ============================================
# 申请证书
# ============================================

echo ""
log_info "开始申请SSL证书..."
log_info "邮箱: $EMAIL"
log_info "域名: $DOMAIN, $WWW_DOMAIN"
echo ""

# 使用Certbot申请证书
certbot --nginx \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    -d $DOMAIN \
    -d $WWW_DOMAIN \
    --redirect

if [ $? -eq 0 ]; then
    log_success "SSL证书申请成功！"
else
    log_error "SSL证书申请失败，请检查错误信息"
    exit 1
fi

# ============================================
# 配置自动续期
# ============================================

echo ""
log_info "配置自动续期..."

# 测试自动续期
certbot renew --dry-run

if [ $? -eq 0 ]; then
    log_success "自动续期配置成功！"
else
    log_warning "自动续期测试未通过，请手动检查"
fi

# 查看续期定时任务状态
log_info "续期定时任务状态："
systemctl status certbot.timer --no-pager || true

# ============================================
# 完成
# ============================================

echo ""
echo "========================================"
log_success "SSL证书配置完成！"
echo "========================================"
echo ""
echo "📋 证书信息："
echo "   证书路径: /etc/letsencrypt/live/$DOMAIN/"
echo "   证书文件: fullchain.pem"
echo "   私钥文件: privkey.pem"
echo ""
echo "🌐 网站访问地址："
echo "   https://$DOMAIN"
echo "   https://$WWW_DOMAIN"
echo ""
echo "📝 证书管理命令："
echo "   手动续期: sudo certbot renew"
echo "   查看证书: sudo certbot certificates"
echo "   删除证书: sudo certbot delete --cert-name $DOMAIN"
echo ""
