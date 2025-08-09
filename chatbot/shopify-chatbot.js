// WearableCode Shopify Chatbot עם Google Gemini API - בטוח ומתקדם
// קח את ה-API Key מכאן: https://ai.google.dev/gemini-api/docs/api-key

(function() {
    'use strict';
    
    // *** חשוב: תחליף את ה-API KEY הזה בשלך! ***
    const GEMINI_API_KEY = 'AIzaSyCJHnfJsB0FfcbSuST2Pf3CVFTu6WJzNNY'; // קח מ-https://ai.google.dev
    
    // הגדרות הצ'אט בוט
    const CHATBOT_CONFIG = {
        position: 'bottom-right',
        zIndex: 999999,
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        maxRetries: 3
    };

    // בדיקה שלא נטען כבר
    if (window.WearableCodeChatbot) {
        return;
    }

    // יצירת הצ'אט בוט
    class WearableCodeChatbot {
        constructor() {
            this.isOpen = false;
            this.messages = [];
            this.conversationHistory = [];
            this.init();
        }

        init() {
            this.addStyles();
            this.createChatbot();
            this.bindEvents();
            
            // הודעת ברוכים הבאים
            this.addMessage('שלום! אני עוזר WearableCode החכם 🤖 איך אני יכול לעזור לך היום?', 'bot');
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .wc-chatbot-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: ${CHATBOT_CONFIG.zIndex};
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    direction: rtl;
                    max-width: 400px;
                }

                .wc-chat-button {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 8px 32px rgba(66, 133, 244, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    position: relative;
                    font-size: 24px;
                    color: white;
                }

                .wc-chat-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 12px 40px rgba(66, 133, 244, 0.4);
                }

                .wc-chat-button::before {
                    content: "🤖";
                }

                .wc-chat-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 380px;
                    height: 600px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                    direction: rtl;
                }

                .wc-chat-window.open {
                    display: flex;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .wc-chat-header {
                    background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
                    padding: 20px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    direction: rtl;
                    text-align: right;
                }

                .wc-assistant-avatar {
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                .wc-assistant-info h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 2px;
                }

                .wc-assistant-info p {
                    font-size: 12px;
                    opacity: 0.9;
                }

                .wc-chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: white;
                    direction: rtl;
                }

                .wc-message {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                }

                .wc-message.user {
                    justify-content: flex-start;
                }

                .wc-message.bot {
                    justify-content: flex-end;
                }

                .wc-message-content {
                    max-width: 75%;
                    padding: 12px 16px;
                    border-radius: 16px;
                    font-size: 14px;
                    line-height: 1.4;
                }

                .wc-message.user .wc-message-content {
                    background: #4285f4;
                    color: white;
                    border-bottom-left-radius: 4px;
                    text-align: right;
                }

                .wc-message.bot .wc-message-content {
                    background: #f3f4f6;
                    color: #374151;
                    border-bottom-right-radius: 4px;
                    text-align: right;
                }

                .wc-chat-input-container {
                    padding: 16px 20px;
                    background: white;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    direction: rtl;
                }

                .wc-chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #e5e7eb;
                    border-radius: 24px;
                    font-size: 14px;
                    outline: none;
                    background: #f9fafb;
                    text-align: right;
                }

                .wc-chat-input:focus {
                    border-color: #4285f4;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
                }

                .wc-send-button {
                    width: 36px;
                    height: 36px;
                    background: #4285f4;
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .wc-send-button:hover {
                    background: #3367d6;
                    transform: scale(1.05);
                }

                .wc-send-button::before {
                    content: "←";
                    font-size: 16px;
                    font-weight: bold;
                }

                .wc-typing {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                    padding: 8px 0;
                }

                .wc-typing-dot {
                    width: 6px;
                    height: 6px;
                    background: #9ca3af;
                    border-radius: 50%;
                    animation: typingDot 1.4s infinite;
                }

                .wc-typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .wc-typing-dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typingDot {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-10px); }
                }

                @media (max-width: 480px) {
                    .wc-chatbot-container {
                        right: 15px;
                        bottom: 15px;
                        max-width: calc(100vw - 80px);
                    }
                    .wc-chat-window {
                        width: calc(100vw - 30px);
                        height: calc(100vh - 140px);
                        max-width: 350px;
                        max-height: 500px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        createChatbot() {
            const container = document.createElement('div');
            container.className = 'wc-chatbot-container';
            container.innerHTML = `
                <button class="wc-chat-button" id="wcChatButton"></button>
                
                <div class="wc-chat-window" id="wcChatWindow">
                    <div class="wc-chat-header">
                        <div class="wc-assistant-avatar">🤖</div>
                        <div class="wc-assistant-info">
                            <h3>עוזר WearableCode</h3>
                            <p>מופעל על ידי Google Gemini AI</p>
                        </div>
                    </div>

                    <div class="wc-chat-messages" id="wcChatMessages"></div>

                    <div class="wc-chat-input-container">
                        <input type="text" class="wc-chat-input" id="wcChatInput" placeholder="כתוב הודעה..." />
                        <button class="wc-send-button" id="wcSendButton"></button>
                    </div>
                </div>
            `;

            document.body.appendChild(container);
            
            this.chatButton = document.getElementById('wcChatButton');
            this.chatWindow = document.getElementById('wcChatWindow');
            this.chatMessages = document.getElementById('wcChatMessages');
            this.chatInput = document.getElementById('wcChatInput');
            this.sendButton = document.getElementById('wcSendButton');
        }

        bindEvents() {
            this.chatButton.addEventListener('click', () => this.toggleChat());
            this.sendButton.addEventListener('click', () => this.sendMessage());
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        toggleChat() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.chatWindow.classList.add('open');
                this.chatInput.focus();
            } else {
                this.chatWindow.classList.remove('open');
            }
        }

        addMessage(content, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `wc-message ${sender}`;
            messageDiv.innerHTML = `<div class="wc-message-content">${content}</div>`;
            
            this.chatMessages.appendChild(messageDiv);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            
            this.messages.push({ content, sender, timestamp: new Date() });
        }

        showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'wc-message bot';
            typingDiv.id = 'wcTyping';
            typingDiv.innerHTML = `
                <div class="wc-message-content">
                    <div class="wc-typing">
                        <div class="wc-typing-dot"></div>
                        <div class="wc-typing-dot"></div>
                        <div class="wc-typing-dot"></div>
                        <span style="margin-right: 8px; color: #6b7280; font-size: 13px;">כותב...</span>
                    </div>
                </div>
            `;
            
            this.chatMessages.appendChild(typingDiv);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }

        hideTyping() {
            const typingDiv = document.getElementById('wcTyping');
            if (typingDiv) {
                typingDiv.remove();
            }
        }

        async sendMessage() {
            const message = this.chatInput.value.trim();
            if (!message) return;

            this.addMessage(message, 'user');
            this.chatInput.value = '';
            this.showTyping();

            try {
                // הוספת הקשר של WearableCode לשיחה
                const contextualMessage = `אתה עוזר חכם של חברת WearableCode - חנות חולצות מגניבות עם עיצובים יחודיים. 
                תמיד תענה בעברית ותעזור ללקוחות עם:
                - מידע על מוצרים ומחירים (₪79-99 לחולצה)
                - עזרה בבחירת מידות (S-XXL זמינות)
                - פרטי משלוח (חינם מעל ₪150)
                - החזרות והחלפות (30 יום)
                - המלצות על עיצובים
                
                השאלה של הלקוח: ${message}`;

                const response = await this.callGeminiAPI(contextualMessage);
                
                this.hideTyping();
                this.addMessage(response, 'bot');

            } catch (error) {
                console.error('שגיאה בצ\'אט בוט:', error);
                this.hideTyping();
                
                // תשובת fallback מקומית
                const fallbackResponse = this.getLocalResponse(message);
                this.addMessage(fallbackResponse, 'bot');
            }
        }

        async callGeminiAPI(message) {
            if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
                throw new Error('API key not configured');
            }

            const response = await fetch(`${CHATBOT_CONFIG.apiUrl}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 150,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('No response from Gemini');
            }
        }

        getLocalResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            // תשובות מקומיות חכמות בעברית
            if (lowerMessage.includes('מחיר') || lowerMessage.includes('כמה עולה') || lowerMessage.includes('₪')) {
                return 'המחירים שלנו נעים בין ₪79-99 לחולצה, תלוי בעיצוב. יש לנו מבצע מיוחד של 15% הנחה ללקוחות חדשים! 💰';
            }
            
            if (lowerMessage.includes('משלוח') || lowerMessage.includes('דואר')) {
                return 'משלוח חינם בהזמנה מעל ₪150! משלוח רגיל עולה ₪25 ומגיע תוך 3-5 ימי עסקים 📦';
            }
            
            if (lowerMessage.includes('מידה') || lowerMessage.includes('גודל')) {
                return 'יש לנו מידות S, M, L, XL, XXL. יש מדריך מידות מפורט באתר עם מדידות מדויקות 📏';
            }
            
            if (lowerMessage.includes('החזרה') || lowerMessage.includes('החלפה')) {
                return 'מדיניות ההחזרות שלנו נדיבה - החזרה עד 30 יום, החלפת מידה חינם! 🔄';
            }
            
            if (lowerMessage.includes('עיצוב') || lowerMessage.includes('חולצה')) {
                return 'יש לנו מגוון ענק של עיצובים מגניבים! מציטוטים מסדרות, מימים ישראליים, ועיצובים יחודיים 🎨';
            }
            
            return 'תודה על השאלה! אני כאן לעזור לך עם כל מה שקשור ל-WearableCode. איך אני יכול לעזור לך עוד? 😊';
        }
    }

    // אתחול הצ'אט בוט
    function initChatbot() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.WearableCodeChatbot = new WearableCodeChatbot();
            });
        } else {
            window.WearableCodeChatbot = new WearableCodeChatbot();
        }
    }

    // התחל!
    initChatbot();

})();
