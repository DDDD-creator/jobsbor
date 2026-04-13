#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from datetime import datetime, timezone

title = "高带宽存储器与先进存储产业人才战略：当AI算力遭遇内存墙时，HBM堆叠、存储控制与存算一体的人才竞赛与产业生态构建"

description = "系统解构高带宽存储器（HBM）与先进存储产业的人才版图，聚焦HBM芯片设计、TSV先进封装、存储控制器、存算一体四大核心领域，揭示AI时代突破内存墙的人才瓶颈与企业突围之道。"

with open('article-239-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-239",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-239",
    "sourceCategory": "半导体与AI基础设施",
    "sourceLang": "zh-CN",
    "keywords": [
        "高带宽存储器",
        "HBM",
        "先进存储",
        "DRAM",
        "TSV",
        "先进封装",
        "存储控制器",
        "存算一体",
        "内存墙",
        "AI芯片",
        "2.5D封装",
        "混合键合",
        "人才战略"
    ],
    "tags": [
        "高带宽存储器",
        "HBM",
        "先进存储",
        "DRAM",
        "TSV",
        "先进封装",
        "存储控制器",
        "存算一体",
        "人才战略"
    ],
    "metaDescription": "系统解构HBM与先进存储产业的人才版图，聚焦HBM芯片设计、TSV先进封装、存储控制器与存算一体四大领域，揭示AI时代突破内存墙的人才瓶颈。"
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
