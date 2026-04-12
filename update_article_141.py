#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import datetime

# Read the article content
with open('article-141-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Build the article entry
article = {
    "id": "article-141",
    "title": "人形机器人产业人才战略：当硅基助手走进工厂与家庭时，运动控制、灵巧操作与具身智能的人才竞赛与产业生态构建",
    "description": "深度解析人形机器人从技术原型到量产落地的关键阶段，运动控制、灵巧手、多模态感知、具身智能大脑等核心技术领域的人才需求格局，系统梳理全球人形机器人产业的人才竞争态势，为企业提供抢占人形机器人高地的人才战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T12:20:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "人形机器人",
        "具身智能",
        "运动控制",
        "灵巧操作",
        "多模态感知",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "产业生态",
        "人才缺口",
        "HR战略",
        "跨学科人才",
        "未来工作",
        "雇主品牌",
        "双足行走",
        "机器人大脑"
    ],
    "tags": [
        "人形机器人",
        "具身智能",
        "科技招聘",
        "人才战略",
        "前沿技术",
        "产教融合",
        "人才缺口",
        "未来工作",
        "HR战略",
        "组织变革"
    ],
    "metaDescription": "深度解析人形机器人产业核心技术领域的人才需求格局，系统梳理全球竞争态势，为企业提供抢占人形机器人高地的人才战略指南。"
}

# Load existing blog posts
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-141 already exists
existing_ids = [a['id'] for a in data]
if article['id'] in existing_ids:
    print(f"{article['id']} already exists, replacing it.")
    for i, a in enumerate(data):
        if a['id'] == article['id']:
            data[i] = article
            break
else:
    data.append(article)

# Write back
with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated blog-posts.json. Total articles: {len(data)}")

# Update task file
with open('kimi-tasks/TASK-001-blog-content-generation.md', 'r', encoding='utf-8') as f:
    task_text = f.read()

# Add the new article to the progress list
progress_entry = "- [x] article-141: 人形机器人产业人才战略：当硅基助手走进工厂与家庭时，运动控制、灵巧操作与具身智能的人才竞赛与产业生态构建"

# Find the completion section and add the new entry
lines = task_text.split('\n')
# Insert before "## 完成时间" or at an appropriate place
inserted = False
new_lines = []
for i, line in enumerate(lines):
    if line.startswith("## 完成时间") and not inserted:
        new_lines.append(progress_entry)
        new_lines.append("")
        inserted = True
    new_lines.append(line)

# Add completion log at the top of the completion time section
for i, line in enumerate(new_lines):
    if line.startswith("## 完成时间"):
        new_lines.insert(i+1, f"2026-04-12 - article-141 已成功生成并推送至 main分支")
        break

task_text = '\n'.join(new_lines)

with open('kimi-tasks/TASK-001-blog-content-generation.md', 'w', encoding='utf-8') as f:
    f.write(task_text)

print("Updated task file.")
