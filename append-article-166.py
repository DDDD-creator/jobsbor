import json

# Read content
with open('article-166-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_article = {
    "id": "article-166",
    "title": "新型显示技术与虚实融合视界人才战略：当Micro LED点亮万物显示新时代时，巨量转移、微显示与光波导模组的人才竞赛与产业生态构建",
    "description": "系统剖析新型显示产业的全链条人才版图，深入解读Micro LED、微显示与光波导、柔性显示三大核心赛道的人才需求格局与竞争态势，为企业在这场点亮未来的显示革命中构建人才高地提供前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-13T16:30:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "新型显示技术",
        "Micro LED",
        "微显示",
        "光波导",
        "AR/VR",
        "柔性显示",
        "车载显示",
        "巨量转移",
        "硅基OLED",
        "衍射光波导",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "显示产业"
    ],
    "tags": [
        "新型显示",
        "Micro LED",
        "人才战略",
        "科技招聘",
        "AR/VR",
        "光波导",
        "柔性显示",
        "车载显示",
        "微显示",
        "HR战略"
    ],
    "metaDescription": "系统剖析新型显示产业的全链条人才版图，深入解读Micro LED、微显示与光波导、柔性显示三大核心赛道的人才需求格局与竞争态势。"
}

# Read existing posts
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Check if article-166 already exists
ids = [p['id'] for p in posts]
if 'article-166' in ids:
    print('article-166 already exists, replacing...')
    for i, p in enumerate(posts):
        if p['id'] == 'article-166':
            posts[i] = new_article
            break
else:
    print('Appending article-166...')
    posts.append(new_article)

# Write back
with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f'Total posts: {len(posts)}')
print('Done.')
