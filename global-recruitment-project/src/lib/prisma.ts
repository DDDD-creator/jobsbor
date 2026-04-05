import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma 客户端配置
// 对于 Serverless 环境，建议使用连接池
// DATABASE_URL 应包含连接池参数：
// ?connection_limit=5&pool_timeout=10
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
