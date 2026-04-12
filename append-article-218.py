#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate and append article-218 to jobsbor blog-posts.json"""
import json
from datetime import datetime, timezone

title = "太空资源开发与地外制造人才战略：当月球采矿与火星基建从科幻走进现实时，原位资源利用、深空制造与地外建筑的人才竞赛与产业生态构建"

description = "系统解构太空资源开发与地外制造产业崛起背景下的人才版图重构，深入分析月球与小行星资源勘探、原位资源利用、太空增材制造、地外建筑与深空物流等核心领域的人才需求特征、能力壁垒与竞争态势，为企业布局星际时代的人才战略提供系统性指南。"

with open('article-218-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-218",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-218",
    "sourceCategory": "太空经济",
    "sourceLang": "zh-CN",
    "keywords": [
        "太空资源开发",
        "地外制造",
        "原位资源利用",
        "ISRU",
        "月球采矿",
        "火星基建",
        "太空3D打印",
        "深空物流",
        "星际建筑",
        "太空经济",
        "人才战略"
    ],
    "tags": [
        "太空资源开发",
        "地外制造",
        "原位资源利用",
        "月球采矿",
        "火星基建",
        "太空3D打印",
        "星际建筑",
        "人才战略",
        "太空经济"
    ],
    "metaDescription": "系统解构太空资源开发与地外制造产业崛起背景下的人才版图重构，为企业布局星际时代的人才战略提供系统性指南。"
}

# Load existing data
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-218 already exists
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
