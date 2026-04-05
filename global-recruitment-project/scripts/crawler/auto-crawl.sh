#!/bin/bash
# 全球爬虫智能体自动运行脚本
# 每小时自动抓取最新职位

echo "🕷️ 启动全球爬虫智能体..."
echo "⏰ $(date '+%Y-%m-%d %H:%M:%S')"

cd /root/.openclaw/workspace/recruitment-site

# 运行爬虫
node scripts/crawler/orchestrator.js

# 如果有新数据，构建并部署
if [ $? -eq 0 ]; then
  echo "🚀 构建并部署..."
  npm run build
  
  if [ $? -eq 0 ]; then
    echo "✅ 部署成功！$(date '+%Y-%m-%d %H:%M:%S')"
  else
    echo "❌ 构建失败"
  fi
else
  echo "❌ 爬虫失败"
fi
