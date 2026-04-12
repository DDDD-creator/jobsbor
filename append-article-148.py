import json
from datetime import datetime, timezone

# Read the content
with open('article-148-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-148",
    "title": "第三代半导体与功率器件人才战略：当碳化硅与氮化镓重塑能源电子世界，功率芯片、射频前端与衬底外延技术的人才竞赛与产业生态构建",
    "description": "系统剖析第三代半导体产业全链条人才版图，深入解读衬底外延、功率芯片、射频前端与封装测试四大核心领域的人才需求格局与结构性矛盾，为企业在宽禁带材料主导的产业变革中抢占人才制高点提供前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "第三代半导体",
        "碳化硅",
        "氮化镓",
        "功率器件",
        "射频前端",
        "衬底外延",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "产业生态",
        "人才缺口",
        "HR战略",
        "半导体人才",
        "宽禁带材料"
    ],
    "tags": [
        "第三代半导体",
        "碳化硅",
        "氮化镓",
        "科技招聘",
        "人才战略",
        "前沿技术",
        "产教融合",
        "人才缺口",
        "未来工作",
        "HR战略"
    ],
    "metaDescription": "系统剖析第三代半导体产业全链条人才版图，深入解读四大核心领域的人才需求格局与结构性矛盾，为企业提供抢占人才制高点的前瞻性战略指南。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-148 already exists
exists = any(item.get('id') == 'article-148' for item in data)
if exists:
    print("article-148 already exists, skipping append.")
else:
    data.append(new_article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-148.")
    print(f"Total articles: {len(data)}")
