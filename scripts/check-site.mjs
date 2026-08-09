import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

import { findMissingReferences } from './site-references.mjs';

const rootDir = process.cwd();
const htmlFiles = (await readdir(rootDir))
  .filter((file) => file.endsWith('.html'))
  .sort();
const JavaScriptFiles = [
  'profile-data.js',
  'server.js',
  'script.js',
  'chatbot-shared.js',
  'chatbot-v3.js',
  'chatbot-worker/src/index.js',
];

let failed = false;
const missingReferences = await findMissingReferences(htmlFiles, rootDir);

for (const { htmlFile, reference } of missingReferences) {
  console.error(`${htmlFile}: missing local reference ${reference}`);
  failed = true;
}

for (const file of JavaScriptFiles) {
  const result = spawnSync(process.execPath, ['--check', file], {
    cwd: rootDir,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    console.error(`${file}: JavaScript syntax check failed`);
    if (result.stderr) console.error(result.stderr.trim());
    failed = true;
  }
}

if (failed) process.exit(1);

console.log(`Site check passed: ${htmlFiles.length} HTML files and ${JavaScriptFiles.length} JavaScript files.`);
