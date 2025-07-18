// AI Chatbot Modal Functionality - Shared across all pages
document.addEventListener('DOMContentLoaded', () => {
    const aiChatbotBtn = document.getElementById('ai-chatbot-btn');
    const aiChatbotOverlay = document.getElementById('ai-chatbot-overlay');
    const aiChatbotClose = document.getElementById('ai-chatbot-close');

    if (!aiChatbotBtn || !aiChatbotOverlay || !aiChatbotClose) {
        console.warn('AI Chatbot elements not found on this page');
        return;
    }

    function openChatbot() {
        aiChatbotOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        // Focus on input after animation
        setTimeout(() => {
            const userInput = document.getElementById('user-input');
            if (userInput) userInput.focus();
        }, 150);
    }

    function closeChatbot() {
        aiChatbotOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // Event listeners
    aiChatbotBtn.addEventListener('click', openChatbot);
    aiChatbotClose.addEventListener('click', closeChatbot);

    // Close on overlay click
    aiChatbotOverlay.addEventListener('click', (e) => {
        if (e.target === aiChatbotOverlay) {
            closeChatbot();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && aiChatbotOverlay.classList.contains('active')) {
            closeChatbot();
        }
    });

    // Quick suggestion buttons functionality
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    suggestionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const question = button.getAttribute('data-question');
            const userInput = document.getElementById('user-input');
            if (userInput && question) {
                userInput.value = question;
                // Trigger the send button click
                const sendButton = document.getElementById('send-button');
                if (sendButton) {
                    sendButton.click();
                }
            }
        });
    });

    // Voice input functionality
    const voiceButton = document.getElementById('voice-button');
    if (voiceButton) {
        let recognition = null;
        let isRecording = false;

        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                isRecording = true;
                voiceButton.classList.add('recording');
                voiceButton.innerHTML = '<i class="fas fa-stop"></i>';
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const userInput = document.getElementById('user-input');
                if (userInput) {
                    userInput.value = transcript;
                }
            };

            recognition.onend = () => {
                isRecording = false;
                voiceButton.classList.remove('recording');
                voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                isRecording = false;
                voiceButton.classList.remove('recording');
                voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
            };

            voiceButton.addEventListener('click', () => {
                if (!isRecording) {
                    recognition.start();
                } else {
                    recognition.stop();
                }
            });
        } else {
            // Hide voice button if speech recognition is not supported
            voiceButton.style.display = 'none';
        }
    }
}); 