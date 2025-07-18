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

    // Voice input functionality
    let isRecording = false;
    let recognition = null;
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            isRecording = false;
            updateVoiceButton();
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isRecording = false;
            updateVoiceButton();
        };
        
        recognition.onend = function() {
            isRecording = false;
            updateVoiceButton();
        };
    }

    // Create voice button
    const voiceButton = document.createElement('button');
    voiceButton.innerHTML = '🎤';
    voiceButton.className = 'voice-button';
    voiceButton.title = 'Voice Input';
    voiceButton.style.cssText = `
        background: #c9a96e;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        margin-right: 10px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s;
        display: ${recognition ? 'flex' : 'none'};
        align-items: center;
        justify-content: center;
    `;
    
    function updateVoiceButton() {
        if (isRecording) {
            voiceButton.style.background = '#c94f4f';
            voiceButton.innerHTML = '⏹️';
            voiceButton.title = 'Stop Recording';
        } else {
            voiceButton.style.background = '#c9a96e';
            voiceButton.innerHTML = '🎤';
            voiceButton.title = 'Voice Input';
        }
    }
    
    voiceButton.addEventListener('click', () => {
        if (!recognition) return;
        
        if (isRecording) {
            recognition.stop();
        } else {
            recognition.start();
            isRecording = true;
            updateVoiceButton();
        }
    });
    
    // Insert voice button before the input field
    const chatInputContainer = document.querySelector('.chat-input-container');
    if (chatInputContainer) {
        chatInputContainer.insertBefore(voiceButton, userInput);
    }

    // Quick response buttons
    const quickResponses = [
        "Tell me about Yuqiao's achievements",
        "What competitions has he won?",
        "How did he start playing piano?",
        "What's his practice routine?",
        "Where has he performed?"
    ];

    function createQuickResponseButtons() {
        const quickButtonsContainer = document.createElement('div');
        quickButtonsContainer.className = 'quick-responses';
        quickButtonsContainer.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 15px;
            padding: 10px;
            background: #f9f5ef;
            border-radius: 8px;
            border: 1px solid #e6d8c1;
        `;

        quickResponses.forEach(response => {
            const button = document.createElement('button');
            button.textContent = response;
            button.style.cssText = `
                background: #c9a96e;
                color: white;
                border: none;
                border-radius: 15px;
                padding: 6px 12px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.3s;
                font-family: 'Montserrat', sans-serif;
            `;
            
            button.addEventListener('mouseenter', () => {
                button.style.background = '#b89862';
                button.style.transform = 'translateY(-1px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.background = '#c9a96e';
                button.style.transform = 'translateY(0)';
            });
            
            button.addEventListener('click', () => {
                getChatbotResponse(response);
            });
            
            quickButtonsContainer.appendChild(button);
        });

        // Insert after chat header
        const chatHeader = document.getElementById('chat-header');
        if (chatHeader && chatHeader.parentNode) {
            chatHeader.parentNode.insertBefore(quickButtonsContainer, chatHeader.nextSibling);
        }
    }

    // Create quick response buttons
    createQuickResponseButtons();

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