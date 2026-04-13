#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from datetime import datetime, timezone

title = "人形机器人整机集成与量产制造产业人才战略：当具身智能走出实验室时，系统集成、精密装配与供应链协同的人才竞赛与产业生态构建"

description = "深度剖析人形机器人整机集成与量产制造产业的人才竞争格局，聚焦系统集成、精密装配工艺、供应链协同与测试验证四大核心环节，揭示从实验室样机到规模化量产的关键人才缺口，并为企业构建面向人形机器人工业化的人才战略提供切实可行的指引。"

with open('article-246-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-246",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-246",
    "sourceCategory": "机器人与具身智能",
    "sourceLang": "zh-CN",
    "keywords": [
        "人形机器人",
        "整机集成",
        "量产制造",
        "精密装配",
        "供应链协同",
        "测试验证",
        "具身智能",
        "规模化生产",
        "制造工艺",
        "人才战略"
    ],
    "tags": [
        "人形机器人",
        "整机集成",
        "量产制造",
        "精密装配",
        "供应链协同",
        "测试验证",
        "具身智能",
        "人才战略"
    ],
    "metaDescription": "深度剖析人形机器人整机集成与量产制造产业的人才竞争格局，聚焦系统集成、精密装配工艺、供应链协同与测试验证四大核心环节，揭示从实验室到规模化量产的关键人才缺口与企业突围路径。"
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
chinese_chars = len([c for c in content if '\u4e00' <= c <= '\u9fff'])
print(f"SUCCESS: Appended {article['id']} with title: {title}")
print(f"Character count: {char_count}")
print(f"Chinese characters: {chinese_chars}")
print(f"Total articles: {len(data)}")
