import json

with open('article-075-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_post = {
    "id": "article-075",
    "title": "雇主品牌危机管理与声誉修复：从负面舆情到信任重建的系统防御与反击战略",
    "description": "系统阐述雇主品牌危机的类型、成因与预警机制，深度解析危机应对的黄金法则、声誉修复路径与制度重塑方法，帮助企业在舆情风暴中实现逆风翻盘，构建韧性雇主品牌生态系统。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T18:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "雇主品牌",
        "危机管理",
        "声誉修复",
        "负面舆情",
        "信任重建",
        "雇主品牌危机",
        "危机预警",
        "社交媒体监听",
        "员工敬业度",
        "劳动关系"
    ],
    "tags": [
        "雇主品牌",
        "危机管理",
        "声誉修复",
        "负面舆情",
        "信任重建",
        "雇主品牌危机",
        "社交媒体监听",
        "员工敬业度",
        "劳动关系",
        "HR战略"
    ],
    "metaDescription": "系统阐述雇主品牌危机的类型、成因与预警机制，深度解析危机应对的黄金法则、声誉修复路径与制度重塑方法，帮助企业在舆情风暴中实现逆风翻盘。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data.append(new_post)

with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print('Added article-075. Total articles:', len(data))
print('Content length:', len(new_post['content']), 'characters')
