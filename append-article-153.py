import json
from datetime import datetime, timezone

# Read the content
with open('article-153-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-153",
    "title": "先进封装与Chiplet人才战略：当摩尔定律逼近物理极限时，异构集成、芯粒互联与2.5D/3D封装的人才竞赛与产业生态构建",
    "description": "系统剖析先进封装与Chiplet产业从技术原理到产业落地的全链条人才版图，深入解读异构集成设计、芯粒架构、2.5D/3D封装工艺、封装测试与EDA工具五大核心领域的人才需求格局与竞争态势，为企业构建后摩尔时代芯片人才高地提供前瞻性战略指南。",
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
        "人才战略",
        "科技招聘",
        "半导体",
        "摩尔定律",
        "EDA工具",
        "封装测试",
        "产教融合",
        "人才缺口"
    ],
    "tags": [
        "先进封装",
        "Chiplet",
        "半导体",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "产教融合",
        "人才缺口",
        "未来工作",
        "HR战略"
    ],
    "metaDescription": "系统剖析先进封装与Chiplet产业全链条人才版图，深入解读五大核心领域的人才需求格局与竞争态势，为企业构建后摩尔时代芯片人才高地提供前瞻性战略指南。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-153 already exists
exists = any(item.get('id') == 'article-153' for item in data)
if exists:
    print("article-153 already exists, skipping append.")
else:
    data.append(new_article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-153.")
    print(f"Total articles: {len(data)}")
