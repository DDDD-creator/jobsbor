import json
from datetime import datetime, timezone

title = "卫星互联网终端与手机直连卫星产业人才战略：当万物互联伸向太空时，相控阵终端芯片、低轨星座运控与天地融合通信的人才竞赛与产业生态构建"
description = "系统解构卫星互联网终端与手机直连卫星产业的人才版图，深入分析相控阵终端芯片、低轨星座运控、天地融合通信、终端系统集成与应用生态等核心领域的人才需求与供给困境，为企业构建太空互联网时代的人才战略提供系统性指南。"

with open('article-238-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

pub_date = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

article = {
    "id": "article-238",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor研究院",
    "author": "Jobsbor研究院",
    "pubDate": pub_date,
    "image": "",
    "link": "https://jobsbor.com/blog/article-238",
    "sourceCategory": "卫星互联网",
    "sourceLang": "zh-CN",
    "keywords": [
        "卫星互联网", "手机直连卫星", "相控阵天线", "低轨卫星", "星座运控",
        "NTN", "天地融合通信", "卫星通信芯片", "射频前端", "SpaceX", "星链", "人才战略"
    ],
    "tags": [
        "卫星互联网", "手机直连卫星", "相控阵芯片", "低轨星座", "天地融合通信", "人才战略"
    ],
    "metaDescription": "系统解构卫星互联网终端与手机直连卫星产业的人才版图，聚焦相控阵芯片、星座运控、天地融合通信，揭示太空互联网时代的人才瓶颈与企业突围之道。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data.append(article)

with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("article-238 appended successfully. Total articles:", len(data))
