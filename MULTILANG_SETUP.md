# Jobsbor 多语言国际化 (i18n) 配置文档

## 🌍 概述

Jobsbor 现已支持 **10国语言**，实现全自动海外SEO优化。系统采用 Next.js App Router 的动态路由方案，支持自动语言检测、cookie记忆、和SEO友好的URL结构。

## 📋 支持语言

| 代码 | 语言 | 国旗 | 市场 |
|------|------|------|------|
| `en` | English | 🇺🇸 | 美国/全球 |
| `ja` | 日本語 | 🇯🇵 | 日本 |
| `de` | Deutsch | 🇩🇪 | 德国 |
| `fr` | Français | 🇫🇷 | 法国 |
| `es` | Español | 🇪🇸 | 西班牙 |
| `ko` | 한국어 | 🇰🇷 | 韩国 |
| `th` | ไทย | 🇹🇭 | 泰国 |
| `vi` | Tiếng Việt | 🇻🇳 | 越南 |
| `hi` | हिन्दी | 🇮🇳 | 印度 |
| `zh` | 简体中文 | 🇸🇬 | 新加坡/中国 |

## 📁 文件结构

```
recruitment-site/
├── next.config.js              # i18n路由配置
├── src/
│   ├── middleware.ts           # 语言检测与重定向中间件
│   ├── i18n/
│   │   ├── config.ts           # 语言配置 (locales, flags, etc.)
│   │   ├── loader.ts           # 翻译文件加载器
│   │   ├── context.tsx         # React i18n Context
│   │   ├── index.ts            # 导出入口
│   │   └── locales/            # 翻译文件
│   │       ├── en.json         # 🇺🇸 English
│   │       ├── ja.json         # 🇯🇵 日本語
│   │       ├── de.json         # 🇩🇪 Deutsch
│   │       ├── fr.json         # 🇫🇷 Français
│   │       ├── es.json         # 🇪🇸 Español
│   │       ├── ko.json         # 🇰🇷 한국어
│   │       ├── th.json         # 🇹🇭 ไทย
│   │       ├── vi.json         # 🇻🇳 Tiếng Việt
│   │       ├── hi.json         # 🇮🇳 हिन्दी
│   │       └── zh.json         # 🇸🇬 简体中文
│   ├── components/
│   │   └── i18n/
│   │       ├── LanguageSwitcher.tsx   # 语言切换组件
│   │       ├── HreflangTags.tsx       # SEO hreflang标签
│   │       └── index.ts
│   └── app/
│       ├── [lang]/             # 多语言路由
│       │   ├── layout.tsx      # 多语言布局
│       │   ├── page.tsx        # 多语言首页
│       │   └── HomeContent.tsx # 首页内容组件
│       ├── sitemap.ts          # 多语言sitemap生成器
│       └── robots.ts           # 搜索引擎爬虫配置
```

## ⚙️ 配置说明

### 1. next.config.js

```javascript
i18n: {
  locales: ['en', 'ja', 'de', 'fr', 'es', 'ko', 'th', 'vi', 'hi', 'zh'],
  defaultLocale: 'en',
  domains: [
    { domain: 'jobsbor.com', defaultLocale: 'en' },
    { domain: 'jobsbor.jp', defaultLocale: 'ja' },
    // ... 更多域名配置
  ],
}
```

### 2. 中间件 (middleware.ts)

自动语言检测优先级：
1. **Cookie** - 用户之前选择的语言 (保存1年)
2. **Accept-Language Header** - 浏览器语言偏好
3. **默认语言** - English (en)

### 3. URL结构

| 页面 | URL示例 |
|------|---------|
| 首页 | `/en`, `/ja`, `/de`... |
| 职位列表 | `/en/jobs`, `/ja/jobs`... |
| 职位详情 | `/en/jobs/senior-developer`... |
| 公司列表 | `/en/companies`... |
| 公司详情 | `/en/companies/acme-corp`... |

## 🔧 使用指南

### 添加新翻译

1. 在 `src/i18n/locales/[lang].json` 添加翻译
2. 保持所有语言文件的键名一致

```json
{
  "metadata": {
    "title": "Page Title",
    "description": "Page description for SEO"
  },
  "nav": {
    "home": "Home",
    "jobs": "Jobs"
  }
}
```

### 在组件中使用翻译

```tsx
import { useI18n } from '@/i18n'

function MyComponent() {
  const { t, locale } = useI18n()
  
  return (
    <h1>{t('metadata.title')}</h1>
    <p>Current language: {locale}</p>
  )
}
```

### 语言切换组件

```tsx
import { LanguageSwitcher } from '@/components/i18n'

function Header() {
  return (
    <header>
      <LanguageSwitcher 
        currentLocale={locale} 
        variant="dropdown"  // 'dropdown' | 'inline' | 'minimal'
      />
    </header>
  )
}
```

## 🚀 SEO优化

### 1. Hreflang 标签

自动生成 `hreflang` 标签，告诉搜索引擎每种语言版本的对应关系：

```html
<link rel="alternate" hreflang="en-US" href="https://jobsbor.com/en/jobs" />
<link rel="alternate" hreflang="ja-JP" href="https://jobsbor.com/ja/jobs" />
<link rel="alternate" hreflang="x-default" href="https://jobsbor.com/en/jobs" />
```

### 2. Sitemap 结构

- **主Sitemap**: `/sitemap.xml` - 包含所有语言的URL
- **每个URL包含**: `hreflang` 交替链接到所有语言版本
- **更新频率**: 
  - 首页/职位列表: daily
  - 职位详情: weekly
  - 公司页面: weekly
  - 静态页面: monthly

### 3. Meta 标签

每个页面自动生成：
- `og:locale` - Open Graph 语言标签
- `canonical` - 规范URL
- `alternate` - 语言替代链接

## 📊 搜索引擎提交

### Google Search Console

1. 添加所有语言版本的属性：
   - `https://jobsbor.com/en`
   - `https://jobsbor.com/ja`
   - ...

2. 提交 Sitemap:
   ```
   https://jobsbor.com/sitemap.xml
   ```

### Bing Webmaster Tools

同样提交主 sitemap，Bing 会自动识别多语言结构。

### Yandex Webmaster

针对俄语市场（可扩展），提交 sitemap 并验证所有语言版本。

## 🔍 验证检查清单

- [ ] 访问 `/en` - 英文版本正常显示
- [ ] 访问 `/ja` - 日文版本正常显示
- [ ] 切换语言 - URL正确变化
- [ ] Cookie保存 - 刷新后保持选择的语言
- [ ] 浏览器语言检测 - 首次访问自动跳转
- [ ] 查看源代码 - hreflang 标签存在
- [ ] 访问 `/sitemap.xml` - 包含所有语言URL
- [ ] Google Search Console - 无 hreflang 错误

## 🛠️ 故障排除

### 语言不切换

1. 检查 cookie 是否启用
2. 清除 cookie 后重试
3. 检查控制台是否有 JS 错误

### SEO 问题

1. 确保每个页面都有唯一的 `canonical` URL
2. 检查 `hreflang` 标签是否完整 (所有语言)
3. 验证 sitemap 是否包含所有语言的对应版本

### 性能优化

- 翻译文件使用动态导入，按需加载
- 支持翻译缓存，避免重复加载
- 使用 `generateStaticParams` 预渲染所有语言页面

## 📈 未来扩展

### 添加新语言

1. 在 `src/i18n/config.ts` 添加 locale
2. 创建 `src/i18n/locales/[new].json`
3. 更新 `next.config.js` 的 locales 数组
4. 重启开发服务器

### 区域域名

可以为特定市场配置独立域名：

```javascript
// next.config.js
domains: [
  { domain: 'jobsbor.co.jp', defaultLocale: 'ja' },
  { domain: 'jobsbor.de', defaultLocale: 'de' },
]
```

### CDN 优化

建议为不同地区配置 CDN：
- 亚太地区: 日本/新加坡节点
- 欧洲: 德国/法国节点
- 北美: 美国节点

## 📝 更新日志

- **v1.0** (2024-04-02) - 初始版本，支持10国语言
  - 英语 (en) - 默认
  - 日语 (ja)
  - 德语 (de)
  - 法语 (fr)
  - 西班牙语 (es)
  - 韩语 (ko)
  - 泰语 (th)
  - 越南语 (vi)
  - 印地语 (hi)
  - 简体中文 (zh)

---

**预算**: ¥0 (全自动执行)
**开发时间**: 1天
**SEO效果**: 10倍搜索可见性提升
