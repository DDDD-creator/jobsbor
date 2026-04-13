#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate and append article-230 to jobsbor blog-posts.json"""
import json
from datetime import datetime, timezone

title = "海洋牧场与蓝色粮仓产业人才战略：当深远海养殖成为粮食安全新支柱时，智能网箱、养殖工船与海洋生物工程的人才竞赛与产业生态构建"

description = "系统解构海洋牧场与蓝色粮仓产业的人才版图，深入分析深远海养殖装备、海洋生物育种、智能管控系统、水产营养饲料与海洋生态环保等核心领域的人才需求特征与竞争态势，为企业构建深远海养殖时代的人才战略提供系统性指南。"

with open('article-230-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-230",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-230",
    "sourceCategory": "海洋经济",
    "sourceLang": "zh-CN",
    "keywords": [
        "海洋牧场",
        "深远海养殖",
        "蓝色粮仓",
        "智能网箱",
        "养殖工船",
        "海洋生物育种",
        "水产养殖",
        "海洋工程",
        "智慧渔业",
        "粮食安全",
        "人才战略"
    ],
    "tags": [
        "海洋牧场",
        "深远海养殖",
        "蓝色粮仓",
        "智能网箱",
        "养殖工船",
        "人才战略",
        "海洋经济"
    ],
    "metaDescription": "系统解构海洋牧场与蓝色粮仓产业的人才版图，聚焦深远海养殖装备、海洋生物育种与智能管控系统，揭示蓝色粮仓建设中的人才瓶颈与企业突围之道。"
}

# Load existing data
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-230 already exists
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
