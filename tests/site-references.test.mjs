import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import {
  extractLocalReferences,
  findMissingReferences,
} from '../scripts/site-references.mjs';

test('extractLocalReferences returns normalized local href, src, and poster targets', () => {
  const html = `
    <link href="styles.css?v=1.0" rel="stylesheet">
    <a href="pages/about.html#bio">About</a>
    <img src="images/portrait%20small.jpg" alt="Portrait">
    <video src="media/movie.mp4" poster="media/poster.jpg"></video>
  `;

  assert.deepEqual(extractLocalReferences(html), [
    'styles.css',
    'pages/about.html',
    'images/portrait small.jpg',
    'media/movie.mp4',
    'media/poster.jpg',
  ]);
});

test('extractLocalReferences ignores remote and non-file references', () => {
  const html = `
    <a href="#content">Skip</a>
    <a href="https://example.com/page">Remote</a>
    <a href="mailto:hello@example.com">Email</a>
    <a href="tel:+123456789">Call</a>
    <a href="javascript:void(0)">Action</a>
    <img src="data:image/gif;base64,AAAA" alt="Inline">
    <script src="//cdn.example.com/app.js"></script>
  `;

  assert.deepEqual(extractLocalReferences(html), []);
});

test('findMissingReferences reports only missing targets with their HTML files', async () => {
  const rootDir = await mkdtemp(path.join(tmpdir(), 'site-reference-test-'));
  await mkdir(path.join(rootDir, 'pages'));
  await mkdir(path.join(rootDir, 'images'));
  await writeFile(path.join(rootDir, 'images', 'present.jpg'), 'image');
  await writeFile(
    path.join(rootDir, 'pages', 'index.html'),
    '<img src="../images/present.jpg"><img src="../images/missing.jpg">',
  );

  const result = await findMissingReferences(['pages/index.html'], rootDir);

  assert.deepEqual(result, [
    { htmlFile: 'pages/index.html', reference: '../images/missing.jpg' },
  ]);
});
