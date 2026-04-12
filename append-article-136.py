import json
from datetime import datetime, timezone

with open('article-136-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

title = "可控核聚变与清洁能源人才战略：当人造太阳点亮能源未来时，等离子体物理、超导磁体与聚变工程的人才竞赛与产业生态构建"
description = "深度解析可控核聚变从技术突破到商业化的加速进程中，等离子体物理、超导磁体、聚变材料等关键领域的人才需求图景，系统梳理全球聚变人才竞争态势，为企业提供抢占终极能源制高点的人才战略框架。"
meta_description = description

article = {
    "id": "article-136",
    "title": title,
    "description": description,
    "content": content,
    "image": "",
    "keywords": [
        "可控核聚变",
        "清洁能源",
        "人才战略",
        "等离子体物理",
        "超导磁体",
        "聚变工程",
        "高温超导",
        "托卡马克",
        "ITER",
        "商业聚变",
        "核工程",
        "人才缺口",
        "科技招聘",
        "未来能源",
        "HR战略",
        "跨学科人才",
        "核聚变人才",
        "能源转型",
        "碳中和",
        "雇主品牌"
    ],
    "link": "",
    "metaDescription": meta_description,
    "pubDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "source": "Jobsbor原创",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "tags": [
        "可控核聚变",
        "科技招聘",
        "人才战略",
        "前沿技术",
        "产教融合",
        "人才缺口",
        "未来工作",
        "HR战略",
        "组织变革",
        "清洁能源"
    ]
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-136 already exists
existing_ids = [p['id'] for p in data]
if 'article-136' not in existing_ids:
    data.append(article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-136")
else:
    print("article-136 already exists, skipping append")

print(f"Total posts: {len(data)}")
print(f"Max article number: {max(int(p['id'].split('-')[1]) for p in data)}")
