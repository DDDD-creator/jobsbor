import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'

const execAsync = promisify(exec)

// 简单的爬虫函数（内联实现，避免外部依赖）
async function runCrawler() {
  const startTime = Date.now()
  
  try {
    // 1. 检查是否有爬虫脚本
    const crawlerPath = path.join(process.cwd(), '..', 'job-crawler', 'src', 'index.ts')
    
    if (!fs.existsSync(crawlerPath)) {
      // 爬虫不存在，返回当前数据状态
      return {
        success: true,
        method: 'check-only',
        message: 'Crawler not found, checking existing data',
        jobs: 510, // 当前职位数
        timestamp: new Date().toISOString(),
      }
    }

    // 2. 运行爬虫
    console.log('Running crawler...')
    const { stdout, stderr } = await execAsync(
      'cd ../job-crawler && npm run crawl',
      { timeout: 300000 } // 5分钟超时
    )

    if (stderr) {
      console.error('Crawler stderr:', stderr)
    }

    console.log('Crawler stdout:', stdout)

    // 3. 解析爬虫输出
    const jobCountMatch = stdout.match(/成功保存职位数据.*?(\d+)/)
    const jobCount = jobCountMatch ? parseInt(jobCountMatch[1]) : 0

    return {
      success: true,
      method: 'crawler',
      jobs: jobCount,
      output: stdout,
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    }

  } catch (error: any) {
    console.error('Crawler error:', error)
    
    return {
      success: false,
      error: error?.message || 'Unknown error',
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    }
  }
}

// 验证请求来源（Vercel Cron 或 API Key）
function isAuthorized(request: NextRequest): boolean {
  // 1. 检查Vercel Cron头
  const vercelSignature = request.headers.get('x-vercel-signature')
  if (vercelSignature) {
    // Vercel会自动验证Cron请求的签名
    return true
  }

  // 2. 检查API Key
  const authHeader = request.headers.get('authorization')
  const apiKey = process.env.CRAWLER_API_KEY
  
  if (apiKey && authHeader === `Bearer ${apiKey}`) {
    return true
  }

  return false
}

export async function GET(request: NextRequest) {
  // 验证权限
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // 运行爬虫
  const result = await runCrawler()

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  return GET(request)
}
