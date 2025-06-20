export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    // Ensure it's a POST request
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const { messages } = await request.json();
  
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }
  
    // Transform messages to have 'user' role
    const transformedMessages = messages.map(msg => ({
      role: 'user',
      content: msg.content
    }));

    try {
      const response = await fetch('https://portal.2brain.ai/api/bot/chat/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.TWOBRAIN_API_KEY}`
        },
        body: JSON.stringify({
          model: '2brain-1.5',
          messages: transformedMessages,
          max_tokens: 1000,
          temperature: 0.7,
          intent_engine: 0,
          stream: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`2brain API returned ${response.status}: ${errorText}`);
      }

      if (!response.body) {
        throw new Error('API response is not streamable');
      }

      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      };

      return new Response(response.body, {
        headers: corsHeaders,
        status: response.status
      });

    } catch (error) {
      console.error('Worker error:', error);
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };
      return new Response(error.message, { 
        status: 500,
        headers: corsHeaders
      });
    }
  },
};

function handleOptions(request) {
  let headers = request.headers;
  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    headers.get("Access-Control-Request-Headers") !== null
  ) {
    // Handle CORS preflight requests.
    let respHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    return new Response(null, { headers: respHeaders });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        Allow: "POST, OPTIONS",
      },
    });
  }
} 