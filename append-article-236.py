#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate and append article-236 to jobsbor blog-posts.json"""
import json
from datetime import datetime, timezone

title = "智能网联汽车信息安全产业人才战略：当软件定义汽车面临网络攻击时，车端安全架构、V2X通信加密与OTA防护的人才竞赛与产业生态构建"

description = "系统解构智能网联汽车信息安全产业的人才版图，深入分析车端安全架构、V2X通信安全、OTA升级安全、汽车云安全与供应链安全等核心领域的人才需求与供给困境，为企业构建智能汽车时代的信息安全人才战略提供系统性指南。"

with open('article-236-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-236",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-236",
    "sourceCategory": "智能网联汽车",
    "sourceLang": "zh-CN",
    "keywords": [
        "智能网联汽车",
        "汽车信息安全",
        "车端安全",
        "V2X通信安全",
        "OTA安全",
        "汽车云安全",
        "入侵检测系统",
        "密码学工程",
        "网络安全架构",
        "软件定义汽车",
        "UN R155",
        "数据安全",
        "人才战略"
    ],
    "tags": [
        "智能网联汽车",
        "汽车信息安全",
        "车端安全",
        "V2X通信",
        "OTA安全",
        "汽车云安全",
        "人才战略"
    ],
    "metaDescription": "系统解构智能网联汽车信息安全产业的人才版图，聚焦车端安全、V2X通信、OTA与汽车云安全，揭示软件定义汽车时代信息安全的人才瓶颈与企业突围之道。"
}

# Load existing data
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-236 already exists
existing_ids = {item['id'] for item in data}
if article['id'] in existing_ids:
    print(f"ERROR: {article['id']} already exists in blog-posts.json")
    exit(1)

# Append new article
data.append(article)

# Write back
with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

word_count = len(content)
print(f"SUCCESS: Appended {article['id']} with title: {title}")
print(f"Character count: {word_count}")
print(f"Total articles: {len(data)}")
