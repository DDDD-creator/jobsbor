#!/usr/bin/env node
/**
 * 全站URL扫描器
 * 检查所有页面是否可访问
 */

const SITE_URL = 'https://jobsbor.vercel.app'

// 所有需要检查的页面
const pagesToCheck = [
  // 首页
  '/zh', '/en',
  
  // 职位相关
  '/zh/jobs', '/en/jobs',
  '/zh/jobs/quantitative-researcher',
  '/zh/jobs/web3-product-manager',
  '/zh/jobs/senior-frontend-engineer',
  '/zh/jobs/equity-research-tmt',
  '/zh/jobs/investment-banking-analyst',
  
  // 公司相关
  '/zh/companies', '/en/companies',
  '/zh/companies/huatai',
  '/zh/companies/metaverse',
  '/zh/companies/bytedance',
  
  // 静态页面
  '/zh/about', '/en/about',
  '/zh/guide', '/en/guide',
  '/zh/contact', '/en/contact',
  '/zh/privacy', '/en/privacy',
  '/zh/terms', '/en/terms',
  '/zh/guestbook', '/en/guestbook',
  
  // 博客
  '/zh/blog', '/en/blog',
  '/zh/blog/finance-job-guide-2024',
  '/zh/blog/web3-remote-jobs-guide',
  
  // 工具
  '/zh/tools', '/en/tools',
  '/zh/tools/salary-comparison',
  '/zh/tools/interview-questions',
  
  // 行业
  '/zh/industries/finance',
  '/zh/industries/web3',
  '/zh/industries/internet',
]

async function checkUrl(path) {
  try {
    const response = await fetch(`${SITE_URL}${path}`, {
      method: 'HEAD',
      redirect: 'follow',
    })
    
    return {
      path,
      status: response.status,
      ok: response.status === 200,
    }
  } catch (error) {
    return {
      path,
      status: 'ERROR',
      ok: false,
      error: error.message,
    }
  }
}

async function runScanner() {
  console.log('🔍 [URL Scanner] Starting full site scan...\n')
  
  const results = []
  let passed = 0
  let failed = 0
  
  for (const page of pagesToCheck) {
    const result = await checkUrl(page)
    results.push(result)
    
    if (result.ok) {
      passed++
      console.log(`✅ ${page}`)
    } else {
      failed++
      console.log(`❌ ${page} - ${result.status}`)
    }
    
    // 延迟避免请求过快
    await new Promise(r => setTimeout(r, 300))
  }
  
  console.log(`\n📊 [URL Scanner] Results:`)
  console.log(`   ✅ Passed: ${passed}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log(`   📈 Success Rate: ${((passed / pagesToCheck.length) * 100).toFixed(1)}%`)
  
  if (failed > 0) {
    console.log(`\n❌ [URL Scanner] Found ${failed} errors:`)
    results.filter(r => !r.ok).forEach(r => {
      console.log(`   - ${r.path}: ${r.status}`)
    })
    process.exit(1)
  } else {
    console.log(`\n✅ [URL Scanner] All pages accessible!`)
  }
}

runScanner().catch(error => {
  console.error('[URL Scanner] Error:', error)
  process.exit(1)
})
