# Project Maintenance Instructions

## Scope and design

- Preserve the site's existing piano-inspired visual language unless the user explicitly requests a redesign.
- Keep the site framework-free unless a migration is separately designed and approved.
- When changing navigation, chatbot controls, or SATB project UI, check every top-level HTML page because markup is duplicated between pages.
- Do not invent biographical claims, awards, dates, media, or links. Ask for source material when content is missing.

## Runtime architecture

- Treat `chatbot-worker/src/index.js` as the production chatbot proxy used by `chatbot-v3.js`.
- Treat `server.js` as the local static server and development chatbot fallback.
- Keep API credentials in environment variables. Never add `.env` or a real credential to Git.
- Preserve the production and localhost CORS allowlist unless deployment requirements change.

## Verification

- Run `npm test` and `npm run check` after code or content changes.
- For responsive navigation or layout changes, verify desktop, intermediate-width, and mobile viewports in a real browser.
- Confirm `npm start` serves the homepage before publishing significant changes.

## Repository safety

- Preserve `.DS_Store` changes and `screenshots website/` unless the user explicitly asks to remove or organize them; the screenshots are user-owned reference material.
- Do not discard uncommitted work, rewrite Git history, force-push, or push changes without explicit user approval.
- Keep commits narrowly scoped and report when work is local versus published.
