# Jobsbor 产品重构方案 V2.0

## 🔴 当前核心问题诊断

### 1. 数据层混乱
- 4种不同来源的数据混在一起（mock/real/crawled/seed）
- 没有统一的数据标准和质量管控
- 行业分类不一致（realJobs用remote判断，其他用industry字段）
- 职位重复、过期、无效链接多

### 2. 用户体系缺失
- 有auth.ts但没有完整的用户系统
- 没有区分求职者、HR、管理员角色
- 没有用户中心、简历管理

### 3. 核心功能空白
- ❌ 无法投递简历
- ❌ HR无法发布职位
- ❌ 没有申请追踪状态机
- ❌ 没有消息通知系统

### 4. 商业模式模糊
- 只是静态展示，没有交易闭环
- 没有付费点设计
- 没有用户价值沉淀

---

## 🎯 重构目标

### 第一阶段：MVP闭环（2周）
**目标：让基础交易流程跑通**
- 用户注册/登录（求职者 + HR双角色）
- HR发布职位（表单提交 + 审核）
- 求职者投递简历
- 申请状态追踪（待查看/已查看/面试中/已拒绝/已录用）

### 第二阶段：平台化（2周）
**目标：让平台活起来**
- 用户中心（简历管理、求职偏好）
- 企业中心（职位管理、简历筛选）
- 消息通知系统
- 简单的匹配推荐

### 第三阶段：增长引擎（持续）
**目标：数据驱动增长**
- 爬虫自动化（每日更新职位）
- 飞书/企微/邮件推送
- 数据分析看板
- SEO自动化

---

## 🏗️ 新架构设计

### 用户角色体系
```
User
├── JobSeeker（求职者）
│   ├── 简历管理
│   ├── 投递记录
│   ├── 收藏职位
│   └── 求职意向
│
├── Recruiter（招聘方）
│   ├── 企业信息
│   ├── 职位管理
│   ├── 简历筛选
│   └── 面试管理
│
└── Admin（管理员）
    ├── 职位审核
    ├── 用户管理
    └── 系统配置
```

### 核心业务实体
```
Job（职位）- 简化版
├── 基本信息（标题、描述、要求）
├── 薪酬范围
├── 工作地点/类型
├── 发布企业
├── 状态（草稿/审核中/已发布/已关闭）
└── 申请统计

Application（申请）
├── 求职者
├── 职位
├── 简历快照
├── 状态机（pending → viewed → interviewing → offered/rejected）
├── 备注/反馈
└── 时间线

Company（企业）
├── 基础信息
├── 认证状态
├── 发布中的职位
└── 企业主页
```

---

## 📊 数据库Schema（新）

```prisma
// 用户基础表
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  phone         String?   @unique
  password      String
  name          String
  avatar        String?
  role          UserRole  @default(JOBSEEKER) // JOBSEEKER | RECRUITER | ADMIN
  status        UserStatus @default(ACTIVE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // 关联
  jobSeekerProfile JobSeekerProfile?
  recruiterProfile RecruiterProfile?
  applications     Application[]
  jobs             Job[] // HR发布的职位
}

// 求职者档案
model JobSeekerProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  // 简历信息
  resumeUrl       String?  // 简历文件
  resumeText      String?  // 解析后的文本
  
  // 求职意向
  expectedSalary  Json?    // {min: number, max: number, currency: string}
  expectedCities  String[] // 期望城市
  jobTypes        String[] // 全职/兼职/远程
  industries      String[] // 目标行业
  
  // 工作经历/教育背景（简化存储）
  experience      Json?    // [{company, title, duration}]
  education       Json?    // [{school, degree, major}]
  
  // 状态
  isOpenToWork    Boolean  @default(true)
}

// 招聘方档案
model RecruiterProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  companyId       String
  company         Company  @relation(fields: [companyId], references: [id])
  
  position        String?  // 职位（如"技术总监"）
  isVerified      Boolean  @default(false)
}

// 企业表
model Company {
  id              String    @id @default(cuid())
  name            String
  slug            String    @unique
  logo            String?
  coverImage      String?
  description     String?
  website         String?
  size            String?   // 1-50, 51-200, 201-1000, 1000+
  industry        String
  location        String?
  
  // 认证
  verifyStatus    VerifyStatus @default(PENDING) // PENDING | VERIFIED | REJECTED
  businessLicense String?   // 营业执照
  
  // 统计
  jobCount        Int       @default(0)
  activeJobCount  Int       @default(0)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // 关联
  recruiters      RecruiterProfile[]
  jobs            Job[]
}

// 职位表
model Job {
  id              String    @id @default(cuid())
  title           String
  slug            String    @unique
  
  // 关联
  companyId       String
  company         Company   @relation(fields: [companyId], references: [id])
  postedBy        String    // 发布者userId
  poster          User      @relation(fields: [postedBy], references: [id])
  
  // 职位详情
  description     String    @db.Text
  requirements    String    @db.Text
  responsibilities String?   @db.Text
  
  // 薪酬
  salaryMin       Int?
  salaryMax       Int?
  salaryCurrency  String    @default("CNY")
  salaryNegotiable Boolean  @default(false)
  
  // 工作信息
  location        String
  remote          RemoteType @default(ONSITE) // ONSITE | REMOTE | HYBRID
  type            JobType    @default(FULLTIME) // FULLTIME | PARTTIME | CONTRACT | INTERNSHIP
  level           JobLevel   @default(MID) // JUNIOR | MID | SENIOR | LEAD | EXECUTIVE
  
  // 分类
  industry        String
  category        String    // 技术/产品/设计/运营/销售等
  tags            String[]
  skills          String[]  // 技能要求
  
  // 状态
  status          JobStatus  @default(DRAFT) // DRAFT | PENDING | ACTIVE | PAUSED | CLOSED | REJECTED
  isUrgent        Boolean    @default(false)
  isFeatured      Boolean    @default(false)
  
  // 时间
  publishedAt     DateTime?
  expiresAt       DateTime?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  
  // 统计
  viewCount       Int        @default(0)
  applyCount      Int        @default(0)
  
  // 关联
  applications    Application[]
}

// 申请表
model Application {
  id              String    @id @default(cuid())
  
  // 关联
  jobId           String
  job             Job       @relation(fields: [jobId], references: [id])
  applicantId     String
  applicant       User      @relation(fields: [applicantId], references: [id])
  
  // 简历快照（防止用户修改后影响历史申请）
  resumeSnapshot  Json      // {name, email, phone, resumeUrl, resumeText}
  
  // 申请内容
  coverLetter     String?   @db.Text
  
  // 状态机
  status          ApplicationStatus @default(PENDING)
  // PENDING → VIEWED → INTERVIEWING → OFFERED/REJECTED → HIRED
  
  // 时间线
  appliedAt       DateTime  @default(now())
  viewedAt        DateTime?
  respondedAt     DateTime?
  
  // HR反馈
  feedback        String?   @db.Text
  nextStep        String?   // 下一步安排
  
  // 是否被用户删除（软删除）
  isDeletedByUser Boolean   @default(false)
}

// 消息通知表
model Notification {
  id              String    @id @default(cuid())
  userId          String
  type            NotificationType
  title           String
  content         String
  data            Json?     // 关联数据（如jobId, applicationId）
  
  isRead          Boolean   @default(false)
  readAt          DateTime?
  
  createdAt       DateTime  @default(now())
}

// 枚举定义
enum UserRole {
  JOBSEEKER
  RECRUITER
  ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DELETED
}

enum VerifyStatus {
  PENDING
  VERIFIED
  REJECTED
}

enum JobStatus {
  DRAFT
  PENDING
  ACTIVE
  PAUSED
  CLOSED
  REJECTED
}

enum RemoteType {
  ONSITE
  REMOTE
  HYBRID
}

enum JobType {
  FULLTIME
  PARTTIME
  CONTRACT
  INTERNSHIP
}

enum JobLevel {
  JUNIOR
  MID
  SENIOR
  LEAD
  EXECUTIVE
}

enum ApplicationStatus {
  PENDING      // 已投递，待查看
  VIEWED       // HR已查看
  INTERVIEWING // 面试中
  OFFERED      // 已发offer
  REJECTED     // 已拒绝
  HIRED        // 已录用
  WITHDRAWN    // 用户撤回
}

enum NotificationType {
  APPLICATION_STATUS
  NEW_APPLICATION
  INTERVIEW_INVITE
  JOB_RECOMMENDATION
  SYSTEM
}
```

---

## 🚀 执行路线图

### Week 1: 基础架构 + 用户系统

#### Day 1-2: 数据库 + API基础
- [ ] 更新Prisma Schema
- [ ] 迁移数据库
- [ ] 创建基础API路由结构
- [ ] 认证中间件完善

#### Day 3-4: 用户系统
- [ ] 注册/登录页面
- [ ] 用户角色选择（求职者/HR）
- [ ] 求职者资料完善
- [ ] HR企业认证流程

#### Day 5-7: HR端职位管理
- [ ] HR Dashboard
- [ ] 发布职位表单
- [ ] 职位列表管理
- [ ] 职位编辑/下架

### Week 2: 求职者端 + 申请流程

#### Day 8-10: 求职者端
- [ ] 用户中心页面
- [ ] 简历上传/管理
- [ ] 求职意向设置
- [ ] 收藏职位功能

#### Day 11-12: 投递系统
- [ ] 职位详情页投递按钮
- [ ] 投递确认弹窗
- [ ] 申请表单
- [ ] 投递成功提示

#### Day 13-14: 申请追踪
- [ ] 申请列表页面
- [ ] 申请状态展示
- [ ] HR端简历筛选
- [ ] 状态更新功能

### Week 3: 打磨 + 增长

#### Day 15-17: 体验优化
- [ ] 消息通知系统
- [ ] 邮件通知
- [ ] 空状态设计
- [ ] 加载/错误状态

#### Day 18-21: 数据迁移 + 自动化
- [ ] 旧数据清洗迁移
- [ ] 爬虫自动化部署
- [ ] SEO优化
- [ ] 性能优化

---

## 📝 页面结构（新）

```
/                         # 首页（职位搜索 + 推荐）
/jobs                     # 职位列表
/jobs/[slug]              # 职位详情（带投递按钮）

/auth
  /login                  # 登录
  /register               # 注册
  /forgot-password        # 找回密码

/dashboard                # 根据角色跳转

/jobseeker                # 求职者中心
  /profile                # 个人资料
  /resume                 # 简历管理
  /applications           # 我的申请
  /favorites              # 收藏职位
  /settings               # 设置

/recruiter                # HR中心
  /dashboard              # 数据概览
  /jobs                   # 职位管理
    /new                  # 发布职位
    /[id]/edit            # 编辑职位
  /applications           # 收到的申请
  /company                # 企业信息
  /settings               # 设置

/admin                    # 管理后台
  /jobs                   # 职位审核
  /companies              # 企业审核
  /users                  # 用户管理
```

---

## 💰 商业模式（V2.1考虑）

### 免费层
- 求职者：基础投递（每月5次）、简历展示
- HR：每月1个免费职位、基础筛选

### 付费层（后续迭代）
- **求职者会员**：无限投递、简历置顶、优先展示
- **企业会员**：更多职位、置顶曝光、简历库访问
- **猎头服务**：高级人才推荐

---

## ⚡ 技术要点

### 认证方案
- NextAuth.js v5 (Auth.js)
- Credentials Provider + JWT
- Role-based access control

### 文件存储
- 简历上传：Supabase Storage / AWS S3
- 图片处理：Sharp + CDN

### 搜索/过滤
- Algolia / Meilisearch（后续）
- 目前用Prisma + 分页

### 消息推送
- 站内信：数据库 + 轮询
- 邮件：Resend / SendGrid
- 飞书：Webhook

---

## 🎯 成功指标

### 第一阶段成功标准
- [ ] 日活用户 > 50
- [ ] 每日新增职位 > 10
- [ ] 每日投递 > 20
- [ ] 注册转化率 > 5%

### 第二阶段成功标准
- [ ] 日活 > 500
- [ ] 职位覆盖 > 1000
- [ ] 申请转化率 > 10%
- [ ] HR企业认证 > 50

---

**现在开始执行第一阶段？** 我可以立即开始：
1. 更新数据库Schema
2. 搭建认证系统
3. 创建基础页面结构
