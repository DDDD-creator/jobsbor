import json
from datetime import datetime, timezone

# Read the content
with open('article-156-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-156",
    "title": "工业母机与高端数控机床人才战略：当国产替代遇上精度极限突破时，五轴联动机床、高精度数控系统与复合加工中心的人才竞赛与产业生态构建",
    "description": "系统剖析工业母机与高端数控机床产业从技术原理到产业落地的全链条人才版图，深入解读五轴联动机床、高精度数控系统、复合加工中心三大核心领域的人才需求格局与竞争态势，为企业构建智能制造时代高端装备人才高地提供前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "工业母机",
        "高端数控机床",
        "五轴联动机床",
        "数控系统",
        "复合加工中心",
        "国产替代",
        "智能制造",
        "人才战略",
        "科技招聘",
        "精密制造",
        "制造业升级",
        "人才缺口"
    ],
    "tags": [
        "工业母机",
        "数控机床",
        "五轴加工",
        "数控系统",
        "智能制造",
        "人才战略",
        "科技招聘",
        "国产替代",
        "前沿技术",
        "HR战略"
    ],
    "metaDescription": "系统剖析工业母机与高端数控机床产业全链条人才版图，深入解读三大核心领域的人才需求格局与竞争态势，为企业构建智能制造时代高端装备人才高地提供前瞻性战略指南。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-156 already exists
exists = any(item.get('id') == 'article-156' for item in data)
if exists:
    print("article-156 already exists, skipping append.")
else:
    data.append(new_article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-156.")
    print(f"Total articles: {len(data)}")
