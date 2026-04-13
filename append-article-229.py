#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate and append article-229 to jobsbor blog-posts.json"""
import json
from datetime import datetime, timezone

title = "钙钛矿太阳能电池与下一代光伏技术产业人才战略：当光伏产业进入技术迭代期时，钙钛矿叠层电池、透明光伏与高效率组件的人才竞赛与产业生态构建"

description = "系统解构钙钛矿太阳能电池与下一代光伏技术产业的人才版图，深入分析钙钛矿材料与器件、叠层电池、透明光伏、组件封装与量产工艺等核心领域的人才需求特征、能力壁垒与竞争态势，为企业构建面向下一代光伏时代的人才战略提供系统性指南。"

with open('article-229-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-229",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-229",
    "sourceCategory": "新能源",
    "sourceLang": "zh-CN",
    "keywords": [
        "钙钛矿电池",
        "光伏技术",
        "叠层电池",
        "新能源",
        "太阳能电池",
        "透明光伏",
        "光伏组件",
        "薄膜电池",
        "清洁能源",
        "新材料",
        "人才战略",
        "光电转换"
    ],
    "tags": [
        "钙钛矿电池",
        "光伏技术",
        "叠层电池",
        "新能源",
        "透明光伏",
        "人才战略",
        "清洁能源"
    ],
    "metaDescription": "系统解构钙钛矿太阳能电池与下一代光伏技术产业的人才版图，聚焦钙钛矿叠层电池、透明光伏与高效率组件，揭示光伏技术迭代期的人才瓶颈与企业突围之道。"
}

# Load existing data
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-229 already exists
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
