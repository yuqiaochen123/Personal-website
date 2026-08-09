const ALLOWED_ORIGINS = new Set([
  'https://yuqiaochen.uk',
  'https://www.yuqiaochen.uk',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

function isAllowedOrigin(origin) {
  return origin === null || ALLOWED_ORIGINS.has(origin);
}

export function corsHeadersFor(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');

    if (!isAllowedOrigin(origin)) {
      return new Response('Forbidden origin', { status: 403 });
    }

    const corsHeaders = corsHeadersFor(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: { ...corsHeaders, Allow: 'POST, OPTIONS' },
      });
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', {
        status: 400,
        headers: corsHeaders,
      });
    }

    const transformedMessages = messages.map((message) => ({
      role: 'user',
      content: message.content,
    }));

    try {
      const response = await fetch('https://portal.2brain.ai/api/bot/chat/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.TWOBRAIN_API_KEY}`,
        },
        body: JSON.stringify({
          model: '2brain-1.5',
          messages: transformedMessages,
          max_tokens: 1000,
          temperature: 0.7,
          intent_engine: 0,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`2brain API returned ${response.status}: ${errorText}`);
      }

      if (!response.body) {
        throw new Error('API response is not streamable');
      }

      return new Response(response.body, {
        status: response.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(error.message, {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};
