# 远程工作筛选器 - 功能文档

## 功能概述

远程工作筛选器聚合全球远程职位，提供时区匹配、薪资货币转换、签证/税务信息查询。核心传播机制是**匹配结果分享**和**数字游民攻略**。

---

## 核心传播机制

### 1. 时区匹配可视化
- 展示与团队的共同工作时间
- 生成时区重叠图分享
- "找到15个适合我的远程职位"

### 2. 数字游民热点
- 远程工作是趋势
- 数字游民签证指南
- 在巴厘岛写代码的生活方式

### 3. 实用工具
- 薪资换算器
- 签证信息查询
- 税务估算器

---

## 功能模块

### 职位筛选
```typescript
interface RemoteJobFilter {
  timezoneOffset: number;      // 用户时区偏移
  maxTimezoneDiff: number;     // 最大时区差（小时）
  minSalary: number;           // 最低薪资
  currency: string;            // 显示货币
  jobType: string;             // 工作类型
  companyType: string;         // 公司类型
  tags: string[];              // 技能标签
  visaSupport: boolean;        // 是否需要签证支持
}
```

### 职位卡片
```typescript
interface RemoteJob {
  id: string;
  title: string;
  company: string;
  location: string;
  timezone: string;
  timezoneOverlap: number;     // 时区重叠小时数
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: string;
  tags: string[];
  postedAt: Date;
  visaSupport: boolean;
  equity: boolean;
  benefits: string[];
  applyUrl: string;
}
```

### 实用工具
1. **时区重叠计算器**
   - 输入用户时区
   - 显示与职位的共同工作时间
   - 可视化时区图

2. **薪资换算器**
   - 实时汇率转换
   - 购买力平价参考
   - 税后估算

3. **签证指南**
   - 数字游民签证列表
   - 申请条件
   - 税务影响

4. **税务计算器**
   - 粗略估算税务负担
   - 双重征税提示
   - 税务优化建议

---

## 数字游民签证指南

### 热门签证

| 国家 | 签证类型 | 有效期 | 收入要求 | 税务 |
|------|---------|--------|---------|------|
| 🇵🇹 葡萄牙 | 数字游民签证 | 1年可续 | €3,040/月 | 0%（NHR） |
| 🇪🇸 西班牙 | 数字游民签证 | 1+3年 | €2,000/月 | 15%优惠 |
| 🇭🇷 克罗地亚 | 数字游民签证 | 1年 | €2,300/月 | 0% |
| 🇪🇪 爱沙尼亚 | 数字游民签证 | 1年 | €3,504/月 | 无当地税 |
| 🇦🇪 阿联酋 | 远程工作签证 | 1年 | $5,000/月 | 0% |
| 🇨🇷 哥斯达黎加 | Rentista签证 | 2年 | $3,000/月 | 本地征税 |

---

## 分享文案模板

### 匹配结果
```
🌍 找到15个适合我的远程职位！
时区匹配、薪资满意、还支持数字游民签证
远程工作，我来啦！👉 jobsbor.com/remote
```

### 时区可视化
```
🌏 我的远程团队工作时间
上午9点-下午5点，完美重叠8小时
时区匹配真的很重要！👉 jobsbor.com/remote
```

### 签证分享
```
✈️ 刚研究了数字游民签证
葡萄牙/西班牙/克罗地亚都不错
0%税务真的香！详情 👉 jobsbor.com/remote/visas
```

---

## 数据来源

| 来源 | 类型 | 更新频率 |
|------|------|---------|
| RemoteOK API | 职位聚合 | 实时 |
| We Work Remotely | 职位聚合 | 每日 |
| LinkedIn | 职位聚合 | 每日 |
| AngelList | 创业公司 | 每日 |
| 各公司招聘页 | 官方职位 | 每小时 |

---

## 技术实现

### 时区匹配算法
```typescript
function calculateTimezoneOverlap(
  userOffset: number,
  jobTimezoneRange: string
): number {
  // 解析职位时区范围
  const [minOffset, maxOffset] = parseTimezoneRange(jobTimezoneRange);
  
  // 计算重叠时间
  const overlap = Math.max(0, 
    8 - Math.abs(userOffset - (minOffset + maxOffset) / 2)
  );
  
  return Math.min(overlap, 8);
}
```

### 薪资换算
```typescript
function convertSalary(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const fromRate = getExchangeRate(fromCurrency);
  const toRate = getExchangeRate(toCurrency);
  return (amount / fromRate) * toRate;
}
```

---

## 增长策略

### 内容营销
- 数字游民生活方式文章
- 各国签证攻略
- 远程工作经验分享

### 社区建设
- 数字游民交流群
- 远程工作经验分享
- 线下聚会活动

### SEO优化
- "远程工作"关键词
- "数字游民签证"长尾词
- 各国+远程工作组合

---

## 关键指标

| 指标 | 目标值 |
|------|--------|
| 收录职位数 | >10,000 |
| 月活跃用户 | >8,000 |
| 职位申请转化率 | >5% |
| 签证页面访问量 | >30% |
| 分享率 | >12% |

---

*文档版本：1.0*
*创建时间：2026-04-02*
