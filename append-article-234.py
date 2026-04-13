#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from datetime import datetime, timezone

title = "低空经济基础设施与空管系统产业人才战略：当城市上空成为新交通走廊时，低空智联网、通感一体化与数字空管的人才竞赛与产业生态构建"

description = "系统解构低空经济基础设施与空管系统产业的人才版图，聚焦低空智联网、5G-A通感一体化、数字空管平台、垂直起降场运营四大核心领域，揭示低空经济时代的人才瓶颈与企业突围之道。"

with open('article-234-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-234",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-234",
    "sourceCategory": "低空经济",
    "sourceLang": "zh-CN",
    "keywords": [
        "低空经济",
        "低空基础设施",
        "低空智联网",
        "通感一体化",
        "数字空管",
        "UTM",
        "垂直起降场",
        "Vertiport",
        "5G-A",
        "城市空中交通",
        "UAM",
        "空域管理",
        "人才战略"
    ],
    "tags": [
        "低空经济",
        "低空基础设施",
        "低空智联网",
        "通感一体化",
        "数字空管",
        "垂直起降场",
        "城市空中交通",
        "人才战略"
    ],
    "metaDescription": "系统解构低空经济基础设施与空管系统产业的人才版图，聚焦低空智联网、通感一体化、数字空管与垂直起降场四大领域，揭示低空经济时代的人才瓶颈与企业突围之道。"
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
