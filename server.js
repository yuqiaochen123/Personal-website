require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const TWOBRAIN_API_KEY = process.env.TWOBRAIN_API_KEY;

if (!TWOBRAIN_API_KEY) {
  console.error('TWOBRAIN_API_KEY is not set in .env file');
  process.exit(1);
}

app.post('/api/2brain', async (req, res) => {
  const { messages } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    console.error('Invalid messages format:', messages);
    return res.status(400).json({ error: 'Invalid messages format' });
  }
  
  // According to docs, 'role' only supports 'user'.
  // We will transform the messages array to conform to this.
  const transformedMessages = messages.map(msg => ({
    role: 'user',
    content: msg.content
  }));

  try {
    console.log('Calling 2brain API with transformed messages:', transformedMessages);
    
    const response = await fetch('https://portal.2brain.ai/api/bot/chat/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TWOBRAIN_API_KEY}`
      },
      body: JSON.stringify({
        model: '2brain-1.5',
        messages: transformedMessages,
        max_tokens: 1000,
        temperature: 0.7,
        intent_engine: 0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('2brain API error:', response.status, errorText);
      throw new Error(`2brain API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('2brain API response:', data);
    res.json(data);
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('API Key loaded:', TWOBRAIN_API_KEY ? 'Yes' : 'No');
}); 