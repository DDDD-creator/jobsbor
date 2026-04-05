# 招聘网站项目规划

## 项目定位
一站式招聘平台，覆盖三大垂直领域：
1. **金融行业招聘**（核心目标关键词）
2. **Web3/区块链招聘**（新兴高增长领域）
3. **互联网行业招聘**（流量基本盘）

## SEO目标关键词矩阵

### 主词（高流量，高竞争）
- 金融行业招聘
- 互联网招聘
- Web3招聘
- 区块链招聘

### 长尾词（精准流量）
- 北京金融公司招聘
- 远程Web3工作
- 产品经理招聘
- 前端开发招聘
- 智能合约工程师招聘
- 投行实习生招聘

### 地域+行业组合
- 上海金融行业招聘
- 深圳Web3招聘
- 杭州互联网招聘

## 技术架构决策

### 前端
- **Next.js 14** (App Router) - SSR/SSG利于SEO
- **Tailwind CSS** - 快速响应式设计
- **shadcn/ui** - 现成组件库

### 后端
- **Next.js API Routes** - 全栈一体化
- **Prisma + PostgreSQL** - 数据库ORM
- **NextAuth.js** - 认证系统

### 部署
- **Vercel** - 一键部署，自带CDN和HTTPS
- **自定义域名** - 用户后续自行配置

## 站点结构（URL规划）

```
/                           # 首页
/jobs                       # 职位列表页
/jobs/[industry]            # 行业分类（/jobs/finance, /jobs/web3, /jobs/internet）
/jobs/[industry]/[slug]     # 职位详情页
/companies                  # 公司列表
/companies/[slug]           # 公司详情页
/blog                       # 博客/职场资讯
/blog/[slug]                # 文章详情页
/about                      # 关于我们
/privacy                    # 隐私政策
```

## 页面清单与SEO配置

| 页面 | URL | 标题模板 | 优先级 |
|------|-----|----------|--------|
| 首页 | / | 金融招聘_互联网招聘_Web3招聘 - [品牌名] | P0 |
| 职位列表 | /jobs | 最新招聘职位 - [品牌名] | P0 |
| 金融招聘 | /jobs/finance | 金融行业招聘_投行_券商招聘 - [品牌名] | P0 |
| Web3招聘 | /jobs/web3 | Web3招聘_区块链招聘_远程工作 - [品牌名] | P0 |
| 互联网招聘 | /jobs/internet | 互联网招聘_产品经理_程序员招聘 - [品牌名] | P0 |
| 职位详情 | /jobs/[slug] | [职位名]招聘_[公司名] - [品牌名] | P0 |
| 公司列表 | /companies | 热门招聘公司 - [品牌名] | P1 |
| 公司详情 | /companies/[slug] | [公司名]招聘_最新职位 - [品牌名] | P1 |
| 博客首页 | /blog | 职场资讯_面试技巧_行业动态 - [品牌名] | P1 |
| 博客文章 | /blog/[slug] | [文章标题] - [品牌名] | P1 |

## 核心功能模块

### 1. 职位展示系统
- 职位卡片列表（缩略信息）
- 职位详情页（完整JD）
- 按行业/地域/职位类型筛选
- 搜索功能（职位名、公司、关键词）
- 分页/无限滚动

### 2. 公司展示系统
- 公司列表页
- 公司详情页（简介+在招职位）
- 公司Logo展示

### 3. SEO优化功能
- 动态生成sitemap.xml
- 动态生成robots.txt
- 每个页面自定义meta标签
- JSON-LD结构化数据（JobPosting, Organization）
- 面包屑导航
- 规范化URL（canonical）

### 4. 管理后台（基础版）
- 职位发布/编辑/删除
- 公司信息管理
- 博客文章发布

### 5. 用户体验
- 响应式设计（移动端优先）
- 职位收藏（LocalStorage）
- 分享功能
- 加载状态优化

## 设计参考

### 风格方向
- **Clean & Professional** - 参考 LinkedIn、Boss直聘、拉勾
- **配色**：深蓝（信任）+ 橙色/金色（活力/金融感）
- **字体**：Inter / Noto Sans SC

### 关键页面布局
1. **首页**：Hero搜索区 + 热门行业入口 + 最新职位 + 热门公司
2. **职位列表**：侧边筛选 + 职位卡片流 + 分页
3. **职位详情**：职位信息 + 公司信息 + 申请按钮 + 相关推荐
4. **公司详情**：公司Header + 简介 + 在招职位列表

## 数据模型（Prisma Schema草案）

```prisma
// 公司表
model Company {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  logo        String?
  description String?
  website     String?
  location    String?
  industry    String   // finance | web3 | internet
  jobs        Job[]
  createdAt   DateTime @default(now())
}

// 职位表
model Job {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  companyId   String
  company     Company  @relation(fields: [companyId], references: [id])
  description String
  requirements String
  salaryMin   Int?
  salaryMax   Int?
  salaryCurrency String @default("CNY")
  location    String
  type        String   // full-time | part-time | contract | remote
  industry    String   // finance | web3 | internet
  category    String   // engineer | product | design | marketing
  tags        String[]
  isActive    Boolean  @default(true)
  publishedAt DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 博客文章表
model Post {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String
  coverImage  String?
  published   Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 交付物清单

### 阶段一：基础架构
- [ ] 项目脚手架（Next.js + TypeScript + Tailwind）
- [ ] 数据库Schema + Prisma配置
- [ ] 基础布局组件（Header, Footer, Layout）
- [ ] 设计系统配置（颜色、字体、间距）

### 阶段二：核心页面
- [ ] 首页（含搜索、行业入口、职位列表）
- [ ] 职位列表页（含筛选）
- [ ] 职位详情页
- [ ] 公司列表页
- [ ] 公司详情页

### 阶段三：SEO优化
- [ ] 所有页面的Meta标签优化
- [ ] 动态sitemap.xml
- [ ] robots.txt
- [ ] JSON-LD结构化数据
- [ ] 面包屑导航
- [ ] 语义化HTML

### 阶段四：内容填充
- [ ] 种子数据（20+职位、10+公司）
- [ ] 5篇SEO博客文章（长尾关键词覆盖）

### 阶段五：部署
- [ ] Vercel部署配置
- [ ] 环境变量模板
- [ ] 部署指南文档

## 技术约束
- 用户是技术小白，文档要详细到每一步
- 代码要有详细注释
- 优先使用无服务器方案（降低运维成本）
- 所有配置尽量自动化

## 品牌信息
- **品牌名**: Jobsbor
- **域名**: 用户自有（腾讯云）
- **服务器**: 腾讯云（自建部署）

## 部署策略变更
原计划的Vercel托管改为**腾讯云服务器自建部署**：
- Next.js 生产构建 + PM2 进程管理
- Nginx 反向代理 + SSL
- 腾讯云 PostgreSQL 或服务器本地数据库
