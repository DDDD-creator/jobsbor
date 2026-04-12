import json

# Read content
with open('article-162-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-162",
    "title": "智能电网与新型电力系统人才战略：当双碳目标进入攻坚期时，源网荷储协同、电力电子技术、虚拟电厂与数字电网的人才竞赛与产业生态构建",
    "description": "系统剖析智能电网与新型电力系统产业的全链条人才版图，深入解读源网荷储协同规划、电力电子硬件、虚拟电厂算法与数字电网AI调度四大核心领域的人才需求格局与竞争态势，为企业构建能源转型时代的人才高地提供前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T16:10:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "智能电网",
        "新型电力系统",
        "源网荷储",
        "电力电子",
        "虚拟电厂",
        "数字电网",
        "能源转型",
        "双碳",
        "新能源",
        "储能",
        "人才战略",
        "科技招聘",
        "电力人才",
        "国产替代",
        "未来工作"
    ],
    "tags": [
        "智能电网",
        "新型电力系统",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "能源转型",
        "电力电子",
        "虚拟电厂",
        "人才缺口",
        "未来工作",
        "HR战略"
    ],
    "metaDescription": "系统剖析智能电网与新型电力系统产业的全链条人才版图，深入解读源网荷储协同规划、电力电子硬件、虚拟电厂算法与数字电网AI调度四大核心领域的人才需求格局与竞争态势，为企业构建能源转型时代的人才高地提供前瞻性战略指南。"
}

# Read existing posts
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Check if article-162 already exists
ids = [p['id'] for p in posts]
if 'article-162' in ids:
    print('article-162 already exists, replacing...')
    for i, p in enumerate(posts):
        if p['id'] == 'article-162':
            posts[i] = new_article
            break
else:
    print('Appending article-162...')
    posts.append(new_article)

# Write back
with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f'Total posts: {len(posts)}')
print('Done.')
