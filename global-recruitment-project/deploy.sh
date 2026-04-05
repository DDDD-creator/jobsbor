#!/bin/bash
# Jobsbor Deployment Script
# Run this to deploy all fixes to Vercel

set -e

echo "🚀 Jobsbor Deployment Script"
echo "==========================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm i -g vercel
fi

# Navigate to web app directory
cd "$(dirname "$0")/apps/web"

echo ""
echo "📋 Files to deploy:"
find . -name "*.tsx" -o -name "*.ts" -o -name "*.css" -o -name "*.js" -o -name "*.json" | grep -v node_modules | grep -v .next | sort

echo ""
echo "🔧 Building project..."
npm run build

echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
