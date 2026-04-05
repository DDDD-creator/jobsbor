#!/bin/bash

# Vercel环境变量设置脚本
# 运行前请确保已登录Vercel CLI: vercel login

echo "设置Vercel环境变量..."

# 必需变量
vercel env add DATABASE_URL production <<< "postgresql://neondb_owner:npg_iQb3es5xorXN@ep-mute-thunder-an1obgba-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

vercel env add NEXTAUTH_SECRET production <<< "058a8b86d0d6a8e231e6011a7e4fe2361797a671956c1f3e51eeaae6c92a1f1f"

vercel env add NEXTAUTH_URL production <<< "https://jobsbor.vercel.app"

vercel env add NEXT_PUBLIC_SITE_URL production <<< "https://jobsbor.vercel.app"

echo "环境变量设置完成！"
echo "现在运行: vercel --prod"
