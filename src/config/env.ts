/**
 * 环境变量验证
 * 应用启动时检查必要的环境变量
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
]

const optionalEnvVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'BLOB_READ_WRITE_TOKEN',
  'JWT_SECRET',
]

export function validateEnv() {
  const missing: string[] = []
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ 缺少必要的环境变量:')
    for (const envVar of missing) {
      console.error(`   - ${envVar}`)
    }
    console.error('\n请在 .env.local 或 Vercel 环境中配置这些变量')
    
    // 只在运行时严格检查，构建时仅警告
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build'
    if (process.env.NODE_ENV === 'production' && !isBuildTime) {
      throw new Error(`缺少必要的环境变量: ${missing.join(', ')}`)
    }
  }
  
  // 检查可选变量
  const missingOptional = optionalEnvVars.filter(v => !process.env[v])
  if (missingOptional.length > 0) {
    console.warn('⚠️  可选环境变量未配置（某些功能可能不可用）:')
    for (const envVar of missingOptional) {
      console.warn(`   - ${envVar}`)
    }
  }
  
  if (missing.length === 0) {
    console.log('✅ 环境变量验证通过')
  }
}
