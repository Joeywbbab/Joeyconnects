---
title: FlowTree
description: Interactive flow management tool for product designers
problem: Complex user flows are hard to visualize and test interactively
solution: A visual tool that lets designers create, test, and iterate on user flows in real-time
features:
  - Drag-and-drop flow builder
  - Interactive prototype mode
  - Export to various formats
  - Collaborative editing
tech:
  - HTML5
  - CSS3
  - JavaScript
  - LocalStorage API
demoUrl: /products/flowtree/app/app.html
status: active
---

## The Problem

When designing products, user flows become complex quickly. Traditional flowchart tools are static and don't allow designers to actually test the experience. Prototyping tools are too heavy for quick iterations.

I needed a lightweight tool that bridges the gap between flowcharts and prototypes.

## The Solution

FlowTree is an interactive flow management tool that lets you:

1. **Build flows visually** - Drag and drop nodes to create user journeys
2. **Test interactively** - Click through your flows as if they were live
3. **Iterate quickly** - Make changes and test immediately
4. **Export easily** - Share your flows in multiple formats

## How It Works

The tool uses a simple node-based system where each node represents a step in your user journey. Connect nodes to create paths, add conditions for branching, and test the entire flow interactively.

All data is stored locally in your browser, so your flows are private and always available.

## Try It Out

[Launch FlowTree](/products/flowtree/app/app.html)

---

Built with vanilla JavaScript for maximum performance and minimal dependencies.
