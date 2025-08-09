// WearableCode Shopify Chatbot Widget
// הוסף את הקוד הזה לשופיפיי לווידג'ט צ'אט בוט מלא

(function() {
    'use strict';
    
    // הגדרות הצ'אט בוט
    const CHATBOT_CONFIG = {
        apiUrl: 'https://wearablecode-pages.vercel.app/api/chat',
        position: 'bottom-right', // bottom-right, bottom-left
        zIndex: 999999
    };

    // בדיקה שלא נטען כבר
    if (window.WearableCodeChatbot) {
        return;
    }

    // CSS עבור הצ'אט בוט
    const chatbotCSS = `
        /* WearableCode Chatbot Styles */
        .wc-chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: ${CHATBOT_CONFIG.zIndex};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            direction: rtl;
        }

        .wc-chat-button {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            border-radius: 50%;
            border: none;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(124, 58, 237, 0.3);
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
            box-shadow: 0 12px 40px rgba(124, 58, 237, 0.4);
        }

        .wc-chat-button::before {
            content: "💬";
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
        }

        .wc-chat-window.open {
            display: flex;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .wc-chat-header {
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            padding: 20px;
            color: white;
            display: flex;
            align-items: center;
            gap: 12px;
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
        }

        .wc-message {
            margin-bottom: 16px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }

        .wc-message.user {
            justify-content: flex-end;
        }

        .wc-message.bot {
            justify-content: flex-start;
        }

        .wc-message-content {
            max-width: 75%;
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.4;
        }

        .wc-message.user .wc-message-content {
            background: #7c3aed;
            color: white;
            border-bottom-right-radius: 4px;
        }

        .wc-message.bot .wc-message-content {
            background: #f3f4f6;
            color: #374151;
            border-bottom-left-radius: 4px;
        }

        .wc-chat-input-container {
            padding: 16px 20px;
            background: white;
            border-top: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 12px;
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
            border-color: #7c3aed;
            background: white;
            box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
        }

        .wc-send-button {
            width: 36px;
            height: 36px;
            background: #7c3aed;
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
            background: #6d28d9;
            transform: scale(1.05);
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

        /* Mobile Responsive */
        @media (max-width: 480px) {
            .wc-chatbot-container {
                right: 15px;
                bottom: 15px;
            }
            
            .wc-chat-window {
                width: 90vw;
                height: 80vh;
                right: -75vw;
                bottom: 80px;
            }
        }
    `;

    // יצירת הצ'אט בוט
    class WearableCodeChatbot {
        constructor() {
            this.isOpen = false;
            this.messages = [];
            this.init();
        }

        init() {
            this.addStyles();
            this.createChatbot();
            this.bindEvents();
            
            // הודעת ברוכים הבאים
            this.addMessage('שלום! איך אני יכול לעזור לך היום? 😊', 'bot');
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = chatbotCSS;
            document.head.appendChild(style);
        }

        createChatbot() {
            const container = document.createElement('div');
            container.className = 'wc-chatbot-container';
            container.innerHTML = `
                <button class="wc-chat-button" id="wcChatButton"></button>
                
                <div class="wc-chat-window" id="wcChatWindow">
                    <div class="wc-chat-header">
                        <div class="wc-assistant-avatar">🛍️</div>
                        <div class="wc-assistant-info">
                            <h3>WearableCode Assistant</h3>
                            <p>כאן כדי לעזור לך למצוא את המוצר המושלם</p>
                        </div>
                    </div>

                    <div class="wc-chat-messages" id="wcChatMessages">
                    </div>

                    <div class="wc-chat-input-container">
                        <input type="text" class="wc-chat-input" id="wcChatInput" placeholder="כתוב הודעה..." />
                        <button class="wc-send-button" id="wcSendButton">
                            <span>➤</span>
                        </button>
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
                const response = await fetch(CHATBOT_CONFIG.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message })
                });

                const data = await response.json();
                
                this.hideTyping();
                
                if (data.success) {
                    this.addMessage(data.response, 'bot');
                } else {
                    throw new Error('API Error');
                }

            } catch (error) {
                console.log('שגיאה בצ\'אט בוט:', error);
                this.hideTyping();
                
                // תשובת fallback בעברית
                const fallbackResponse = this.getFallbackResponse(message);
                this.addMessage(fallbackResponse, 'bot');
            }
        }

        getFallbackResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes('מחיר') || lowerMessage.includes('כמה עולה')) {
                return 'המחירים שלנו נעים בין ₪79-99 לחולצה. יש לנו הנחות מיוחדות ללקוחות חדשים! 💰';
            }
            
            if (lowerMessage.includes('משלוח')) {
                return 'משלוח חינם מעל ₪150! משלוח רגיל עולה ₪25 ומגיע תוך 3-5 ימי עסקים 📦';
            }
            
            if (lowerMessage.includes('החזרה') || lowerMessage.includes('החלפה')) {
                return 'ההחזרות שלנו עד 30 יום, החלפת מידה חינם! המוצר צריך להיות במצב מקורי 🔄';
            }
            
            if (lowerMessage.includes('מידה') || lowerMessage.includes('גודל')) {
                return 'יש לנו מידות S, M, L, XL. אפשר לראות את מדריך המידות באתר או לפנות אלינו לעזרה! 📏';
            }
            
            return 'תודה על הפניה! איך אני יכול לעזור לך עם המוצרים שלנו? אני יכול לעזור עם מידע על חולצות, מחירים, משלוח או כל דבר אחר 😊';
        }
    }

    // אתחול הצ'אט בוט כשהדף נטען
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
