#!/bin/bash
set -Eeuo pipefail

# 工作目录：默认当前目录，可用环境变量 COZE_WORKSPACE_PATH 覆盖
COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
cd "${COZE_WORKSPACE_PATH}"

echo "==> 开始更新 margin-calc（拉取最新代码）"

# 前置检查：git / pnpm 是否可用
command -v git >/dev/null 2>&1 || { echo "✗ 找不到 git，请先安装 Git"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "✗ 找不到 pnpm，请先安装：npm i -g pnpm"; exit 1; }

# 必须是 git 仓库且配置了 origin 远程
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "✗ 当前目录不是 Git 仓库"; exit 1
fi
if ! git remote get-url origin >/dev/null 2>&1; then
  echo "✗ 没有配置 origin 远程仓库，请先：git remote add origin <仓库地址>"; exit 1
fi

# 工作区必须干净，避免更新把本地未提交改动冲掉
if [ -n "$(git status --porcelain)" ]; then
  echo "✗ 当前有未提交的改动，先 commit 或 stash 再更新，否则会被覆盖："
  git status --short
  exit 1
fi

# 拉取远程 main 最新引用
echo "==> 从 GitHub 拉取最新代码 ..."
git fetch origin main

# 把本地对齐到远程 main：
#  - 已在 main 分支：先尝试快进；若与远程分叉（本地有远程没有的提交），则直接对齐远程（丢弃本地独有提交）
#  - detached HEAD（部署/CI 按 commit 检出的常见情况）：把本地 main 对齐到远程最新
#  - 其他分支：提示先切回 main，避免误改
CURRENT="$(git rev-parse --abbrev-ref HEAD)"
if [ "$CURRENT" = "main" ]; then
  if git merge --ff-only origin/main 2>/dev/null; then
    :
  else
    echo "⚠ 本地 main 与远程分叉，无法直接快进；将把本地对齐到远程最新（丢弃本地独有提交）..."
    git reset --hard origin/main
  fi
elif [ "$CURRENT" = "HEAD" ]; then
  git checkout -B main origin/main
else
  echo "✗ 当前在 '$CURRENT' 分支，更新脚本只支持 main，请先切回 main（git checkout main）"; exit 1
fi

echo ""
echo "✓ 代码已更新到最新版本（main）。如需构建/启动，请手动执行："
echo "    pnpm install && pnpm build   # 或 ./scripts/build.sh"
echo "    pnpm start                   # 生产模式，端口 5000"
echo "    或 ./scripts/start.sh"
