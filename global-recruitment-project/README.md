# Jobsbor 招聘网站

> 专业的金融行业、Web3、互联网行业招聘平台

## 🌐 在线访问

- **网站地址**: https://jobsbor.com
- **技术栈**: Next.js 14 + TypeScript + Tailwind CSS + Prisma + PostgreSQL

## 🚀 快速开始

### 本地开发

```bash
# 1. 克隆代码
git clone https://github.com/你的用户名/jobsbor.git
cd jobsbor

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 添加数据库连接信息

# 4. 初始化数据库
npx prisma db push
npm run db:seed

# 5. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 部署到 Vercel

1. Fork 本仓库到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 添加环境变量（见 `.env.example`）
4. 点击 Deploy

详细步骤见 [docs/vercel-deployment.md](./docs/vercel-deployment.md)

## 📁 项目结构

```
jobsbor/
├── src/
│   ├── app/              # Next.js App Router 页面
│   ├── components/       # React 组件
│   │   ├── ui/          # 基础 UI 组件
│   │   ├── layout/      # 布局组件
│   │   ├── jobs/        # 职位相关组件
│   │   ├── companies/   # 公司相关组件
│   │   ├── blog/        # 博客组件
│   │   └── seo/         # SEO 组件
│   ├── data/            # 种子数据
│   ├── lib/             # 工具函数
│   ├── types/           # TypeScript 类型
│   └── app/             # API 路由和页面
├── prisma/
│   └── schema.prisma    # 数据库模型
├── docs/                # 文档
└── package.json         # 项目配置
```

## ✨ 功能特性

- 📱 响应式设计，支持移动端
- 🔍 SEO 优化（Sitemap、结构化数据、Meta 标签）
- 📝 职位搜索和筛选
- 🏢 公司展示页面
- 📰 博客系统
- 🎨 深蓝 + 橙色主题

## 📝 内容数据

- 20+ 种子职位（金融/Web3/互联网）
- 10+ 种子公司
- 5 篇 SEO 博客文章

## 🔧 技术细节

### SEO 优化
- 动态 Sitemap 生成
- JSON-LD 结构化数据（JobPosting、Organization、Article）
- Open Graph 和 Twitter Card 标签
- 面包屑导航
- 语义化 HTML

### 数据库模型
- **Company**: 公司信息
- **Job**: 职位信息
- **Post**: 博客文章

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request

---
Made with ❤️ for Jobsbor
