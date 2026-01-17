---
title: AI笔记产品的想法
date: 2025-10-18
tags: [产品, AI, 笔记]
category: thoughts
lang: zh
---

最近发现了几个很心水的产品：chorus, integrity, excalidraw，以及结合 Notebook LM 的一些关于 AI notes app 的想法。

我对于笔记产品非常地痴迷，所以我自己 build 的第一个产品就是笔记产品，虽然它现在演变成为了项目管理的 app。

在做笔记产品的时候，我就非常清楚知道，这是一个很萝卜白菜各有所爱的区域，因为和用户的习惯和心理等方面强相关。

所以最好的一个方式其实是 flomo 代表的这种方式：我的理念驱动创造出这样的笔记产品，而恰巧有这样的一群人认同我的理念而使用我的产品（我看过一个用户对 flomo 的反馈，非常贴切，flomo = vibe thinking）。

---

## 这段时间的新想法（AI-powered, web-formed 笔记产品）

以群来划分用户，每一个群体最舒服的方式是不一样的。

有些人喜欢 markdown，有些人喜欢 canvas……

integrity 做得很好的一点是，他意识到了这个事情：产品里包含 canvas 和 page 两种记录方式，canvas 同时又可以承载 page，因为 canvas = workspace。

### 第一点：发散 + 收拢两种形态

一个 web 端适合的笔记产品应该可以支持“发散”和“收拢”这两种思维习惯，或者准确说使用场景对应的形态。

为什么这么说？

因为我 review 了一下我这周的使用轨迹，什么情况下会使用哪一个，为什么要切换。

这周重度使用产品 excalidraw，我甚至还付费了，这上面承载了我的思考过程（原本一般是手写在本子上）。

两个点精准戳中我的喜好：canvas + 手写体像是在自己写笔记（包括方框和圆形，每一个方框和圆形都不一样）。

但当我需要将思考过程和结果沉淀，并且有助于 team work，我会写 doc。

所以其实是分场景的，不同场景的需要 -> 有不同的形态（好比飞书 / Lark，有 doc, mindmap, board）。

integrity 做得很好的第二个点是，他提供了这种用户的自主性（我喜欢这种感觉，我可以按照我自己的需求，组合各种样式，在他提供给我的窗口进行编辑，虽然他现在一些东西反映出来技术 support 不太行），我可以点击 “add split view”，去增加一个 page, canvas 以及 AI 对话区。

I have to say, canvas 是一个很包容的形态，可以放 page，也可以放 ppt、表格、图片，可以画画，也可以在上面画思维导图。某种程度上，也支持协作。

---

## 第二点：AI chat 和笔记怎么结合

Pain points:
1. 需要切换多个模型
2. 基于当前对话的分支（better for memory protection）
3. 对内容的回复
4. 对内容的 highlights、保存，形成过程笔记；+ 我的标注和一些思考，AI 帮助我形成最终笔记

对于前三点，chorus 做得还不错。还不错的原因是，他的功能是我需要的，但还差一点是因为：
1. AI answer 很长，但是对于 answer 编辑的功能按钮不会固定，需要滑动点击
2. AI answer 很长，尤其是在多个模型 answer 长度不一致，说实话除了有点丑之外，对照性降低了

这个问题局限于对话框。

在 integrity 基础上讨论：
1. AI answer 应该可以支持生成 mind map，显示在 canvas 上；同时如果添加形状工具（方块）通过 tab / shift + enter 等可以创建 mind map
2. 在 canvas 里对于一些内容的 ask AI，AI answer 应该像 comment 一样存在：AI comment 的 signal 以及“评论区”一样展示
3. 如果 AI answer 在 canvas 上出现，能够对 AI answer 编辑，包括对部分进行 “extension” 很重要。“extendability，n8n 很喜欢用这个词来描述他们的产品，我也很喜欢”。Actually，canvas 上的一切东西在没有 connect 之前都是 node，AI 除了作为 node 之外，最重要的就是可以做 node 的“尾巴”（我能不能就像 n8n 一样在 canvas 上写写画画，然后通过有机地连接，点击 execute，将散落的东西 + AI 提供的 knowledge，又有机地组合成为 doc 这种结构化的东西）
4. 对 AI answer 的过程笔记可以人工复制粘贴在 page 上，+ 我的标注和一些思考，AI 帮助我形成最终笔记（和 granola 又有点不谋而合了）
5. 如何添加和查看外部信息，在 AI chat 区增加 tab，以查看上传学习资料的记录，还可以通过上传的区域不同明晰是否需要 AI 辅助做一些东西，比如在 chat 区上传，提出要求就这份资料做某事，在资料区上传，可以点击预览，不需要从当前状态退出
6. 希望它的 canvas 可以更 excalidraw 一点
