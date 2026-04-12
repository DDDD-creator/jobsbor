import json

# Read content
with open('article-160-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-160",
    "title": "数字孪生与工业元宇宙人才战略：当物理工厂拥有数字镜像时，虚拟调试、预测性维护与实时仿真的人才竞赛与产业生态构建",
    "description": "系统剖析数字孪生与工业元宇宙产业的全链条人才版图，深入解读数字孪生建模、工业元宇宙平台、虚拟调试、预测性维护与实时仿真五大核心领域的人才需求格局与竞争态势，为企业构建工业元宇宙时代的人才高地提供前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T15:40:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "数字孪生",
        "工业元宇宙",
        "虚拟调试",
        "预测性维护",
        "实时仿真",
        "智能制造",
        "工业互联网",
        "CAD",
        "CAE",
        "人才战略",
        "科技招聘",
        "制造业",
        "国产替代",
        "人才缺口",
        "未来工作"
    ],
    "tags": [
        "数字孪生",
        "工业元宇宙",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "智能制造",
        "工业互联网",
        "人才缺口",
        "未来工作",
        "HR战略"
    ],
    "metaDescription": "系统剖析数字孪生与工业元宇宙产业的全链条人才版图，深入解读数字孪生建模、工业元宇宙平台、虚拟调试、预测性维护与实时仿真五大核心领域的人才需求格局与竞争态势，为企业构建工业元宇宙时代的人才高地提供前瞻性战略指南。"
}

# Read existing posts
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Check if article-160 already exists
ids = [p['id'] for p in posts]
if 'article-160' in ids:
    print('article-160 already exists, replacing...')
    for i, p in enumerate(posts):
        if p['id'] == 'article-160':
            posts[i] = new_article
            break
else:
    print('Appending article-160...')
    posts.append(new_article)

# Write back
with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f'Total posts: {len(posts)}')
print('Done.')
