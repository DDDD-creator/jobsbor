import json
from datetime import datetime, timezone

# Read the content
with open('article-146-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-146",
    "title": "氢能与燃料电池人才战略：当绿氢时代加速到来，电解槽、燃料电池电堆与氢储运技术的人才竞赛与产业生态构建",
    "description": "深度解析氢能与燃料电池产业从制氢、储运到应用的关键阶段，电解槽、燃料电池电堆与氢储运技术等核心技术领域的人才需求格局，系统梳理全球氢能产业的人才竞争态势，为企业提供抢占绿氢时代制高点的人才战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "氢能",
        "燃料电池",
        "绿氢",
        "电解槽",
        "氢储运",
        "质子交换膜",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "产业生态",
        "人才缺口",
        "HR战略",
        "清洁能源",
        "双碳目标"
    ],
    "tags": [
        "氢能",
        "燃料电池",
        "绿氢",
        "科技招聘",
        "人才战略",
        "前沿技术",
        "产教融合",
        "人才缺口",
        "未来工作",
        "HR战略"
    ],
    "metaDescription": "深度解析氢能与燃料电池产业核心技术领域的人才需求格局，系统梳理全球竞争态势，为企业提供抢占绿氢时代制高点的人才战略指南。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-146 already exists
exists = any(item.get('id') == 'article-146' for item in data)
if exists:
    print("article-146 already exists, skipping append.")
else:
    data.append(new_article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-146.")
    print(f"Total articles: {len(data)}")
