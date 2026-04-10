# 博客内容生成任务

## 任务编号
TASK-001-blog-content-generation

## 任务目标
为 Jobsbor 招聘平台生成高质量的原创文章，丰富博客内容，提升SEO和平台专业性。

## 文章要求

### 文章编号
article-004

### 主题建议
雇主品牌建设与人才吸引策略：打造令人向往的企业雇主品牌

### 内容要求
1. **字数**：5000字以上
2. **语言**：中文
3. **风格**：专业、深入、实用
4. **结构**：
   - 引言：背景介绍和问题陈述
   - 多个章节，系统阐述主题
   - 结语：总结和展望

### SEO要求
- 包含关键词：雇主品牌、人才吸引、招聘策略、员工价值主张、雇主品牌建设
- 添加 metaDescription
- 包含10-15个标签(tags)和15-20个关键词(keywords)

### 数据源
- Jobsbor原创
- 作者：Jobsbor编辑部

## 输出格式

文章需要添加到 `src/data/blog-posts.json` 文件中，格式如下：

```json
{
  "id": "article-004",
  "title": "文章标题",
  "description": "文章描述",
  "content": "文章正文（Markdown格式）",
  "source": "Jobsbor原创",
  "author": "Jobsbor编辑部",
  "pubDate": "2026-04-10T12:00:00.000Z",
  "image": "",
  "link": "",
  "sourceCategory": "original",
  "sourceLang": "zh",
  "keywords": ["关键词1", "关键词2", ...],
  "tags": ["标签1", "标签2", ...],
  "metaDescription": "SEO描述"
}
```

## 当前进度

- [x] article-001: 2026年科技招聘趋势：远程工作、Web3与AI驱动的人才市场
- [x] article-002: 持续绩效管理与OKR实践：从年度考核到实时反馈的管理革命
- [x] article-003: AI招聘伦理与算法公平性：构建负责任的智能招聘体系
- [x] article-004: 雇主品牌建设与人才吸引策略：打造令人向往的企业雇主品牌（已完成，约7500字）
- [x] article-005: AI如何改变招聘流程和人才筛选：从人工筛选到智能决策的范式革命（已完成，约8500字）

## 提交要求

1. 生成文章后追加到 `src/data/blog-posts.json` 数组末尾
2. 保持JSON格式正确
3. git commit 并 push 到 main 分支
4. commit message 格式：`feat: Add article-004 - [文章标题]`
