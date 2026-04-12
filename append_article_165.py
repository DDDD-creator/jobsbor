import json

# Read the blog posts
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Read article content
with open('article-165-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

title = "量子信息技术与量子产业人才战略：当第二次量子革命来临，量子计算、量子通信与量子精密测量的人才竞赛与产业生态构建"
description = "系统剖析量子信息技术产业的全链条人才版图，深入解读量子计算、量子通信与量子精密测量三大核心领域的人才需求格局与竞争态势，为企业在这场第二次量子革命中构建人才高地提供前瞻性战略指南。"

new_article = {
    "id": "article-165",
    "title": title,
    "description": description,
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-15T16:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "量子信息",
        "量子计算",
        "量子通信",
        "量子精密测量",
        "量子科技",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "未来工作",
        "量子人才"
    ],
    "tags": [
        "量子信息",
        "量子计算",
        "量子通信",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "量子精密测量",
        "HR战略",
        "未来工作"
    ],
    "metaDescription": description
}

posts.append(new_article)

with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f"Appended article-165. Total articles: {len(posts)}")
