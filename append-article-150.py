import json
from datetime import datetime, timezone

# Read the content
with open('article-150-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-150",
    "title": "固态电池与新型储能人才战略：当高能量密度遇见极致安全，全固态电解质、干法电极与系统集成的人才竞赛与产业生态构建",
    "description": "系统剖析固态电池产业从技术原理到产业化的全链条人才版图，深入解读全固态电解质、干法电极、界面工程、系统集成与智能制造五大核心领域的人才需求格局与竞争态势，为企业构建储能科技人才高地提供前瞻性战略指南。",
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
        "全固态电解质",
        "干法电极",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "产业生态",
        "人才缺口",
        "HR战略",
        "动力电池",
        "界面工程",
        "储能产业"
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
        "HR战略"
    ],
    "metaDescription": "系统剖析固态电池产业全链条人才版图，深入解读五大核心领域的人才需求格局与竞争态势，为企业构建储能科技人才高地提供前瞻性战略指南。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-150 already exists
exists = any(item.get('id') == 'article-150' for item in data)
if exists:
    print("article-150 already exists, skipping append.")
else:
    data.append(new_article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-150.")
    print(f"Total articles: {len(data)}")
