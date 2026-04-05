# Jobsbor SEO优化指南

> 面向内容编辑和开发人员的SEO实践手册

---

## 目录

1. [如何添加新职位并优化](#一如何添加新职位并优化)
2. [如何写SEO友好的博客文章](#二如何写seo友好的博客文章)
3. [关键词布局建议](#三关键词布局建议)
4. [提交sitemap到搜索引擎](#四提交sitemap到搜索引擎)
5. [SEO最佳实践速查表](#五seo最佳实践速查表)

---

## 一、如何添加新职位并优化

### 1.1 职位基础信息

#### 职位标题优化

**原则**：清晰、包含关键词、吸引点击

**格式**：`[职位名称] - [公司名] | [地点]`

**示例**：
- ✅ 投资银行分析师 - 中信证券 | 北京/上海
- ✅ 高级智能合约工程师 - Uniswap Labs | 远程
- ❌ 招聘（过于简单，无关键词）
- ❌ 急招！！！（过度营销，不利于SEO）

#### 职位Slug生成

使用 `generateSlug()` 函数自动生成SEO友好的URL：

```typescript
import { generateSlug } from '@/lib/seo';

const slug = generateSlug("投资银行分析师"); 
// 输出: investment-banking-analyst
```

**Slug最佳实践**：
- 使用小写字母
- 单词之间用连字符（-）分隔
- 移除停用词（的、是、在等）
- 长度控制在50个字符以内

### 1.2 职位描述优化

#### 描述结构

职位描述应包含以下部分，每部分都有SEO价值：

```
1. 职位概述（50-100字）
   - 一句话概括职位核心
   - 包含1-2个核心关键词

2. 岗位职责（3-5点）
   - 使用项目符号列表
   - 每点包含相关关键词

3. 任职要求（3-5点）
   - 明确的技能和经验要求
   - 包含行业术语

4. 薪资福利
   - 具体薪资范围（有利于搜索匹配）
   - 列出有吸引力的福利

5. 公司介绍
   - 简短有力的公司描述
   - 包含公司优势和亮点
```

#### 关键词植入示例

**原标题**：我们需要一个分析师

**优化后**：
```
投资银行分析师 | 金融行业招聘

【职位概述】
加入中信证券投资银行部，参与IPO、并购重组等资本市场业务。
作为投资银行分析师，你将负责财务建模、尽职调查、路演材料准备等工作。

【关键词植入】
- 金融招聘：我们专注金融行业招聘5年，与头部券商保持深度合作
- 投行招聘：本岗位属于核心投行招聘项目，表现优异者可转正
- 分析师：投递时请备注"分析师"岗位
```

### 1.3 页面集成代码示例

```tsx
// src/app/jobs/[slug]/page.tsx
import { Metadata } from 'next';
import { MetaTags, JsonLd, Breadcrumb } from '@/components/seo';
import { generateJobSeoConfig } from '@/lib/seo-config';
import { generateCanonical } from '@/lib/seo';

interface Props {
  params: { slug: string };
}

// 生成动态Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);
  if (!job) return {};

  const seoConfig = generateJobSeoConfig(
    job.title,
    job.company,
    job.industry,
    job.location
  );

  return {
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    alternates: {
      canonical: generateCanonical(`/jobs/${params.slug}`),
    },
    openGraph: {
      title: seoConfig.title,
      description: seoConfig.description,
      url: generateCanonical(`/jobs/${params.slug}`),
      type: 'article',
    },
  };
}

export default async function JobPage({ params }: Props) {
  const job = await getJobBySlug(params.slug);
  if (!job) return notFound();

  // 准备JSON-LD数据
  const jobPostingData = {
    title: job.title,
    description: job.description,
    companyName: job.company,
    companyLogo: job.companyLogo,
    city: job.location.split('/')[0], // 取第一个城市
    employmentType: job.type === 'remote' ? 'REMOTE' : 'FULL_TIME',
    datePosted: job.publishedAt,
    salary: {
      currency: 'CNY',
      minValue: job.salaryMin,
      maxValue: job.salaryMax,
      unit: 'MONTH',
    },
    applyUrl: job.applyUrl,
  };

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <JsonLd type="JobPosting" data={jobPostingData} />
      
      {/* 面包屑导航 */}
      <Breadcrumb
        items={[
          { label: '职位', href: '/jobs' },
          { 
            label: job.industry === 'finance' ? '金融行业招聘' 
                 : job.industry === 'web3' ? 'Web3招聘' 
                 : '互联网招聘', 
            href: `/jobs/${job.industry}` 
          },
          { label: job.title },
        ]}
      />
      
      {/* 页面内容 */}
      <article>
        <h1>{job.title}</h1>
        {/* 其他内容 */}
      </article>
    </>
  );
}
```

### 1.4 职位标签优化

**标签作用**：
- 帮助内部分类和筛选
- 作为关键词被搜索引擎索引
- 形成相关内容聚合页面

**推荐标签组合**：

| 行业 | 推荐标签 |
|------|---------|
| 金融 | 投行招聘、券商招聘、基金招聘、量化招聘、金融校招 |
| Web3 | 智能合约工程师招聘、DeFi招聘、远程Web3工作、DAO招聘、区块链招聘 |
| 互联网 | 产品经理招聘、程序员招聘、大厂招聘、前端招聘、后端招聘 |

---

## 二、如何写SEO友好的博客文章

### 2.1 选题策略

#### 关键词研究

使用以下方法发现优质选题：

1. **搜索建议法**
   - 在百度搜索框输入"金融行业"
   - 观察下拉建议：金融行业招聘、金融行业求职、金融行业薪资待遇
   - 这些就是用户真实搜索需求

2. **长尾关键词挖掘**
   - 主词：金融招聘
   - 长尾：金融招聘应届生、金融招聘2024、金融招聘简历怎么写
   - 长尾词竞争小，更容易获得排名

3. **竞品分析**
   - 搜索目标关键词
   - 分析排名前10的文章
   - 找到内容空白或改进空间

#### 选题矩阵

| 类型 | 示例 | SEO价值 |
|------|------|---------|
| 指南类 | 2024金融行业求职完整指南 | ⭐⭐⭐⭐⭐ |
| 对比类 | 投行vs咨询：职业选择对比 | ⭐⭐⭐⭐ |
| 清单类 | 投行面试必问的50个问题 | ⭐⭐⭐⭐ |
| 案例类 | 从四大到投行：我的转型之路 | ⭐⭐⭐ |
| 观点类 | 金融行业的未来趋势分析 | ⭐⭐⭐ |

### 2.2 文章结构模板

```markdown
# 标题（包含核心关键词，60字以内）

> 摘要/导语（150字以内，概括文章核心价值）

## 目录（长文章使用，提升用户体验）

## 一、一级标题（包含关键词）

### 1.1 二级标题
内容段落，自然植入关键词

### 1.2 二级标题
- 要点1
- 要点2
- 要点3

## 二、一级标题

**重点内容加粗**

| 表格 | 说明 |
|------|------|
| 数据 | 展示 |

> 引用重要观点或数据

## 三、FAQ常见问题

**Q: 问题？**
A: 回答...

## 结语
总结全文，引导行动

---
*相关阅读：*
- [相关文章1](/blog/xxx)
- [相关文章2](/blog/xxx)
```

### 2.3 关键词布局策略

#### 关键词密度

- **核心关键词**：2-3%（每100字出现2-3次）
- **长尾关键词**：1-2%
- **同义词/相关词**：自然分布

#### 关键词位置优先级

| 位置 | 重要性 | 示例 |
|------|--------|------|
| 标题 | ⭐⭐⭐⭐⭐ | 2024金融行业求职指南 |
| 首段 | ⭐⭐⭐⭐⭐ | 金融行业招聘竞争激烈... |
| H2标题 | ⭐⭐⭐⭐ | 二、金融行业招聘现状分析 |
| 正文 | ⭐⭐⭐ | 自然分布 |
| 尾段 | ⭐⭐⭐⭐ | 总结时再次提及 |
| 图片alt | ⭐⭐⭐ | 金融行业招聘面试现场 |

#### 示例：关键词植入

**关键词**：金融行业招聘

**标题**：2024金融行业招聘趋势与求职策略

**首段**：
> 金融行业招聘市场在2024年呈现出新的特点和趋势。对于希望进入投行、券商、基金等顶级金融机构的求职者来说，了解金融行业招聘的最新动态至关重要。

**正文**：
> 金融行业招聘的周期通常分为暑期实习、秋招和春招三个阶段。暑期实习是进入头部机构的最佳途径...

**尾段**：
> 总结来说，金融行业招聘竞争激烈但机会依然众多。希望本指南能帮助你在金融行业招聘中脱颖而出...

### 2.4 内容质量要求

#### E-E-A-T原则

Google评估内容质量的核心标准：

- **Experience（经验）**：内容基于实际经验
- **Expertise（专业）**：展示专业知识和技能
- **Authoritativeness（权威）**：引用权威来源
- **Trustworthiness（可信）**：信息准确可验证

**实践建议**：
- 作者署名，标注专业背景
- 引用权威数据和来源
- 定期更新内容，添加"更新日期"
- 避免夸大或误导性表述

#### 内容长度建议

| 类型 | 建议字数 | 适用场景 |
|------|---------|---------|
| 短文章 | 800-1200字 | 快讯、简单技巧 |
| 中等文章 | 1500-2500字 | 标准指南、教程 |
| 长文章 | 3000-5000字 | 深度分析、综合指南 |

**注意**：质量优先于数量，不要为了凑字数而添加无价值内容。

### 2.5 博客文章发布清单

发布前检查：

- [ ] 标题包含核心关键词（60字以内）
- [ ] 首段包含核心关键词
- [ ] 至少2个H2标题包含关键词
- [ ] 所有图片有描述性alt文本
- [ ] 内部链接：链接到3-5篇相关文章
- [ ] 外部链接：引用2-3个权威来源
- [ ] URL slug简洁包含关键词
- [ ] Meta description填写完整
- [ ] 添加作者信息和发布日期
- [ ] 添加相关阅读推荐

---

## 三、关键词布局建议

### 3.1 核心关键词矩阵

#### 一级关键词（首页主推）

| 关键词 | 搜索量 | 竞争度 | 优先级 |
|--------|--------|--------|--------|
| 金融行业招聘 | 高 | 高 | ⭐⭐⭐⭐⭐ |
| Web3招聘 | 中高 | 中 | ⭐⭐⭐⭐⭐ |
| 互联网招聘 | 高 | 高 | ⭐⭐⭐⭐⭐ |

#### 二级关键词（分类页主推）

| 行业 | 关键词 | 落地页 |
|------|--------|--------|
| 金融 | 投行招聘、券商招聘、基金招聘、量化招聘 | /jobs/finance |
| Web3 | 区块链招聘、智能合约招聘、远程Web3工作 | /jobs/web3 |
| 互联网 | 产品经理招聘、程序员招聘、大厂招聘 | /jobs/internet |

#### 三级关键词（详情页/长尾）

| 类型 | 关键词示例 | 内容形式 |
|------|-----------|---------|
| 地域 | 北京金融招聘、上海Web3招聘 | 筛选页面 |
| 职位 | 投资银行分析师招聘、DeFi研究员招聘 | 职位详情 |
| 公司 | 中信证券招聘、字节跳动招聘 | 公司详情 |
| 场景 | 应届生金融求职、转行Web3 | 博客文章 |

### 3.2 页面关键词分配

```
首页
├── 核心词：金融行业招聘、Web3招聘、互联网招聘
├── 标题：Jobsbor | 金融行业招聘_Web3招聘_互联网招聘
└── 描述：覆盖金融、Web3、互联网三大热门领域...

职位分类页 /jobs/finance
├── 核心词：金融行业招聘、投行招聘、券商招聘
├── 标题：金融行业招聘 | Jobsbor
└── 描述：专注金融行业招聘，汇聚投行、券商...

职位详情页 /jobs/xxx
├── 核心词：[职位名]招聘、[公司名]招聘
├── 标题：[职位名]招聘 - [公司名] | [地点]
└── 描述：[公司名]招聘[职位名]，了解职位要求...

博客文章 /blog/xxx
├── 核心词：[文章主题关键词]
├── 标题：[文章标题] | Jobsbor
└── 描述：文章摘要包含核心关键词
```

### 3.3 关键词追踪表

建议每月更新以下表格：

| 关键词 | 当前排名 | 目标排名 | 负责页面 | 优化动作 | 更新时间 |
|--------|---------|---------|---------|---------|---------|
| 金融行业招聘 | 15 | 3 | 首页 | 增加外链 | 2024-04 |
| Web3招聘 | 8 | 3 | /jobs/web3 | 内容优化 | 2024-04 |
| 投行招聘 | 20 | 5 | /jobs/finance | 新增文章 | 2024-04 |

---

## 四、提交sitemap到搜索引擎

### 4.1 自动生成Sitemap

Jobsbor已配置自动sitemap生成（`src/app/sitemap.ts`），访问以下地址即可获取：

```
https://jobsbor.com/sitemap.xml
```

sitemap包含：
- 所有静态页面（首页、分类页等）
- 所有职位详情页
- 所有公司详情页
- 所有博客文章页

### 4.2 提交到百度搜索资源平台

#### 步骤1：注册并验证网站

1. 访问 [百度搜索资源平台](https://ziyuan.baidu.com/)
2. 登录百度账号
3. 添加网站：https://jobsbor.com
4. 选择验证方式（推荐HTML文件验证）
5. 下载验证文件并上传到网站根目录
6. 点击验证

#### 步骤2：提交sitemap

1. 进入「抓取」→「Sitemap」
2. 点击「添加新数据」
3. 输入sitemap地址：`https://jobsbor.com/sitemap.xml`
4. 提交

#### 步骤3：监控索引状态

- 定期查看「索引量」报告
- 关注「抓取异常」提醒
- 处理死链和404错误

### 4.3 提交到Google Search Console

#### 步骤1：注册并验证

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 登录Google账号
3. 添加属性：https://jobsbor.com
4. 选择验证方式（推荐HTML标记）
5. 将验证代码添加到网站 `<head>` 中

#### 步骤2：提交sitemap

1. 进入「Sitemap」菜单
2. 添加新的sitemap
3. 输入：`sitemap.xml`
4. 提交

#### 步骤3：监控与优化

- 查看「覆盖率」报告
- 关注「增强功能」建议
- 查看「搜索效果」数据

### 4.4 提交到其他搜索引擎

| 搜索引擎 | 提交地址 | 说明 |
|---------|---------|------|
| 必应 | [Bing Webmaster](https://www.bing.com/webmasters) | 与Google类似 |
| 360搜索 | [360站长平台](https://zhanzhang.so.com/) | 国内第三大搜索引擎 |
| 搜狗 | [搜狗站长平台](https://zhanzhang.sogou.com/) | 腾讯系搜索引擎 |

### 4.5 自动推送（可选）

配置主动推送，新内容发布时自动通知搜索引擎：

```typescript
// 发布新职位后自动推送
export async function notifySearchEngines(url: string) {
  // 百度主动推送
  await fetch('http://data.zz.baidu.com/urls?site=jobsbor.com&token=xxx', {
    method: 'POST',
    body: url,
  });
  
  // Google Indexing API
  // 需要额外配置
}
```

---

## 五、SEO最佳实践速查表

### 5.1 On-Page SEO检查项

| 元素 | 要求 | 示例 |
|------|------|------|
| Title | 30-60字符，含关键词 | 投行分析师招聘 - 中信证券 | Jobsbor |
| Meta Description | 150-160字符，含关键词 | 中信证券招聘投行分析师... |
| H1 | 每页1个，含核心关键词 | 投资银行分析师 |
| H2 | 2-6个，含长尾关键词 | 岗位职责、任职要求 |
| URL | 简洁，含关键词 | /jobs/investment-banking-analyst |
| 图片Alt | 描述性，含关键词 | 中信证券办公环境 |
| 内链 | 3-5个相关内链 | 链接到相关职位/文章 |
| 外链 | 2-3个权威外链 | 链接到数据来源 |

### 5.2 技术SEO检查项

- [ ] 网站HTTPS化
- [ ] 移动端适配
- [ ] 页面加载速度 < 3秒
- [ ] 配置robots.txt
- [ ] 提交sitemap
- [ ] 实现面包屑导航
- [ ] 使用Schema.org结构化数据
- [ ] 配置canonical标签
- [ ] 修复404错误
- [ ] 实现301重定向

### 5.3 内容SEO检查项

- [ ] 原创内容
- [ ] 内容深度（1500字以上）
- [ ] 关键词自然分布
- [ ] 定期更新内容
- [ ] 作者署名
- [ ] 引用权威来源
- [ ] 添加发布/更新日期
- [ ] 内部链接结构
- [ ] 多媒体内容（图片、视频）

### 5.4 常用SEO工具

| 工具 | 用途 | 地址 |
|------|------|------|
| 百度搜索资源平台 | 百度SEO监控 | ziyuan.baidu.com |
| Google Search Console | Google SEO监控 | search.google.com/search-console |
| 5118 | 关键词研究 | 5118.com |
| 站长工具 | 综合SEO查询 | chinaz.com |
| 爱站 | 排名监控 | aizhan.com |
| Screaming Frog | 网站爬虫分析 | screamingfrog.co.uk |
| PageSpeed Insights | 速度检测 | pagespeed.web.dev |

---

## 六、SEO优化时间线

### 第1周：基础配置
- [ ] 配置robots.txt
- [ ] 配置sitemap
- [ ] 提交到搜索引擎
- [ ] 设置Search Console监控

### 第2-4周：内容优化
- [ ] 优化首页标题和描述
- [ ] 优化分类页面
- [ ] 检查并修复现有内容
- [ ] 添加结构化数据

### 第1-3月：内容建设
- [ ] 每周发布2-3篇优质文章
- [ ] 建立内部链接网络
- [ ] 获取初期外链

### 第3-6月：持续优化
- [ ] 监控排名变化
- [ ] 根据数据调整策略
- [ ] 扩大内容覆盖范围
- [ ] 建立行业权威性

---

*本指南持续更新，如有疑问请联系SEO团队*
