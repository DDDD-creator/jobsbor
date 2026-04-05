# JobHub Web3 风格重塑设计方案

## 一、设计概述

将传统的招聘网站升级为 **Web3/Cyberpunk 霓虹科技风格**，营造出高端、前沿、专业的视觉效果，契合金融+Web3+互联网的行业定位。

**设计风格参考：**
- Cyberpunk 2077 UI
- Raycast / Linear 现代工具风格
- Coinbase / Uniswap Web3 产品界面

---

## 二、颜色系统

### 2.1 深色背景系统
| Token | 色值 | 用途 |
|-------|------|------|
| `dark-500` | `#0a0a0f` | 主背景色 |
| `dark-300` | `#0f0f14` | 次级背景 |
| `dark-200` | `#12121a` | 卡片背景 |
| `dark-100` | `#15151c` | 悬浮背景 |

### 2.2 霓虹强调色
| Token | 色值 | 用途 |
|-------|------|------|
| `neon-cyan` | `#00d4ff` | 主强调色、按钮、链接 |
| `neon-purple` | `#a855f7` | 次强调色、Logo |
| `neon-pink` | `#ec4899` | 点缀色、互联网标签 |
| `neon-blue` | `#3b82f6` | 按钮渐变终点 |
| `neon-green` | `#10b981` | 薪资、成功状态 |

### 2.3 渐变预设
```css
--gradient-hero: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--gradient-neon: linear-gradient(90deg, #00d4ff, #a855f7, #ec4899)
--gradient-cyan-purple: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)
```

---

## 三、玻璃拟态 (Glassmorphism)

### 3.1 基础玻璃卡片
```css
.glass-card {
  background: rgba(18, 18, 26, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### 3.2 悬浮动效
```css
.glass-card-hover:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(168, 85, 247, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}
```

---

## 四、霓虹发光效果

### 4.1 文字发光
```css
.text-neon-cyan {
  color: #00d4ff;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}
```

### 4.2 盒子发光
```css
.shadow-neon-cyan {
  box-shadow: 
    0 0 20px rgba(0, 212, 255, 0.5), 
    0 0 40px rgba(0, 212, 255, 0.3);
}

.shadow-neon-purple {
  box-shadow: 
    0 0 20px rgba(168, 85, 247, 0.5), 
    0 0 40px rgba(168, 85, 247, 0.3);
}
```

---

## 五、动画效果

### 5.1 悬浮动画
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float { animation: float 6s ease-in-out infinite; }
```

### 5.2 发光脉冲
```css
@keyframes glow {
  0% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
  100% { box-shadow: 0 0 40px rgba(0, 212, 255, 0.6), 0 0 60px rgba(168, 85, 247, 0.4); }
}

.animate-glow { animation: glow 2s ease-in-out infinite alternate; }
```

### 5.3 渐变文字
```css
.text-gradient-neon {
  background: linear-gradient(90deg, #00d4ff, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 六、组件样式规范

### 6.1 导航栏 (Header)
- 固定定位，滚动后显示玻璃背景
- Logo 使用渐变背景 + 发光效果
- 链接悬浮时显示霓虹下划线
- 按钮使用青色渐变 + 发光悬浮效果

### 6.2 职位卡片 (JobCard)
- 玻璃拟态背景
- 悬浮时显示紫色光晕 + 上浮动效
- 薪资使用霓虹绿色
- 标签使用对应霓虹色的半透明边框

### 6.3 行业入口卡片
- 每个行业对应不同霓虹色渐变
- 图标容器带发光效果
- 悬浮时显示对应颜色的阴影

### 6.4 底部 (Footer)
- 深色背景 + 网格装饰
- 社交图标悬浮时显示紫色发光
- 链接悬浮时变为青色

---

## 七、响应式断点

| 断点 | 宽度 | 调整 |
|------|------|------|
| Mobile | < 640px | 单列布局，简化动画 |
| Tablet | 640px - 1024px | 两列网格 |
| Desktop | > 1024px | 三列网格，完整动效 |

---

## 八、已修改文件清单

| 文件 | 变更内容 |
|------|----------|
| `tailwind.config.ts` | 添加 Web3 颜色系统、阴影、动画配置 |
| `globals.css` | 添加玻璃拟态、霓虹效果 CSS 组件 |
| `Header.tsx` | 玻璃导航、霓虹Logo、发光按钮 |
| `Footer.tsx` | 深色玻璃背景、网格装饰、发光社交图标 |
| `JobCard.tsx` | 玻璃卡片、霓虹标签、悬浮光晕 |
| `page.tsx` | 霓虹Hero、渐变文字、动态背景、统计数据卡片 |

---

## 九、视觉效果预览

### Hero区域
- 深空黑背景 + 紫色/青色光晕
- 浮动几何装饰元素
- 渐变霓虹标题文字
- 玻璃搜索框 + 发光聚焦效果

### 职位卡片
- 半透明玻璃背景
- 悬浮时紫色光晕扩散
- 霓虹色行业标签
- 发光薪资数字

### 整体氛围
- 沉浸式的深色体验
- 科技感的霓虹点缀
- 流畅的悬浮动效
- 专业而不失活力

---

## 十、后续优化建议

1. **暗/亮模式切换** - 添加主题切换按钮
2. **粒子动画** - 使用 canvas 添加背景粒子效果
3. **滚动视差** - 为不同区块添加视差滚动
4. **加载动画** - 添加骨架屏和加载动画
5. **音效反馈** - 为交互添加 subtle 的音效（可选）

---

*设计方案完成于 2026-04-02*
