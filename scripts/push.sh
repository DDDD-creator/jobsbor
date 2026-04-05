#!/bin/bash

# 自动推送到GitHub脚本
# 用法: ./push.sh "提交信息"

# 获取提交信息
MESSAGE=${1:-"auto: update from $(date '+%Y-%m-%d %H:%M')"}

echo "🚀 开始推送到GitHub..."
echo "💬 提交信息: $MESSAGE"

# 添加所有更改
git add .

# 检查是否有更改要提交
if git diff --cached --quiet; then
    echo "⚠️ 没有更改需要提交"
    exit 0
fi

# 提交
git commit -m "$MESSAGE"

# 推送
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ 推送成功!"
else
    echo "❌ 推送失败"
    exit 1
fi
