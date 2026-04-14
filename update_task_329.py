import re

# 读取任务文件
with open('/root/.openclaw/workspace/jobsbor-task/kimi-tasks/TASK-001-blog-content-generation.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 更新当前状态
content = content.replace(
    '✅ **任务持续进行中** - 已完成 328 篇博客文章，正在按计划持续扩展内容库',
    '✅ **任务持续进行中** - 已完成 329 篇博客文章，正在按计划持续扩展内容库'
)

# 在当前进度部分添加 article-329
content = content.replace(
    '- [x] article-328: 生物制造产业人才战略 - **已完成** (2026-04-14)\n\n## 最新完成文章',
    '''- [x] article-328: 生物制造产业人才战略 - **已完成** (2026-04-14)
- [x] article-329: 6G通信产业人才战略 - **已完成** (2026-04-14)

## 最新完成文章'''
)

# 更新最新完成文章部分
old_latest = '''## 最新完成文章

- [x] article-328: 生物制造产业人才战略 - **已完成** (2026-04-14)'''

new_latest = '''## 最新完成文章

- [x] article-329: 6G通信产业人才战略 - **已完成** (2026-04-14)
  - 标题: 6G通信产业人才战略：当万物智联成为现实时，太赫兹通信、空天地一体化与智能超表面的人才竞赛与生态构建
  - 字数: 约 9,800+ 中文字符（5000+中文字）
  - 内容覆盖: 太赫兹通信、智能超表面(RIS)、空天地一体化网络、AI原生通信、通信感知一体化、6G标准化等核心领域
  - 文章结构: 引言、产业全景、核心领域人才需求、能力模型重构、人才培养体系、人才竞争策略、政策支持、未来展望、结语

### article-328: 生物制造产业人才战略
- **标题**: 生物制造产业人才战略：当细胞成为工厂时，合成生物学、生物材料与绿色制造的人才竞赛与生态构建
- **字数**: 约 10,800+ 中文字符（5000+中文字）
- **发布时间**: 2026-04-14
- **内容摘要**: 深度解析生物制造产业的人才战略图景，系统阐述合成生物学、生物工艺、生物信息学等核心领域的人才需求特征与培养路径。'''

content = content.replace(old_latest, new_latest)

# 更新完成时间和下一步计划
content = content.replace(
    '2026-04-14 - article-328 已成功生成并推送至 main分支\n\n## 下一步计划\n- article-329: 待定主题 (建议: 6G通信产业人才战略 或 具身智能产业人才战略)',
    '2026-04-14 - article-329 已成功生成并推送至 main分支\n\n## 下一步计划\n- article-330: 待定主题 (建议: 具身智能产业人才战略 或 智能网联汽车产业人才战略)'
)

# 写回文件
with open('/root/.openclaw/workspace/jobsbor-task/kimi-tasks/TASK-001-blog-content-generation.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 任务文件已更新")
print("📊 当前文章总数: 329")
