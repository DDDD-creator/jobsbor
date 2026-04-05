# Web3 UI 组件文档

## 概述

Jobsbor招聘网站现已升级为Web3风格设计系统，包含以下特性：

- 🌙 深色主题背景
- ✨ 霓虹发光效果
- 💎 玻璃拟态卡片
- 🎨 渐变文字和边框
- 🎬 流畅动画效果

## 组件列表

### 1. Button 按钮组件

```tsx
import { Button } from '@/components/ui/button'

// 主要按钮 - 青色渐变发光
<Button variant="primary">主要按钮</Button>

// 次要按钮 - 紫色渐变发光
<Button variant="secondary">次要按钮</Button>

// 轮廓按钮 - 霓虹边框
<Button variant="outline">轮廓按钮</Button>

// 幽灵按钮 - 玻璃拟态
<Button variant="ghost">幽灵按钮</Button>

// 霓虹按钮 - 强烈发光
<Button variant="neon">霓虹按钮</Button>

// 渐变按钮 - 多彩渐变
<Button variant="gradient">渐变按钮</Button>

// 自定义发光颜色
<Button variant="glow" glowColor="purple">紫色发光</Button>

// 尺寸变体
<Button size="sm">小按钮</Button>
<Button size="md">中按钮（默认）</Button>
<Button size="lg">大按钮</Button>
<Button size="icon">图标按钮</Button>
```

### 2. Card 卡片组件

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

// 默认暗色卡片
<Card>内容</Card>

// 玻璃拟态卡片
<Card variant="glass">内容</Card>

// 霓虹边框卡片
<Card variant="neon" glowColor="cyan">内容</Card>
<Card variant="neon" glowColor="purple">内容</Card>

// 发光卡片
<Card variant="glow" glowColor="pink">内容</Card>

// 完整使用示例
<Card variant="glass" className="group">
  <CardHeader>
    <CardTitle>职位标题</CardTitle>
    <CardDescription>职位描述</CardDescription>
  </CardHeader>
  <CardContent>内容</CardContent>
  <CardFooter>底部</CardFooter>
</Card>
```

### 3. Input 输入框组件

```tsx
import { Input, SearchInput, LabeledInput } from '@/components/ui/input'

// 默认暗色输入框
<Input placeholder="请输入..." />

// 霓虹边框输入框
<Input variant="neon" placeholder="霓虹输入框" />

// 玻璃拟态输入框
<Input variant="glass" placeholder="玻璃输入框" />

// 不同发光颜色
<Input variant="neon" glowColor="purple" />
<Input variant="neon" glowColor="pink" />

// 带图标
<Input leftIcon={<SearchIcon />} placeholder="搜索..." />
<Input rightIcon={<EyeIcon />} type="password" />

// 搜索输入框
<SearchInput 
  placeholder="搜索职位..." 
  onSearch={(value) => console.log(value)} 
/>

// 带标签的输入框
<LabeledInput 
  label="邮箱" 
  placeholder="输入邮箱" 
  helperText="我们将使用此邮箱联系您"
/>
```

### 4. Badge 标签组件

```tsx
import { Badge, StatusBadge, SkillBadge } from '@/components/ui/badge'

// 默认标签
<Badge>默认</Badge>

// 霓虹标签
<Badge variant="neon" color="cyan">青色霓虹</Badge>
<Badge variant="neon" color="purple">紫色霓虹</Badge>
<Badge variant="neon" color="pink">粉色霓虹</Badge>

// 渐变标签
<Badge variant="gradient">渐变</Badge>

// 发光标签
<Badge variant="glow" color="green">发光</Badge>

// 带状态指示点
<Badge variant="neon" color="green" dot>在线</Badge>

// 状态标签
<StatusBadge status="online" />
<StatusBadge status="busy" />
<StatusBadge status="offline" />

// 技能标签
<SkillBadge level="expert">专家</SkillBadge>
<SkillBadge level="advanced">高级</SkillBadge>
```

### 5. JobCard 职位卡片组件

```tsx
import { JobCard, JobCardSkeleton } from '@/components/jobs/JobCard'

// 默认职位卡片
<JobCard job={job} />

// 精选职位卡片
<JobCard job={job} variant="featured" />

// 紧凑版
<JobCard job={job} variant="compact" />

// 带交错动画索引
<JobCard job={job} index={0} />
<JobCard job={job} index={1} />

// 骨架屏
<JobCardSkeleton />
```

### 6. 动画工具函数

```tsx
import { 
  useEnterAnimation, 
  useStaggeredAnimation,
  ScrollReveal,
  NeonGlow,
  FloatingContainer 
} from '@/lib/animations'

// 进入动画钩子
function MyComponent() {
  const { ref, isVisible } = useEnterAnimation(200)
  return <div ref={ref} className={isVisible ? 'opacity-100' : 'opacity-0'}>内容</div>
}

// 交错动画
function ListComponent() {
  const { containerRef, visibleItems } = useStaggeredAnimation(5)
  return (
    <div ref={containerRef}>
      {items.map((item, i) => (
        <div key={i} className={visibleItems.has(i) ? 'opacity-100' : 'opacity-0'}>
          {item}
        </div>
      ))}
    </div>
  )
}

// 滚动显示组件
<ScrollReveal>
  <Card>内容</Card>
</ScrollReveal>

// 带方向和延迟
<ScrollReveal direction="left" delay={300}>
  <Card>从左侧进入</Card>
</ScrollReveal>

<ScrollReveal direction="scale" delay={500}>
  <Card>缩放进入</Card>
</ScrollReveal>

// 霓虹发光包装器
<NeonGlow glowColor="rgba(168, 85, 247, 0.5)" glowIntensity="lg">
  <div>发光内容</div>
</NeonGlow>

// 浮动容器
<FloatingContainer amplitude={15} duration={4}>
  <div>浮动内容</div>
</FloatingContainer>
```

## CSS 工具类

### 动画类

```css
/* 浮动动画 */
.animate-float

/* 脉冲发光 */
.animate-pulse-glow

/* 霓虹闪烁 */
.animate-neon-flicker

/* 渐变移动 */
.animate-gradient-shift

/* 闪光效果 */
.animate-shimmer

/* 慢速旋转 */
.animate-rotate-slow
```

### 玻璃拟态

```css
/* 玻璃效果 */
.glass
.glass-dark
```

### 霓虹文字

```css
/* 霓虹文字效果 */
.neon-text
.neon-text-cyan
.neon-text-purple
```

### 渐变文字

```css
/* 渐变文字 */
.gradient-text
.gradient-text-cyan-purple
```

### 背景效果

```css
/* 网格背景 */
.bg-grid

/* 点阵背景 */
.bg-dots
```

## 颜色系统

### 霓虹色

- `cyan` - 青色 (#06b6d4)
- `purple` - 紫色 (#a855f7)
- `pink` - 粉色 (#ec4899)
- `green` - 绿色 (#22c55e)
- `orange` - 橙色 (#f97316)
- `yellow` - 黄色 (#eab308)
- `red` - 红色 (#ef4444)
- `blue` - 蓝色 (#3b82f6)

### 深色背景

- 主背景: `#0a0f1c`
- 卡片背景: `rgba(0, 0, 0, 0.3)`
- 边框: `rgba(255, 255, 255, 0.1)`

## 最佳实践

1. **使用 ScrollReveal 包裹主要区块** - 实现滚动触发动画
2. **职位卡片使用交错索引** - 创建优雅的入场效果
3. **按钮使用发光变体** - 强调CTA操作
4. **卡片使用玻璃拟态** - 创建层次感
5. **霓虹色适度使用** - 避免过度炫目

## 示例页面

```tsx
export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      <!-- 背景装饰 -->
      <div className="absolute inset-0 bg-grid" />
      
      <ScrollReveal>
        <Card variant="glass" className="m-8 p-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Web3风格标题
          </h1>
          
          <div className="flex gap-4">
            <Button variant="gradient">开始探索</Button>
            <Button variant="outline">了解更多</Button>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  )
}
```
