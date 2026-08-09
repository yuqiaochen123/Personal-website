# Site Stabilization Design

## Goal

Stabilize the existing Yuqiao Chen portfolio without redesigning it, while preserving current user work and making future Codex maintenance safe and repeatable.

## Scope

This pass keeps the current static HTML/CSS site, its visual design, its page structure, the EmailJS contact form, the Cloudflare Worker chatbot, and the Express development server. It does not introduce a framework, consolidate repeated page markup, rewrite Git history, delete historical screenshots, or change published content beyond removing entries whose media does not exist.

## Repository Safety

The existing staged `index.html` change, modified `.DS_Store`, and untracked `screenshots website/` directory belong to the user and must not be discarded. Local `main` is one commit ahead of and one commit behind `origin/main`; reconciliation must preserve both the local SATB work and the remote date update. No force push or history rewrite is permitted.

The implementation will fetch the current remote state, record the pre-reconciliation status, and merge `origin/main` into local `main`. If Git reports a conflict, implementation stops for a targeted resolution that retains the SATB feature and uses the remote August 14, 2025 date. Pushing is outside this stabilization pass unless the user requests it separately.

## Secret Management

`.env` will remain present locally so the development server continues to work, but it will be removed from Git's index and added to `.gitignore`. A tracked `.env.example` will contain only `TWOBRAIN_API_KEY=`.

Because the current key has already been committed, removing the file from the current tree does not make that key safe. The user must rotate the 2brain API key and update both the local `.env` file and the Cloudflare Worker secret. Git history will not be rewritten in this pass because that is destructive and would require coordination with every clone.

## Content Repair

The three placeholder articles in `blog.html` and the three placeholder gallery items in `gallery.html` will be removed because their referenced media files do not exist. The surrounding page headers, category/filter controls, empty content containers, navigation, chatbot, and SATB project UI will remain unchanged. No replacement copy or imagery will be invented.

## Chatbot Deployment

`chatbot-worker/src/index.js` remains the canonical production proxy used by `chatbot-v3.js`. `server.js` remains a local development fallback and is documented as such.

The Worker will allow browser requests only from:

- `https://yuqiaochen.uk`
- `https://www.yuqiaochen.uk`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Allowed origins receive a matching `Access-Control-Allow-Origin` header and `Vary: Origin`. Requests with another `Origin` receive HTTP 403. Requests without an `Origin`, such as server-to-server health checks, remain allowed but do not receive an allow-origin header. OPTIONS handling follows the same policy. The Express fallback will use the same allowlist.

## Automated Checks

A dependency-free Node script at `scripts/check-site.mjs` will provide the project test command. It will:

1. Scan every top-level HTML file.
2. Verify that each local `href`, `src`, and video `poster` target exists.
3. Ignore fragments, mail, telephone, data URLs, JavaScript URLs, and HTTP(S) resources.
4. Run JavaScript syntax checks for the site scripts, Express server, and Worker source.
5. Exit nonzero with actionable file-and-reference messages if a check fails.

The checker itself will use Node's built-in test runner for focused tests of local-reference extraction and validation. No new runtime dependency is required. `npm test` will run the automated suite, and `npm run check` will run the complete site check.

## Maintenance Documentation

`README.md` will be updated to use `https://yuqiaochen.uk`, describe the static frontend and both chatbot proxies, provide local setup commands, explain Cloudflare Worker deployment and secret configuration, document the test commands, and warn against committing `.env`.

A root `AGENTS.md` will give future Codex sessions concise project-specific rules: preserve the visual language, keep navigation/chatbot changes consistent across pages, treat the Worker as production, use environment secrets, run the complete checks, preserve user-owned screenshots, and never rewrite or discard Git history without explicit approval.

Historical screenshots and obsolete copies inside `screenshots website/` remain untouched. Documentation will identify that directory as reference material rather than production source.

## Verification and Success Criteria

The stabilization is complete when:

- `.env` is ignored and no longer tracked, while `.env.example` is tracked without a secret.
- The previously staged `index.html` change and all user-owned files remain intact.
- Local and remote Git histories are reconciled without force or history rewriting.
- No top-level HTML page references a missing local file.
- All maintained JavaScript files pass syntax checking.
- The automated tests and complete site check pass.
- `npm start` serves `/` successfully and rejects an invalid chatbot request with HTTP 400.
- README and `AGENTS.md` accurately describe maintenance and deployment.
- The user is explicitly reminded to rotate the exposed 2brain key; rotation itself is not falsely reported as complete.

