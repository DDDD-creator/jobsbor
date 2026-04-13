#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from datetime import datetime, timezone

title = "具身智能数据引擎与机器人训练场产业人才战略：当物理世界成为AI的数据矿场时，遥操作数据采集、动作捕捉工场与Sim2Real迁移学习的人才竞赛与产业生态构建"

description = "系统解构具身智能数据引擎与机器人训练场产业的人才版图，深入分析遥操作数据采集、动作捕捉工场、Sim2Real迁移学习三大核心领域的人才需求、能力模型与获取策略，揭示物理智能时代的数据瓶颈与人才突围之道，并为正在布局这一战略赛道的企业提供可执行的人才战略指引。"

with open('article-243-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-243",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-243",
    "sourceCategory": "具身智能",
    "sourceLang": "zh-CN",
    "keywords": [
        "具身智能",
        "数据引擎",
        "机器人训练场",
        "遥操作",
        "动作捕捉",
        "Sim2Real",
        "迁移学习",
        "物理智能",
        "人机交互",
        "机器人数据",
        "人才战略"
    ],
    "tags": [
        "具身智能",
        "数据引擎",
        "机器人训练场",
        "遥操作",
        "动作捕捉",
        "Sim2Real",
        "迁移学习",
        "人才战略"
    ],
    "metaDescription": "系统解构具身智能数据引擎与机器人训练场产业的人才版图，深入分析遥操作数据采集、动作捕捉工场、Sim2Real迁移学习三大核心领域的人才需求与能力模型。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

existing_ids = {item['id'] for item in data}
if article['id'] in existing_ids:
    print(f"ERROR: {article['id']} already exists in blog-posts.json")
    exit(1)

data.append(article)

with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

char_count = len(content)
print(f"SUCCESS: Appended {article['id']} with title: {title}")
print(f"Character count: {char_count}")
print(f"Total articles: {len(data)}")
