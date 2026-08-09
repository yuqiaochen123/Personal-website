const ALLOWED_ORIGINS = new Set([
  'https://yuqiaochen.uk',
  'https://www.yuqiaochen.uk',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

function isAllowedOrigin(origin) {
  return !origin || ALLOWED_ORIGINS.has(origin);
}

module.exports = { ALLOWED_ORIGINS, isAllowedOrigin };
