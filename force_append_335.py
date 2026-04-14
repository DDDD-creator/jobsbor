#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
追加 article-335 到 blog-posts.json (强制)
"""

import json

# 读取现有文章列表
with open('/tmp/jobsbor/src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# 读取新文章
with open('/tmp/jobsbor/article-335.json', 'r', encoding='utf-8') as f:
    new_article = json.load(f)

# 移除已存在的 article-335（如果存在）
posts = [post for post in posts if post['id'] != 'article-335']

# 将新文章添加到开头
posts.insert(0, new_article)

# 保存更新后的文件
with open('/tmp/jobsbor/src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print(f"article-335 已成功添加到 blog-posts.json")
print(f"当前文章总数: {len(posts)}")
