# 🔍 搜索引擎提交操作指南

> 按优先级排序，预计总耗时 2 小时

---

## 一、Google Search Console（最高优先级）

### 操作步骤
1. 访问 https://search.google.com/search-console
2. 点击「添加资源」→ 选择「网域」
3. 输入：`jobsbor.vercel.app`
4. 验证方式选择 **DNS TXT 记录**：
   - 复制 Google 提供的 TXT 值（类似 `google-site-verification=XXXXX`）
   - 到你的域名 DNS 管理面板添加 TXT 记录
5. 验证通过后：
   - 左侧菜单 → Sitemaps → 提交 `sitemap.xml`
   - 左侧菜单 → 网址检查 → 输入首页 URL → 点击「请求编入索引」

### 快速验证替代方案
如果 DNS 验证不方便，可用 **HTML 标记** 验证：
- Google 会给一段 `<meta>` 标签
- 把它加到 `src/app/layout.tsx` 的 `<head>` 里
- 重新部署即可

---

## 二、Bing Webmaster Tools（次优先）

### 操作步骤
1. 访问 https://www.bing.com/webmasters
2. 用微软账号登录
3. 添加站点：`https://jobsbor.vercel.app`
4. **可以直接导入 Google Search Console 数据**（推荐）
5. 或者单独验证后提交 Sitemap

---

## 三、Yandex Webmaster（俄罗斯市场）

### 操作步骤
1. 访问 https://webmaster.yandex.com
2. 添加站点
3. 验证方式：HTML 元标签 / HTML 文件 / DNS
4. 提交 Sitemap

---

## 四、Baidu 站长（中国市场）

### 操作步骤
1. 访问 https://ziyuan.baidu.com
2. 注册/登录百度账号
3. 添加站点 → 选择验证方式
4. 已有 `public/baidu_verify_CODE.html`，需替换为真实验证码
5. 提交 Sitemap

---

## 五、自动索引提交（代码方案）

### IndexNow 协议
Bing 和 Yandex 支持 IndexNow 协议——**提交 URL 后几分钟内就会被索引**。

创建脚本 `scripts/submit-indexnow.mjs`：

```bash
node scripts/submit-indexnow.mjs
```

这会自动向 Bing 和 Yandex 提交所有页面 URL。

---

## 六、Google Indexing API（最快）

Google 官方 API，提交后 **几小时内索引**：

1. 在 Google Cloud Console 创建 Service Account
2. 启用 Indexing API
3. 下载 JSON key
4. 运行提交脚本

---

## 提交优先级

| 顺序 | 操作 | 预计耗时 | 效果 |
|------|------|---------|------|
| 1 | Google Search Console | 15 分钟 | ⭐⭐⭐⭐⭐ |
| 2 | Bing Webmaster | 10 分钟（可导入 Google） | ⭐⭐⭐⭐ |
| 3 | IndexNow 脚本 | 5 分钟 | ⭐⭐⭐⭐ |
| 4 | Yandex | 15 分钟 | ⭐⭐⭐ |
| 5 | Baidu | 30 分钟 | ⭐⭐（中国市场） |

---

## 验证索引状态

提交后 1-7 天，在 Google 搜索：
```
site:jobsbor.vercel.app
```
可以看到已被索引的页面数量。
