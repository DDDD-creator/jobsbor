import json

# Read content
with open('article-167-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-167",
    "title": "智能电网与新型电力系统人才战略：当能源转型进入深水区时，特高压输电、虚拟电厂与源网荷储协同的人才竞赛与产业生态构建",
    "description": "系统剖析智能电网与新型电力系统产业的全链条人才版图，深入解读特高压输电、新能源并网、虚拟电厂、储能集成与数字化电网五大核心领域的人才需求格局与竞争态势，为企业在这场能源转型的深水区竞争中构建人才高地提供前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-16T12:40:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "智能电网",
        "新型电力系统",
        "特高压输电",
        "新能源并网",
        "虚拟电厂",
        "储能系统",
        "电力电子",
        "数字化电网",
        "能源转型",
        "碳中和",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "未来工作"
    ],
    "tags": [
        "智能电网",
        "新型电力系统",
        "特高压",
        "虚拟电厂",
        "储能",
        "新能源",
        "能源转型",
        "人才战略",
        "科技招聘",
        "HR战略"
    ],
    "metaDescription": "系统剖析智能电网与新型电力系统产业的全链条人才版图，深入解读特高压输电、虚拟电厂、储能集成与数字化电网的人才需求格局与竞争态势。"
}

# Read existing posts
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Check if article-167 already exists
ids = [p['id'] for p in posts]
if 'article-167' in ids:
    print('article-167 already exists, replacing...')
    for i, p in enumerate(posts):
        if p['id'] == 'article-167':
            posts[i] = new_article
            break
else:
    print('Appending article-167...')
    posts.append(new_article)

# Write back
with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f'Total posts: {len(posts)}')
print('Done.')
