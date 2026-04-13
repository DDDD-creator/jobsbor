#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from datetime import datetime, timezone

title = "智能网联汽车车路云一体化产业人才战略：当聪明的车遇见智慧的路时，路侧感知、V2X通信、云控平台与交通数字孪生的人才竞赛与产业生态构建"

description = "系统解构智能网联汽车车路云一体化产业的人才版图，聚焦路侧感知与边缘计算、V2X通信网络优化、云控平台与大数据治理、交通数字孪生与仿真测试四大核心领域，揭示系统智能时代的人才瓶颈与企业突围之道。"

with open('article-231-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-231",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-231",
    "sourceCategory": "智能网联汽车",
    "sourceLang": "zh-CN",
    "keywords": [
        "智能网联汽车",
        "车路云一体化",
        "V2X通信",
        "路侧感知",
        "云控平台",
        "交通数字孪生",
        "边缘计算",
        "车联网",
        "智慧交通",
        "自动驾驶",
        "高精地图",
        "仿真测试",
        "人才战略"
    ],
    "tags": [
        "智能网联汽车",
        "车路云一体化",
        "V2X通信",
        "路侧感知",
        "云控平台",
        "交通数字孪生",
        "智慧交通",
        "自动驾驶",
        "人才战略"
    ],
    "metaDescription": "系统解构智能网联汽车车路云一体化产业的人才版图，聚焦路侧感知、V2X通信、云控平台与交通数字孪生四大核心领域，揭示系统智能时代的人才瓶颈。"
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
