#!/bin/bash
# 推送 FlowTree 到 GitHub
# 使用方法：先替换 YOUR_GITHUB_USERNAME，然后运行：bash push-to-github.sh

# GitHub 配置
GITHUB_USERNAME="Joeywbbab"
REPO_NAME="FLOWTREE"

# 添加远程仓库（如果还没有添加）
if ! git remote | grep -q origin; then
    git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git
fi

# 推送到 GitHub
git branch -M main
git push -u origin main

echo "✅ 推送完成！访问 https://github.com/${GITHUB_USERNAME}/${REPO_NAME} 查看你的仓库"

