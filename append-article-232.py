#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from datetime import datetime, timezone

title = "智能计算中心与算力网络产业人才战略：当AI算力成为数字经济核心底座时，智算集群、算网调度与绿色数据中心的人才竞赛与产业生态构建"

description = "系统解构智能计算中心与算力网络产业的人才版图，聚焦智算集群架构、算网调度编排、绿色数据中心与液冷技术、大模型训练系统工程四大核心领域，揭示算力经济时代的人才瓶颈与企业突围之道。"

with open('article-232-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-232",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-232",
    "sourceCategory": "人工智能基础设施",
    "sourceLang": "zh-CN",
    "keywords": [
        "智能计算中心",
        "算力网络",
        "智算集群",
        "算网调度",
        "绿色数据中心",
        "液冷技术",
        "大模型训练",
        "GPU集群",
        "分布式训练",
        "东数西算",
        "高性能计算",
        "AI加速器",
        "人才战略"
    ],
    "tags": [
        "智能计算中心",
        "算力网络",
        "智算集群",
        "算网调度",
        "绿色数据中心",
        "液冷技术",
        "大模型训练",
        "人才战略"
    ],
    "metaDescription": "系统解构智能计算中心与算力网络产业的人才版图，聚焦智算集群、算网调度、绿色数据中心与大模型训练系统四大领域，揭示算力经济时代的人才瓶颈。"
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