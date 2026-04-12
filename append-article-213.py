#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate and append article-213 to jobsbor blog-posts.json"""
import json
from datetime import datetime, timezone

title = "车规级芯片与汽车电子产业人才战略：当汽车智能化遇上缺芯潮时，MCU、功率半导体、传感器与域控制器的人才竞赛与产业生态构建"

description = "系统解构汽车智能化浪潮下车规级芯片与汽车电子产业的人才版图重构，深入解析MCU、功率半导体、车载传感器、域控制器、车规级SoC与汽车电子架构五大核心领域的人才需求特征、能力壁垒与竞争态势，为企业布局智能汽车芯片时代的人才战略提供系统性指南。"

with open('article-213-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-213",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-213",
    "sourceCategory": "汽车半导体",
    "sourceLang": "zh-CN",
    "keywords": [
        "车规级芯片",
        "汽车电子",
        "MCU",
        "功率半导体",
        "IGBT",
        "碳化硅",
        "域控制器",
        "自动驾驶芯片",
        "车载传感器",
        "汽车半导体",
        "人才战略",
        "国产替代"
    ],
    "tags": [
        "车规级芯片",
        "汽车电子",
        "MCU",
        "功率半导体",
        "域控制器",
        "自动驾驶",
        "人才战略",
        "国产替代"
    ],
    "metaDescription": "系统解构汽车智能化浪潮下车规级芯片与汽车电子产业的人才版图重构，深入解析MCU、功率半导体、传感器、域控制器与汽车电子架构五大核心领域的人才战略。"
}

# Load existing data
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-213 already exists
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
