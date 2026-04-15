import json
import sys

# 读取现有文章列表
with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# 读取新文章
with open('article-345.json', 'r', encoding='utf-8') as f:
    new_article = json.load(f)

# 检查是否已存在该文章
existing_ids = {post['id'] for post in posts}
if new_article['id'] in existing_ids:
    print(f"Error: Article {new_article['id']} already exists!")
    sys.exit(1)

# 将新文章添加到列表开头
posts.insert(0, new_article)

# 写回文件
with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f"Successfully added {new_article['id']}: {new_article['title']}")
print(f"Total articles: {len(posts)}")
print(f"Article content length: {len(new_article['content'])} characters")
