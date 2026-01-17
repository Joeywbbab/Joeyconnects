---
title: Finding Content Opportunities in Noise
date: 2026-01-01
tags: [marketing, research, workflow]
category: work
description: A practical framework for turning messy Reddit discussions into a systematic content roadmap, plus early results and what still needs validation.
excerpt: Most content marketing is guesswork. Here's an attempt to make it systematic—by mapping Reddit discussions to a framework that works across industries. Research in progress.
---

Most content teams operate on intuition. Someone reads a few blog posts, checks what competitors are doing, maybe scrolls Reddit for an hour, and comes up with a content calendar. It works, kind of. But it doesn't scale, and it's hard to know if you're missing obvious opportunities.

This article focuses on a **"opportunity product"** approach to content: content designed to fill demand gaps in a category. It is more useful for products and teams than for individuals, especially influencers. For a personal creator, this framework might feel heavy or even counterproductive.

In practice, the contrast is:
- **Opportunity content** (this article): map a category, find gaps, and build a coverage plan around demand.
- **Creator content** (personal/influencer): lead with taste and narrative; choose topics that reinforce your voice, not necessarily the biggest gaps.

I've been working on something different: a systematic way to discover content opportunities from unstructured social discussions. The core idea is simple—what if you could take thousands of Reddit posts, cluster them into topics, and map them onto a framework that tells you exactly where the gaps are?

My working hypothesis is:
1) For any category (e.g. AI coding editors, project management tools), the set of **topics is exhaustible**.
2) In this article, a "topic" means a problem definition that sits at the intersection of user journey stage and product aspect.
3) Topics derived from social discussions are user-voice grounded, and volume indicates which problems matter most.
4) For any specific product, its content topics are a **subset** of the category topic set.

That gives two practical uses:
- Use the category topic map to structure your content layout, focusing on where you already play and on related topics you can expand into.
- Use your existing content coverage to see what users care about most, then decide what to fix or build next.

![Framework flow from social sources to content opportunities](/images/writing/finding-content-opportunities-flow.png)

This is still research in progress. Maybe 60% figured out. But the parts that work are interesting enough to share.

## TL;DR

- Use a 7×8 matrix (journey stage × product aspect) to structure content opportunities.
- Cluster Reddit discussions into topics and map them to the matrix cells.
- The empty cells point to high-intent gaps you can fill with targeted content.

## The Problem With "Just Listen to Your Users"

Everyone says to listen to your users. But actually doing it at scale is surprisingly hard.

Reddit alone has thousands of subreddits where people discuss software tools. A single category like "AI code editors" might have relevant discussions spread across r/cursor, r/vscode, r/neovim, r/programming, r/LocalLLaMA, and dozens more. The conversations are messy—memes mixed with genuine pain points, promotional posts mixed with honest reviews.

Even if you read everything, you'd struggle to answer: what should we write about first? Which topics matter most? Where are we missing content that competitors have?

The usual approach is to hire someone with good judgment and let them figure it out. That works for one brand, but it doesn't generalize. Every new product requires rebuilding the intuition from scratch.

## A Framework That Works Across Industries

The insight that got me started: the questions users ask about any tool follow predictable patterns.

Whether it's an AI video generator, a meeting transcription app, or a project management tool—users go through similar stages and care about similar dimensions. The specifics differ, but the structure is the same.

**User journey stages (Y-axis):**

| Stage | What users ask |
|-------|----------------|
| Awareness | "What is this? What can it do?" |
| Consideration | "Which one should I choose? A vs B?" |
| Decision | "How much does it cost? Is it worth it?" |
| Onboarding | "How do I get started?" |
| Usage | "How do I do X?" |
| Troubleshooting | "Why isn't this working?" |
| Advanced | "What are the pro tips?" |

**Product aspects (X-axis):**

| Aspect | What users care about |
|--------|----------------------|
| Quality | "Are the results good?" |
| Control | "Can I customize it?" |
| Efficiency | "Is it fast? Does it save time?" |
| Usability | "Is it easy to learn?" |
| Pricing | "Is it expensive?" |
| Integration | "Does it work with my other tools?" |
| Reliability | "Is it stable?" |
| Comparison | "How does it compare to alternatives?" |

Put these together and you get a 7×8 matrix with 56 cells. Each cell represents a specific content opportunity: "consideration × comparison" is competitive analysis content, "troubleshooting × integration" is documentation for common integration issues.

The framework is generic by design. Like how customer service categories (shipping, refunds, product quality) work for any e-commerce business, these dimensions work for any tool.

## Testing the Framework

I ran this against four different product categories to see if it actually generalizes:

| Category | Posts analyzed | Top brands mentioned |
|----------|---------------|---------------------|
| AI Video Generator | 532 | Runway, Sora, Kling |
| AI Code Editors | 440 | Cursor, VSCode, Neovim |
| AI Coding Tools | 446 | Cursor, Codeium, Claude |
| AI Writing Tools | 407 | Claude, ChatGPT, Gemini |

The distribution of user journey stages was remarkably consistent:

| Stage | Share of discussions |
|-------|---------------------|
| Usage | 21% |
| Consideration | 19% |
| Troubleshooting | 17% |
| Decision | 12% |
| Onboarding | 11% |
| Advanced | 10% |
| Awareness | 6% |

Usage and consideration dominate. Awareness is surprisingly small—by the time people are discussing tools on Reddit, they already know what category they're in.

## The Pipeline

The actual process has five steps:

**1. Fetch** — Pull posts from relevant subreddits using the Reddit API. For AI code editors, that's r/cursor, r/vscode, r/neovim, r/LocalLLaMA, etc.

**2. Filter** — Most Reddit content is noise. Memes, off-topic discussions, promotional spam. Use a combination of rule-based filters and LLM classification to keep only substantive discussions.

**3. Cluster** — Group similar posts into topics using LLM-driven clustering. "Cursor pricing complaints" becomes one cluster, "Neovim plugin recommendations" becomes another.

**4. Map** — Assign each cluster to a cell in the framework matrix. This is where the structure comes in—every topic gets labeled with its journey stage and product aspect.

**5. Output** — Generate recommendations based on what's hot (high discussion volume) and what's missing (gaps between social discussions and existing brand content).

## What the Output Looks Like

Here's a sample from the AI code editor analysis:

| Stage | core_fun | model_ca | performa | usabil. | pricing | integrat |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| awareness | ██░░ | ---- | ---- | ---- | ---- | ---- |
| considerat | ████ | ████ | ████ | ---- | █░░░ | ██░░ |
| decision | █░░░ | ███░ | █░░░ | ---- | ██░░ | ---- |
| onboarding | ---- | ---- | ---- | ███░ | ---- | ---- |
| usage | ████ | ███░ | █░░░ | ████ | ---- | ---- |
| troublesho | ████ | █░░░ | ███░ | ██░░ | ██░░ | ---- |
| advanced | ---- | ---- | ██░░ | ---- | ---- | ---- |

The filled cells show where discussions are happening. The empty cells are potential content opportunities—topics users care about but aren't being addressed.

The pipeline also identifies:

**Top brand mentions:**
- Neovim: 387 mentions (76 posts)
- Cursor: 173 mentions (73 posts)
- VSCode: 172 mentions (75 posts)
- Claude: 65 mentions (32 posts)

**Brand co-occurrences:**
- Claude + Cursor: 18 times
- VSCode + GitHub Copilot: 10 times
- VSCode + Neovim: 9 times

**Negative sentiment hotspots:**
- Performance and Stability Issues: -0.90 sentiment
- Pricing and Subscription Issues: -0.80 sentiment
- Connectivity and Errors: -0.80 sentiment

These tell you not just what to write about, but what angles matter. If "Cursor pricing" has negative sentiment, that's a pain point worth addressing. If Claude and Cursor are frequently mentioned together, a comparison piece makes sense.

## Case Study: Manus

I ran the full pipeline for Manus, an AI agent product.
**Input:** 246 Reddit posts from AI/automation subreddits + analysis of 13 pages on their website.

Key finding: 96 posts discussed the consideration stage (people comparing Manus to alternatives), but the website had zero comparison content. That's a significant gap.

The output was specific enough to act on:

| Priority | Content piece | Rationale |
|----------|--------------|-----------|
| P0 | "Manus vs ChatGPT: Who's better for automation?" | 96 Reddit posts, 0 website coverage |
| P0 | FAQ page | 17 troubleshooting posts, no help content |
| P0 | 15 use case roundup | Consolidate existing showcases |
| P1 | AI Agent selection guide | Category keyword opportunity |

This isn't just "write more content." It's "write this specific content, in this priority order, because the data shows these gaps."

## What's Still Uncertain

I said this is 60% figured out. Here's what's still unclear:

**Validation mechanism.** For website content, you'd want to validate with search volume data before investing in production. The pipeline identifies opportunities but doesn't tell you which ones have SEO potential. That's a separate problem.

**Entity recognition.** The brand mention extraction works reasonably well for major brands but misses nuanced cases. "Copilot" might refer to GitHub Copilot or Microsoft Copilot—context matters and isn't always captured.

**Website content analysis.** Comparing Reddit discussions to existing brand content requires understanding what the brand already covers. This part of the pipeline is rougher than the social listening part.

## The Bigger Picture

This research connects to something I've been thinking about more broadly: how do you systematically understand what your market cares about?

The same framework that finds content opportunities could potentially:
- Guide product feature prioritization (what dimensions have the most pain?)
- Inform positioning (which comparison angles matter most?)
- Track perception over time (how is sentiment shifting?)

The content opportunity use case is just the most immediate application. If the framework holds, it could be useful for other things.

For now, though, I'm focused on making the content piece work reliably. The pipeline produces useful outputs, but it needs more validation across different types of products and markets before I'd call it ready for production use.

If you're working on something similar or have thoughts on the approach, I'd be interested to hear about it.

---

*This is an ongoing research project. Some details may change as I learn more.*
