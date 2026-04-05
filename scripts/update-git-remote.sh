#!/bin/bash

# 更新GitHub Remote URL脚本
# 用于更换Personal Access Token

echo "🔧 更新GitHub Remote配置"
echo "========================="
echo ""

# 检查是否在git仓库中
if [ ! -d ".git" ]; then
    echo "❌ 错误：当前目录不是Git仓库"
    exit 1
fi

# 显示当前remote
echo "📍 当前配置："
git remote -v
echo ""

# 提示输入新Token
echo "请输入新的GitHub Personal Access Token："
echo "（从 https://github.com/settings/tokens 生成）"
read -s TOKEN

echo ""

# 验证输入
if [ -z "$TOKEN" ]; then
    echo "❌ 错误：Token不能为空"
    exit 1
fi

if [[ ! $TOKEN =~ ^ghp_[a-zA-Z0-9]{36,}$ ]]; then
    echo "⚠️ 警告：Token格式看起来不正确"
    echo "标准格式：ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    echo "是否继续？ (y/n)"
    read CONFIRM
    if [ "$CONFIRM" != "y" ]; then
        exit 1
    fi
fi

echo ""
echo "📝 更新中..."

# 删除旧remote
git remote remove origin 2>/dev/null

# 添加新remote
git remote add origin "https://${TOKEN}@github.com/DDDD-creator/jobsbor.git"

# 验证
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 更新成功！"
    echo ""
    echo "📍 新配置："
    git remote -v | sed 's/ghp_[a-zA-Z0-9]\{20,\}/ghp_*****/g'
    echo ""
    echo "🧪 测试连接..."
    git fetch origin --dry-run 2>&1 | head -5
    echo ""
    echo "💡 提示：可以运行 './scripts/push.sh \"测试提交\"' 来验证"
else
    echo ""
    echo "❌ 更新失败"
    exit 1
fi
