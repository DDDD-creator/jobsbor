#!/usr/bin/env node
/**
 * 构建监控脚本
 * 包装npm run build，监控构建失败并报告
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// 加载环境变量
const envPath = path.join(__dirname, '..', '.env.monitor')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value && !process.env[key]) {
      process.env[key] = value.trim()
    }
  })
}

async function sendReport(type, severity, message, details = {}) {
  const API_KEY = process.env.MONITOR_API_KEY
  const API_URL = process.env.MONITOR_API_URL || 'https://api.monitor.jobsbor.com/report'
  
  if (!API_KEY) {
    console.log('[Monitor] API key not configured, skipping report')
    return
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        type,
        severity,
        message,
        details,
        timestamp: new Date().toISOString(),
      }),
    })
    
    if (response.ok) {
      console.log('[Monitor] ✓ Report sent')
    } else {
      console.error('[Monitor] ✗ Failed to send report:', response.status)
    }
  } catch (error) {
    console.error('[Monitor] ✗ Error:', error.message)
  }
}

console.log('🔍 [Monitor] Starting build with monitoring...\n')

const startTime = Date.now()

try {
  // 执行构建
  execSync('next build', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  })
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\n✅ [Monitor] Build successful (${duration}s)`)
  
} catch (error) {
  const duration = ((Date.now() - startTime) / 1000).toFixed(1)
  console.error(`\n❌ [Monitor] Build failed after ${duration}s`)
  
  // 发送错误报告
  sendReport('build_fail', 'critical', `构建失败: ${error.message}`, {
    duration: `${duration}s`,
    stack: error.stack,
  })
  
  process.exit(1)
}
