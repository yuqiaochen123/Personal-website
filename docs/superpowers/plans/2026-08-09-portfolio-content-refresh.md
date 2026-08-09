# Portfolio Content Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the portfolio with Yuqiao Chen's confirmed 2026 achievements, four-identity positioning, upcoming recital, active AI music-learning work, and complete removal of the discontinued SATB analyzer.

**Architecture:** Preserve the static HTML/CSS architecture and piano-inspired design. Add a browser-compatible canonical profile data file, keep visible facts in semantic HTML, enforce content consistency with dependency-free Node tests, and validate responsive behavior in a real browser.

**Tech Stack:** HTML, CSS, browser JavaScript, Node.js built-in test runner, Express, GitHub Pages.

## Global Constraints

- Publish only facts approved in `docs/superpowers/specs/2026-08-09-portfolio-content-refresh-design.md`.
- Label the August 16, 2026 event as upcoming and never imply it has already occurred.
- Remove every production SATB analyzer reference, control, modal, script, style, and dead link.
- Preserve the existing performance imagery, piano navigation, preloader, chatbot, contact flow, and user-owned screenshot files.
- Keep core visible content in semantic HTML so it works through both `file://` and the local server.
- Do not invent a public URL for the music-theory and aural-learning platform.
- Do not push to GitHub during implementation.

---

### Task 1: Canonical Profile Data and Content Guardrails

**Files:**
- Create: `profile-data.js`
- Create: `tests/profile-content.test.mjs`
- Modify: `scripts/check-site.mjs`

**Interfaces:**
- Produces: `window.YUQIAO_PROFILE` in browsers and `YUQIAO_PROFILE` from CommonJS.
- Produces: tests rejecting SATB production references, predicted 41/42, and missing confirmed facts.

- [ ] Write a failing test that loads canonical profile data in a VM context and asserts IB 45/45, RCM four-year full scholarship, IELTS 8.0, SAT 1520, Apple Music No. 1 and repeated Top 10 recommendations, Chinese/English/French, the AI learning platform, and an upcoming August 16 event.
- [ ] Write a failing production-source scan asserting that top-level HTML, production CSS, and production JavaScript contain no SATB IDs, SATB analyzer copy, dead Netlify URL, or predicted 41/42 claim.
- [ ] Run `node --test tests/profile-content.test.mjs`; confirm failure because the data file is absent and SATB content remains.
- [ ] Implement `profile-data.js` as a dependency-free UMD-style frozen object that works through `<script>` and `require()` without network fetches.
- [ ] Add `profile-data.js` to the JavaScript syntax list in `scripts/check-site.mjs`.
- [ ] Re-run the focused test; canonical-data assertions pass while the production SATB scan still fails.
- [ ] Commit with `test: add portfolio content guardrails`.

### Task 2: Remove the Discontinued SATB Analyzer

**Files:**
- Modify: `index.html`, `global-experience.html`, `accolades.html`, `media-blog.html`, `karma-and-me.html`, `contact.html`, `blog.html`, `gallery.html`
- Modify: `chatbot-shared.css`

**Interfaces:**
- Consumes the source-scan test from Task 1.
- Produces pages with the chatbot button as the only floating action.

- [ ] Run the profile-content test and capture the SATB failures.
- [ ] Remove `satb-projects-btn`, `satb-projects-overlay`, modal content, dead link, and SATB inline event code from every top-level HTML page.
- [ ] Remove SATB-only positioning/selectors from `chatbot-shared.css`; retain chatbot layout at desktop and mobile sizes.
- [ ] Run `node --test tests/profile-content.test.mjs`, `npm test`, and `npm run check`; all pass.
- [ ] Commit with `refactor: remove discontinued SATB analyzer`.

### Task 3: Homepage Four-Identity Experience

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes approved profile facts from Task 1.
- Produces semantic `current-chapter`, `identity-grid`, and `upcoming-event` sections.

- [ ] Add a failing source-level content test asserting the homepage contains four identity headings, an upcoming-event label, RCM scholarship, IB 45/45, and AI product language.
- [ ] Run the focused test and verify it fails because the sections are absent.
- [ ] Replace the hero subtitle with `Pianist · Scholar · AI Builder · Global Citizen` and replace the generic update announcement with a concise current-chapter line.
- [ ] Add a biography section, four identity cards, and an August 16 upcoming-event feature below the hero using semantic headings and links to relevant internal pages.
- [ ] Add intentional responsive styling in `styles.css`, reusing the existing black, ivory, and gold palette with clear typography and restrained motion.
- [ ] Update the homepage footer year to 2026.
- [ ] Run focused and complete tests; confirm pass.
- [ ] Commit with `feat: present Yuqiao's current chapter`.

### Task 4: Accolades, Global Experience, Media, and Recording Story

**Files:**
- Modify: `accolades.html`
- Modify: `global-experience.html`
- Modify: `media-blog.html`
- Modify: `karma-and-me.html`

**Interfaces:**
- Produces corrected academic results, current professional achievements, London next chapter, and upcoming-event coverage.

- [ ] Extend the content test to assert the final IB score replaces predicted grades; Accolades includes RCM, Apple Music, IELTS, SAT, HKU offer, and AI product; Global includes London as next chapter; Media marks the recital upcoming.
- [ ] Run the focused test and verify the new assertions fail.
- [ ] Add 2026 cards at the top of relevant Accolades categories and replace the predicted-grade card with the final result.
- [ ] Add “Next Chapter: London” to Global Experience, explicitly future-facing.
- [ ] Add the August 16 event and planned Bach/Chopin/Debussy/Rachmaninoff program to Media, explicitly upcoming.
- [ ] Correct Karma & Me recording language to match Apple Music No. 1 and repeated Top 10 recommendation facts without changing its personal narrative.
- [ ] Run focused and complete tests; confirm pass.
- [ ] Commit with `feat: update 2026 achievements and engagements`.

### Task 5: Chatbot, Metadata, and Maintenance

**Files:**
- Modify: `chatbot-v3.js`
- Modify: all public top-level HTML pages
- Modify: `README.md`
- Modify: `tests/profile-content.test.mjs`

**Interfaces:**
- Consumes `window.YUQIAO_PROFILE` when available.
- Produces accurate 2026 chatbot context, metadata, and update guidance.

- [ ] Add failing tests asserting each public page has a Yuqiao-specific title and meta description, visible copyright years are 2026, and chatbot source contains no stale predicted score or 8M-only fallback.
- [ ] Run the focused test and verify failure.
- [ ] Load `profile-data.js` before chatbot scripts on public pages and build the chatbot system context from canonical profile data with a safe embedded fallback.
- [ ] Update chatbot welcome/fallback responses to distinguish completed achievements from the upcoming recital.
- [ ] Update titles, descriptions, and copyright years on public pages.
- [ ] Add README instructions for updating `profile-data.js` and converting the upcoming event to a completed engagement after it occurs.
- [ ] Run focused and complete tests; confirm pass.
- [ ] Commit with `chore: align portfolio metadata and chatbot`.

### Task 6: Full Verification and Local Integration

**Files:**
- Verify only unless a check exposes a defect.

**Interfaces:**
- Produces a locally merged, reviewed portfolio update without publishing.

- [ ] Run `npm test`, `npm run check`, `npm audit --audit-level=low`, `npm ls --depth=0`, and `git diff --check`.
- [ ] Start the site on an unused local port and verify homepage HTTP 200 plus invalid chatbot request HTTP 400.
- [ ] In a real browser verify desktop, 875px, and 390px widths; confirm piano navigation labels/scrolling, the four identity cards, upcoming badge, Accolades additions, London next chapter, Media event, chatbot opening, and absence of SATB controls.
- [ ] Inspect console errors and local missing assets; require zero production errors.
- [ ] Confirm only expected commits differ from `main` and the worktree is clean.
- [ ] Fast-forward the verified branch into local `main`, preserving local `.env`, `.DS_Store`, and `screenshots website/`.
- [ ] Re-run `npm test` and `npm run check` on local `main`.
- [ ] Do not push. Present the local result for user review.
