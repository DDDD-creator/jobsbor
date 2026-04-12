import json
from datetime import datetime, timezone

# Read the content
with open('article-144-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-144",
    "title": "先进封装与Chiplet人才战略：当摩尔定律放缓，异构集成、2.5D/3D封装与芯粒设计的人才竞赛与产业生态构建",
    "description": "深度解析先进封装与Chiplet从技术突破到量产落地的关键阶段，异构集成、2.5D/3D封装、芯粒设计与EDA工具等核心技术领域的人才需求格局，系统梳理全球先进封装产业的人才竞争态势，为企业提供抢占下一代半导体高地的人才战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "先进封装",
        "Chiplet",
        "芯粒",
        "异构集成",
        "2.5D封装",
        "3D封装",
        "摩尔定律",
        "人才战略",
        "科技招聘",
        "半导体",
        "EDA工具",
        "人才缺口",
        "HR战略",
        "产教融合",
        "组织变革"
    ],
    "tags": [
        "先进封装",
        "Chiplet",
        "半导体",
        "科技招聘",
        "人才战略",
        "前沿技术",
        "产教融合",
        "人才缺口",
        "未来工作",
        "HR战略"
    ],
    "metaDescription": "深度解析先进封装与Chiplet产业核心技术领域的人才需求格局，系统梳理全球竞争态势，为企业提供抢占下一代半导体高地的人才战略指南。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-144 already exists
exists = any(item.get('id') == 'article-144' for item in data)
if exists:
    print("article-144 already exists, skipping append.")
else:
    data.append(new_article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-144.")
    print(f"Total articles: {len(data)}")
