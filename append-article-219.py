#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate and append article-219 to jobsbor blog-posts.json"""
import json
from datetime import datetime, timezone

title = "柔性电子与智能穿戴产业人才战略：当电子设备像皮肤一样柔软时，有机半导体、印刷电子与生物信号传感的人才竞赛与产业生态构建"

description = "系统解构柔性电子与智能穿戴产业崛起背景下的人才版图重构，深入分析有机半导体、印刷电子、柔性传感器、生物信号采集与智能穿戴系统集成等核心领域的人才需求特征、能力壁垒与竞争态势，为企业布局柔性电子时代的人才战略提供系统性指南。"

with open('article-219-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-219",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-219",
    "sourceCategory": "柔性电子",
    "sourceLang": "zh-CN",
    "keywords": [
        "柔性电子",
        "智能穿戴",
        "有机半导体",
        "印刷电子",
        "柔性传感器",
        "生物信号采集",
        "电子皮肤",
        "智能织物",
        "可穿戴医疗",
        "人才战略"
    ],
    "tags": [
        "柔性电子",
        "智能穿戴",
        "有机半导体",
        "印刷电子",
        "柔性传感器",
        "生物信号采集",
        "可穿戴医疗",
        "人才战略",
        "智能织物"
    ],
    "metaDescription": "系统解构柔性电子与智能穿戴产业崛起背景下的人才版图重构，为企业布局柔性电子时代的人才战略提供系统性指南。"
}

# Load existing data
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-219 already exists
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
