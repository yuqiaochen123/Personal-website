import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const NON_FILE_PREFIX = /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i;

function normalizeReference(reference) {
  const trimmed = reference.trim();
  if (!trimmed || trimmed.startsWith('#') || NON_FILE_PREFIX.test(trimmed)) {
    return null;
  }

  const withoutQueryOrHash = trimmed.split(/[?#]/, 1)[0];
  if (!withoutQueryOrHash) return null;

  try {
    return decodeURIComponent(withoutQueryOrHash);
  } catch {
    return withoutQueryOrHash;
  }
}

export function extractLocalReferences(html) {
  const references = [];
  const attributePattern = /\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi;

  for (const match of html.matchAll(attributePattern)) {
    const normalized = normalizeReference(match[1]);
    if (normalized) references.push(normalized);
  }

  return references;
}

export async function findMissingReferences(htmlFiles, rootDir) {
  const missing = [];

  for (const htmlFile of [...htmlFiles].sort()) {
    const htmlPath = path.resolve(rootDir, htmlFile);
    const html = await readFile(htmlPath, 'utf8');

    for (const reference of extractLocalReferences(html)) {
      const targetPath = path.resolve(path.dirname(htmlPath), reference);
      try {
        await access(targetPath);
      } catch {
        missing.push({ htmlFile, reference });
      }
    }
  }

  return missing.sort((left, right) =>
    left.htmlFile.localeCompare(right.htmlFile)
      || left.reference.localeCompare(right.reference),
  );
}
