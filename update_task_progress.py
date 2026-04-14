#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
更新任务文件进度
"""

# 读取任务文件
with open('/tmp/jobsbor/kimi-tasks/TASK-001-blog-content-generation.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 替换 article-335 的状态
old_text = "- article-335: 待定主题 (建议: Web3/区块链产业人才战略 或 生物科技产业人才战略)"
new_text = """- article-335: Web3与区块链产业人才战略 - 已完成 (2026-04-14)

标题: Web3与区块链产业人才战略：当价值互联网重塑世界时，智能合约、DeFi与数字身份的人才竞赛与生态构建

- 字数: 约 15,000+ 中文字符（5000+中文字）

- 内容覆盖: 智能合约开发、DeFi协议设计、区块链基础设施、零知识证明、加密经济学、Web3安全、DAO治理、数字身份等核心领域

- 文章结构: 引言、产业全景、核心领域人才需求、能力模型重构、人才培养体系、人才竞争策略、政策支持、未来展望、结语

- 发布时间: 2026-04-14

- 内容摘要: 深度解析Web3与区块链产业的人才战略图景，系统阐述智能合约开发、DeFi协议设计、区块链基础设施、加密安全、DAO治理等核心领域的人才需求特征与培养路径，揭示这场价值互联网革命中的人才竞赛与生态构建之道。

- article-336: 待定主题 (建议: 生物科技产业人才战略 或 合成数据产业人才战略)"""

content = content.replace(old_text, new_text)

# 保存更新后的文件
with open('/tmp/jobsbor/kimi-tasks/TASK-001-blog-content-generation.md', 'w', encoding='utf-8') as f:
    f.write(content)

print("任务文件已更新")
print("article-335 进度已标记为已完成")
