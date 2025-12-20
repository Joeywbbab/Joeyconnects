# Security & Permission System Setup Guide

## 概述

你的网站现在已经实施了完整的权限管理系统，分为两种模式：
- **Viewer Mode（访客模式）**: 所有人可以查看内容，但无法创建、编辑或删除
- **Admin Mode（管理员模式）**: 登录后可以完全控制所有内容

## 🔒 当前实施的安全措施

### 1. 前端权限控制
- ✅ Login app - 完整的登录/登出界面
- ✅ MemoApp - 只有管理员可以创建/删除 memos
- ✅ ComicsApp - 只有管理员可以上传/删除 comics
- ✅ AuthContext - 全局认证状态管理

### 2. 数据库安全 (Row Level Security)
- ✅ RLS 策略已配置（SQL 脚本在 `database/SECURITY_POLICIES.sql`）
- ✅ 所有人可以 READ 数据（公开浏览）
- ✅ 只有认证用户可以 INSERT/UPDATE/DELETE

### 3. Storage 安全
- ✅ 所有人可以查看图片（公开访问）
- ✅ 只有认证用户可以上传/删除文件

## 📋 设置步骤

### Step 1: 配置 Admin 邮箱

编辑 `contexts/AuthContext.tsx` 文件，将你的邮箱添加到管理员列表：

```typescript
// 第 20 行左右
const ADMIN_EMAILS = [
  'your-email@example.com', // 替换为你的实际邮箱
];
```

### Step 2: 在 Supabase 中运行 SQL 脚本

1. 打开 Supabase Dashboard: https://supabase.com/dashboard
2. 选择你的项目
3. 进入 SQL Editor
4. 复制 `database/SECURITY_POLICIES.sql` 的全部内容
5. 点击 "Run" 执行

**重要**: 这个步骤必须完成，否则数据库不安全！

### Step 3: 在 Supabase 中启用 Email Auth

1. 进入 Supabase Dashboard → Authentication → Providers
2. 确保 "Email" provider 已启用
3. 配置邮件模板（可选，用于密码重置等）

### Step 4: 创建 Admin 账户

1. 在 Supabase Dashboard → Authentication → Users
2. 点击 "Add User"
3. 输入你的邮箱和密码（必须是在 Step 1 中添加的邮箱）
4. 点击 "Create User"

或者，在网站上打开 Login app，直接注册（需要验证邮箱）。

### Step 5: 测试权限系统

#### 测试 Viewer Mode（未登录）:
1. 打开网站（不登录）
2. 打开 Memo app - 应该可以看到所有 memos，但编辑区显示 "Viewer Mode" 锁定消息
3. 打开 Comics app - 应该可以看到所有 comics，但上传区显示锁定消息
4. 尝试创建/删除内容 - 应该无法操作

#### 测试 Admin Mode（已登录）:
1. 打开 Login app
2. 使用你的 admin 邮箱登录
3. Login app 应该显示你的角色为 "ADMIN"
4. 打开 Memo app - 应该可以完整使用（创建、删除）
5. 打开 Comics app - 应该可以上传和删除

## 🎯 功能说明

### MemoApp 权限控制
- **未登录/访客**:
  - ✅ 可以查看所有 memos
  - ❌ 无法创建新 memo
  - ❌ 看不到删除按钮
  - 显示 "Viewer Mode" 提示信息

- **Admin 登录后**:
  - ✅ 完整编辑功能
  - ✅ 可以创建、删除 memos
  - ✅ 可以上传图片

### ComicsApp 权限控制
- **未登录/访客**:
  - ✅ 可以查看所有 comics
  - ✅ 可以点击放大查看
  - ❌ 无法上传新 comics
  - ❌ 看不到删除按钮

- **Admin 登录后**:
  - ✅ 完整上传功能
  - ✅ 可以删除 comics

### LoginApp 功能
- 登录界面（邮箱 + 密码）
- 账户信息显示（邮箱、角色）
- 登出功能
- 清晰的权限说明

## 🔐 安全最佳实践

### 已实施：
✅ Row Level Security (RLS) 保护数据库
✅ 前端权限检查（隐藏编辑功能）
✅ 后端权限验证（Supabase Auth）
✅ 公开内容 + 受保护的编辑功能

### 建议添加（未来优化）：
- [ ] 速率限制（防止暴力登录）
- [ ] 两步验证
- [ ] 审计日志（记录所有修改操作）
- [ ] 更细粒度的角色（Editor, Moderator 等）

## 🚨 常见问题

### Q: 我登录后还是无法编辑
**A**: 检查以下项目：
1. 确认登录的邮箱在 `AuthContext.tsx` 的 `ADMIN_EMAILS` 列表中
2. 确认在 Supabase 中成功执行了 RLS 策略 SQL
3. 刷新页面重新登录

### Q: 数据库返回 "permission denied" 错误
**A**: 说明 RLS 策略未正确配置，请重新执行 `database/SECURITY_POLICIES.sql`

### Q: 忘记密码怎么办？
**A**: 可以在 Supabase Dashboard → Authentication → Users 中手动重置密码

### Q: 如何添加其他管理员？
**A**:
1. 在 `AuthContext.tsx` 中添加新的邮箱到 `ADMIN_EMAILS`
2. 在 Supabase 中创建对应的用户账户
3. 重新部署网站

## 📊 安全架构图

```
┌─────────────────────────────────────────────────────┐
│                   Visitor (未登录)                    │
│  - 可以查看所有内容                                      │
│  - 无法创建/编辑/删除                                    │
│  - 前端显示 "Viewer Mode" 锁定                          │
└─────────────────────────────────────────────────────┘
                        │
                        │ 打开 Login app
                        ↓
┌─────────────────────────────────────────────────────┐
│              Supabase Authentication                 │
│  - 验证邮箱和密码                                       │
│  - 检查是否在 ADMIN_EMAILS 列表                        │
└─────────────────────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────┐
│               Admin (isAdmin = true)                 │
│  - 完整的创建/编辑/删除权限                              │
│  - 前端显示所有编辑功能                                  │
│  - 后端 RLS 策略允许所有操作                             │
└─────────────────────────────────────────────────────┘
```

## 🎉 完成！

你的网站现在已经安全了！所有访客可以自由浏览，但只有你（admin）可以修改内容。

记得：
1. ✅ 运行 SQL 脚本配置 RLS
2. ✅ 更新 ADMIN_EMAILS 为你的邮箱
3. ✅ 创建 admin 账户
4. ✅ 测试权限系统

---
生成时间: 2025-12-20
