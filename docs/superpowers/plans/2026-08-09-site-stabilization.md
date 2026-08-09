# Site Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize the existing portfolio without redesigning it by repairing broken content, securing secrets, restricting chatbot origins, adding repeatable checks, and documenting maintenance.

**Architecture:** Keep the static HTML/CSS frontend and its direct Cloudflare Worker chatbot integration. Add dependency-free Node validation scripts and tests, retain Express as a documented local fallback, and make origin policy explicit in both proxies.

**Tech Stack:** HTML, CSS, browser JavaScript, Node.js built-in test runner, Express, Cloudflare Workers, GitHub Pages.

## Global Constraints

- Preserve the current visual design, page structure, EmailJS form, chatbot, and SATB UI.
- Preserve the modified `.DS_Store` and untracked `screenshots website/` directory without staging or deleting them.
- Do not rewrite Git history, force-push, or push any commit to GitHub.
- Keep `.env` locally but remove it from Git tracking; never print or copy its value.
- Treat `chatbot-worker/src/index.js` as the production chatbot proxy and `server.js` as a local fallback.
- Remove the six broken blog/gallery entries without inventing replacement content.
- Use only Node built-ins for new validation tests and scripts.

---

### Task 1: Dependency-Free Site Validation

**Files:**
- Create: `scripts/site-references.mjs`
- Create: `scripts/check-site.mjs`
- Create: `tests/site-references.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `extractLocalReferences(html: string): string[]`
- Produces: `findMissingReferences(htmlFiles: string[], rootDir: string): Array<{htmlFile: string, reference: string}>`
- Produces: `npm test` for Node tests and `npm run check` for the complete site check.

- [ ] **Step 1: Write failing reference-extraction tests**

Create `tests/site-references.test.mjs` with Node's `node:test` and `node:assert/strict`. Test that `extractLocalReferences()` returns `image.jpg`, `movie.mp4`, and `poster.jpg` from `href`, `src`, and `poster`; test that it ignores `https:`, `mailto:`, `tel:`, `data:`, `javascript:`, fragments, and query/hash suffixes.

- [ ] **Step 2: Run the tests and verify the expected failure**

Run: `node --test tests/site-references.test.mjs`

Expected: FAIL because `scripts/site-references.mjs` does not exist.

- [ ] **Step 3: Implement reference extraction and missing-file validation**

Create `scripts/site-references.mjs`. Export `extractLocalReferences(html)` and `findMissingReferences(htmlFiles, rootDir)`. Decode URL-encoded local paths, strip query/hash suffixes, resolve paths relative to each HTML file, and return deterministic results sorted by HTML filename and reference.

- [ ] **Step 4: Verify the unit tests pass**

Run: `node --test tests/site-references.test.mjs`

Expected: all tests PASS.

- [ ] **Step 5: Add the complete site checker and package scripts**

Create `scripts/check-site.mjs` to scan top-level HTML files with `findMissingReferences()`, then invoke `node --check` for `server.js`, `script.js`, `chatbot-shared.js`, `chatbot-v3.js`, and `chatbot-worker/src/index.js`. Print one actionable line per failure and exit with status 1 when any check fails.

Update `package.json` scripts to:

```json
"scripts": {
  "start": "node server.js",
  "test": "node --test tests/*.test.*",
  "check": "node scripts/check-site.mjs"
}
```

- [ ] **Step 6: Run the checker and verify it detects the known broken content**

Run: `npm test && npm run check`

Expected: unit tests PASS; the complete check FAILS and reports the missing `blog-1.jpg`, `blog-2.jpg`, `blog-3.jpg`, `gallery-1.jpg`, `gallery-2.mp4`, `gallery-2-poster.jpg`, and `gallery-3.jpg` references.

- [ ] **Step 7: Commit the validation tooling**

```bash
git add package.json scripts/site-references.mjs scripts/check-site.mjs tests/site-references.test.mjs
git commit -m "test: add portfolio integrity checks"
```

---

### Task 2: Remove Broken Blog and Gallery Entries

**Files:**
- Modify: `blog.html`
- Modify: `gallery.html`

**Interfaces:**
- Consumes: `npm run check` from Task 1.
- Produces: Blog and gallery pages with no references to nonexistent placeholder media.

- [ ] **Step 1: Capture the failing regression check**

Run: `npm run check`

Expected: FAIL listing the seven missing references associated with the six placeholder entries; the gallery video entry contains both a missing video and poster.

- [ ] **Step 2: Remove only the placeholder entry markup**

In `blog.html`, delete the three `<article class="blog-card">` blocks and their `Blog Post 1`, `Blog Post 2`, and `Blog Post 3` comments. Preserve `.blog-grid`, category controls, navigation, chatbot, and SATB modal.

In `gallery.html`, delete the three `<div class="gallery-item">` blocks and their `Gallery Item 1`, `Gallery Item 2`, and `Gallery Item 3` comments. Preserve `.gallery-grid`, filters, lightbox, navigation, chatbot, and SATB modal.

- [ ] **Step 3: Verify the broken references are gone**

Run: `npm test && npm run check`

Expected: both commands PASS with no missing-reference output.

- [ ] **Step 4: Commit the content repair**

```bash
git add blog.html gallery.html
git commit -m "fix: remove unavailable media placeholders"
```

---

### Task 3: Restrict Chatbot Proxy Origins

**Files:**
- Create: `origin-policy.js`
- Create: `tests/origin-policy.test.js`
- Create: `chatbot-worker/package.json`
- Create: `tests/worker-cors.test.mjs`
- Modify: `server.js`
- Modify: `chatbot-worker/src/index.js`

**Interfaces:**
- Produces: `isAllowedOrigin(origin: string | undefined): boolean` from `origin-policy.js`.
- Produces: `corsHeadersFor(origin: string | null): Record<string, string>` from the Worker module.
- Consumes the exact origin allowlist from the approved design.

- [ ] **Step 1: Write failing Express origin-policy tests**

Create `tests/origin-policy.test.js` using `node:test`. Assert that `https://yuqiaochen.uk`, `https://www.yuqiaochen.uk`, `http://localhost:3000`, `http://127.0.0.1:3000`, and an absent origin are accepted; assert that `https://example.com` is rejected.

- [ ] **Step 2: Verify the Express policy test fails**

Run: `node --test tests/origin-policy.test.js`

Expected: FAIL because `origin-policy.js` does not exist.

- [ ] **Step 3: Implement and connect the Express policy**

Create `origin-policy.js` as a CommonJS module exporting `ALLOWED_ORIGINS` and `isAllowedOrigin`. Update the `cors` middleware in `server.js` to use an origin callback that permits absent origins and allowlisted origins, and rejects all others with `Origin not allowed by CORS`.

- [ ] **Step 4: Verify the Express policy test passes**

Run: `node --test tests/origin-policy.test.js`

Expected: PASS.

- [ ] **Step 5: Write failing Worker CORS tests**

Add `chatbot-worker/package.json` containing `{ "type": "module" }`. Create `tests/worker-cors.test.mjs`, import the Worker module, and assert:

- OPTIONS from `https://yuqiaochen.uk` returns 204 with that exact allow-origin value and `Vary: Origin`.
- OPTIONS from `https://example.com` returns 403.
- POST from `https://example.com` returns 403 without calling the upstream API.

- [ ] **Step 6: Verify the Worker tests fail for the current wildcard policy**

Run: `node --test tests/worker-cors.test.mjs`

Expected: FAIL because the current Worker returns wildcard CORS headers and does not reject the unapproved origin.

- [ ] **Step 7: Implement the Worker allowlist**

In `chatbot-worker/src/index.js`, define the four approved origins, export `corsHeadersFor(origin)`, and reject disallowed request origins before request-body parsing or upstream fetch. Return 204 for approved OPTIONS requests, 403 for disallowed origins, the exact requesting origin for approved browser requests, and `Vary: Origin` whenever origin-sensitive headers are returned.

- [ ] **Step 8: Run focused and complete checks**

Run: `npm test && npm run check`

Expected: all tests and syntax/reference checks PASS.

- [ ] **Step 9: Commit the proxy hardening**

```bash
git add origin-policy.js tests/origin-policy.test.js chatbot-worker/package.json tests/worker-cors.test.mjs server.js chatbot-worker/src/index.js
git commit -m "fix: restrict chatbot proxy origins"
```

---

### Task 4: Remove the Tracked Secret and Document Maintenance

**Files:**
- Create: `.env.example`
- Create: `AGENTS.md`
- Modify: `.gitignore`
- Modify: `README.md`
- Remove from Git index only: `.env`

**Interfaces:**
- Consumes: the existing local `.env` used by `npm start`.
- Produces: safe onboarding instructions and project-specific Codex guidance.

- [ ] **Step 1: Record the failing secret-hygiene state**

Run:

```bash
git ls-files --error-unmatch .env
```

Expected: exit 0, proving `.env` is currently tracked and the hygiene requirement is not yet met.

- [ ] **Step 2: Stop tracking the secret without deleting the local file**

Add `.env` and `.env.*` to `.gitignore`, then add `!.env.example`. Create `.env.example` with exactly:

```dotenv
TWOBRAIN_API_KEY=
```

Run `git rm --cached .env`. Confirm `test -f .env` succeeds so the local secret remains available.

- [ ] **Step 3: Update README with operational instructions**

Replace the stale GitHub Pages link with `https://yuqiaochen.uk`. Document prerequisites, `npm install`, copying `.env.example` to `.env`, `npm start`, `npm test`, `npm run check`, the static frontend architecture, the production Worker endpoint, `wrangler secret put TWOBRAIN_API_KEY`, Worker deployment from `chatbot-worker/`, GitHub Pages publishing via an intentional push, and the requirement to rotate the previously committed key.

- [ ] **Step 4: Add root maintenance instructions**

Create `AGENTS.md` stating that future work must preserve the visual language, update repeated navigation/chatbot UI consistently across all pages, treat the Worker as production and Express as local fallback, keep secrets out of Git, run `npm test` and `npm run check`, preserve `screenshots website/` as user-owned reference material, and avoid history rewriting or pushing without explicit approval.

- [ ] **Step 5: Verify secret hygiene without revealing the value**

Run:

```bash
test -f .env
test "$(cat .env.example)" = 'TWOBRAIN_API_KEY='
git check-ignore -q .env
if git ls-files --error-unmatch .env >/dev/null 2>&1; then exit 1; fi
```

Expected: all commands exit 0.

- [ ] **Step 6: Run the full automated and local runtime checks**

Run: `npm test && npm run check && npm ls --depth=0`

Start `npm start`, then verify:

```bash
curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/
curl -sS -o /dev/null -w '%{http_code}' -H 'Content-Type: application/json' -d '{}' http://127.0.0.1:3000/api/2brain
```

Expected: homepage `200`; invalid chatbot body `400`. Stop the server after the checks.

- [ ] **Step 7: Verify scope and commit documentation/security changes**

Run `git diff --check`, inspect `git diff --stat`, and confirm `.DS_Store` plus `screenshots website/` remain unstaged. Then commit:

```bash
git add .gitignore .env.example README.md AGENTS.md
git add -u -- .env
git commit -m "chore: secure and document site maintenance"
```

The `.env` path stages its removal from Git only; the ignored local file remains on disk.

---

### Task 5: Final Stabilization Verification

**Files:**
- Verify only; do not modify production files unless a preceding check exposes a failure.

**Interfaces:**
- Consumes all deliverables from Tasks 1–4.
- Produces an evidence-backed handoff with no GitHub push.

- [ ] **Step 1: Run all automated checks from a clean process**

Run:

```bash
npm test
npm run check
npm ls --depth=0
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 2: Confirm repository and secret state**

Run `git status --short --branch`, `git ls-files .env .env.example`, and `git check-ignore -v .env`.

Expected: local `main` is ahead of `origin/main`; `.env.example` is tracked; `.env` is ignored and untracked; only the pre-existing `.DS_Store` and `screenshots website/` user files remain outside committed work.

- [ ] **Step 3: Review the complete stabilization diff**

Run `git log --oneline origin/main..HEAD` and `git diff --stat origin/main...HEAD`. Confirm the diff contains only the approved stabilization, the prior SATB commit, the reconciled date change, and its documentation.

- [ ] **Step 4: Report the manual credential action**

Tell the user that code stabilization is complete but the exposed 2brain key still must be rotated in the 2brain provider and replaced in local `.env` plus the Cloudflare Worker secret. Do not claim the secret is secure until that external rotation is confirmed.

- [ ] **Step 5: Leave publishing to an explicit follow-up**

Do not push. Explain that the completed commits remain local and the live GitHub Pages site is unchanged until the user explicitly requests a push.
