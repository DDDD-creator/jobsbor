import re

# 读取文件
with open('/root/.openclaw/workspace/jobsbor/kimi-tasks/TASK-001-blog-content-generation.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 更新状态
content = content.replace(
    '## 当前状态\n⏳ **任务持续进行中** - 已完成 246 篇博客文章，正在按计划持续扩展内容库',
    '## 当前状态\n⏳ **任务持续进行中** - 已完成 247 篇博客文章，正在按计划持续扩展内容库'
)

# 在article-246后面添加article-247
content = content.replace(
    '- [x] article-246: 低空经济与eVTOL产业人才战略：当城市上空成为新交通网络时，飞行器总体设计、飞控系统与空域管理的人才竞赛与产业生态构建（已完成，约9400字）',
    '- [x] article-246: 低空经济与eVTOL产业人才战略：当城市上空成为新交通网络时，飞行器总体设计、飞控系统与空域管理的人才竞赛与产业生态构建（已完成，约9400字）\n- [x] article-247: 卫星互联网与低轨星座产业人才战略：当星辰大海遇见万物互联时，星座组网、星地融合与终端生态的人才竞赛与产业生态构建（已完成，约9000字）'
)

# 在提交记录部分添加新记录
content = content.replace(
    '2026-04-13 - article-246 已成功生成并推送至 main分支\n\n## 完成时间',
    '2026-04-13 - article-246 已成功生成并推送至 main分支\n2026-04-13 - article-247 已成功生成并推送至 main分支\n\n## 完成时间'
)

# 写回文件
with open('/root/.openclaw/workspace/jobsbor/kimi-tasks/TASK-001-blog-content-generation.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 任务文件已更新")
