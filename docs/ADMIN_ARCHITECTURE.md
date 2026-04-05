# Jobsbor 管理后台架构设计

## 1. 技术栈

- **框架**: Next.js App Router
- **认证**: JWT + 密码哈希 (bcrypt)
- **数据库**: Prisma + PostgreSQL (生产) / SQLite (开发)
- **UI**: Tailwind CSS + shadcn/ui
- **状态管理**: React Hooks + Context

## 2. 功能模块

### 2.1 认证模块
- [ ] 登录页 (/admin/login)
- [ ] JWT Token管理
- [ ] 权限中间件
- [ ] 登出功能

### 2.2 仪表盘 (/admin)
- [ ] 数据统计卡片
  - 总职位数
  - 总公司数
  - 今日新增职位
  - 待审核职位
- [ ] 最近活动列表
- [ ] 快速操作入口

### 2.3 职位管理 (/admin/jobs)
- [ ] 职位列表 (表格 + 筛选)
- [ ] 新增职位
- [ ] 编辑职位
- [ ] 删除职位
- [ ] 批量操作
- [ ] 搜索功能

### 2.4 公司管理 (/admin/companies)
- [ ] 公司列表
- [ ] 新增公司
- [ ] 编辑公司
- [ ] 删除公司
- [ ] Logo上传

### 2.5 用户管理 (/admin/users)
- [ ] 用户列表
- [ ] 添加管理员
- [ ] 修改密码

### 2.6 设置 (/admin/settings)
- [ ] 网站基本信息
- [ ] SEO设置
- [ ] 联系信息

## 3. 数据库模型

### User
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String   // 哈希存储
  role      Role     @default(ADMIN)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  EDITOR
}
```

### Job (扩展现有)
```prisma
model Job {
  // ... 现有字段
  status    JobStatus @default(ACTIVE)
  views     Int       @default(0)
  clicks    Int       @default(0)
}

enum JobStatus {
  ACTIVE
  INACTIVE
  PENDING
  EXPIRED
}
```

## 4. API路由

- `/api/admin/auth/login` - 登录
- `/api/admin/auth/logout` - 登出
- `/api/admin/jobs` - 职位CRUD
- `/api/admin/companies` - 公司CRUD
- `/api/admin/users` - 用户管理
- `/api/admin/stats` - 统计数据

## 5. 文件结构

```
src/
  app/
    admin/
      layout.tsx          # 后台布局
      page.tsx            # 仪表盘
      login/
        page.tsx          # 登录页
      jobs/
        page.tsx          # 职位列表
        [id]/
          page.tsx        # 编辑职位
        new/
          page.tsx        # 新增职位
      companies/
        page.tsx          # 公司列表
        [id]/
          page.tsx        # 编辑公司
        new/
          page.tsx        # 新增公司
      users/
        page.tsx          # 用户管理
      settings/
        page.tsx          # 设置
  components/
    admin/
      Sidebar.tsx         # 侧边栏
      Header.tsx          # 顶部导航
      DataTable.tsx       # 数据表格
      JobForm.tsx         # 职位表单
      CompanyForm.tsx     # 公司表单
      StatCard.tsx        # 统计卡片
  lib/
    auth.ts               # 认证工具
    prisma.ts             # 数据库
  middleware.ts           # 权限验证
```

## 6. 开发计划

### Phase 1: 基础架构
1. 安装依赖 (Prisma, bcrypt, jsonwebtoken)
2. 配置数据库
3. 创建认证系统
4. 创建基础布局

### Phase 2: 核心功能
1. 职位管理CRUD
2. 公司管理CRUD
3. 仪表盘统计

### Phase 3: 增强功能
1. 用户管理
2. 设置页面
3. 图片上传
4. 数据导出

## 7. 安全配置

- JWT Secret 环境变量
- 密码最小8位 + 复杂度要求
- API路由权限验证
- CSRF保护
- 速率限制

## 8. 部署检查清单

- [ ] 数据库迁移
- [ ] 创建初始管理员账号
- [ ] 环境变量配置
- [ ] 生产环境JWT Secret
- [ ] HTTPS强制
- [ ] 备份策略
