# Google OAuth 配置指南

## 概述
本指南将帮助你在 Supabase 中启用 Google OAuth 登录功能。

## 步骤 1: 获取 Google OAuth 凭证

### 1.1 访问 Google Cloud Console
1. 打开 https://console.cloud.google.com/
2. 登录你的 Google 账号

### 1.2 创建新项目（如果还没有）
1. 点击顶部的项目下拉菜单
2. 点击 "NEW PROJECT"
3. 输入项目名称，例如 "Joeyconnects"
4. 点击 "CREATE"

### 1.3 启用 Google+ API
1. 在左侧菜单中，点击 "APIs & Services" → "Library"
2. 搜索 "Google+ API"
3. 点击并启用它

### 1.4 创建 OAuth 凭证
1. 在左侧菜单中，点击 "APIs & Services" → "Credentials"
2. 点击 "CREATE CREDENTIALS" → "OAuth client ID"
3. 如果提示配置同意屏幕，点击 "CONFIGURE CONSENT SCREEN"：
   - User Type: 选择 "External"
   - App name: 输入 "Joeyconnects"
   - User support email: 选择你的邮箱
   - Developer contact: 输入你的邮箱
   - 点击 "SAVE AND CONTINUE"
   - Scopes: 直接点击 "SAVE AND CONTINUE"（默认即可）
   - Test users: 可以添加你的邮箱作为测试用户
   - 点击 "SAVE AND CONTINUE"

4. 返回 "Credentials" 页面，再次点击 "CREATE CREDENTIALS" → "OAuth client ID"
5. Application type: 选择 "Web application"
6. Name: 输入 "Joeyconnects Web Client"
7. **重要**: 在 "Authorized redirect URIs" 中添加：
   ```
   https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback
   ```
   其中 `<YOUR_SUPABASE_PROJECT_REF>` 是你的 Supabase 项目引用 ID

   例如：`https://qepzxintyizhkxnwhctx.supabase.co/auth/v1/callback`

8. 点击 "CREATE"
9. **保存显示的 Client ID 和 Client Secret**

## 步骤 2: 在 Supabase 中配置 Google OAuth

### 2.1 打开 Supabase Dashboard
1. 访问 https://supabase.com/dashboard
2. 选择你的项目

### 2.2 启用 Google Provider
1. 在左侧菜单中，点击 "Authentication" → "Providers"
2. 找到 "Google" 并点击
3. 启用 "Enable Sign in with Google"
4. 输入从 Google Cloud Console 获取的：
   - **Client ID**: 粘贴你的 Google Client ID
   - **Client Secret**: 粘贴你的 Google Client Secret
5. 点击 "Save"

### 2.3 获取回调 URL
在 Google Provider 设置页面，你会看到：
```
Callback URL (for Google Cloud Console):
https://<YOUR_PROJECT>.supabase.co/auth/v1/callback
```
确保这个 URL 已经添加到 Google Cloud Console 的 "Authorized redirect URIs" 中。

## 步骤 3: 测试 Google 登录

### 3.1 在本地测试
1. 启动你的开发服务器
2. 打开网站
3. 点击桌面上的 "Login" 图标
4. 点击 "Continue with Google" 按钮
5. 会跳转到 Google 登录页面
6. 选择你的 Google 账号
7. 授权后会自动返回你的网站

### 3.2 检查登录状态
1. 登录成功后，Login app 会显示：
   - 你的邮箱
   - 你的角色（ADMIN 或 VIEWER）
2. 如果你的邮箱在 `AuthContext.tsx` 的 `ADMIN_EMAILS` 列表中，你会看到 "ADMIN" 角色
3. 如果不在列表中，你会看到 "VIEWER" 角色

## 步骤 4: 添加 Admin 邮箱

编辑 `contexts/AuthContext.tsx` 文件（第 28-30 行）：

```typescript
const ADMIN_EMAILS = [
  'joeybab5207@gmail.com',  // 你当前的邮箱
  'another-admin@gmail.com', // 可以添加更多
];
```

确保你用来登录的 Google 账号邮箱在这个列表中，才能获得 Admin 权限。

## 常见问题

### Q: 点击 Google 登录后出现错误
**A**: 检查以下项目：
1. Google OAuth Client ID 和 Secret 是否正确
2. Redirect URI 是否正确配置
3. Google+ API 是否已启用
4. OAuth 同意屏幕是否已配置

### Q: 登录成功但没有 Admin 权限
**A**: 确认你的 Google 账号邮箱在 `ADMIN_EMAILS` 列表中

### Q: 开发环境下 redirect 不工作
**A**: 确保在 Google Cloud Console 的 "Authorized redirect URIs" 中添加了：
- Supabase 的回调 URL（生产环境）
- 如果需要，也可以添加 `http://localhost:5173` （开发环境）

### Q: 出现 "Access blocked: This app's request is invalid"
**A**: 确保：
1. OAuth 同意屏幕已完成配置
2. 你的邮箱已添加为测试用户（如果应用处于测试模式）

## 安全提示

1. **不要泄露 Client Secret** - 这是敏感信息
2. **定期检查 ADMIN_EMAILS 列表** - 只添加信任的邮箱
3. **启用 Google 两步验证** - 保护你的 Admin 账号
4. **定期审查登录日志** - 在 Supabase Dashboard → Authentication → Users 中查看

## 下一步

配置完成后：
1. ✅ 你可以用 Google 账号一键登录
2. ✅ 访客可以自由浏览所有内容
3. ✅ 只有你（Admin）可以创建、编辑、删除内容
4. ✅ 数据库受 RLS 保护

---
更新时间: 2025-12-20
