---
title: GEO is SEO for AI Answers (and it's not optional anymore)
date: 2025-12-23
tags: [seo, ai, marketing, optimization]
category: newsletter
excerpt: If you do marketing long enough, you eventually learn a depressing truth - you don't control the distribution. In the LLM era, if your brand isn't inside that AI-generated paragraph, you can be the best product in the world and still lose.
---

If you do marketing long enough, you eventually learn a depressing truth: you don't control the distribution.

In the Google era, the distribution was a list of blue links. In the LLM era, the distribution is a paragraph that sounds confident.
And if your brand isn't inside that paragraph, you can be the best product in the world and still lose.

That is what people mean by **GEO — Generative Engine Optimization**.

---

## 1) What is GEO?

**SEO** is about ranking on the search engine results page.

**GEO** is about being **mentioned** (and ideally **cited**) inside an AI-generated answer.

Same intent. Different surface area.

| Aspect | SEO | GEO |
|---|---|---|
| Output | Links | Synthesized answer (sometimes with citations) |
| Primary object | Keyword | Prompt (a question) |
| Winning signal | Ranking | Mention, position in answer, citation rate |
| Controller | Search algorithm | LLM behavior (mostly a black box) |

### A concrete example

User asks: **"What's the best project management tool for startups?"**

- In SEO: you try to rank for this (or a close variant).
- In GEO: you try to be the tool the model *names*, and the page it *cites*.

The important detail: LLM queries tend to be **long-tail and conversational**. They read like what a person would say out loud. That changes how you discover demand, and how you write.

### Who should care?

If you're tiny, GEO might be a distraction. If you're medium-sized and you already invest in content and SEO, GEO is the next obvious frontier.

In practice, the biggest near-term beneficiaries are:

- SaaS (people ask AI which tool to buy)
- E-commerce / consumer products (people ask AI what to choose)

And no, GEO doesn't "kill" SEO. GEO is built on top of SEO. If your SEO foundation is weak, GEO is mostly wishful thinking.

---

## 2) The real mechanics: Prompts → Answers → Citations

When people discuss GEO, they often mix two different dimensions:

1. **Performance dimension**: prompts, answers, citations (what you measure)
2. **AI-friendliness dimension**: structure, schema, authority, freshness (what you improve)

Most confusion comes from treating these as one bucket. They're not.

Here's a useful mental model:

> **GEO success = SEO fundamentals + content that LLMs can reliably extract and cite**

---

## 3) Prompts are the new keywords (but they're richer)

If you remember nothing else, remember this:

> In GEO, **prompts** play the role keywords played in SEO — but they encode more context and intent.

Why prompts matter:

- They mirror the user's actual problem (and the brand's position in that problem space)
- They decide what the model "thinks" the question is
- They reveal which domains the model treats as authoritative

### How to find good prompts (practical)

Don't start by brainstorming "creative prompts." Start by collecting the language users already use.

Good sources:

- Your own website: FAQ, help center, product pages ("what is X?", "how does X work?")
- Industry communities: Reddit, forums, Discords ("what do people argue about?")
- Customer support: the raw phrasing people use when they're confused
- Competitors: the categories they own and the claims they repeat

Three prompt angles that usually work:

- **Reputation**: "Is [Brand] reliable? Is it safe? Is it worth it?"
- **Feature**: "Best tool for [use case]? Can [tool] do [specific thing]?"
- **Comparison**: "[Brand A] vs [Brand B] for [use case]"

---

## 4) The black box: how to test without pretending it's science

LLMs are black boxes. You won't get clean causal results.
But you can still run useful experiments.

What to do:

- Write scripts (or use tools) to run a stable prompt set repeatedly
- Track changes over time (mentions, position, citations)
- Vary one thing at a time when you can: prompt phrasing, page, structure, claim

What not to do:

- Don't treat one response as truth.
- Don't optimize for a single model's quirks and call it a strategy.

---

## 5) Make your site "AI-readable"

Even though prompts drive the conversation, **content structure** determines whether you're extractable.

If a model can't easily locate the answer on your page, it can't confidently cite it.

Basic structural wins:

- Clear headings (H1/H2 with meaningful labels)
- FAQ sections where they actually make sense
- Lists and short, direct definitions
- Updated timestamps when freshness matters
- Schema markup where appropriate

This is the part where GEO looks suspiciously like "good SEO + good writing." That's because it is.

---

## 6) Finding GEO opportunities: treat it like a competitive map

Opportunities are easiest to define relative to competitors.

| You | Competitor | What it means | What to do |
|---|---|---|---|
| Mentioned | Not mentioned | You're winning | Maintain: refresh, deepen authority |
| Not mentioned | Mentioned | You're losing | Create: new angles, stronger pages |
| Mentioned | Mentioned | Competitive | Analyze: sentiment, position, depth |
| Not mentioned | Not mentioned | White space | Move first: claim the topic |

### Example: Manus and "AI presentations"

Suppose Manus is an AI agent expanding into "AI presentation tools," but prompt testing shows Manus is rarely mentioned.

This tells you two things:

1. The market exists (otherwise competitors wouldn't show up consistently).
2. Your positioning isn't legible to the model yet.

A reasonable plan:

- Create pages that explicitly link "AI agent" → "creates presentations"
- Target office-worker pain: speed, templates, polish, story structure
- Build topic clusters: Manus + presentation + use case + outcomes
- Study what competitors get cited for, and cover the missing pieces

Prompt testing doesn't just diagnose your weakness. It tells you who the model thinks is the authority — which is basically competitor research with less pretending.

---

## 7) Attribution: the best imperfect system we have

Attribution in GEO is messy because the system is opaque.
So you measure what you can observe directly.

What usually matters:

- **Mentions**: do you appear at all?
- **Position**: are you first, mid-pack, or a footnote?
- **Citations**: does the model link to your site?
- **Sentiment**: is the mention positive, neutral, or cautious?

### A simple prompt-testing loop

```
1) Pick a topic set (your key use cases)
2) Write prompt variants (reputation / feature / comparison)
3) Test across models (ChatGPT, Gemini, Perplexity)
4) Record: mention? position? citation? sentiment?
5) Ship content improvements
6) Re-test in 2–4 weeks
```

### Referral traffic (when you can get it)

Some platforms send identifiable referrals (e.g. Perplexity). Many don't, or show up as "direct."
So treat referral data as a helpful signal, not as a full measurement system.

Also watch **branded search**. If GEO works, people often discover you in AI, then search your name to verify.

---

## Closing

GEO isn't magic. It's not even new in spirit.
It's the same old game: understand the question, publish the best answer, earn trust.

The only difference is where the answer shows up.
