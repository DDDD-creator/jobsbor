import json
from datetime import datetime, timezone

# Read the content
with open('article-152-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-152",
    "title": "空间计算与XR人才战略：当虚实融合成为主流交互范式，三维引擎、空间感知与内容创作的人才竞赛与产业生态构建",
    "description": "系统剖析空间计算与XR产业从技术原理到商业落地的全链条人才版图，深入解读三维引擎、空间感知、内容创作、光学显示与交互设计五大核心领域的人才需求格局与竞争态势，为企业构建下一代计算平台人才高地提供前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "空间计算",
        "XR",
        "扩展现实",
        "三维引擎",
        "空间感知",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "产业生态",
        "人才缺口",
        "HR战略",
        "虚拟现实",
        "增强现实",
        "混合现实"
    ],
    "tags": [
        "空间计算",
        "XR",
        "科技招聘",
        "人才战略",
        "前沿技术",
        "产教融合",
        "人才缺口",
        "未来工作",
        "HR战略"
    ],
    "metaDescription": "系统剖析空间计算与XR产业全链条人才版图，深入解读五大核心领域的人才需求格局与竞争态势，为企业构建下一代计算平台人才高地提供前瞻性战略指南。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-152 already exists
exists = any(item.get('id') == 'article-152' for item in data)
if exists:
    print("article-152 already exists, skipping append.")
else:
    data.append(new_article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-152.")
    print(f"Total articles: {len(data)}")
