document.addEventListener('DOMContentLoaded', () => {
    console.log('Chatbot-v3.js loaded, looking for elements...');
    
    // Correctly reference the elements by their updated IDs from global-experience.html
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    console.log('Elements found:', {
        chatHistory: !!chatHistory,
        userInput: !!userInput,
        sendButton: !!sendButton
    });

    // Check if all elements were found
    if (!chatHistory || !userInput || !sendButton) {
        console.error('Critical Error: A required chatbot element was not found in the HTML. Please check the IDs.');
        console.log('Available elements with similar IDs:');
        document.querySelectorAll('[id*="chat"], [id*="user"], [id*="send"]').forEach(el => {
            console.log('-', el.id, el.tagName);
        });
        return; // Stop execution if elements are missing
    }

    console.log('All chatbot elements found successfully!');

    // Voice input functionality - now handled by chatbot-shared.js
    // The voice button is already present in the modal HTML structure

    // Welcome message
    function showWelcomeMessage() {
        const welcomeMessage = `Hello! I'm Yuqiao's AI assistant. I can help you learn about his musical journey, achievements, and provide advice for musicians. Feel free to ask me anything about classical piano, competitions, or his international experiences!`;
        appendMessage(welcomeMessage, 'ai');
    }

    // Show welcome message when chatbot is opened
    setTimeout(showWelcomeMessage, 500);

    // Set the initial system prompt to define the AI's name and behavior
    let messages = [{ 
        role: 'system', 
        content: `You are 'Yuqiao's AI assistant', a knowledgeable guide about Yuqiao Chen's musical journey and expertise.

ABOUT YUQIAO:
- Award-winning pianist with international performance experience
- Winner of Bangkok Chopin Piano Competition 2024
- Apple Artist with 8M+ streams worldwide
- Studied in China (Chengdu, Beijing), India, Nepal, and Thailand
- IB predicted score: 41/42, 10 A*/9s in IGCSEs
- Performed across Berlin, Prague, San Francisco, Hong Kong, Moscow, Shanghai, Bangkok
- Multiple Carnegie Hall invitations (postponed due to COVID-19)
- Collaborates with Karma Sound Studio

YOUR CAPABILITIES:
- Answer questions about Yuqiao's musical journey, performances, and achievements
- Provide insights about classical piano, competitions, and music education
- Share knowledge about international music scenes and cultural experiences
- Discuss practice techniques, performance preparation, and musical development
- Offer guidance on music theory, repertoire selection, and career advice

RESPONSE GUIDELINES:
- Respond in the same language as the user's message
- Use clean, plain text paragraphs (no Markdown formatting)
- Be conversational, knowledgeable, and helpful
- Share specific details about Yuqiao's experiences when relevant
- Provide practical advice for musicians and students
- Keep responses concise but informative`
    }];

    // Conversation management
    const MAX_MESSAGES = 20; // Keep conversation manageable
    
    function manageConversationHistory() {
        // Keep system message + recent messages
        if (messages.length > MAX_MESSAGES) {
            const systemMessage = messages[0];
            const recentMessages = messages.slice(-MAX_MESSAGES + 1);
            messages = [systemMessage, ...recentMessages];
        }
    }

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

    // Enhanced typing indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'typing-indicator';
        typingElement.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span style="color: #8c7a65; font-size: 0.9rem; margin-left: 10px;">Yuqiao's AI is typing...</span>
        `;
        typingElement.style.cssText = `
            display: flex;
            align-items: center;
            padding: 10px 15px;
            background: #f1f1f1;
            border-radius: 18px 18px 18px 4px;
            align-self: flex-start;
            max-width: 80%;
            margin-bottom: 12px;
        `;
        
        const dots = typingElement.querySelectorAll('.typing-dots span');
        dots.forEach((dot, index) => {
            dot.style.cssText = `
                width: 8px;
                height: 8px;
                background: #c9a96e;
                border-radius: 50%;
                display: inline-block;
                margin: 0 2px;
                animation: typing 1.4s infinite ease-in-out;
                animation-delay: ${index * 0.2}s;
            `;
        });
        
        // Add CSS animation
        if (!document.querySelector('#typing-animation')) {
            const style = document.createElement('style');
            style.id = 'typing-animation';
            style.textContent = `
                @keyframes typing {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-10px); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        chatHistory.appendChild(typingElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        return typingElement;
    }

    async function getChatbotResponse(message) {
        console.log('Sending message to chatbot:', message);
        
        // Add user message to history
        appendMessage(message, 'user');
        userInput.value = '';
        messages.push({ role: 'user', content: message });
        manageConversationHistory(); // Manage history after adding user message

        // Show enhanced typing indicator
        const typingIndicator = showTypingIndicator();

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
                                if (typingIndicator && typingIndicator.parentNode) {
                                    typingIndicator.remove();
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
            manageConversationHistory(); // Manage history after adding AI response

        } catch (error) {
            if (typingIndicator && typingIndicator.parentNode) {
                typingIndicator.remove();
            }
            
            // Fallback response for testing
            console.error('API Error:', error);
            const fallbackResponses = [
                "Hello! I'm Yuqiao's AI assistant. I'm currently in testing mode. I can tell you that Yuqiao is an award-winning pianist who has won the Bangkok Chopin Piano Competition 2024 and has over 8 million streams worldwide as an Apple Artist.",
                "Thanks for your message! Yuqiao has performed across the globe including Berlin, Prague, San Francisco, Hong Kong, Moscow, Shanghai, and Bangkok. He's also received multiple Carnegie Hall invitations.",
                "I'm here to help! Yuqiao studied piano in China (Chengdu, Beijing), India, Nepal, and Thailand. He has an IB predicted score of 41/42 and achieved 10 A*/9s in his IGCSEs.",
                "Great question! Yuqiao collaborates with Karma Sound Studio and has given memorable performances including solo recitals in Kathmandu with over 200 attendees at the French Ambassador's residence."
            ];
            
            const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
            appendMessage(randomResponse, 'ai');
            messages.push({ role: 'assistant', content: randomResponse });
        }
    }

    console.log('Adding event listeners to send button and input...');
    
    sendButton.addEventListener('click', () => {
        console.log('Send button clicked');
        const message = userInput.value;
        if (message.trim() !== '') {
            getChatbotResponse(message);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log('Enter key pressed');
            const message = userInput.value;
            if (message.trim() !== '') {
                getChatbotResponse(message);
            }
        }
    });

    console.log('Chatbot initialization complete!');
});