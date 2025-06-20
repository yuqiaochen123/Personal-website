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
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    if (!chatContainer || !messageInput || !sendButton) {
        console.error('Chatbot elements not found. Make sure you have a chat-container, message-input, and send-button in your HTML.');
        return;
    }

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Thinking...';

    let messages = [];

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.textContent = content;
        messageDiv.appendChild(contentDiv);
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function sendMessage() {
        const userInput = messageInput.value.trim();
        if (!userInput) return;

        addMessage(userInput, true);
        messages.push({ role: 'user', content: userInput });
        messageInput.value = '';
        chatContainer.appendChild(loadingIndicator);

        try {
            const response = await fetch('http://localhost:3000/api/2brain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const botResponse = data.choices[0].message.content;

            messages.push({ role: 'assistant', content: botResponse });
            
            loadingIndicator.remove();
            addMessage(botResponse);

        } catch (error) {
            console.error('Error:', error);
            loadingIndicator.remove();
            addMessage(`Sorry, I encountered an error: ${error.message}. Please try again.`);
        }
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    addMessage("Hello! I am Yuqiao's AI assistant. Ask me anything about his experiences!");
}); 