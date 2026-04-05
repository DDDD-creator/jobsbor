# SEO语义化HTML检查清单

> Jobsbor招聘网站优化指南 - 确保每个页面都符合SEO最佳实践

## 概述

本检查清单用于指导开发人员和内容编辑创建SEO友好的页面。每个页面上线前，请确保完成以下检查项。

---

## 一、标题层级检查

### 1.1 每个页面必须只有一个 `<h1>`

- [ ] 首页：使用品牌核心关键词作为主标题
- [ ] 职位列表页：使用行业/分类名称作为 `<h1>`
- [ ] 职位详情页：使用职位标题作为 `<h1>`
- [ ] 公司详情页：使用公司名称作为 `<h1>`
- [ ] 博客文章页：使用文章标题作为 `<h1>`

**示例**：
```html
<!-- 职位详情页 -->
<h1>投资银行分析师</h1>

<!-- 公司详情页 -->
<h1>中信证券</h1>

<!-- 博客文章页 -->
<h1>2024金融行业求职指南</h1>
```

### 1.2 标题层级必须连续

- [ ] 不要跳级（如从 `<h2>` 直接跳到 `<h4>`）
- [ ] 按逻辑顺序组织内容层级

**正确示例**：
```html
<h1>职位标题</h1>
<h2>职位描述</h2>
<h3>岗位职责</h3>
<h3>任职要求</h3>
<h2>公司介绍</h2>
```

**错误示例**：
```html
<h1>职位标题</h1>
<h3>职位描述</h3>  <!-- ❌ 跳过了 h2 -->
<h2>公司介绍</h2>
```

### 1.3 不要在非标题元素上使用标题样式

- [ ] 使用CSS而非标题标签来调整字体大小
- [ ] 标题标签只用于真正的内容层级

---

## 二、语义化标签检查

### 2.1 必须使用的语义标签

#### `<header>` - 页面头部
- [ ] 包含网站Logo/品牌名
- [ ] 包含主导航
- [ ] 每个页面只能有一个 `<header>` 作为页头

```html
<header>
  <a href="/" aria-label="Jobsbor首页">
    <img src="/logo.svg" alt="Jobsbor招聘平台" />
  </a>
  <nav aria-label="主导航">...</nav>
</header>
```

#### `<nav>` - 导航区域
- [ ] 主导航使用 `<nav>` 包裹
- [ ] 面包屑导航使用 `<nav>` 包裹
- [ ] 页脚链接区域可使用 `<nav>`
- [ ] 使用 `aria-label` 区分不同导航

```html
<!-- 主导航 -->
<nav aria-label="主导航">
  <a href="/jobs">职位</a>
  <a href="/companies">公司</a>
  <a href="/blog">职场资讯</a>
</nav>

<!-- 面包屑导航 -->
<nav aria-label="面包屑导航">...</nav>
```

#### `<main>` - 主内容区
- [ ] 每个页面只能有一个 `<main>`
- [ ] 包含页面的主要内容
- [ ] 不包含侧边栏、广告等辅助内容

```html
<main>
  <!-- 页面主要内容 -->
</main>
```

#### `<article>` - 独立内容
- [ ] 博客文章使用 `<article>`
- [ ] 职位卡片可使用 `<article>`
- [ ] 公司简介可使用 `<article>`

```html
<article>
  <header>
    <h1>文章标题</h1>
    <time datetime="2024-03-15">2024年3月15日</time>
  </header>
  <div>文章内容...</div>
</article>
```

#### `<section>` - 内容区块
- [ ] 用于将内容分组
- [ ] 通常配合标题使用
- [ ] 页面中可以有多个 `<section>`

```html
<section>
  <h2>相关职位</h2>
  <!-- 职位列表 -->
</section>

<section>
  <h2>公司简介</h2>
  <!-- 公司介绍 -->
</section>
```

#### `<aside>` - 侧边内容
- [ ] 侧边栏内容
- [ ] 相关推荐
- [ ] 广告区域

```html
<aside>
  <h3>热门公司</h3>
  <!-- 公司列表 -->
</aside>
```

#### `<footer>` - 页脚
- [ ] 包含版权信息
- [ ] 包含网站地图链接
- [ ] 包含联系方式

```html
<footer>
  <p>&copy; 2024 Jobsbor. 保留所有权利。</p>
  <nav aria-label="页脚导航">
    <a href="/about">关于我们</a>
    <a href="/contact">联系我们</a>
    <a href="/privacy">隐私政策</a>
  </nav>
</footer>
```

### 2.2 语义化标签使用示例

**完整的职位详情页结构**：
```html
<body>
  <header>
    <!-- Logo和主导航 -->
  </header>
  
  <nav aria-label="面包屑导航">
    <!-- 面包屑 -->
  </nav>
  
  <main>
    <article>
      <header>
        <h1>投资银行分析师</h1>
        <p>中信证券 · 北京/上海</p>
      </header>
      
      <section>
        <h2>职位描述</h2>
        <p>...</p>
      </section>
      
      <section>
        <h2>任职要求</h2>
        <ul>...</ul>
      </section>
      
      <section>
        <h2>薪资福利</h2>
        <p>...</p>
      </section>
    </article>
    
    <aside>
      <h3>相似职位</h3>
      <!-- 推荐职位 -->
    </aside>
  </main>
  
  <footer>
    <!-- 页脚内容 -->
  </footer>
</body>
```

---

## 三、图片优化检查

### 3.1 所有图片必须包含 `alt` 属性

- [ ] 装饰性图片使用空 `alt=""`
- [ ] 内容图片使用描述性 `alt` 文本
- [ ] 功能图片（如按钮）描述其功能

**正确示例**：
```html
<!-- 公司Logo - 描述图片内容 -->
<img src="/logos/citic.png" alt="中信证券" />

<!-- 职位封面图 - 描述图片场景 -->
<img src="/images/office.jpg" alt="现代化的办公环境" />

<!-- 装饰性背景 - 空alt -->
<img src="/images/bg-pattern.svg" alt="" />

<!-- 功能图标 - 描述功能 -->
<img src="/icons/search.svg" alt="搜索" />
```

### 3.2 图片尺寸优化

- [ ] 使用适当尺寸的图片（不要缩放过大图片）
- [ ] 使用 `srcset` 提供响应式图片
- [ ] 使用现代格式（WebP、AVIF）并提供回退

```html
<picture>
  <source srcset="/images/photo.avif" type="image/avif">
  <source srcset="/images/photo.webp" type="image/webp">
  <img src="/images/photo.jpg" alt="描述性文本" loading="lazy" />
</picture>
```

### 3.3 懒加载

- [ ] 首屏外的图片使用 `loading="lazy"`
- [ ] 首屏图片预加载

```html
<!-- 首屏图片 - 立即加载 -->
<img src="/hero.jpg" alt="首屏主图" fetchpriority="high" />

<!-- 非首屏图片 - 懒加载 -->
<img src="/below-fold.jpg" alt="下方内容" loading="lazy" />
```

---

## 四、链接优化检查

### 4.1 链接文本要有意义

- [ ] 不要使用 "点击这里"、"查看更多" 等无意义文本
- [ ] 链接文本应描述目标内容

**正确示例**：
```html
<a href="/jobs/investment-banking">查看投资银行分析师职位详情</a>
<a href="/companies/citic-securities">了解中信证券公司信息</a>
```

**错误示例**：
```html
<a href="/jobs/investment-banking">点击这里</a>
<a href="/companies/citic-securities">查看更多</a>
```

### 4.2 使用 `title` 属性补充信息

- [ ] 当链接文本不足以说明时使用 `title`
- [ ] 不要重复链接文本

```html
<a href="/jobs/finance" title="浏览所有金融行业招聘职位">金融职位</a>
```

### 4.3 外部链接处理

- [ ] 外部链接添加 `rel="noopener noreferrer"`
- [ ] 在新标签页打开外部链接时添加视觉提示

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  访问官网 <span aria-hidden="true">↗</span>
</a>
```

### 4.4 下载链接

- [ ] 下载链接使用 `download` 属性
- [ ] 标明文件格式和大小

```html
<a href="/templates/resume.pdf" download>
  下载简历模板 (PDF, 500KB)
</a>
```

---

## 五、ARIA标签检查

### 5.1 必要的ARIA属性

#### 当前页面指示
```html
<nav aria-label="主导航">
  <a href="/" aria-current="page">首页</a>
  <a href="/jobs">职位</a>
</nav>
```

#### 搜索表单
```html
<form role="search">
  <label for="search-input">搜索职位</label>
  <input id="search-input" type="search" placeholder="输入关键词..." />
  <button type="submit">搜索</button>
</form>
```

#### 动态内容区域
```html
<!-- 加载状态 -->
<div aria-live="polite" aria-busy="true">
  正在加载职位列表...
</div>

<!-- 错误提示 -->
<div role="alert">
  加载失败，请稍后重试
</div>
```

#### 模态框/对话框
```html
<div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
  <h2 id="dialog-title">申请职位</h2>
  <!-- 对话框内容 -->
</div>
```

### 5.2 避免过度使用ARIA

- [ ] 优先使用原生HTML语义标签
- [ ] 不要重复定义语义标签的默认角色

**正确**：
```html
<button>提交</button>
<nav>...</nav>
<main>...</main>
```

**错误**（重复定义）：
```html
<button role="button">提交</button>
<nav role="navigation">...</nav>
<main role="main">...</main>
```

---

## 六、表格优化检查

### 6.1 表格必须使用正确的语义标签

```html
<table>
  <caption>金融行业薪资水平对比</caption>
  <thead>
    <tr>
      <th scope="col">职位</th>
      <th scope="col">月薪范围</th>
      <th scope="col">年终奖</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">投行分析师</th>
      <td>25K-40K</td>
      <td>6-12个月</td>
    </tr>
  </tbody>
</table>
```

---

## 七、表单优化检查

### 7.1 所有表单元素必须有标签

```html
<!-- 显式关联 -->
<label for="email">邮箱地址</label>
<input id="email" type="email" required />

<!-- 隐式关联 -->
<label>
  手机号
  <input type="tel" required />
</label>
```

### 7.2 必填字段标记

```html
<label for="name">
  姓名 <span aria-label="必填">*</span>
</label>
<input id="name" type="text" required aria-required="true" />
```

### 7.3 错误提示

```html
<input 
  id="email" 
  type="email" 
  required 
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">请输入有效的邮箱地址</span>
```

---

## 八、页面级检查清单

### 8.1 每个页面上线前检查

- [ ] 有且仅有一个 `<h1>`
- [ ] 标题层级连续
- [ ] 使用 `<main>` 包裹主要内容
- [ ] 使用 `<header>`、`<footer>` 定义页头页脚
- [ ] 导航使用 `<nav>` 包裹
- [ ] 所有图片有 `alt` 属性
- [ ] 所有链接有有意义的文本
- [ ] 表单元素有关联标签
- [ ] 当前页面链接有 `aria-current="page"`

### 8.2 常用工具检测

- [ ] 使用 Chrome DevTools Lighthouse 进行SEO检测
- [ ] 使用 axe DevTools 进行可访问性检测
- [ ] 使用 W3C HTML Validator 验证HTML
- [ ] 使用屏幕阅读器（如NVDA、VoiceOver）测试

---

## 九、各页面特殊要求

### 9.1 首页

- [ ] `<h1>` 包含核心关键词
- [ ] 职位搜索表单有 `role="search"`
- [ ] 职位分类卡片使用 `<article>` 或 `<section>`

### 9.2 职位列表页

- [ ] `<h1>` 明确当前筛选条件
- [ ] 每个职位卡片使用 `<article>`
- [ ] 筛选器使用 `<fieldset>` 和 `<legend>`

### 9.3 职位详情页

- [ ] `<h1>` 是职位标题
- [ ] 使用 `<article>` 包裹职位内容
- [ ] 公司信息使用 `<section>` 分组

### 9.4 公司详情页

- [ ] `<h1>` 是公司名称
- [ ] 公司Logo有描述性 `alt`
- [ ] 职位列表使用 `<section>` 分组

### 9.5 博客文章页

- [ ] `<h1>` 是文章标题
- [ ] 使用 `<article>` 包裹文章内容
- [ ] 发布时间使用 `<time>` 标签
- [ ] 作者信息使用语义化标记

---

## 十、常见问题FAQ

**Q: 什么时候使用 `<div>` 而不是语义化标签？**

A: 当元素纯粹用于布局或样式，不包含独立语义内容时使用 `<div>`。

**Q: 可以同时使用多个 `<nav>` 吗？**

A: 可以，但需要用 `aria-label` 区分不同的导航。

**Q: 装饰性图片为什么要用空 alt？**

A: 空 alt 告诉屏幕阅读器忽略该图片，避免朗读无意义的文件名。

**Q: 如何测试ARIA标签是否正确？**

A: 使用屏幕阅读器实际测试，或使用 axe DevTools 等自动化工具。

---

*本清单持续更新，如有疑问请联系SEO团队*
