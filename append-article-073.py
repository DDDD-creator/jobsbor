import json

with open('article-073-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_post = {
    "id": "article-073",
    "title": "人才成长引擎与职业发展双通道：打破晋升天花板，构建组织与人才共赢的可持续发展系统",
    "description": "深度解析传统单通道晋升模式的结构性困境，系统阐述职业发展双通道与内部人才市场的构建方法论，为企业提供从岗位固化到人才流动、从层级晋升到多元发展的职业生态系统设计指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T16:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "职业发展双通道",
        "内部人才市场",
        "人才成长",
        "晋升通道",
        "导师制",
        "职业发展对话",
        "人才保留",
        "组织发展",
        "人力资源管理",
        "Jobsbor"
    ],
    "tags": [
        "职业发展双通道",
        "内部人才市场",
        "人才成长",
        "晋升通道",
        "导师制",
        "职业发展对话",
        "人才保留",
        "组织发展",
        "HR战略",
        "Jobsbor"
    ],
    "metaDescription": "深度解析传统单通道晋升困境，系统阐述职业发展双通道与内部人才市场的构建方法论，帮助企业打破晋升天花板，构建组织与人才共同成长的可持续发展系统。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

if any(p.get('id') == 'article-073' for p in posts):
    print('article-073 already exists, skipping')
else:
    posts.append(new_post)
    with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print('article-073 appended successfully')
