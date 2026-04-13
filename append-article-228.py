#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate and append article-228 to jobsbor blog-posts.json"""
import json
from datetime import datetime, timezone

title = "动力电池与储能系统产业人才战略：当新能源革命进入储能时代时，锂离子电池、钠离子电池与液流电池的人才竞赛与产业生态构建"

description = "系统解构动力电池与储能系统产业的人才版图，深入分析锂离子电池、钠离子电池、液流电池与储能系统集成四大核心技术领域的人才需求特征、能力壁垒与竞争态势，为企业构建面向储能时代的人才战略提供系统性指南。"

with open('article-228-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-228",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-228",
    "sourceCategory": "新能源",
    "sourceLang": "zh-CN",
    "keywords": [
        "动力电池",
        "储能系统",
        "锂离子电池",
        "钠离子电池",
        "液流电池",
        "新能源",
        "新型储能",
        "电池管理系统",
        "电力储能",
        "新能源汽车",
        "人才战略",
        "电化学"
    ],
    "tags": [
        "动力电池",
        "储能系统",
        "锂离子电池",
        "钠离子电池",
        "液流电池",
        "新能源",
        "人才战略"
    ],
    "metaDescription": "系统解构动力电池与储能系统产业的人才版图，聚焦锂离子电池、钠离子电池、液流电池与储能系统集成四大核心领域，揭示储能时代的人才瓶颈与企业突围之道。"
}

# Load existing data
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-228 already exists
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
