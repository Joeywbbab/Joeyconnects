# Blog Content

This folder contains blog posts that will be displayed on the Write app.

## Writing Workflow

1. Create a new Markdown file in the `posts/` folder
2. Add frontmatter with title, date, tags, and excerpt
3. Write your content in Markdown
4. Commit and push to GitHub
5. The website will automatically fetch and display your posts

## Post Categories

Posts can be categorized as:
- **blog**: Regular blog posts
- **newsletter**: Newsletter-style content
- **tutorials**: Step-by-step tutorials

## Post Format

Each post should be a Markdown file with frontmatter:

```markdown
---
title: "Your Post Title"
date: 2025-01-15
tags: [tag1, tag2, tag3]
category: blog
excerpt: "A brief description of your post..."
---

Your post content starts here...

You can use standard Markdown formatting:
- Lists
- **Bold** and *italic* text
- Links
- Code blocks
- And more!
```

## File Naming Convention

Use descriptive filenames with dates:
- `2025-01-15-my-first-post.md`
- `2025-02-01-product-thinking.md`
- `2025-03-10-ai-notes.md`

## GitHub Integration

These posts will be displayed on your website through the Write app, which fetches from your GitHub repository using the GitHub Public API.

See `example-post.md` in the `posts/` folder for a template.
