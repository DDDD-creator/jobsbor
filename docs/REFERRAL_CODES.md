# 内推码系统 - 功能文档

## 功能概述

内推码系统是一个内推码交换平台，用户可以提交内推码、查看成功率、参与排行榜竞争。核心传播机制是**排行榜竞赛**和**互惠互利**的网络效应。

---

## 核心传播机制

### 1. 排行榜竞赛
- 周榜/月榜/总榜展示
- "内推王"荣誉称号
- 等级徽章系统（钻石/金牌/银牌/铜牌）

### 2. 互惠互利
- 你帮我内推，我帮你内推
- 内推成功双方获益
- 社区互助氛围

### 3. 网络效应
- 用户越多，内推码越全
- 内推码越全，用户越多
- 形成正向循环

---

## 功能模块

### 内推码管理
```typescript
interface ReferralCode {
  id: string;
  code: string;              // 内推码
  company: string;           // 公司
  contributor: string;       // 贡献者
  department?: string;       // 部门
  location?: string;         // 地点
  successRate: number;       // 成功率
  usesLeft: number;          // 剩余次数
  totalUses: number;         // 总使用次数
  expiryDate: Date;          // 过期时间
  verified: boolean;         // 是否验证
  notes?: string;            // 备注
}
```

### 排行榜系统
```typescript
interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  totalReferrals: number;    // 总内推数
  successCount: number;      // 成功数
  successRate: number;       // 成功率
  badges: Badge[];           // 徽章
  monthlyChange: number;     // 月度变化
}
```

### 等级系统
```
💎 钻石内推官   成功内推 50+
🥇 金牌内推官   成功内推 20+
🥈 银牌内推官   成功内推 10+
🥉 铜牌内推官   成功内推 5+
⭐ 活跃内推官   成功内推 1+
```

---

## 防作弊机制

### 使用限制
- 每个内推码使用次数限制
- IP/设备频率限制
- 验证码使用验证

### 验证机制
- 邮箱验证
- 公司邮箱验证（优先展示）
- 人工审核（可疑账号）

### 举报系统
- 用户举报失效内推码
- 自动下架失效码
- 贡献者信誉分系统

---

## 分享文案模板

### 排行榜炫耀
```
🏆 我是本周内推王！
这周成功帮助12位朋友获得面试机会
来Jobsbor获取内推码，一起上岸！
👉 jobsbor.com/referral
```

### 互助邀请
```
🤝 求内推互助！
我有字节/阿里的内推码，需要腾讯/百度的内推
在Jobsbor上交换 👉 jobsbor.com/referral
```

### 贡献内推码
```
🔗 刚提交了新的Google内推码！
还剩5次使用机会，需要的朋友自取
👉 jobsbor.com/referral/google
```

---

## 积分系统

### 获取积分
| 行为 | 积分 |
|------|------|
| 提交内推码 | +50 |
| 内推码被使用 | +10 |
| 内推成功 | +100 |
| 举报失效码 | +20 |
| 完善个人资料 | +30 |

### 积分用途
- 解锁高级内推码
- 兑换周边礼品
- 排行榜加成
- 优先客服支持

---

## 技术实现

### 数据库设计
```sql
-- 内推码表
CREATE TABLE referral_codes (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(100) NOT NULL,
  company_id VARCHAR(36) NOT NULL,
  contributor_id VARCHAR(36) NOT NULL,
  success_rate INT DEFAULT 0,
  uses_left INT DEFAULT 10,
  total_uses INT DEFAULT 0,
  expiry_date TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 使用记录表
CREATE TABLE referral_uses (
  id VARCHAR(36) PRIMARY KEY,
  code_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API设计
```
GET    /api/referrals                    # 获取内推码列表
POST   /api/referrals                    # 提交内推码
GET    /api/referrals/:id                # 获取内推码详情
POST   /api/referrals/:id/use            # 使用内推码
GET    /api/referrals/leaderboard        # 排行榜
GET    /api/referrals/my-codes           # 我的内推码
GET    /api/referrals/my-stats           # 我的统计
```

---

## 增长策略

### 冷启动
1. 团队内部分享内推码
2. 邀请KOL贡献内推码
3. 从公开渠道收集内推码

### 激励机制
- 积分奖励
- 排行榜展示
- 等级徽章
- 周边礼品

### 社区运营
- 内推成功故事分享
- 月度内推王专访
- 互助活动

---

## 关键指标

| 指标 | 目标值 |
|------|--------|
| 活跃内推码 | >5,000 |
| 月内推次数 | >10,000 |
| 内推成功率 | >50% |
| 头部贡献者占比 | 20% |
| 用户留存率（30天） | >40% |

---

*文档版本：1.0*
*创建时间：2026-04-02*
