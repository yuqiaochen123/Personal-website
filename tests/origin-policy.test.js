const test = require('node:test');
const assert = require('node:assert/strict');

const { isAllowedOrigin } = require('../origin-policy');

test('isAllowedOrigin accepts production, www, and local development origins', () => {
  for (const origin of [
    'https://yuqiaochen.uk',
    'https://www.yuqiaochen.uk',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]) {
    assert.equal(isAllowedOrigin(origin), true, origin);
  }
});

test('isAllowedOrigin accepts requests without a browser origin', () => {
  assert.equal(isAllowedOrigin(undefined), true);
  assert.equal(isAllowedOrigin(null), true);
  assert.equal(isAllowedOrigin(''), true);
});

test('isAllowedOrigin rejects unapproved browser origins', () => {
  assert.equal(isAllowedOrigin('https://example.com'), false);
  assert.equal(isAllowedOrigin('https://yuqiaochen.uk.example.com'), false);
});
