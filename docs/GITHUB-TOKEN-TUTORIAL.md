# GitHub Personal Access Token 生成教程

## 步骤1：打开GitHub Token设置页面

1. 登录 GitHub 账号
2. 点击右上角头像 → **Settings**

```
https://github.com/settings/profile
```

3. 左侧菜单拉到最下面 → **Developer settings**

```
https://github.com/settings/apps
```

4. 选择 **Personal access tokens** → **Tokens (classic)**

```
https://github.com/settings/tokens
```

---

## 步骤2：生成新Token

1. 点击绿色按钮 **Generate new token (classic)**

2. 可能需要输入密码验证

3. 填写Token信息：
   - **Note**: `Jobsbor Deploy` (或任意名称)
   - **Expiration**: `No expiration` (或选90天)

---

## 步骤3：选择权限范围

勾选以下权限（打勾）：

```
☑️ repo              (完整仓库访问)
  ☑️ repo:status
  ☑️ repo_deployment
  ☑️ public_repo
  ☑️ repo:invite
  ☑️ security_events

☑️ workflow          (GitHub Actions)
```

**截图示意：**
```
┌─────────────────────────────────────────┐
│  Select scopes                          │
│                                         │
│  ☑️ repo (Full control of private repos)│
│    ☑️ repo:status                       │
│    ☑️ repo_deployment                   │
│    ☑️ public_repo                       │
│    ☑️ repo:invite                       │
│    ☑️ security_events                   │
│                                         │
│  ☐ admin:org                            │
│  ☐ admin:public_key                     │
│  ☐ admin:repo_hook                      │
│                                         │
│  ☑️ workflow (Update GitHub Action...)  │
│                                         │
└─────────────────────────────────────────┘
```

4. 点击底部 **Generate token** 按钮

---

## 步骤4：保存Token（重要！）

**⚠️ 警告：这个Token只显示一次！**

```
┌─────────────────────────────────────────┐
│  Your new personal access token         │
│                                         │
│  ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │  ← 复制这行！
│                                         │
│  [ Copy ]  [ Delete ]                   │
└─────────────────────────────────────────┘
```

**立即复制保存！** 刷新页面后就看不到了。

---

## 步骤5：更新到项目

### 方法A：手动更新（推荐）

在你的服务器上执行：

```bash
# 进入项目目录
cd /root/.openclaw/workspace/recruitment-site

# 查看当前remote
git remote -v

# 删除旧的remote
git remote remove origin

# 添加新的（把 ghp_xxxxx 换成你刚复制的Token）
git remote add origin https://ghp_xxxxxxxxxxxxxxxxxxxxxxxx@github.com/DDDD-creator/jobsbor.git

# 验证
git remote -v

# 测试推送
git push origin main
```

### 方法B：使用脚本

我已经创建了脚本，运行后输入Token即可：

```bash
cd /root/.openclaw/workspace/recruitment-site
./scripts/update-git-remote.sh
```

---

## 步骤6：删除旧Token

1. 回到 https://github.com/settings/tokens
2. 找到旧的Token（名字叫 Jobsbor 或类似的）
3. 点击 **Delete**
4. 确认删除

---

## 常见问题

### Q: 提示 "invalid token"?
A: 检查Token是否复制完整，不要有多余空格

### Q: 提示 "repository not found"?
A: 检查remote URL拼写是否正确

### Q: 不想用Token了？
A: 可以配置SSH密钥代替：
```bash
ssh-keygen -t ed25519 -C "deploy@jobsbor.com"
cat ~/.ssh/id_ed25519.pub
# 把公钥添加到GitHub → Settings → SSH Keys
```

---

## Token安全提示

| ❌ 不要做 | ✅ 要做 |
|---------|--------|
| 把Token发给任何人 | 保存在密码管理器 |
| 写在代码里提交 | 只在本地git配置中使用 |
| 设置永不过期 | 定期轮换（90天） |
| 给过多权限 | 只给最小必要权限 |

---

**有问题随时问我！** 🔐
