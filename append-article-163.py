import json

# Read content
with open('article-163-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-163",
    "title": "类脑计算与神经形态芯片人才战略：当AI逼近能效极限时，神经形态工程、忆阻器器件与脉冲神经网络的人才竞赛与产业生态构建",
    "description": "系统剖析类脑计算与神经形态芯片产业的人才版图，深入解读神经形态工程、忆阻器器件、脉冲神经网络与系统架构四大核心领域的人才需求格局，为企业布局下一代智能计算时代的人才高地提供前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-13T16:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "类脑计算",
        "神经形态芯片",
        "脉冲神经网络",
        "忆阻器",
        "存算一体",
        "能效优化",
        "边缘AI",
        "自动驾驶",
        "人形机器人",
        "脑机接口",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "半导体",
        "未来工作"
    ],
    "tags": [
        "类脑计算",
        "神经形态芯片",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "脉冲神经网络",
        "忆阻器",
        "存算一体",
        "边缘AI",
        "HR战略"
    ],
    "metaDescription": "系统剖析类脑计算与神经形态芯片产业的人才版图，深入解读神经形态工程、忆阻器器件、脉冲神经网络与系统架构四大核心领域的人才需求格局，为企业布局下一代智能计算时代的人才高地提供前瞻性战略指南。"
}

# Read existing posts
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Check if article-163 already exists
ids = [p['id'] for p in posts]
if 'article-163' in ids:
    print('article-163 already exists, replacing...')
    for i, p in enumerate(posts):
        if p['id'] == 'article-163':
            posts[i] = new_article
            break
else:
    print('Appending article-163...')
    posts.append(new_article)

# Write back
with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f'Total posts: {len(posts)}')
print('Done.')
