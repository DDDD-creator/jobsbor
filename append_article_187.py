import json
from datetime import datetime, timezone

# Read content
with open('/tmp/article-187-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

article = {
    "id": "article-187",
    "title": "碳捕集利用与封存(CCUS)产业人才战略：当碳中和目标进入攻坚期时，碳捕集技术、二氧化碳资源化利用与地质封存工程的人才竞赛与产业生态构建",
    "description": "系统剖析CCUS产业的人才战略图景，深入分析碳捕集技术、二氧化碳资源化利用、地质封存工程三大核心领域的人才能力模型与结构性缺口，探讨在碳中和目标进入攻坚期的历史性阶段，如何构建支撑全球最大规模CCUS产业落地的战略性人才梯队与产业生态体系。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-13T03:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "CCUS",
        "碳捕集利用与封存",
        "碳中和",
        "双碳战略",
        "碳捕集技术",
        "二氧化碳驱油",
        "地质封存",
        "碳循环经济",
        "绿色燃料",
        "CO2催化转化",
        "碳捕集工程师",
        "地质封存评估",
        "CCUS人才战略",
        "碳减排技术",
        "清洁能源转型"
    ],
    "tags": [
        "CCUS",
        "碳捕集利用与封存",
        "碳中和",
        "双碳战略",
        "碳捕集技术",
        "二氧化碳资源化利用",
        "地质封存工程",
        "碳循环经济",
        "CCUS人才战略",
        "清洁能源转型"
    ],
    "metaDescription": "系统剖析CCUS产业的人才战略图景，深入分析碳捕集技术、二氧化碳资源化利用、地质封存工程三大核心领域的人才能力模型与结构性缺口。"
}

# Load existing data
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-187 already exists
existing_ids = [p.get('id') for p in data if p.get('id')]
if 'article-187' in existing_ids:
    print('article-187 already exists, skipping append')
else:
    data.append(article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'Appended article-187. Total articles: {len(data)}')
