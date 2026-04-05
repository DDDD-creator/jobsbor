# Jobsbor 管理后台部署指南

## 📋 部署要求

- Node.js 18+
- PostgreSQL 14+
- Vercel 账号 (或自有服务器)

## 🚀 部署步骤

### 1. 环境变量配置

在 Vercel Dashboard 或 `.env.local` 中设置：

```env
# 数据库
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# JWT 密钥 (生产环境使用强密码)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# 可选: Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### 2. 数据库迁移

```bash
# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 运行迁移
npx prisma migrate dev --name init

# 或生产环境
npx prisma migrate deploy
```

### 3. 创建初始管理员

运行脚本创建第一个管理员账号：

```bash
# 使用 ts-node 运行脚本
npx ts-node scripts/create-admin.ts
```

或直接执行 SQL：

```sql
-- 密码: admin123 (请立即修改)
INSERT INTO users (id, email, name, password, role, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@jobsbor.com',
  '管理员',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G',
  'ADMIN',
  true,
  NOW(),
  NOW()
);
```

### 4. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 5. 访问管理后台

```
https://your-domain.com/admin

默认账号: admin@jobsbor.com
默认密码: admin123
```

**⚠️ 重要：首次登录后立即修改密码！**

## 📁 管理后台功能

| 功能 | 路径 | 说明 |
|------|------|------|
| 仪表盘 | `/admin` | 统计数据、最近职位 |
| 职位管理 | `/admin/jobs` | 列表、新增、编辑、删除 |
| 公司管理 | `/admin/companies` | 列表、新增、编辑、删除 |
| 用户管理 | `/admin/users` | 仅ADMIN可操作 |
| 系统设置 | `/admin/settings` | 网站配置 |

## 🔐 权限说明

- **ADMIN**: 超级管理员，可操作所有功能
- **EDITOR**: 编辑，可操作职位和公司，不可操作用户

## 📊 数据库表

```
users          - 用户表
companies      - 公司表
jobs           - 职位表
applications   - 申请表
settings       - 设置表
activity_logs  - 活动日志
```

## 🔧 常见问题

### Q: 无法登录？
- 检查 JWT_SECRET 是否设置
- 检查数据库连接
- 查看浏览器控制台错误

### Q: 数据库迁移失败？
- 确认 DATABASE_URL 格式正确
- 确认数据库用户有创建表权限

### Q: 如何重置管理员密码？
```bash
npx ts-node scripts/reset-password.ts admin@jobsbor.com newpassword
```

## 📞 技术支持

遇到问题请联系：support@jobsbor.com
