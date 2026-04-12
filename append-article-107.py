import json
from datetime import datetime, timezone

# Read content
with open('article-107-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Read existing posts
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Check if article-107 already exists
existing_ids = [p['id'] for p in posts]
if 'article-107' in existing_ids:
    print('article-107 already exists, skipping')
    exit(0)

# Build article object
article = {
    "id": "article-107",
    "title": "组织遗忘管理与知识新陈代谢：信息熵增时代构建认知更新能力的战略方法论",
    "description": "系统阐述组织遗忘的战略价值与主动忘却机制，深入解析知识健康审计、心智模式更新、制度重构与认知升级的核心路径，为不确定时代的企业提供保持敏捷性和适应能力的全新人才管理视角。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "组织遗忘",
        "主动忘却",
        "知识新陈代谢",
        "学习型组织",
        "心智模式",
        "双环学习",
        "认知更新",
        "组织记忆",
        "知识管理",
        "变革管理",
        "组织敏捷性",
        "人才管理",
        "领导力发展",
        "反学习",
        "组织韧性"
    ],
    "tags": [
        "组织遗忘",
        "主动忘却",
        "知识新陈代谢",
        "学习型组织",
        "心智模式",
        "双环学习",
        "认知更新",
        "变革管理",
        "组织敏捷性",
        "领导力发展"
    ],
    "metaDescription": "系统阐述组织遗忘的战略价值与主动忘却机制，深入解析知识健康审计、心智模式更新、制度重构与认知升级的核心路径，为不确定时代的企业提供保持敏捷性和适应能力的全新人才管理视角。"
}

posts.append(article)

with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f'✅ article-107 已成功追加到 blog-posts.json')
print(f'📊 当前共有 {len(posts)} 篇文章')
