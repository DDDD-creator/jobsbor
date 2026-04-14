#!/usr/bin/env python3
import json
import os
from datetime import datetime

# 读取现有 blog-posts.json
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# 读取新生成的文章内容
with open('article-309-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 创建新文章对象
new_post = {
    "id": "article-309",
    "title": "低空经济与eVTOL产业人才战略：当飞行汽车驶入城市天际线时，航空工程、空中交通管理与智能飞控的人才竞赛与产业生态构建",
    "description": "深度解析低空经济与eVTOL产业的人才战略图景，系统阐述飞行器设计、电动推进系统、飞控与导航、空中交通管理等关键领域的人才需求特征与培养路径，揭示低空经济革命中的人才竞争格局，为布局这一新兴产业的企业提供战略指引。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "低空经济",
        "eVTOL",
        "城市空中交通",
        "电动航空",
        "飞行汽车",
        "航空人才",
        "智能飞控",
        "空中交通管理"
    ],
    "tags": [
        "低空经济",
        "eVTOL",
        "城市空中交通",
        "电动航空",
        "航空人才",
        "智能飞控",
        "产业人才战略"
    ],
    "metaDescription": "深度解析低空经济与eVTOL产业的人才战略图景，系统阐述飞行器设计、电动推进系统、飞控与导航、空中交通管理等关键领域的人才需求特征与培养路径。"
}

# 追加新文章
posts.append(new_post)

# 保存更新后的 blog-posts.json
with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f"✅ 成功追加 article-309 到 blog-posts.json")
print(f"   标题: {new_post['title']}")
print(f"   字数: {len(content)} 字符")
print(f"   当前文章总数: {len(posts)}")
