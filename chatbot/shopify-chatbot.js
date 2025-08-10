// WearableCode Shopify Chatbot עם Google Gemini API - גרסה מותאמת אישית
// צריך לקבל API Key מ: https://aistudio.google.com/app/apikey

(function() {
    'use strict';
    
    // *** חשוב: תחליף את ה-API KEY הזה בשלך! ***
    const GEMINI_API_KEY = 'AIzaSyCJHnfJsB0FfcbSuST2Pf3CVFTu6WJzNNY'; // הכנס כאן את המפתח שלך
    
    // הגדרות הצ'אט בוט
    const CHATBOT_CONFIG = {
        position: 'bottom-right',
        zIndex: 999999,
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
        maxRetries: 3
    };

    // תשובות מותאמות אישית לשאלות ספציפיות
    const CUSTOM_RESPONSES = {
        'מה זה wearablecode': '🎨 WearableCode זה המקום הכי מגניב לחולצות עם עיצובים יחודיים! אנחנו מתמחים בציטוטים מסדרות, מימים ישראליים, ועיצובים שלא תמצאו בשום מקום אחר 👕',
        
        'איך אני מזמין': '🛒 זה פשוט מאוד! בחר חולצה שאתה אוהב, בחר מידה, הוסף לעגלה ועבור לקופה. יש לנו משלוח מהיר ותשלום מאובטח 💳',
        
        'איכות חולצות': '⭐ כל החולצות שלנו עשויות מ100% כותנה איכותית, עם הדפסה עמידה שלא תיפסל במכונת כביסה. איכות פרימיום במחירים הוגנים!',
        
        'זמן אספקה': '🚚 אנחנו שולחים תוך 1-2 ימי עסקים, והמשלוח מגיע תוך 3-5 ימי עסקים נוספים. משלוח חינם מעל ₪150!',
        
        'חולצות לנשים': '👩‍🎨 בהחלט! יש לנו קולקציה מיוחדת לנשים עם עיצובים פמיניסטיים, ציטוטים מעצימים ועיצובים עדינים יותר',
        
        'מידות גדולות': '📏 יש לנו מידות עד XXL ואנחנו עובדים על הוספת מידות גדולות יותר. תמיד אפשר ליצור קשר ונבדוק אפשרויות מיוחדות',
        
        'עיצוב מותאם': '🎨 כן! אנחנו מקבלים הזמנות לעיצובים מותאמים אישית. פנה אלינו עם הרעיון שלך ונכין לך הצעת מחיר',
        
        'מבצעים': '🎉 יש לנו מבצעים קבועים! 15% הנחה ללקוחות חדשים, ומבצע "קנה 2 קבל שלישית חינם" לחברי המועדון'
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
            this.addMessage('👋 שלום! אני עוזר WearableCode החכם. איך אני יכול לעזור לך היום?', 'bot');
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
                    width: 65px;
                    height: 65px;
                    background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
                    border-radius: 50%;
                    border: 3px solid #404040;
                    cursor: pointer;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    position: relative;
                    font-size: 28px;
                    color: white;
                    animation: gentleWave 3s ease-in-out infinite;
                }

                .wc-chat-button:hover {
                    transform: scale(1.08);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
                    background: linear-gradient(135deg, #404040 0%, #2c2c2c 100%);
                }

                .wc-chat-button::before {
                    content: "👋";
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
                }

                @keyframes gentleWave {
                    0%, 100% { 
                        transform: rotate(0deg) scale(1); 
                    }
                    25% { 
                        transform: rotate(15deg) scale(1.02); 
                    }
                    75% { 
                        transform: rotate(-15deg) scale(1.02); 
                    }
                }

                .wc-chat-window {
                    position: absolute;
                    bottom: 85px;
                    right: 0;
                    width: 380px;
                    height: 600px;
                    background: #1a1a1a;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    border: 2px solid #404040;
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
                    background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
                    padding: 20px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    direction: rtl;
                    text-align: right;
                    border-bottom: 1px solid #404040;
                }

                .wc-assistant-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #404040, #2c2c2c);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    border: 2px solid #666;
                    animation: gentleWave 3s ease-in-out infinite;
                }

                .wc-assistant-info h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 2px;
                    color: #ffffff;
                }

                .wc-assistant-info p {
                    font-size: 12px;
                    opacity: 0.8;
                    color: #cccccc;
                }

                .wc-chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: #1a1a1a;
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
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }

                .wc-message.user .wc-message-content {
                    background: linear-gradient(135deg, #404040 0%, #2c2c2c 100%);
                    color: white;
                    border-bottom-left-radius: 4px;
                    text-align: right;
                    border: 1px solid #555;
                }

                .wc-message.bot .wc-message-content {
                    background: linear-gradient(135deg, #808080 0%, #666666 100%);
                    color: #ffffff;
                    border-bottom-right-radius: 4px;
                    text-align: right;
                    border: 1px solid #999;
                }

                .wc-chat-input-container {
                    padding: 16px 20px;
                    background: #2c2c2c;
                    border-top: 1px solid #404040;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    direction: rtl;
                }

                .wc-chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #555;
                    border-radius: 24px;
                    font-size: 14px;
                    outline: none;
                    background: #404040;
                    color: white;
                    text-align: right;
                    transition: all 0.3s ease;
                }

                .wc-chat-input::placeholder {
                    color: #aaa;
                }

                .wc-chat-input:focus {
                    border-color: #666;
                    background: #4a4a4a;
                    box-shadow: 0 0 0 3px rgba(102, 102, 102, 0.2);
                }

                .wc-send-button {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #404040 0%, #2c2c2c 100%);
                    border: 1px solid #666;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }

                .wc-send-button:hover {
                    background: linear-gradient(135deg, #4a4a4a 0%, #363636 100%);
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
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
                    background: #ccc;
                    border-radius: 50%;
                    animation: typingDot 1.4s infinite;
                }

                .wc-typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .wc-typing-dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typingDot {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-8px); opacity: 1; }
                }

                /* Close button */
                .wc-close-button {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    width: 30px;
                    height: 30px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: all 0.2s ease;
                }

                .wc-close-button:hover {
                    background: rgba(255,255,255,0.2);
                    transform: scale(1.1);
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
                    .wc-chat-button {
                        width: 55px;
                        height: 55px;
                        font-size: 24px;
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
                        <div class="wc-assistant-avatar">👋</div>
                        <div class="wc-assistant-info">
                            <h3>עוזר WearableCode</h3>
                            <p>מופעל על ידי Google Gemini</p>
                        </div>
                        <button class="wc-close-button" id="wcCloseButton">×</button>
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
            this.closeButton = document.getElementById('wcCloseButton');
        }

        bindEvents() {
            this.chatButton.addEventListener('click', () => this.toggleChat());
            this.closeButton.addEventListener('click', () => this.toggleChat());
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
                        <span style="margin-right: 8px; color: #ccc; font-size: 13px;">כותב...</span>
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

        // פונקציה לבדיקת תשובות מותאמות אישית
        getCustomResponse(message) {
            const lowerMessage = message.toLowerCase().trim();
            
            // בדיקה מדויקת של המילות המפתח
            for (const [key, response] of Object.entries(CUSTOM_RESPONSES)) {
                if (lowerMessage.includes(key) || lowerMessage === key) {
                    return response;
                }
            }
            
            return null; // אם לא נמצאה תשובה מותאמת
        }

        async sendMessage() {
            const message = this.chatInput.value.trim();
            if (!message) return;

            this.addMessage(message, 'user');
            this.chatInput.value = '';
            this.showTyping();

            // בדוק תחילה אם יש תשובה מותאמת אישית
            const customResponse = this.getCustomResponse(message);
            if (customResponse) {
                setTimeout(() => {
                    this.hideTyping();
                    this.addMessage(customResponse, 'bot');
                }, 1000); // דיליי קצר לריאליזם
                return;
            }

            try {
                // בדיקה אם ה-API Key מוגדר
                if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
                    throw new Error('API key not configured');
                }

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
            console.log('🚀 קורא ל-Gemini API...');
            
            try {
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
                        },
                        safetySettings: [
                            {
                                category: "HARM_CATEGORY_HARASSMENT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE"
                            }
                        ]
                    })
                });

                console.log('📡 תגובת שרת:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ שגיאת API:', response.status, errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('✅ נתונים מGemini:', data);
                
                if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                    return data.candidates[0].content.parts[0].text;
                } else {
                    throw new Error('No valid response from Gemini');
                }
            } catch (error) {
                console.error('❌ שגיאה בקריאה ל-Gemini:', error);
                throw error;
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
            
            if (lowerMessage.includes('שלום') || lowerMessage.includes('היי')) {
                return 'שלום וברוכים הבאים ל-WearableCode! 👋 איך אני יכול לעזור לך היום?';
            }
            
            // אם ה-API לא עובד
            if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
                return '⚠️ הצ\'אט בוט פועל במצב מקומי. לקבלת תשובות מתקדמות יותר, צריך להוסיף API Key. בינתיים אני יכול לעזור עם שאלות בסיסיות על WearableCode!';
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
