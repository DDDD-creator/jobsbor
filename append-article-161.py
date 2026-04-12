import json

# Read content
with open('article-161-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-161",
    "title": "深海科技与海洋工程人才战略：当万米深渊成为新疆场时，载人深潜、海底观测与海洋油气的人才竞赛与产业生态构建",
    "description": "系统剖析深海科技与海洋工程产业的全链条人才版图，深入解读深海装备设计、载人深潜、海底观测、海洋油气与深海资源开发五大核心领域的人才需求格局与竞争态势，为企业构建深海时代的人才高地提供前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T16:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "深海科技",
        "海洋工程",
        "载人深潜",
        "海底观测",
        "海洋油气",
        "深海资源",
        "水下机器人",
        "深海装备",
        "海底观测网",
        "人才战略",
        "科技招聘",
        "海洋强国",
        "深海采矿",
        "国产替代",
        "未来工作"
    ],
    "tags": [
        "深海科技",
        "海洋工程",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "海洋强国",
        "载人深潜",
        "海底观测",
        "水下机器人",
        "HR战略"
    ],
    "metaDescription": "系统剖析深海科技与海洋工程产业的全链条人才版图，深入解读深海装备设计、载人深潜、海底观测、海洋油气与深海资源开发五大核心领域的人才需求格局与竞争态势，为企业构建深海时代的人才高地提供前瞻性战略指南。"
}

# Read existing posts
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Check if article-161 already exists
ids = [p['id'] for p in posts]
if 'article-161' in ids:
    print('article-161 already exists, replacing...')
    for i, p in enumerate(posts):
        if p['id'] == 'article-161':
            posts[i] = new_article
            break
else:
    print('Appending article-161...')
    posts.append(new_article)

# Write back
with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f'Total posts: {len(posts)}')
print('Done.')
