import json
from datetime import datetime, timezone

# Read content
with open('/tmp/article-184-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

article = {
    "id": "article-184",
    "title": "创新药研发与产业化人才战略：当健康中国遇上创新药出海时，药物化学、抗体工程与CMC工艺的人才竞赛与产业生态构建",
    "description": "系统剖析创新药研发与产业化的人才战略图景，深入分析药物化学、抗体工程、CMC工艺三大核心支柱领域的人才能力模型与结构性缺口，探讨在中国创新药从fast-follow向first-in-class跃迁的关键时期，如何构建支撑全球化竞争的原创研发、临床开发和产业化人才梯队。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-13T04:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "创新药",
        "生物制药",
        "药物化学",
        "抗体工程",
        "CMC工艺",
        "GMP生产",
        "临床研究",
        "药品注册",
        "创新药出海",
        "转化医学",
        "药物研发",
        "生物大分子",
        "ADC药物",
        "双特异性抗体",
        "临床试验",
        "CRO",
        "CDMO",
        "生物医药人才",
        "新药研发人才",
        "制药工业"
    ],
    "tags": [
        "创新药",
        "生物制药",
        "药物化学",
        "抗体工程",
        "CMC工艺",
        "GMP生产",
        "临床研究",
        "创新药出海",
        "生物医药人才",
        "新药研发"
    ],
    "metaDescription": "系统剖析创新药研发与产业化的人才战略图景，深入分析药物化学、抗体工程、CMC工艺三大核心支柱领域的人才能力模型与结构性缺口。"
}

# Load existing data
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-184 already exists
existing_ids = [p.get('id') for p in data if p.get('id')]
if 'article-184' in existing_ids:
    print('article-184 already exists, skipping append')
else:
    data.append(article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'Appended article-184. Total articles: {len(data)}')
