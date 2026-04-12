import json

# Read content
with open('article-168-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-168",
    "title": "半导体设备及核心材料人才战略：当国产替代攻坚战进入核心区时，光刻机、刻蚀设备与电子级材料的人才竞赛与产业生态构建",
    "description": "深入剖析半导体设备与材料产业的人才版图，聚焦光刻系统、刻蚀/薄膜设备、量测检测、电子级硅片与特种气体等核心领域的人才紧缺现状与竞争态势，为企业在这场决定未来的科技博弈中构建人才防线提供战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-17T12:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "半导体设备",
        "核心材料",
        "光刻机",
        "刻蚀设备",
        "薄膜沉积",
        "量测检测",
        "电子特气",
        "电子级硅片",
        "光刻胶",
        "国产替代",
        "人才战略",
        "科技招聘",
        "集成电路",
        "芯片制造"
    ],
    "tags": [
        "半导体设备",
        "核心材料",
        "光刻机",
        "刻蚀设备",
        "国产替代",
        "人才战略",
        "科技招聘",
        "HR战略",
        "集成电路",
        "芯片"
    ],
    "metaDescription": "深入剖析半导体设备与材料产业的人才版图，聚焦光刻系统、刻蚀设备、量测检测、电子级材料等核心领域的人才紧缺现状与竞争态势。"
}

# Read existing posts
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Check if article-168 already exists
ids = [p['id'] for p in posts]
if 'article-168' in ids:
    print('article-168 already exists, replacing...')
    for i, p in enumerate(posts):
        if p['id'] == 'article-168':
            posts[i] = new_article
            break
else:
    print('Appending article-168...')
    posts.append(new_article)

# Write back
with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f'Total posts: {len(posts)}')
print('Done.')
