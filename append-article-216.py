#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate and append article-216 to jobsbor blog-posts.json"""
import json
from datetime import datetime, timezone

title = "北斗导航与时空信息产业人才战略：当北斗系统进入全球化应用爆发期时，导航芯片、精密定位与时空信息服务的人才竞赛与产业生态构建"

description = "系统解构北斗三号全球组网完成后产业应用爆发期的人才版图重构，深入解析导航芯片与核心模组、高精度定位与增强服务、时空大数据平台、行业应用解决方案四大核心领域的人才需求特征与竞争态势，为企业布局北斗全球化人才战略提供系统性指南。"

with open('article-216-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-216",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-216",
    "sourceCategory": "北斗导航",
    "sourceLang": "zh-CN",
    "keywords": [
        "北斗导航",
        "时空信息",
        "卫星导航",
        "导航芯片",
        "高精度定位",
        "RTK",
        "PPP",
        "时空大数据",
        "位置服务",
        "北斗产业",
        "人才战略",
        "国产替代"
    ],
    "tags": [
        "北斗导航",
        "时空信息",
        "卫星导航",
        "导航芯片",
        "高精度定位",
        "时空大数据",
        "人才战略",
        "国产替代"
    ],
    "metaDescription": "系统解构北斗产业全球化应用爆发期的人才版图重构，深入解析导航芯片、高精度定位、时空大数据与行业应用四大核心领域的人才战略。"
}

# Load existing data
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-216 already exists
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
