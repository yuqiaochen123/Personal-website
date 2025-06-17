// Chatbot functionality
let chatHistory = [];

function addMessage(message, isUser = false) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isUser ? 'user' : 'ai'}`;
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function handleChatbotSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, true);
    input.value = '';
    
    try {
        // Show loading state
        addMessage('Thinking...');
        
        // Call 2brain API (correct endpoint and body)
        const response = await fetch('http://localhost:3000/api/2brain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: message }]
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to get response from 2brain');
        }
        
        const data = await response.json();
        console.log('2brain API response:', data);
        
        // Remove loading message
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.removeChild(messagesContainer.lastChild);
        
        // Add AI response (per docs)
        const aiReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't answer that.";
        addMessage(aiReply);
        
        // Update chat history
        chatHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: aiReply }
        );
        
    } catch (error) {
        console.error('Chatbot error:', error);
        // Remove loading message
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.removeChild(messagesContainer.lastChild);
        addMessage('Sorry, I encountered an error. Please try again.');
    }
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', () => {
    const chatbotForm = document.getElementById('chatbot-form');
    if (chatbotForm) {
        chatbotForm.addEventListener('submit', handleChatbotSubmit);
    }
}); 