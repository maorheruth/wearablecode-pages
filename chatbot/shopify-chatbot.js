// WearableCode Shopify Chatbot Widget - Enhanced Version
// הוסף את הקוד הזה לשופיפיי לווידג'ט צ'אט בוט מלא

(function() {
    'use strict';
    
    // הגדרות הצ'אט בוט
    const CHATBOT_CONFIG = {
        apiUrl: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        huggingfaceToken: 'hf_pYTJTQzgWzSEGRk6ZmgKvdwJkpWBDqBuzP', // הטוקן שלך
        position: 'bottom-right',
        zIndex: 999999
    };

    // בדיקה שלא נטען כבר
    if (window.WearableCodeChatbot) {
        return;
    }

    // CSS עבור הצ'אט בוט - מעודכן עם תיקוני מובייל
    const chatbotCSS = `
        /* WearableCode Chatbot Styles */
        .wc-chatbot-container {
            position: fixed;
            bottom: 15px;
            right: 15px;
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

        /* החץ מתוקן - פונה שמאלה */
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

        /* Mobile Responsive - מעודכן */
        @media (max-width: 480px) {
            .wc-chatbot-container {
                right: 10px;
                bottom: 10px;
            }
            
            .wc-chat-button {
                width: 55px;
                height: 55px;
                font-size: 22px;
            }
            
            .wc-chat-window {
                width: calc(100vw - 20px);
                height: calc(100vh - 120px);
                right: calc(-100vw + 75px);
                bottom: 75px;
                max-width: 350px;
                max-height: 500px;
            }
            
            .wc-chat-header {
                padding: 15px;
            }
            
            .wc-assistant-avatar {
                width: 35px;
                height: 35px;
                font-size: 18px;
            }
            
            .wc-assistant-info h3 {
                font-size: 14px;
            }
            
            .wc-assistant-info p {
                font-size: 11px;
            }
            
            .wc-chat-messages {
                padding: 15px;
            }
            
            .wc-chat-input-container {
                padding: 12px 15px;
            }
            
            .wc-chat-input {
                padding: 10px 14px;
                font-size: 13px;
            }
            
            .wc-send-button {
                width: 32px;
                height: 32px;
            }
        }
    `;

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
            this.addMessage('שלום! אני כאן לעזור לך עם מוצרי WearableCode. איך אני יכול לעזור לך היום? 😊', 'bot');
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
                // ניסיון להשתמש ב-Hugging Face AI
                const aiResponse = await this.getAIResponse(message);
                
                this.hideTyping();
                this.addMessage(aiResponse, 'bot');

            } catch (error) {
                console.log('שגיאה בצ\'אט בוט:', error);
                this.hideTyping();
                
                // תשובת fallback חכמה יותר
                const fallbackResponse = this.getSmartFallbackResponse(message);
                this.addMessage(fallbackResponse, 'bot');
            }
        }

        async getAIResponse(message) {
            // הוספת הקשר לשיחה
            this.conversationHistory.push(message);
            
            // שמירה על 5 הודעות אחרונות לקונטקסט
            if (this.conversationHistory.length > 5) {
                this.conversationHistory = this.conversationHistory.slice(-5);
            }

            const response = await fetch(CHATBOT_CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CHATBOT_CONFIG.huggingfaceToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: {
                        past_user_inputs: this.conversationHistory.slice(0, -1),
                        generated_responses: [],
                        text: message
                    },
                    parameters: {
                        max_length: 150,
                        temperature: 0.7,
                        repetition_penalty: 1.2
                    }
                })
            });

            if (!response.ok) {
                throw new Error('AI API Error');
            }

            const data = await response.json();
            
            if (data.generated_text) {
                return this.translateToHebrew(data.generated_text);
            } else {
                throw new Error('No AI response');
            }
        }

        translateToHebrew(text) {
            // תרגום בסיסי למילים נפוצות
            const translations = {
                'hello': 'שלום',
                'hi': 'היי',
                'thanks': 'תודה',
                'price': 'מחיר',
                'shirt': 'חולצה',
                'size': 'מידה',
                'shipping': 'משלוח',
                'yes': 'כן',
                'no': 'לא'
            };

            let translated = text;
            Object.keys(translations).forEach(eng => {
                translated = translated.replace(new RegExp(eng, 'gi'), translations[eng]);
            });

            return translated;
        }

        getSmartFallbackResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            // זיהוי כוונות מתקדם יותר
            if (lowerMessage.includes('מחיר') || lowerMessage.includes('כמה עולה') || lowerMessage.includes('₪')) {
                return 'המחירים שלנו נעים בין ₪79-99 לחולצה, תלוי בעיצוב. יש לנו הנחות מיוחדות ללקוחות חדשים של 15%! רוצה לראות את המבצעים הנוכחיים? 💰';
            }
            
            if (lowerMessage.includes('משלוח') || lowerMessage.includes('דואר') || lowerMessage.includes('שליח')) {
                return 'משלוח חינם בהזמנה מעל ₪150! משלוח רגיל עולה ₪25 ומגיע תוך 3-5 ימי עסקים. יש לנו גם אפשרות איסוף עצמי ממרכזי חלוקה 📦';
            }
            
            if (lowerMessage.includes('החזרה') || lowerMessage.includes('החלפה') || lowerMessage.includes('החזר')) {
                return 'מדיניות ההחזרות שלנו נדיבה מאוד! החזרה עד 30 יום, החלפת מידה חינם! המוצר צריך להיות במצב מקורי עם התגיות. רוצה פרטים נוספים? 🔄';
            }
            
            if (lowerMessage.includes('מידה') || lowerMessage.includes('גודל') || lowerMessage.includes('size')) {
                return 'יש לנו מידות S, M, L, XL, XXL. הכי חשוב - יש מדריך מידות מפורט באתר עם מדידות מדויקות. מתלבט/ת במידה? אני יכול לעזור לך לבחור! 📏';
            }
            
            if (lowerMessage.includes('עיצוב') || lowerMessage.includes('דגם') || lowerMessage.includes('חולצה')) {
                return 'יש לנו מגוון ענק של עיצובים מגניבים! מציטוטים מסדרות, מימים ישראליים, ועיצובים יחודיים. איזה סגנון מעניין אותך? קומיקס, סדרות, או משהו ישראלי? 🎨';
            }
            
            if (lowerMessage.includes('איכות') || lowerMessage.includes('חומר') || lowerMessage.includes('בד')) {
                return 'אנחנו משתמשים רק בבדים איכותיים - כותנה 100% או תערובות נוחות שלא מתכווצות בכביסה. ההדפסה עמידה ולא נסדקת. איכות פרימיום במחיר הוגן! 👔';
            }
            
            if (lowerMessage.includes('שלום') || lowerMessage.includes('היי') || lowerMessage.includes('hello')) {
                return 'שלום וברוכים הבאים ל-WearableCode! 👋 אני כאן לעזור לך למצוא את החולצה המושלמת. מה מעניין אותך - מחירים, עיצובים, מידות, או משהו אחר?';
            }
            
            if (lowerMessage.includes('תודה') || lowerMessage.includes('thanks')) {
                return 'בכיף! אני כאן בשבילך. אם יש עוד שאלות או אם תרצה המלצות על חולצות ספציפיות, אל תהסס לשאול! 😊';
            }
            
            // תשובה כללית חכמה
            return `הבנתי את השאלה שלך! אני מתמחה במוצרי WearableCode - חולצות מגניבות עם עיצובים יחודיים. אני יכול לעזור לך עם:
            
📋 מידע על מוצרים ומחירים
📏 עזרה בבחירת מידה
🚚 פרטי משלוח והחזרות
🎨 המלצות על עיצובים
💬 כל שאלה אחרת!

מה הכי מעניין אותך?`;
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
