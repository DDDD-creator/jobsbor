import re

# 读取任务文件
with open('kimi-tasks/TASK-001-blog-content-generation.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 替换article-339的状态
old_text = "- article-339: 待定主题 (建议: 智能客服产业人才战略 或 工业元宇宙人才战略)"
new_text = """- article-339: 工业元宇宙产业人才战略 - 已完成 (2026-04-15)

标题: 工业元宇宙产业人才战略：当制造业进入虚实共生时代时，数字孪生、XR交互与区块链确权的人才竞赛与生态构建

- 字数: 约 11,000+ 中文字符（5000+中文字）

- 内容覆盖: 数字孪生架构、XR交互技术、区块链确权、AI与生成式AI、工业元宇宙解决方案、工业设计师等核心领域

- 文章结构: 引言、产业全景、核心领域人才需求、能力模型重构、人才培养体系、人才竞争策略、政策支持、未来展望、结语

- 发布时间: 2026-04-15

- 内容摘要: 深度解析工业元宇宙产业的人才战略图景，系统阐述数字孪生构建、XR交互设计、区块链确权、AI驱动仿真等核心领域的人才需求特征与培养路径，揭示这场虚实共生革命中的人才竞赛与生态构建之道。

- article-340: 待定主题 (建议: 智能客服产业人才战略 或 碳中和产业人才战略)"""

if old_text in content:
    content = content.replace(old_text, new_text)
    print("✅ 成功更新 article-339 进度")
else:
    print("⚠️ 未找到需要替换的文本")

# 更新总文章数
content = content.replace("✅ 任务持续进行中 - 已完成 338 篇博客文章", "✅ 任务持续进行中 - 已完成 339 篇博客文章")

# 写回文件
with open('kimi-tasks/TASK-001-blog-content-generation.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 任务文件更新完成")
