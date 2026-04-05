# 子智能体任务分配

## 智能体角色与分工

### 1. 架构师 (Architect)
**Agent ID**: kimi-coding/k2p5
**任务**: 项目脚手架搭建、技术选型落地、目录结构设计
**输入**: PROJECT.md
**输出**: 
- 完整的 Next.js 项目结构
- 配置文件（tsconfig, tailwind, next.config.js）
- Prisma Schema 和初始化脚本
- 基础类型定义

### 2. 前端开发 (Frontend Dev)
**Agent ID**: kimi-coding/k2p5
**任务**: 实现所有页面UI和交互
**输入**: 架构师的基础项目
**输出**:
- 首页（Hero、搜索、行业入口、职位列表）
- 职位列表页（筛选、分页）
- 职位详情页
- 公司列表页
- 公司详情页
- 博客相关页面
- 响应式设计

### 3. 后端开发 (Backend Dev)
**Agent ID**: kimi-coding/k2p5
**任务**: API路由、数据库查询、服务端逻辑
**输入**: 架构师的基础项目
**输出**:
- API路由（/api/jobs, /api/companies, /api/posts）
- 数据库查询函数
- 搜索功能实现
- 服务端渲染逻辑

### 4. SEO专员 (SEO Specialist)
**Agent ID**: kimi-coding/k2p5
**任务**: 全面的SEO优化实施
**输入**: 前后端基础代码
**输出**:
- Meta标签组件（动态生成title/description）
- sitemap.xml 动态生成
- robots.txt
- JSON-LD结构化数据组件
- Open Graph 标签
- 语义化HTML审查
- SEO优化检查清单

### 5. 内容专员 (Content Specialist)
**Agent ID**: kimi-coding/k2p5
**任务**: 种子数据和SEO内容
**输入**: 关键词研究结果
**输出**:
- 种子数据（20+职位、10+公司）
- 5篇SEO博客文章
- 关键词布局文档
- 内容发布指南

### 6. DevOps专员 (DevOps)
**Agent ID**: kimi-coding/k2p5
**任务**: 部署配置和文档
**输入**: 完整项目代码
**输出**:
- Vercel部署配置
- 环境变量模板
- 数据库连接配置（Neon/Supabase）
- 详细的部署指南（小白友好）

## 协作流程

```
阶段1: 架构师搭建基础 → 产出base-project
          ↓
阶段2: 前端 + 后端 并行开发（基于base-project）
          ↓
阶段3: SEO专员审查和优化（集成到前后端代码）
          ↓
阶段4: 内容专员填充数据
          ↓
阶段5: DevOps专员部署配置
          ↓
整合交付
```

## 启动顺序

1. **首先启动**：架构师（产出基础项目）
2. **并行启动**：前端开发、后端开发（基于架构师产出）
3. **随后启动**：SEO专员（审查和优化）
4. **然后启动**：内容专员（数据填充）
5. **最后启动**：DevOps专员（部署配置）

## 依赖关系

- 前端/后端 依赖 架构师的基础项目
- SEO专员 依赖 前后端页面基本完成
- 内容专员 依赖 数据库Schema确定
- DevOps 依赖 所有代码完成

## 项目目录结构（目标）

```
recruitment-site/
├── PROJECT.md              # 项目规划
├── TASKS.md               # 本文件
├── README.md              # 项目说明
├── docs/                  # 文档
│   ├── deployment.md      # 部署指南
│   ├── seo-guide.md       # SEO优化指南
│   └── content-guide.md   # 内容发布指南
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (home)/        # 首页路由组
│   │   ├── jobs/          # 职位相关页面
│   │   ├── companies/     # 公司相关页面
│   │   ├── blog/          # 博客页面
│   │   ├── api/           # API路由
│   │   ├── layout.tsx     # 根布局
│   │   └── globals.css    # 全局样式
│   ├── components/        # 组件
│   │   ├── ui/            # 基础UI组件
│   │   ├── jobs/          # 职位相关组件
│   │   ├── companies/     # 公司相关组件
│   │   ├── seo/           # SEO组件
│   │   └── layout/        # 布局组件
│   ├── lib/               # 工具函数
│   │   ├── db.ts          # 数据库连接
│   │   ├── utils.ts       # 通用工具
│   │   └── seo.ts         # SEO工具函数
│   ├── types/             # TypeScript类型
│   └── data/              # 种子数据
├── prisma/
│   └── schema.prisma      # 数据库Schema
├── public/                # 静态资源
│   ├── images/            # 图片
│   └── logo.svg           # Logo
├── scripts/               # 脚本
│   └── seed.ts            # 数据填充脚本
├── tailwind.config.ts     # Tailwind配置
├── next.config.js         # Next.js配置
└── package.json
```
