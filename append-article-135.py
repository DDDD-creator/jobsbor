import json
from datetime import datetime, timezone

with open('article-135-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

title = "商业航天与太空经济人才战略：从卫星互联网到星际探索的新边疆人才布局与组织能力建设"
description = "深度解析商业航天产业崛起对全球人才市场的重塑，系统梳理火箭设计、卫星载荷、太空运营等关键岗位的能力模型，探索企业在太空经济时代构建人才竞争优势的战略路径与行动框架。"
meta_description = description

article = {
    "id": "article-135",
    "title": title,
    "description": description,
    "content": content,
    "image": "",
    "keywords": [
        "商业航天",
        "太空经济",
        "卫星互联网",
        "火箭设计",
        "人才培养",
        "航天工程",
        "液体火箭发动机",
        "卫星载荷",
        "太空运营",
        "雇主品牌",
        "跨学科人才",
        "科技招聘",
        "人才战略",
        "未来工作",
        "HR战略",
        "航天人才",
        "星际探索",
        "SpaceX",
        "可回收火箭",
        "低空经济"
    ],
    "link": "",
    "metaDescription": meta_description,
    "pubDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "source": "Jobsbor原创",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "tags": [
        "商业航天",
        "科技招聘",
        "人才战略",
        "前沿技术",
        "产教融合",
        "人才缺口",
        "未来工作",
        "HR战略",
        "组织变革",
        "太空经济"
    ]
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-135 already exists
existing_ids = [p['id'] for p in data]
if 'article-135' not in existing_ids:
    data.append(article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-135")
else:
    print("article-135 already exists, skipping append")

print(f"Total posts: {len(data)}")
print(f"Max article number: {max(int(p['id'].split('-')[1]) for p in data)}")
