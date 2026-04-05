#!/usr/bin/env node
/**
 * 链接健康检查脚本
 * 检查网站所有链接是否正常工作
 */

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

const API_KEY = process.env.MONITOR_API_KEY
const API_URL = process.env.MONITOR_API_URL || 'https://api.monitor.jobsbor.com/report'
const SITE_URL = process.env.SITE_URL || 'https://jobsbor.vercel.app'

async function sendReport(type, severity, message, details = {}) {
  if (!API_KEY) {
    console.log('[Monitor] API key not configured')
    return
  }

  try {
    await fetch(API_URL, {
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
  } catch (error) {
    console.error('[Monitor] Failed to send report:', error.message)
  }
}

async function checkLink(url, from) {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    
    if (response.status === 404) {
      console.error(`❌ 404: ${url}`)
      await sendReport('404_error', 'high', `404错误: ${url}`, { url, from })
      return { ok: false, status: 404, url }
    }
    
    if (response.status >= 400) {
      console.error(`❌ ${response.status}: ${url}`)
      await sendReport('link_error', response.status >= 500 ? 'critical' : 'medium', 
        `链接异常: ${from} -> ${url} (${response.status})`,
        { from, to: url, status: response.status }
      )
      return { ok: false, status: response.status, url }
    }
    
    return { ok: true, status: response.status, url }
  } catch (error) {
    console.error(`❌ Error: ${url} - ${error.message}`)
    await sendReport('link_error', 'high', 
      `链接检查失败: ${url} - ${error.message}`,
      { from, to: url, error: error.message }
    )
    return { ok: false, error: error.message, url }
  }
}

async function checkSite() {
  console.log('🔍 [Monitor] Checking site health...\n')
  
  // 关键页面列表
  const pages = [
    '/zh',
    '/en',
    '/zh/jobs',
    '/zh/jobs/equity-research-tmt',
    '/zh/companies',
    '/zh/companies/huatai',
    '/zh/about',
    '/zh/guide',
    '/zh/tools',
    '/zh/privacy',
    '/zh/terms',
    '/zh/contact',
  ]
  
  const results = []
  
  for (const page of pages) {
    const url = `${SITE_URL}${page}`
    const result = await checkLink(url, 'health-check-script')
    results.push(result)
    
    if (result.ok) {
      console.log(`✅ ${page}`)
    }
    
    // 延迟避免请求过快
    await new Promise(r => setTimeout(r, 500))
  }
  
  const failed = results.filter(r => !r.ok)
  const passed = results.filter(r => r.ok)
  
  console.log(`\n📊 [Monitor] Results:`)
  console.log(`   ✅ Passed: ${passed.length}`)
  console.log(`   ❌ Failed: ${failed.length}`)
  
  if (failed.length > 0) {
    console.log(`\n❌ [Monitor] Health check failed with ${failed.length} errors`)
    process.exit(1)
  } else {
    console.log(`\n✅ [Monitor] All checks passed!`)
  }
}

checkSite().catch(error => {
  console.error('[Monitor] Health check error:', error)
  process.exit(1)
})
