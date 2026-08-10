# Concert Image Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible, responsive homepage button that opens the supplied 16 August concert image in a focused modal overlay.

**Architecture:** Keep the feature homepage-only. Add semantic trigger and dialog markup plus scoped styles in `index.html`, isolate interaction state in `concert-overlay.js`, and copy the supplied image into `assets/events/` so the static site can serve it locally and in production.

**Tech Stack:** Static HTML/CSS, browser JavaScript, Node.js built-in test runner, Express, in-app browser.

## Global Constraints

- Preserve the existing piano-inspired black, ivory, and gold visual language.
- The trigger label is exactly `16 August · Concert`.
- The supplied portrait image must remain uncropped.
- Support safe-area insets and viewport widths from 320px upward without horizontal overflow.
- Support close button, backdrop click, Escape, scroll restoration, and focus return.
- Respect `prefers-reduced-motion`.
- Preserve user-owned `.DS_Store` and `screenshots website/` content.
- Do not push changes without explicit user approval.

---

### Task 1: Concert Image Dialog

**Files:**
- Create: `assets/events/yuqiao-chen-16-august-concert.png`
- Create: `concert-overlay.js`
- Modify: `index.html`
- Modify: `tests/profile-content.test.mjs`

**Interfaces:**
- Consumes: `#concert-overlay-trigger`, `#concert-overlay`, `#concert-overlay-close`, `.concert-overlay__backdrop`, and `document.body`.
- Produces: `window.createConcertOverlayController({ trigger, overlay, closeButton, backdrop, body })`, whose `open()` and `close()` methods manage dialog visibility, body scroll state, and focus restoration.

- [ ] **Step 1: Write the failing controller test**

Add a test that loads `concert-overlay.js` in a VM-backed fake browser environment. Use fake elements with `hidden`, `classList`, `focus()`, and event-listener storage. Assert that activating the trigger reveals the dialog, adds `concert-overlay-open` to the body, and focuses the close button; then assert that Escape hides the dialog, removes the body class, and returns focus to the trigger. A missing or inert controller is the production break this test catches.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node --test tests/profile-content.test.mjs`

Expected: FAIL because `concert-overlay.js` and the controller do not exist.

- [ ] **Step 3: Implement the minimal interaction controller**

Create `concert-overlay.js` as a browser-safe IIFE. Define `createConcertOverlayController`, bind trigger click, close-button click, backdrop click, and document keydown, and expose the factory on `window` for the real page and VM test. `open()` stores the active element, removes `hidden`, sets `aria-hidden="false"`, adds the body class, and focuses the close button. `close()` reverses those states and restores focus to the trigger.

- [ ] **Step 4: Add accessible homepage markup and responsive styling**

In the hero, add a native button with id `concert-overlay-trigger` and label `16 August · Concert`. Add a sibling dialog after the main wrapper with `id="concert-overlay"`, `role="dialog"`, `aria-modal="true"`, `aria-labelledby="concert-overlay-title"`, `aria-hidden="true"`, and `hidden`. Include a visually hidden title, backdrop button, close button, and image at `assets/events/yuqiao-chen-16-august-concert.png`.

Add scoped styles that use the existing gold token, a fixed full-viewport overlay, `backdrop-filter: blur(7px)`, safe-area padding, `max-width`/`max-height` plus `object-fit: contain`, visible focus states, compact phone spacing, and a reduced-motion override. Add `<script src="concert-overlay.js" defer></script>`.

- [ ] **Step 5: Copy the supplied image into the project**

Copy `/Users/yuqiaochen/Downloads/14823.PNG` to `assets/events/yuqiao-chen-16-august-concert.png` without transforming it. Confirm dimensions remain 841 × 1870 pixels.

- [ ] **Step 6: Run automated verification**

Run: `npm test`, `npm run check`, and `git diff --check`.

Expected: all commands exit successfully with no warnings or broken site references.

- [ ] **Step 7: Verify real responsive behavior**

Serve the site with `npm start`. At 320px, 390px, 768px, and 1280px widths, verify the button is visible in the hero; the dialog opens above the homepage; the image is fully visible and uncropped; the backdrop is dimmed and blurred; the page has no horizontal overflow; background scrolling is locked; close button, backdrop, and Escape all close it; and focus returns to the trigger.

- [ ] **Step 8: Commit the verified feature**

Stage only `index.html`, `concert-overlay.js`, `tests/profile-content.test.mjs`, `assets/events/yuqiao-chen-16-august-concert.png`, and this plan. Commit with `feat: add concert image overlay`.
