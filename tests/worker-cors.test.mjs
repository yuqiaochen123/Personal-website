import test from 'node:test';
import assert from 'node:assert/strict';

import worker from '../chatbot-worker/src/index.js';

test('Worker accepts preflight from the production origin with exact CORS headers', async () => {
  const request = new Request('https://worker.example.test/', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://yuqiaochen.uk',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type',
    },
  });

  const response = await worker.fetch(request, {}, {});

  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://yuqiaochen.uk');
  assert.equal(response.headers.get('Vary'), 'Origin');
});

test('Worker rejects preflight from an unapproved origin', async () => {
  const request = new Request('https://worker.example.test/', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://example.com',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type',
    },
  });

  const response = await worker.fetch(request, {}, {});

  assert.equal(response.status, 403);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
});

test('Worker rejects disallowed POST origins before parsing the request body', async () => {
  const request = new Request('https://worker.example.test/', {
    method: 'POST',
    headers: {
      Origin: 'https://example.com',
      'Content-Type': 'application/json',
    },
    body: '{}',
  });

  const response = await worker.fetch(request, {}, {});

  assert.equal(response.status, 403);
});
