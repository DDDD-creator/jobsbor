#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from datetime import datetime, timezone

title = "智能座舱与汽车人机交互产业人才战略：当汽车成为移动智能终端时，座舱域控制器、多模态交互与整车软件架构的人才竞赛与产业生态构建"

description = "系统解构智能座舱与汽车人机交互产业的人才版图，聚焦座舱域控制器、多模态交互、整车SOA架构与车载操作系统四大核心领域，揭示软件定义汽车时代座舱智能化的人才瓶颈与企业突围之道。"

with open('article-240-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-240",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-240",
    "sourceCategory": "智能汽车与座舱",
    "sourceLang": "zh-CN",
    "keywords": [
        "智能座舱",
        "人机交互",
        "座舱域控制器",
        "多模态交互",
        "整车SOA架构",
        "车载操作系统",
        "软件定义汽车",
        "语音交互",
        "DMS",
        "BSP",
        "人才战略"
    ],
    "tags": [
        "智能座舱",
        "人机交互",
        "座舱域控制器",
        "多模态交互",
        "整车SOA架构",
        "车载操作系统",
        "人才战略"
    ],
    "metaDescription": "系统解构智能座舱与汽车人机交互产业的人才版图，聚焦座舱域控、多模态交互、SOA架构与车载操作系统四大领域，揭示软件定义汽车时代座舱智能化的人才瓶颈。"
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
