document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    let messages = [{ role: 'system', content: 'You are a helpful assistant.' }];

    async function getChatbotResponse(message) {
        chatHistory.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
        userInput.value = '';

        messages.push({ role: 'user', content: message });

        try {
            const response = await fetch('https://chatbot-api.yuqiaochen.workers.dev', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messages })
            });

            if (!response.ok) {
                throw new Error('Load failed');
            }

            const data = await response.json();
            const botMessage = data.choices[0].message.content;

            chatHistory.innerHTML += `<div><strong>AI:</strong> ${botMessage}</div>`;
            messages.push({ role: 'assistant', content: botMessage });

        } catch (error) {
            chatHistory.innerHTML += `<div>Sorry, I encountered an error: ${error.message}. Please try again.</div>`;
            console.error('Error:', error);
        }
    }

    sendButton.addEventListener('click', () => {
        const message = userInput.value;
        if (message.trim() !== '') {
            getChatbotResponse(message);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = userInput.value;
            if (message.trim() !== '') {
                getChatbotResponse(message);
            }
        }
    });
}); 