# 面试题库 - 功能文档

## 功能概述

面试题库是一个按公司、职位、难度分级的面试题目库，支持用户贡献题目（UGC），形成学习-练习-分享的闭环。核心传播机制是**打卡分享**和**挑战好友**。

---

## 核心传播机制

### 1. 打卡分享
- 用户完成练习后生成打卡卡片
- "连续刷题7天！" - 利用连续打卡心理
- 分享成就到社交媒体

### 2. 挑战好友
- 生成挑战链接
- 好友PK答题
- 排行榜竞争

### 3. UGC内容
- 用户贡献高质量题目
- 面经分享
- 讨论区互动

---

## 功能模块

### 分类体系
```
📁 按公司
  ├─ FAANG
  │   ├─ Google
  │   ├─ Meta
  │   ├─ Amazon
  │   └─ ...
  ├─ 国内大厂
  │   ├─ 字节跳动
  │   ├─ 阿里巴巴
  │   └─ ...
  └─ 外企

📁 按职位
  ├─ 前端开发
  ├─ 后端开发
  ├─ 算法工程师
  ├─ 产品经理
  └─ UI/UX设计

📁 按难度
  ├─ 🟢 初级（0-2年）
  ├─ 🟡 中级（3-5年）
  └─ 🔴 高级（5年+）
```

### 题目详情
- 题目描述
- 难度标签
- 出现频率（基于面经统计）
- 参考答案
- 讨论区
- 相关题目推荐

### 用户功能
- 📝 收藏题目
- ✅ 标记已掌握
- 📊 学习进度统计
- 🏆 连续打卡天数
- 💬 评论和讨论

---

## 游戏化设计

### 等级系统
```
青铜刷题者     0-50题
白银刷题者    51-100题
黄金刷题者   101-200题
铂金刷题者   201-500题
钻石刷题者   501-1000题
刷题王者    1000+题
```

### 徽章系统
- "Google题霸" - 完成Google题库
- "算法王者" - 算法题正确率>90%
- "连续打卡7天" - 坚持学习
- "面经贡献者" - 贡献5道以上题目

### 排行榜
- 本周刷题榜
- 总刷题榜
- 正确率榜
- 连续打卡榜

---

## 分享文案模板

### 打卡分享
```
📚 连续刷题第7天！
今天完成了5道Google面试题，收获满满。
来Jobsbor一起刷题打卡吧 👉 jobsbor.com/q/xxxxx
```

### 挑战好友
```
⚔️ 挑战你！
我刚在Jobsbor刷了10道算法题，正确率80%
敢来PK吗？👉 jobsbor.com/challenge/xxxxx
```

### 难题求助
```
🤔 这道题难倒我了...
Google的一道系统设计题，有思路的朋友欢迎讨论
👉 jobsbor.com/q/xxxxx
```

---

## 内容策略

### 初期（1-3个月）
- 爬取公开面经，整理经典题
- 购买/合作获取高质量题目
- 邀请KOL贡献内容

### 中期（3-6个月）
- 开放用户贡献
- 积分激励优质内容
- 社区运营引导讨论

### 长期（6个月+）
- 社区自运转
- 高质量UGC为主
- AI辅助题目生成

---

## 技术实现

### 数据模型
```typescript
interface Question {
  id: string;
  title: string;
  description: string;
  company: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: number;        // 考频百分比
  tags: string[];
  answer?: string;
  discussionCount: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProgress {
  userId: string;
  questionId: string;
  status: 'todo' | 'doing' | 'done';
  attempts: number;
  lastAttemptAt: Date;
}
```

### API设计
```
GET    /api/questions              # 获取题目列表
GET    /api/questions/:id          # 获取题目详情
POST   /api/questions              # 创建题目（UGC）
POST   /api/questions/:id/progress # 更新进度
GET    /api/questions/leaderboard  # 排行榜
GET    /api/questions/streak       # 打卡数据
```

---

## 增长策略

### 种子内容
- LeetCode热门题
- 牛客网面经
- 一亩三分地面经
- 知乎技术话题

### 传播激励
- 分享解锁高级题
- 邀请好友获得积分
- 打卡成就展示

### 社区运营
- 每日一题推送
- 周赛活动
- 月度刷题挑战

---

## 关键指标

| 指标 | 目标值 |
|------|--------|
| 日活跃刷题用户 | >5,000 |
| 题目贡献数/月 | >500 |
| 分享率 | >25% |
| 7日留存率 | >40% |
| UGC占比 | >30% |

---

*文档版本：1.0*
*创建时间：2026-04-02*
