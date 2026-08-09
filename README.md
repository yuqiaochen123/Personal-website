# Yuqiao Chen — Personal Portfolio

A personal portfolio presenting Yuqiao Chen's work as a pianist, scholar, and artist.

## Live website

[https://yuqiaochen.uk](https://yuqiaochen.uk)

The static site is published from GitHub. A push should be intentional because changes to the publishing branch can update the live website.

## Architecture

- The top-level HTML, CSS, JavaScript, image, video, and PDF files form the static website.
- `chatbot-v3.js` sends production chatbot requests to the Cloudflare Worker.
- `chatbot-worker/src/index.js` is the production 2brain API proxy.
- `server.js` serves the website locally and provides a development fallback at `/api/2brain`.
- `script.js` handles the EmailJS contact form.
- `profile-data.js` is the canonical source for current biographical facts used by the site and chatbot.
- `screenshots website/` contains historical reference material and is not production source.

## Local setup

Node.js 18 or newer is required.

```bash
npm install
cp .env.example .env
```

Set `TWOBRAIN_API_KEY` in `.env`, then start the local server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000). Stop the server with `Control+C`.

Never commit `.env`. It is intentionally ignored by Git.

## Checks

```bash
npm test
npm run check
```

`npm test` runs the Node test suite. `npm run check` verifies local HTML references and JavaScript syntax. Run both before committing or publishing a change.

## Updating profile facts

Update confirmed facts in `profile-data.js` first, then reflect the same wording on the relevant public page. The profile-content test rejects discontinued SATB analyzer references and stale predicted IB results. Upcoming engagements should be labelled clearly as upcoming until they have taken place.

## Cloudflare Worker

The browser calls `https://chatbot-api.yuqiaochen.workers.dev`. The Worker accepts browser requests from the production domain and local development origins only.

Configure and deploy it from the Worker directory:

```bash
cd chatbot-worker
npx wrangler secret put TWOBRAIN_API_KEY
npx wrangler deploy
```

The 2brain key was previously committed to this repository. Removing `.env` from the current tree does not remove it from Git history. Rotate that key with the provider, update the local `.env`, and replace the Cloudflare Worker secret.

## Publishing

Work and test locally first. Commit useful checkpoints locally. Push only when the commits are ready to be backed up and published:

```bash
git push origin main
```

The custom domain is configured through `CNAME` as `yuqiaochen.uk`.

## Contact

- Instagram: [@sequoia_petrichor](https://instagram.com/sequoia_petrichor)
- Email: available through the website contact form
