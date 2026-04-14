import json

# 读取现有文章
with open('/root/.openclaw/workspace/jobsbor-task/src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# 读取新文章
with open('/root/.openclaw/workspace/jobsbor-task/article-329.json', 'r', encoding='utf-8') as f:
    new_post = json.load(f)

# 插入到开头
posts.insert(0, new_post)

# 写回文件
with open('/root/.openclaw/workspace/jobsbor-task/src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f"✅ 成功添加 article-329")
print(f"📊 当前文章总数: {len(posts)}")
print(f"📝 新文章标题: {new_post['title'][:50]}...")
