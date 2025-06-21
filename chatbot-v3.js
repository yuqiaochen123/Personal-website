document.addEventListener('DOMContentLoaded', () => {
    // Correctly reference the elements by their updated IDs from global-experience.html
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Check if all elements were found
    if (!chatHistory || !userInput || !sendButton) {
        console.error('Critical Error: A required chatbot element was not found in the HTML. Please check the IDs.');
        return; // Stop execution if elements are missing
    }

    // Set the initial system prompt to define the AI's name and behavior
    let messages = [{ 
        role: 'system', 
        content: "You are 'Yuqiao's AI assistant'. You MUST respond in the same language as the user's message. You MUST NOT use any Markdown formatting. Do not use asterisks (`*`) or dashes (`-`). Your entire response must be in clean, plain text paragraphs." 
    }];

    function appendMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        
        if (sender === 'user') {
            messageElement.textContent = text;
        } else if (sender === 'ai') {
            messageElement.innerHTML = `<strong>Yuqiao's AI assistant:</strong> ${text}`;
        } else if (sender === 'thinking') {
            messageElement.innerHTML = `${text}<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>`;
        } else {
            messageElement.textContent = text;
        }
        
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll
        return messageElement;
    }

    async function getChatbotResponse(message) {
        // Add user message to history
        appendMessage(message, 'user');
        userInput.value = '';
        messages.push({ role: 'user', content: message });

        // Show "Thinking..." message
        const thinkingMessage = appendMessage('Thinking', 'thinking');

        try {
            const response = await fetch('https://chatbot-api.yuqiaochen.workers.dev', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messages })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Load failed with status ${response.status}: ${errorText}`);
            }

            // Handle the stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            let aiMessageElement = null;
            let contentSpan = null;
            let buffer = '';

            let characterQueue = [];
            let isTyping = false;

            function processQueue() {
                if (characterQueue.length === 0) {
                    isTyping = false;
                    return;
                }
                isTyping = true;
                
                const char = characterQueue.shift();
                fullResponse += char;
                const cleanedResponse = fullResponse.replace(/(\*\*|###|---|- |#)/g, '');
                if (contentSpan) {
                    contentSpan.textContent = cleanedResponse;
                    chatHistory.scrollTop = chatHistory.scrollHeight;
                }

                setTimeout(processQueue, 30); // Adjust this value to control typing speed
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    // Wait for the typewriter effect to finish before breaking
                    const waitForTyping = async () => {
                        while (isTyping) {
                            await new Promise(resolve => setTimeout(resolve, 50));
                        }
                    };
                    await waitForTyping();
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n'); // Corrected from '\\n' to '\n'
                buffer = lines.pop(); // Keep the last, possibly incomplete, line in the buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonString = line.substring(6).trim(); // Remove potential whitespace
                        if (jsonString === '[DONE]' || jsonString === '') {
                            continue;
                        }
                        try {
                            const parsed = JSON.parse(jsonString);
                            const content = parsed.choices[0]?.delta?.content || '';
                            if (content) {
                                if (thinkingMessage && thinkingMessage.parentNode) {
                                    thinkingMessage.remove();
                                }

                                if (!aiMessageElement) {
                                    aiMessageElement = document.createElement('div');
                                    aiMessageElement.classList.add('chat-message', 'ai-message');
                                    aiMessageElement.innerHTML = `<strong>Yuqiao's AI assistant:</strong> <span class="content"></span>`;
                                    chatHistory.appendChild(aiMessageElement);
                                    contentSpan = aiMessageElement.querySelector('.content');
                                }
                                
                                for(const char of content) {
                                    characterQueue.push(char);
                                }
                                
                                if (!isTyping) {
                                    processQueue();
                                }
                            }
                        } catch (e) {
                            console.error("Error parsing stream chunk:", jsonString, e);
                        }
                    }
                }
            }
            // Save the clean response to the message history
            if (fullResponse) {
                messages.push({ role: 'assistant', content: fullResponse.replace(/(\*\*|###|---|- |#)/g, '') });
            }

        } catch (error) {
            if (thinkingMessage && thinkingMessage.parentNode) {
                thinkingMessage.remove();
            }
            appendMessage(`Sorry, I encountered an error: ${error.message}. Please try again.`, 'ai');
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