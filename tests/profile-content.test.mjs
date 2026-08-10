import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const rootDir = path.resolve(import.meta.dirname, '..');

test('canonical profile data contains the approved 2026 facts', () => {
  const profile = require('../profile-data.js');

  assert.equal(profile.positioning, 'Pianist · Scholar · AI Builder · Global Citizen');
  assert.equal(profile.academics.ib, '45/45');
  assert.equal(profile.academics.ielts, '8.0');
  assert.equal(profile.academics.sat, 1520);
  assert.match(profile.education.rcm, /four-year full scholarship/i);
  assert.equal(profile.recordings.appleMusicPeak, 'No. 1');
  assert.match(profile.recordings.appleMusicRecommendations, /Top 10/i);
  assert.deepEqual(profile.languages, ['Chinese', 'English', 'French']);
  assert.match(profile.technology.product, /music-theory and aural-learning platform/i);
  assert.deepEqual(profile.upcomingEvent, {
    status: 'Upcoming',
    date: '2026-08-16',
    title: 'A First Public Statement at 18',
    venue: 'YAMAHA Smart Concert Hall',
    city: 'Chengdu',
    composers: ['Bach', 'Chopin', 'Debussy', 'Rachmaninoff'],
  });
});

test('production sources contain no discontinued SATB analyzer or predicted score', async () => {
  const htmlFiles = (await readdir(rootDir)).filter((file) => file.endsWith('.html'));
  const productionFiles = [
    ...htmlFiles,
    'styles.css',
    'chatbot-shared.css',
    'chatbot-shared.js',
    'chatbot-v3.js',
  ];
  const forbidden = /satb-projects|SATB Progression Analyzer|satbwritingwebsite\.netlify\.app|41\/42/gi;
  const violations = [];

  for (const file of productionFiles) {
    const source = await readFile(path.join(rootDir, file), 'utf8');
    const matches = [...source.matchAll(forbidden)].map((match) => match[0]);
    if (matches.length) violations.push({ file, matches });
  }

  assert.deepEqual(violations, []);
});

test('public pages present the current chapter and upcoming event', async () => {
  const [home, accolades, global, media, karma] = await Promise.all([
    readFile(path.join(rootDir, 'index.html'), 'utf8'),
    readFile(path.join(rootDir, 'accolades.html'), 'utf8'),
    readFile(path.join(rootDir, 'global-experience.html'), 'utf8'),
    readFile(path.join(rootDir, 'media-blog.html'), 'utf8'),
    readFile(path.join(rootDir, 'karma-and-me.html'), 'utf8'),
  ]);

  assert.match(home, /Pianist · Scholar · AI Builder · Global Citizen/);
  assert.match(home, /A First Public Statement at 18/);
  assert.match(accolades, /45\/45 Points/);
  assert.match(accolades, /Royal College of Music/);
  assert.match(global, /London · Next Chapter/);
  assert.match(media, /UPCOMING · 16 AUG 2026/);
  assert.match(karma, /Apple Music's global recommendations/);
});

test('chatbot control clears the piano keyboard at desktop and mobile heights', async () => {
  const css = await readFile(path.join(rootDir, 'chatbot-shared.css'), 'utf8');

  assert.match(css, /--piano-nav-height:\s*90px/);
  assert.match(css, /--chat-control-gap:\s*24px/);
  assert.match(css, /top:\s*calc\(var\(--piano-nav-height\)\s*\+\s*var\(--chat-control-gap\)\)/);
  assert.match(css, /right:\s*calc\(20px\s*\+\s*env\(safe-area-inset-right,\s*0px\)\)/);
  assert.match(css, /@media\s*\(max-width:\s*600px\)[\s\S]*--piano-nav-height:\s*50px[\s\S]*--chat-control-gap:\s*20px/);
  assert.match(css, /@media\s*\(max-width:\s*480px\)[\s\S]*\.ai-text\s*\{[\s\S]*display:\s*none/);
});
