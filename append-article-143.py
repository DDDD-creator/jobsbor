import json
from datetime import datetime, timezone

# Read the content
with open('article-143-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-143",
    "title": "固态电池与新型储能人才战略：当能源自由触手可及，固态电解质、电池管理系统与储能系统集成的人才竞赛与产业生态构建",
    "description": "深度解析固态电池从技术突破到量产落地的关键阶段，固态电解质、干法电极、电池管理系统与储能系统集成等核心技术领域的人才需求格局，系统梳理全球固态电池产业的人才竞争态势，为企业提供抢占下一代能源高地的人才战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "固态电池",
        "新型储能",
        "固态电解质",
        "电池管理系统",
        "干法电极",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "产业生态",
        "人才缺口",
        "HR战略",
        "储能系统",
        "未来工作",
        "雇主品牌",
        "能源革命"
    ],
    "tags": [
        "固态电池",
        "新型储能",
        "科技招聘",
        "人才战略",
        "前沿技术",
        "产教融合",
        "人才缺口",
        "未来工作",
        "HR战略",
        "组织变革"
    ],
    "metaDescription": "深度解析固态电池产业核心技术领域的人才需求格局，系统梳理全球竞争态势，为企业提供抢占下一代能源高地的人才战略指南。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-143 already exists
exists = any(item.get('id') == 'article-143' for item in data)
if exists:
    print("article-143 already exists, skipping append.")
else:
    data.append(new_article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-143.")
    print(f"Total articles: {len(data)}")
