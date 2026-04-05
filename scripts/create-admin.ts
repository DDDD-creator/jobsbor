/**
 * 创建初始管理员账号
 * 
 * 用法:
 * npx ts-node scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@jobsbor.com'
  const password = process.argv[3] || 'admin123'
  const name = process.argv[4] || '管理员'

  // 检查用户是否已存在
  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    console.log(`⚠️ 用户 ${email} 已存在`)
    process.exit(1)
  }

  // 创建管理员
  const hashedPassword = await bcrypt.hash(password, 12)
  
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  console.log('✅ 管理员账号创建成功!')
  console.log('')
  console.log('邮箱:', email)
  console.log('密码:', password)
  console.log('')
  console.log('⚠️ 请立即登录并修改密码!')
}

main()
  .catch((e) => {
    console.error('❌ 创建失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
