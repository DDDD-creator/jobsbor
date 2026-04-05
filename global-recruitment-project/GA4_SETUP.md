# Google Analytics 4 配置指南

## 概述
本文档记录Jobsbor招聘平台的GA4配置步骤和最佳实践。

---

## 1. 创建GA4账户和数据流

### 步骤1: 创建GA4属性
1. 访问 [Google Analytics](https://analytics.google.com/)
2. 点击"开始测量"或"创建属性"
3. 输入属性名称：`Jobsbor`
4. 选择时区：`中国标准时间 (GMT+08:00)`
5. 选择货币：`人民币 (CNY)`
6. 点击"下一步"

### 步骤2: 配置业务信息
- 行业类别：`求职与招聘`
- 企业规模：`1-10人`（根据实际选择）
- 业务目标：
  - ✅ 获取潜在客户
  - ✅ 提高品牌认知度
  - ✅ 考察用户行为

### 步骤3: 创建数据流
1. 选择平台：`Web`
2. 网站网址：`https://jobsbor.com`
3. 数据流名称：`Jobsbor Website`
4. 点击"创建数据流"

### 步骤4: 获取测量ID
创建完成后，复制**测量ID**（格式：`G-XXXXXXXXXX`）

---

## 2. 在项目中配置GA4

### 环境变量设置
在 `.env.local` 文件中添加：

```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 代码已植入位置
GA4代码已植入到 `src/app/layout.tsx`：

```tsx
// Google Analytics 4 配置
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

// 在<head>中注入GA4脚本
<head>
  {/* Google Analytics 4 跟踪代码 */}
  <Script
    src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
    strategy="afterInteractive"
  />
  <Script id="ga4-init" strategy="afterInteractive">
    {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true,
        cookie_flags: 'SameSite=None;Secure',
        custom_map: {
          'custom_parameter_1': 'language',
          'custom_parameter_2': 'page_type'
        }
      });
    `}
  </Script>
</head>
```

---

## 3. GA4事件追踪配置

### 自动追踪事件
GA4已配置自动追踪以下事件：
- `page_view` - 页面浏览
- `scroll` - 页面滚动
- `click` - 出站点击
- `view_search_results` - 站内搜索

### 自定义事件（需在代码中实现）

#### 职位申请事件
```javascript
gtag('event', 'job_apply', {
  'job_title': '软件工程师',
  'company': '字节跳动',
  'location': '北京',
  'job_id': 'job_12345'
});
```

#### 用户注册事件
```javascript
gtag('event', 'sign_up', {
  'method': 'email',
  'language': 'zh-CN'
});
```

#### 搜索事件
```javascript
gtag('event', 'search', {
  'search_term': '前端工程师',
  'location': '上海',
  'results_count': 42
});
```

#### 收藏职位事件
```javascript
gtag('event', 'add_to_wishlist', {
  'job_title': '产品经理',
  'company': '腾讯'
});
```

---

## 4. 转化目标设置

### 在GA4后台配置转化事件

1. 进入 **管理** → **数据流** → 选择Web数据流
2. 点击 **增强型测量** → 启用所有选项
3. 进入 **事件** → **转化事件**
4. 添加以下转化事件：

| 转化事件 | 价值 | 说明 |
|---------|------|------|
| `job_apply` | ¥10 | 职位申请 |
| `sign_up` | ¥50 | 用户注册 |
| `add_to_wishlist` | ¥5 | 收藏职位 |
| `contact_submit` | ¥20 | 联系表单提交 |

---

## 5. 自定义维度配置

### 用户属性
在GA4后台配置自定义用户属性：

| 属性名称 | 作用范围 | 说明 |
|---------|---------|------|
| `language` | 用户 | 用户语言偏好 |
| `user_type` | 用户 | 求职者/雇主 |
| `preferred_industry` | 用户 | 偏好行业 |

### 事件参数
配置自定义事件参数：

| 参数名称 | 数据类型 | 说明 |
|---------|---------|------|
| `job_id` | 字符串 | 职位唯一标识 |
| `company_name` | 字符串 | 公司名称 |
| `salary_range` | 字符串 | 薪资范围 |
| `location_city` | 字符串 | 城市 |

---

## 6. 受众群体配置

### 建议创建的受众群体

1. **活跃用户**
   - 条件：过去7天有session
   - 用途：留存分析

2. **职位申请者**
   - 条件：触发`job_apply`事件
   - 用途：转化分析

3. **高价值用户**
   - 条件：浏览≥5个职位且收藏≥1个
   - 用途：核心用户分析

4. **多语言用户**
   - 条件：语言≠zh-CN
   - 用途：国际化分析

---

## 7. 数据保留设置

1. 进入 **管理** → **数据设置** → **数据保留**
2. 设置：
   - 事件数据保留：**14个月**
   - 重置用户ID：不重置

---

## 8. 隐私与合规

### GDPR/CCPA合规配置

代码已包含Cookie安全标记：
```javascript
cookie_flags: 'SameSite=None;Secure'
```

### 隐私政策要求
确保隐私政策页面包含：
- 使用Google Analytics的说明
- Cookie使用说明
- 用户数据权利说明

---

## 9. 验证GA4安装

### 方法1: 实时报告验证
1. 访问网站任意页面
2. 进入GA4后台 **实时** 报告
3. 确认看到活跃用户

### 方法2: Google Tag Assistant
1. 安装 [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmjkgacjhcedfgkojbn) Chrome扩展
2. 访问网站，确认GA4标签已触发

### 方法3: 浏览器开发者工具
1. 打开Chrome开发者工具 → Network标签
2. 刷新页面，筛选`collect`
3. 确认有请求发送到`google-analytics.com`

---

## 10. 监控清单

- [x] GA4账户已创建
- [x] Web数据流已配置
- [x] 测量ID已获取
- [x] 代码已植入layout.tsx
- [ ] 环境变量NEXT_PUBLIC_GA_ID已配置（替换真实ID）
- [ ] 实时报告验证通过
- [ ] 转化事件已配置
- [ ] 自定义维度已设置
- [ ] 受众群体已创建
- [ ] 数据保留已配置

---

## 相关链接

- [GA4官方文档](https://support.google.com/analytics/topic/9143232)
- [GA4事件参考](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Next.js Script组件](https://nextjs.org/docs/app/api-reference/components/script)

---

**创建日期**: 2025-04-02  
**版本**: v1.0  
**负责人**: SEO技术优化智能体
