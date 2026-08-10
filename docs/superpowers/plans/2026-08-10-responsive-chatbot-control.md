# Responsive Chatbot Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Position the shared chatbot control below the piano keyboard across mobile, tablet, and desktop viewports.

**Architecture:** Define the keyboard height and control gap as CSS custom properties in `chatbot-shared.css`. Use one base positioning formula and override only the keyboard height, gap, sizing, and label visibility at the existing mobile breakpoint.

**Tech Stack:** Static HTML, CSS, Node.js test runner, in-app browser.

## Global Constraints

- Preserve the piano-inspired gold control and existing chatbot behavior.
- Apply the fix through shared CSS so all public pages stay consistent.
- Support safe-area insets and widths from 320px upward without body overflow.
- Do not alter user-owned `.DS_Store` or `screenshots website/` content.

---

### Task 1: Responsive Chatbot Positioning

**Files:**
- Modify: `chatbot-shared.css`
- Modify: `tests/profile-content.test.mjs`

**Interfaces:**
- Consumes: `.ai-chatbot-button`, `.ai-text`, and the piano navigation's 90px desktop / 50px mobile heights.
- Produces: `--piano-nav-height`, `--chat-control-gap`, and a fixed `top` formula shared by all pages.

- [ ] **Step 1: Write the failing test**

Add a test that reads `chatbot-shared.css` and requires `--piano-nav-height: 90px`, `--chat-control-gap: 24px`, `top: calc(var(--piano-nav-height) + var(--chat-control-gap))`, `env(safe-area-inset-right, 0px)`, and mobile overrides of 50px / 20px with icon-only text at 480px.

- [ ] **Step 2: Run the focused test to verify it fails**

Run `node --test tests/profile-content.test.mjs`. Expected: failure because the shared variable-based positioning is absent.

- [ ] **Step 3: Implement the minimal shared CSS**

Define the two variables on `.ai-chatbot-button`, replace fixed `top` and `right` values with calculated keyboard clearance and safe-area spacing, remove conflicting breakpoint-specific top values, and add mobile variable overrides.

- [ ] **Step 4: Verify automated checks**

Run `npm test`, `npm run check`, and `git diff --check`. Expected: all commands exit successfully.

- [ ] **Step 5: Verify real responsive layouts**

At 320px, 390px, 480px, 768px, 875px, and 1280px, confirm the control begins below the navigation by the intended gap, remains within the viewport, uses icon-only treatment at 480px and below, retains its label above 480px, and opens the chatbot.

- [ ] **Step 6: Commit**

Stage only the spec, plan, test, and shared CSS, then commit with `fix: separate chatbot control from piano navigation`.
