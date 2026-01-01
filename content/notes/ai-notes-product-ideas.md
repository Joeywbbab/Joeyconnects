---
title: AI笔记产品的想法
date: 2025-10-18
tags: [产品, AI, 笔记]
category: thoughts
lang: zh
---

最近发现了几个很心水的产品：chorus, integrity, excalidraw，以及结合 Notebook LM 的一些关于 AI notes app 的想法。

我对于笔记产品非常地痴迷，所以我自己 build 的第一个产品就是笔记产品。在做笔记产品的时候，我就非常清楚知道，这是一个很萝卜白菜各有所爱的区域，因为和用户的习惯和心理等方面强相关。

所以最好的一个方式其实是 flomo 代表的这种方式：我的理念驱动创造出这样的笔记产品，而恰巧有这样的一群人认同我的理念而使用我的产品（flomo = vibe thinking）

---

**核心想法：**

一个 web 端适合的笔记产品应该可以支持"发散"和"收拢"这两种思维习惯，或者准确说使用场景对应的形态。

这周重度使用 excalidraw，我甚至还付费了，这上面承载了我的思考过程（原本一般是手写在本子上）。两个点精准戳中我的喜好：canvas + 手写体像是在自己写笔记。

但当我需要将思考过程和结果沉淀，并且有助于 team work，我会写 doc。所以其实是分场景的。

---

**AI chat 怎么和笔记类的东西结合在一起？**

Pain points:
1. 需要切换多个模型
2. 基于当前对话的分支（better for memory protection）
3. 对内容的回复
4. 对内容的 highlights、保存，形成过程笔记；+ 我的标注和一些思考，AI 帮助我形成最终笔记

---

**关于 canvas 的想法：**

Canvas 是一个很包容的形态，可以放 page, 也可以放 ppt, 表格, 图片，可以画画，也可以在上面画思维导图。

AI answer 应该可以支持生成 mind map，显示在 canvas 上。Canvas 上的一切东西在没有 connect 之前都是 node，AI 除了作为 node 之外，最重要的就是可以做 node 的"尾巴"。

我能不能就像 n8n 一样在 canvas 上写写画画，然后通过有机地连接，点击 execute，将散落的东西 + AI 提供的 knowledge，又有机地组合成为 doc 这种结构化的东西？

**Extendability** — n8n 很喜欢用这个词来描述他们的产品，我也很喜欢。
