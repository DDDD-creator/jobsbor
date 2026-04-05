# Google Search Console 配置指南

## 概述
本文档记录Jobsbor招聘平台的Google Search Console配置步骤，包括网站验证、sitemap提交和性能监控。

---

## 1. GSC初始设置

### 步骤1: 访问GSC
访问 [Google Search Console](https://search.google.com/search-console)

### 步骤2: 添加属性

#### 方式A: 域名验证（推荐）
1. 选择"域名"类型
2. 输入：`jobsbor.com`
3. 点击"继续"
4. 需要通过DNS TXT记录验证

**DNS验证记录：**
```
类型: TXT
主机: @
值: google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TTL: 3600
```

#### 方式B: URL前缀验证（备用）
1. 选择"URL前缀"类型
2. 输入：`https://jobsbor.com/`
3. 选择验证方式：
   - **HTML文件上传**（推荐静态站点）
   - **HTML标签**（推荐Next.js应用）
   - **DNS记录**（推荐域名级别）

### 步骤3: 验证网站所有权

#### HTML文件验证方法
1. 下载GSC提供的验证文件（如：`googleXXXXXXXXXXXXXX.html`）
2. 将文件放入 `public/` 目录
3. 部署网站
4. 在GSC点击"验证"

#### HTML元标签验证方法（已配置）
已在 `src/app/layout.tsx` 中添加：
```tsx
export const metadata: Metadata = {
  // ...其他配置
  verification: {
    google: 'YOUR_VERIFICATION_CODE',
  },
}
```

---

## 2. Sitemap提交

### 2.1 自动生成Sitemap

项目已配置动态sitemap生成：`src/app/sitemap.ts`

**sitemap特性：**
- ✅ 多语言支持（10种语言）
- ✅ hreflang注解
- ✅ 职位页面动态生成
- ✅ 公司页面动态生成
- ✅ 优先级和更新频率配置

### 2.2 Sitemap结构

```
sitemap.xml                    # 主sitemap（已自动生成）
├── /en/sitemap.xml           # 英语版本
├── /zh/sitemap.xml           # 中文版本
├── /ja/sitemap.xml           # 日语版本
├── ...                       # 其他语言
```

**sitemap包含内容：**
- 核心页面（首页、职位列表、公司列表等）
- 所有职位页面（动态生成）
- 所有公司页面（动态生成）
- 多语言alternates

### 2.3 提交Sitemap到GSC

1. 进入GSC → **索引** → **Sitemap**
2. 在"添加新的sitemap"输入框中输入：
   ```
   sitemap.xml
   ```
3. 点击"提交"
4. 等待Google处理（通常需要1-7天）

### 2.4 多语言Sitemap配置

对于大型站点，建议分拆sitemap：

已在 `src/app/sitemap.ts` 中预留接口：
```typescript
export async function generateSitemapIndex(): Promise<MetadataRoute.Sitemap> {
  const sitemaps = [
    { url: `${SITE_URL}/sitemap-core.xml`, name: 'Core Pages' },
    { url: `${SITE_URL}/sitemap-jobs.xml`, name: 'Job Pages' },
    { url: `${SITE_URL}/sitemap-companies.xml`, name: 'Company Pages' },
  ];
  // ...
}
```

---

## 3. Core Web Vitals监控

### 3.1 在GSC中查看

1. 进入GSC → **体验** → **Core Web Vitals**
2. 查看：
   - 桌面端性能
   - 移动端性能
   - 具体URL问题

### 3.2 优化目标

| 指标 | 目标值 | 当前状态 |
|------|--------|---------|
| LCP (最大内容绘制) | < 2.5s | 待测试 |
| FID (首次输入延迟) | < 100ms | 待测试 |
| CLS (累积布局偏移) | < 0.1 | 待测试 |
| INP (交互到下一次绘制) | < 200ms | 待测试 |
| TTFB (首字节时间) | < 600ms | 待测试 |

### 3.3 性能优化检查清单

- [x] 图片使用WebP格式（Next.js Image组件）
- [x] 图片设置尺寸避免CLS
- [x] 字体预加载
- [x] JavaScript代码分割
- [x] CSS关键路径内联
- [ ] CDN配置
- [ ] 边缘缓存

---

## 4. 索引覆盖监控

### 4.1 监控页面索引状态

1. 进入GSC → **索引** → **网页**
2. 查看：
   - 已编入索引的页面数
   - 未编入索引的页面
   - 索引错误

### 4.2 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 已发现 - 尚未编入索引 | Google尚未抓取 | 提交sitemap，检查robots.txt |
| 已抓取 - 尚未编入索引 | 内容质量问题 | 检查内容原创性、字数 |
| 被robots.txt阻止 | robots.txt配置 | 检查并更新robots.txt |
| 404错误 | 页面不存在 | 修复链接或设置301跳转 |
| 重复内容 | 页面内容相似 | 添加canonical标签 |

### 4.3 索引优化建议

**职位页面索引策略：**
```
高优先级索引：
- 热门公司职位
- 高薪资职位
- 最新发布的职位（7天内）

低优先级/不索引：
- 已下架职位
- 重复职位
- 测试数据
```

---

## 5. 搜索查询分析

### 5.1 查看搜索效果

1. 进入GSC → **效果** → **搜索结果**
2. 分析指标：
   - 总点击次数
   - 总展示次数
   - 平均点击率(CTR)
   - 平均排名

### 5.2 目标关键词监控

需要跟踪的关键词类别：

| 类别 | 示例关键词 | 目标排名 |
|------|-----------|---------|
| 品牌词 | jobsbor, jobsbor招聘 | #1 |
| 行业词 | 金融招聘, web3招聘 | 前10 |
| 职位词 | 软件工程师招聘 | 前20 |
| 地域词 | 北京金融招聘 | 前10 |

---

## 6. 结构化数据监控

### 6.1 验证Schema标记

1. 进入GSC → **增强功能**
2. 查看：
   - 职位发布（JobPosting）
   - 面包屑导航（BreadcrumbList）
   - 站点链接搜索框（WebSite）

### 6.2 Schema测试工具

使用 [富媒体测试工具](https://search.google.com/test/rich-results) 验证：
- JobPosting Schema
- BreadcrumbList Schema
- Organization Schema

---

## 7. 多语言配置

### 7.1 hreflang验证

GSC会显示多语言页面的hreflang问题：
- 缺少返回标签
- 语言代码错误
- 页面不存在

### 7.2 多语言监控

监控各语言版本的索引状态：
- `/en/*` - 英语
- `/zh/*` - 中文
- `/ja/*` - 日语
- `/ko/*` - 韩语
- 其他语言版本

---

## 8. 移动设备易用性

### 8.1 检查移动友好性

1. 进入GSC → **体验** → **移动设备易用性**
2. 检查问题：
   - 文字太小
   - 可点击元素太近
   - 视口未设置
   - 内容宽度问题

### 8.2 移动端优化清单

- [x] 响应式设计
- [x] 触摸目标48px+
- [x] 字体可读（最小16px）
- [x] 视口配置正确

---

## 9. 安全问题

### 9.1 安全监控

1. 进入GSC → **安全与人工处置措施**
2. 检查：
   - 被黑内容
   - 恶意软件
   - 网络钓鱼
   - 人工处罚

### 9.2 HTTPS配置

确保全站HTTPS：
- 证书有效
- 无混合内容
- HTTP自动跳转HTTPS

---

## 10. 链接分析

### 10.1 外部链接

1. 进入GSC → **链接** → **外部链接**
2. 分析：
   - 引荐网站数量
   - 热门链接页面
   - 链接域名质量

### 10.2 内部链接

1. 进入GSC → **链接** → **内部链接**
2. 优化：
   - 确保重要页面有足够内链
   - 修复孤立页面

---

## 11. 设置通知

### 11.1 邮件通知配置

1. 点击GSC右上角设置图标
2. 选择"通知偏好设置"
3. 启用：
   - ✅ 索引问题
   - ✅ Core Web Vitals问题
   - ✅ 移动设备易用性问题
   - ✅ 安全问题
   - ✅ 流量变化提醒

---

## 12. 检查清单

### GSC初始配置
- [ ] 域名/URL前缀已添加
- [ ] 所有权验证完成
- [ ] Sitemap已提交
- [ ] 邮件通知已启用

### 监控设置
- [ ] Core Web Vitals基线已记录
- [ ] 索引页面数基线已记录
- [ ] 目标关键词已设定
- [ ] 竞争对手监控（可选）

### 定期维护（每周）
 [ ] 检查索引覆盖率
- [ ] 查看搜索查询报告
- [ ] 检查Core Web Vitals
- [ ] 处理索引错误

### 定期维护（每月）
- [ ] 分析流量趋势
- [ ] 检查外部链接增长
- [ ] 审核结构化数据
- [ ] 更新sitemap（如需要）

---

## 相关文档

- [GA4配置指南](./GA4_SETUP.md)
- [结构化数据组件](../src/components/seo/)
- [Sitemap配置](../src/app/sitemap.ts)

---

**创建日期**: 2025-04-02  
**版本**: v1.0  
**负责人**: SEO技术优化智能体
