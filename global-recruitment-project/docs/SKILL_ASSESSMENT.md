# 技能评估测试 - 功能文档

## 功能概述

技能评估测试提供技术栈能力测试，生成可视化能力报告，推荐匹配职位，支持好友PK。核心传播机制是**能力证书分享**和**好友PK挑战**。

---

## 核心传播机制

### 1. 能力证书分享
- 生成精美证书图片
- "我达到钻石段位了！"
- 展示个人能力，吸引挑战

### 2. 好友PK挑战
- 发起一对一挑战
- 排行榜竞争
- 社交媒体炫耀

### 3. 游戏化元素
- 等级系统（青铜→王者）
- 徽章成就
- 能力雷达图

---

## 功能模块

### 测试类型
```typescript
const TEST_TYPES = [
  {
    id: 'frontend',
    name: '前端开发',
    skills: ['HTML/CSS', 'JavaScript', 'React/Vue', '性能优化', '工程化'],
    questions: 20,
    duration: 30,
  },
  {
    id: 'backend',
    name: '后端开发',
    skills: ['Java/Go/Python', '数据库', '微服务', '缓存', '消息队列'],
    questions: 20,
    duration: 30,
  },
  {
    id: 'algorithm',
    name: '算法能力',
    skills: ['数组', '链表', '树', '图', '动态规划'],
    questions: 15,
    duration: 45,
  },
  {
    id: 'system',
    name: '系统设计',
    skills: ['架构设计', '分布式', '数据库设计', '缓存策略', '限流熔断'],
    questions: 10,
    duration: 40,
  },
  {
    id: 'product',
    name: '产品思维',
    skills: ['需求分析', '用户研究', '数据分析', '项目管理', '商业思维'],
    questions: 20,
    duration: 25,
  },
  {
    id: 'design',
    name: 'UI/UX设计',
    skills: ['设计原理', 'Figma/Sketch', '用户体验', '交互设计', '视觉设计'],
    questions: 20,
    duration: 30,
  },
];
```

### 等级系统
```
青铜    0-399分   🥉
白银  400-599分   🥈
黄金  600-749分   🥇
铂金  750-849分   💎
钻石  850-949分   👑
王者  950-1000分  🏆
```

### 徽章系统
- "React专家" - React测试>90分
- "算法王者" - 算法测试钻石段位
- "全栈工程师" - 前后端均黄金以上
- "连续7天" - 连续测试7天
- "挑战之王" - PK胜场10+

---

## 测试流程

### 1. 选择测试
- 浏览测试类型
- 查看测试介绍
- 开始测试

### 2. 答题过程
- 单选题（基础知识）
- 多选题（综合应用）
- 代码题（在线编程）
- 场景题（系统设计）

### 3. 结果展示
- 总分和等级
- 能力雷达图
- 各项得分详情
- 排名百分比

### 4. 后续推荐
- 匹配职位推荐
- 能力提升建议
- 相关学习资源

---

## 分享文案模板

### 等级炫耀
```
🏆 我在Jobsbor前端测试中达到钻石段位！
得分：925/1000，超过92%的测试者
来挑战我？👉 jobsbor.com/skill-test
```

### 能力证书
```
📜 获得「React专家」认证！
React能力得分：95/100
Jobsbor技能认证 👉 jobsbor.com/cert/xxxxx
```

### PK挑战
```
⚔️ 挑战你！
我刚在算法测试中获得890分
敢来PK吗？👉 jobsbor.com/challenge/xxxxx
```

### 求职炫耀
```
🎯 我的能力匹配这些高薪职位！
前端架构师匹配度：92%
测测你的能力？👉 jobsbor.com/skill-test
```

---

## 技术实现

### 题目设计
```typescript
interface Question {
  id: string;
  type: 'single' | 'multiple' | 'code' | 'scenario';
  question: string;
  options?: string[];
  correctAnswer: number | number[] | string;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
}
```

### 评分算法
```typescript
function calculateScore(
  answers: Answer[],
  questions: Question[]
): ScoreResult {
  let totalScore = 0;
  const categoryScores: Record<string, number> = {};
  
  questions.forEach((q, idx) => {
    const isCorrect = checkAnswer(answers[idx], q.correctAnswer);
    const score = isCorrect ? q.score : 0;
    totalScore += score;
    categoryScores[q.category] = (categoryScores[q.category] || 0) + score;
  });
  
  return {
    total: totalScore,
    categories: categoryScores,
    percentile: calculatePercentile(totalScore),
    level: getLevel(totalScore),
  };
}
```

### 能力雷达图数据
```typescript
const radarData = [
  { subject: 'JavaScript', A: 85, fullMark: 100 },
  { subject: 'CSS', A: 70, fullMark: 100 },
  { subject: 'React', A: 90, fullMark: 100 },
  { subject: '性能优化', A: 65, fullMark: 100 },
  { subject: '工程化', A: 75, fullMark: 100 },
  { subject: '浏览器原理', A: 80, fullMark: 100 },
];
```

---

## 职位匹配算法

### 匹配逻辑
```typescript
function matchJobs(
  userScores: Record<string, number>,
  jobs: Job[]
): MatchedJob[] {
  return jobs.map(job => {
    const requiredSkills = job.requiredSkills;
    let matchScore = 0;
    
    requiredSkills.forEach(skill => {
      if (userScores[skill.name]) {
        matchScore += (userScores[skill.name] / 100) * skill.weight;
      }
    });
    
    return {
      ...job,
      matchScore: Math.round(matchScore * 100),
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
```

---

## 增长策略

### 内容建设
- 邀请行业专家出题
- 参考大厂面试题
- 用户贡献优质题目

### 传播激励
- 分享解锁高级测试
- 邀请好友获得积分
- 排行榜展示

### 社区运营
- 段位挑战赛
- 月度能力大赛
- 高手分享经验

---

## 关键指标

| 指标 | 目标值 |
|------|--------|
| 月测试人数 | >15,000 |
| 平均完成率 | >70% |
| 分享率 | >35% |
| PK参与率 | >20% |
| 证书下载率 | >25% |

---

## 后续迭代

### Phase 2
- AI自适应题目难度
- 个性化学习路径
- 企业版能力认证

### Phase 3
- 面试模拟系统
- 能力趋势分析
- 技能差距报告

---

*文档版本：1.0*
*创建时间：2026-04-02*
