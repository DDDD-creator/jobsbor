import json
from datetime import datetime, timezone

# Read the content
with open('article-154-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-154",
    "title": "高端医疗器械与精准医疗装备人才战略：当国产替代遇上技术迭代时，医学影像、手术机器人与体外诊断的人才竞赛与产业生态构建",
    "description": "系统剖析高端医疗器械与精准医疗装备产业从技术原理到产业落地的全链条人才版图，深入解读医学影像、手术机器人、体外诊断三大核心领域的人才需求格局与竞争态势，为企业构建国产替代时代医疗科技人才高地提供前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "高端医疗器械",
        "精准医疗",
        "医学影像",
        "手术机器人",
        "体外诊断",
        "IVD",
        "人才战略",
        "国产替代",
        "健康中国",
        "科技招聘",
        "医疗科技",
        "医工融合",
        "人才缺口"
    ],
    "tags": [
        "高端医疗器械",
        "精准医疗",
        "医学影像",
        "手术机器人",
        "体外诊断",
        "人才战略",
        "科技招聘",
        "国产替代",
        "前沿技术",
        "HR战略"
    ],
    "metaDescription": "系统剖析高端医疗器械与精准医疗装备产业全链条人才版图，深入解读三大核心领域的人才需求格局与竞争态势，为企业构建国产替代时代医疗科技人才高地提供前瞻性战略指南。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-154 already exists
exists = any(item.get('id') == 'article-154' for item in data)
if exists:
    print("article-154 already exists, skipping append.")
else:
    data.append(new_article)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Successfully appended article-154.")
    print(f"Total articles: {len(data)}")
