---
title: Linear Clone
description: Minimalist project management for personal projects
problem: Existing project management tools are too complex for simple personal projects
solution: A streamlined, keyboard-first project manager inspired by Linear's design philosophy
features:
  - Keyboard shortcuts for everything
  - Minimal, distraction-free interface
  - Fast search and filtering
  - Markdown support
tech:
  - React
  - TypeScript
  - Tailwind CSS
  - IndexedDB
status: active
---

## The Problem

Tools like Jira, Asana, and Monday are powerful but overwhelming for personal projects. They have:
- Too many features you'll never use
- Slow, clunky interfaces
- Designed for teams, not individuals

I wanted something as simple as a text file but with the power of a real project manager.

## The Solution

A minimalist project management tool inspired by Linear's clean design and keyboard-first philosophy, but optimized for solo developers.

### Key Features

**Keyboard-First**
- Create tasks with `C`
- Navigate with arrow keys
- Search with `Cmd+K`
- Complete with `Enter`

**Minimal UI**
- No distracting sidebars
- Focus mode for deep work
- Clean, uncluttered design

**Smart Organization**
- Auto-categorize with labels
- Filter by status, priority, date
- Markdown in descriptions
- Quick capture from anywhere

## Design Philosophy

1. **Speed** - Everything should be instant
2. **Simplicity** - If you need to read docs, it's too complex
3. **Beauty** - Good design aids productivity
4. **Keyboard** - Mouse is optional, not required

## Technical Details

Built with React and TypeScript for type safety. Uses IndexedDB for local-first storage - your data never leaves your machine.

Tailwind CSS keeps the bundle small while maintaining a beautiful, responsive design.

---

Currently in private beta. Building the core workflow before public launch.
