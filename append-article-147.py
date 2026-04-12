import json
from datetime import datetime, timezone

# Read the content
with open('article-147-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-147",
    "title": "商业航天与低轨卫星人才战略：当太空经济驶入快车道，火箭可回收技术、卫星批产制造与空间信息服务的人才竞赛与产业生态构建",
    "description": "深度解析商业航天与低轨卫星产业从技术攻关到商业落地的全链条人才版图，系统梳理火箭可回收技术、卫星批产制造与空间信息服务三大核心领域的人才需求格局，为企业提供在太空经济时代抢占人才制高点的前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "商业航天",
        "低轨卫星",
        "火箭可回收技术",
        "卫星批产制造",
        "空间信息服务",
        "太空经济",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "产业生态",
        "人才缺口",
        "HR战略",
        "卫星互联网",
        "航天产业"
    ],
    "tags": [
        "商业航天",
        "低轨卫星",
        "太空经济",
        "科技招聘",
        "人才战略",
        "前沿技术",
        "产教融合",
        "人才缺口",
        "未来工作",
        "HR战略"
    ],
    "metaDescription": "深度解析商业航天与低轨卫星产业全链条人才版图，系统梳理三大核心领域的人才需求格局，为企业提供抢占太空经济人才制高点的前瞻性战略指南。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-147 already exists
exists = any(item.get('id') == 'article-147' for item in data)
if exists:
    print("article-147 already exists, skipping append.")
else:
    data.append(new_article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-147.")
    print(f"Total articles: {len(data)}")
