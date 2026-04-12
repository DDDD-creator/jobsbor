#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate and append article-217 to jobsbor blog-posts.json"""
import json
from datetime import datetime, timezone

title = "科学智能（AI for Science）产业人才战略：当人工智能重塑科学研究范式时，科学大模型、计算化学与跨学科计算的人才竞赛与产业生态构建"

description = "系统解构科学智能（AI4S）产业崛起背景下的人才版图重构，深入分析科学大模型、计算化学、材料计算、生命科学计算、工程仿真等核心领域的人才需求特征与竞争态势，为企业构建面向智能科学时代的人才战略提供系统性指南。"

with open('article-217-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-217",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-217",
    "sourceCategory": "科学智能",
    "sourceLang": "zh-CN",
    "keywords": [
        "AI for Science",
        "科学智能",
        "科学大模型",
        "计算化学",
        "分子模拟",
        "材料计算",
        "AI制药",
        "跨学科人才",
        "人工智能",
        "科研范式变革",
        "人才战略"
    ],
    "tags": [
        "AI for Science",
        "科学智能",
        "科学大模型",
        "计算化学",
        "AI制药",
        "跨学科人才",
        "人才战略"
    ],
    "metaDescription": "系统解构科学智能产业崛起背景下的人才版图重构，深入分析科学大模型、计算化学、材料计算等核心领域的人才战略。"
}

# Load existing data
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-217 already exists
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
