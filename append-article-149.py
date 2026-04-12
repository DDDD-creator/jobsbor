import json
from datetime import datetime, timezone

# Read the content
with open('article-149-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-149",
    "title": "脑机接口与神经科技人才战略：当思维直连数字世界时，神经工程、信号解码与植入器件的人才竞赛与产业生态构建",
    "description": "系统剖析脑机接口产业从技术原理到商业落地的全链条人才版图，深入解读神经工程、信号解码、植入器件、系统集成与临床转化五大核心领域的人才需求格局与竞争态势，为企业构建神经科技人才高地提供前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "脑机接口",
        "神经科技",
        "神经工程",
        "信号解码",
        "植入器件",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "产业生态",
        "人才缺口",
        "HR战略",
        "人机融合",
        "神经芯片"
    ],
    "tags": [
        "脑机接口",
        "神经科技",
        "科技招聘",
        "人才战略",
        "前沿技术",
        "产教融合",
        "人才缺口",
        "未来工作",
        "HR战略"
    ],
    "metaDescription": "系统剖析脑机接口产业全链条人才版图，深入解读五大核心领域的人才需求格局与竞争态势，为企业构建神经科技人才高地提供前瞻性战略指南。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-149 already exists
exists = any(item.get('id') == 'article-149' for item in data)
if exists:
    print("article-149 already exists, skipping append.")
else:
    data.append(new_article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-149.")
    print(f"Total articles: {len(data)}")
