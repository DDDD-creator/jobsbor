import json
import sys

# 读取现有的blog-posts.json
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# 读取文章内容
with open('article-339-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 创建新文章条目
new_article = {
    "id": "article-339",
    "title": "工业元宇宙产业人才战略：当制造业进入虚实共生时代时，数字孪生、XR交互与区块链确权的人才竞赛与生态构建",
    "description": "深度解析工业元宇宙产业的人才战略图景，系统阐述数字孪生构建、XR交互设计、区块链确权、AI驱动仿真等核心领域的人才需求特征与培养路径，揭示这场虚实共生革命中的人才竞赛与生态构建之道。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-15T12:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "工业元宇宙",
        "数字孪生",
        "XR技术",
        "区块链",
        "智能制造",
        "虚实共生",
        "人才战略"
    ],
    "tags": [
        "工业元宇宙",
        "数字孪生",
        "XR技术",
        "VR/AR/MR",
        "区块链",
        "智能制造",
        "工业4.0",
        "人才战略",
        "制造业转型"
    ],
    "metaDescription": "深度解析工业元宇宙产业的人才战略图景，系统阐述数字孪生构建、XR交互设计、区块链确权、AI驱动仿真等核心领域的人才需求特征与培养路径。"
}

# 将新文章追加到列表开头（最新的文章在前）
posts.insert(0, new_article)

# 写回文件
with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f"✅ 成功添加文章 article-339")
print(f"标题: {new_article['title']}")
print(f"字数: 约 {len(content)} 字符")
print(f"当前文章总数: {len(posts)}")
