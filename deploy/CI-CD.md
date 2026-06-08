# GitHub → ECS 自动部署

> 国内 ECS **无法直接 git pull GitHub**，因此采用 **GitHub Actions**：push 后打包代码 → SSH 上传到 ECS → 自动 `docker compose up -d --build`。

---

## 架构

```
本地 push → GitHub (main) → Actions 打包 → SCP 到 ECS → remote-deploy.sh → Docker 重建
```

`.env` 和数据库卷 **保留在服务器**，不会被覆盖。

---

## 一次性配置（约 15 分钟）

### 1. 代码推送到 GitHub

```bash
cd "/Users/li_warehouse/Downloads/乐自由下单完整版_cursor 2"

# 确认 remote
git remote -v

# 提交并推送
git add .
git commit -m "feat: add GitHub Actions ECS auto deploy"
git push -u origin main
```

仓库地址示例：`git@github.com:lipenglucky/lezyou-platform-prototype.git`

---

### 2. ECS 生成部署专用 SSH 密钥

在 **ECS Workbench 终端**执行：

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f /root/.ssh/github_deploy -N ""

cat /root/.ssh/github_deploy.pub >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

echo "===== 复制下面整段到 GitHub Secret ECS_SSH_KEY ====="
cat /root/.ssh/github_deploy
```

复制输出的 **完整私钥**（含 `BEGIN` / `END` 行）。

---

### 3. GitHub 配置 Secrets

打开仓库 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret 名称 | 值 |
|-------------|-----|
| `ECS_HOST` | `47.113.186.224` |
| `ECS_USER` | `root` |
| `ECS_SSH_KEY` | 上一步复制的私钥全文 |
| `ECS_SSH_PORT` | `22`（可选，默认 22） |

---

### 4. 确认 ECS 安全组

入方向放行 **TCP 22**（GitHub Actions IP 不固定，内测需填 `0.0.0.0/0`）。

### 4.1 确认 ECS 上 authorized_keys

```bash
# Workbench 执行
cat /root/.ssh/github_deploy.pub >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
grep github-actions /root/.ssh/authorized_keys
```

### 4.2 ECS_SSH_KEY 格式（最常见失败原因）

粘贴到 GitHub Secret 时必须**完整保留换行**，格式如下：

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAA...
...多行...
-----END OPENSSH PRIVATE KEY-----
```

❌ 不要加引号、不要合并成一行、不要有多余空格。

---

### 5. 首次手动验证 SSH（可选）

在本地 Mac 保存私钥测试：

```bash
# 将 ECS 私钥保存到本地文件后
chmod 600 ~/github_deploy
ssh -i ~/github_deploy root@47.113.186.224 "echo SSH OK"
```

---

## 日常使用

```bash
# 本地改完代码
git add .
git commit -m "fix: 描述改动"
git push origin main
```

推送后打开 GitHub → **Actions** 标签，查看 **Deploy to ECS** 工作流。

约 **5–15 分钟** 后 ECS 自动更新，访问 `http://47.113.186.224:3000` 验证。

---

## 手动触发部署

GitHub → Actions → Deploy to ECS → **Run workflow**

---

## 故障排查

| 现象 | 处理 |
|------|------|
| Actions SSH 连接失败 | 检查 `ECS_HOST`、私钥格式、安全组 22 端口 |
| SCP 成功但构建失败 | Actions 日志查看 docker build 报错 |
| 部署后 .env 丢失 | workflow 已备份 `.env`；检查 `/tmp/lezyou.env.bak` |
| 页面 502 | `docker compose ps` + `docker compose logs app` |

ECS 上手动部署（不经过 GitHub）：

```bash
cd /opt/lezyou
bash deploy/remote-deploy.sh
```

---

## 正式环境

`.env` 中 `COOKIE_SECURE=true` 时，`remote-deploy.sh` 自动使用 `docker-compose.production.yml`（仅 127.0.0.1:3000，配合 Nginx）。

---

© 2026 乐自由 · CI/CD 手册
