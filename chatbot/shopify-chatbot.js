// WearableCode Smart Chatbot - Updated Design
// גרסה מעודכנת עם עיצוב לבן ותשובות חכמות

(function() {
    'use strict';
    
    // בדיקה שלא נטען כבר
    if (window.WearableCodeSmartChatbot) {
        return;
    }

    // *** נתוני הצ'אטבוט - ערוך כאן או השתמש בדף הניהול ***
    const CHATBOT_RESPONSES = {
        'מחירים': {
            response: '💰 המחירים שלנו:\n• חולצה רגילה: ₪79-89\n• חולצה פרימיום: ₪99-109\n• מבצע ללקוחות חדשים: 15% הנחה!\n• משלוח חינם מעל ₪150',
            keywords: ['מחיר', 'כמה עולה', 'עלות', 'כסף', '₪', 'זול', 'יקר']
        },
        'משלוח': {
            response: '🚚 פרטי משלוח:\n• משלוח רגיל: ₪25 (3-5 ימי עסקים)\n• משלוח מהיר: ₪35 (1-2 ימי עסקים)\n• משלוח חינם מעל ₪150!\n• שליח עד הבית או לנקודת איסוף',
            keywords: ['משלוח', 'דואר', 'הגעה', 'כמה זמן', 'שליח', 'איסוף']
        },
        'מעקב חבילה': {
            response: '📦 למעקב אחר החבילה שלך:\n• היכנס לאזור האישי באתר\n• או שלח לנו את מספר ההזמנה בווטסאפ\n• נשלח לך קישור למעקב ישירות\n• זמן משלוח: 3-5 ימי עסקים',
            keywords: ['חבילה', 'מעקב', 'איפה החבילה', 'הזמנה', 'משלוח', 'הגיע', 'מתי יגיע']
        },
        'מידות': {
            response: '📏 המידות שלנו:\n• S - חזה 90-94 ס"מ\n• M - חזה 94-98 ס"מ\n• L - חזה 98-104 ס"מ\n• XL - חזה 104-110 ס"מ\n• XXL - חזה 110-116 ס"מ\n\nיש מדריך מידות מלא באתר!',
            keywords: ['מידה', 'גודל', 'מידות', 'small', 'medium', 'large', 's', 'm', 'l', 'xl', 'xxl']
        },
        'איכות': {
            response: '⭐ איכות פרימיום:\n• 100% כותנה איכותית\n• הדפסה עמידה במכונת כביסה\n• תפרים חזקים ועמידים\n• צבעים שלא דוהים\n• אחריות על כל מוצר!',
            keywords: ['איכות', 'חומר', 'כותנה', 'הדפסה', 'עמיד', 'כביסה']
        },
        'החזרות': {
            response: '🔄 מדיניות החזרות נדיבה:\n• החזרה תוך 30 יום\n• החלפת מידה חינם\n• החזר כספי מלא (לא כולל משלוח)\n• המוצר חייב להיות במצב חדש\n• פשוט ליצור קשר ונסדר!',
            keywords: ['החזרה', 'החלפה', 'החזר', 'לא מתאים', 'מידה לא טובה', 'להחליף']
        },
        'עיצובים': {
            response: '🎨 הקטגוריות שלנו:\n• ציטוטים מסדרות (יו, חברים, משרד וכו\')\n• מימים ישראליים\n• עיצובים מצחיקים\n• ציטוטים מעצימים\n• עיצובים מותאמים אישית\n\nכל העיצובים יחודיים ובלעדיים!',
            keywords: ['עיצוב', 'חולצה', 'דיזני', 'סדרות', 'מימים', 'מצחיק', 'ציטוט']
        },
        'צור קשר': {
            response: '📞 אפשר ליצור קשר:\n• WhatsApp: 050-123-4567\n• מייל: hello@wearablecode.com\n• פייסבוק: WearableCode Israel\n• אינסטגרם: @wearablecode_il\n\nאנחנו כאן בשבילכם! 😊',
            keywords: ['צור קשר', 'טלפון', 'מייל', 'פייסבוק', 'אינסטגרם', 'ווטסאפ', 'עזרה']
        },
        'מבצעים': {
            response: '🎉 המבצעים הנוכחיים:\n• 15% הנחה ללקוחות חדשים (קוד: NEW15)\n• קנה 2 קבל שלישית ב-50% הנחה\n• משלוח חינם מעל ₪150\n• מבצע חברי מועדון: 20% הנחה\n\nעקבו אחרינו לעוד מבצעים!',
            keywords: ['מבצע', 'הנחה', 'זול יותר', 'קופון', 'קוד', 'חסכון']
        }
    };

    // הודעות ברוכים הבאים אקראיות
    const WELCOME_MESSAGES = [
        '👋 שלום! אני העוזר הווירטואלי של WearableCode. איך אני יכול לעזור לך היום?',
        '🎨 ברוכים הבאים ל-WearableCode! אני כאן לעזור לך למצוא את החולצה המושלמת',
        '👕 היי! רוצה לשמוע על החולצות הכי מגניבות בישראל? אני כאן בשבילך!',
        '😊 שלום וברוכים הבאים! אני יכול לעזור לך עם כל מה שקשור לחולצות שלנו'
    ];

    // יצירת הצ'אט בוט החכם
    class WearableCodeSmartChatbot {
        constructor() {
            this.isOpen = false;
            this.messages = [];
            this.currentMessage = '';
            this.init();
        }

        init() {
            this.addStyles();
            this.createChatbot();
            this.bindEvents();
            
            // הודעת ברוכים הבאים אקראית
            const welcomeMessage = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
            this.addMessage(welcomeMessage, 'bot');
            
            // הוספת הודעת עזרה
            setTimeout(() => {
                this.addMessage('💡 טיפ: נסה לכתוב "מחירים", "משלוח", "חבילה" או "מידות" לקבלת מידע מהיר!', 'bot');
            }, 2000);
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .wc-smart-chatbot-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    direction: rtl;
                    max-width: 420px;
                }

                .wc-smart-chat-button {
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

                .wc-smart-chat-button:hover {
                    transform: scale(1.08);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
                    background: linear-gradient(135deg, #404040 0%, #2c2c2c 100%);
                }

                .wc-smart-chat-button::before {
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

                .wc-smart-chat-window {
                    position: absolute;
                    bottom: 85px;
                    right: 0;
                    width: 400px;
                    height: 600px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    border: 2px solid #e9ecef;
                    direction: rtl;
                }

                .wc-smart-chat-window.open {
                    display: flex;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .wc-smart-chat-header {
                    background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
                    padding: 20px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    direction: rtl;
                    text-align: right;
                    border-bottom: 1px solid #e9ecef;
                    position: relative;
                }

                .wc-smart-assistant-avatar {
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

                .wc-smart-assistant-info h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 2px;
                    color: #ffffff;
                }

                .wc-smart-assistant-info p {
                    font-size: 12px;
                    opacity: 0.8;
                    color: #cccccc;
                }

                .wc-smart-close-button {
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

                .wc-smart-close-button:hover {
                    background: rgba(255,255,255,0.2);
                    transform: scale(1.1);
                }

                .wc-smart-chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: white;
                    direction: rtl;
                    scroll-behavior: smooth;
                }

                .wc-smart-message {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    animation: messageSlide 0.3s ease;
                }

                @keyframes messageSlide {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .wc-smart-message.user {
                    justify-content: flex-start;
                }

                .wc-smart-message.bot {
                    justify-content: flex-end;
                }

                .wc-smart-message-content {
                    max-width: 80%;
                    padding: 12px 16px;
                    border-radius: 16px;
                    font-size: 14px;
                    line-height: 1.5;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    white-space: pre-line;
                }

                .wc-smart-message.user .wc-smart-message-content {
                    background: #6c757d;
                    color: white;
                    border-bottom-left-radius: 4px;
                    text-align: right;
                }

                .wc-smart-message.bot .wc-smart-message-content {
                    background: #e9ecef;
                    color: #333333;
                    border-bottom-right-radius: 4px;
                    text-align: right;
                }

                .wc-smart-chat-input-container {
                    padding: 16px 20px;
                    background: #f8f9fa;
                    border-top: 1px solid #e9ecef;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    direction: rtl;
                }

                .wc-smart-chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #ced4da;
                    border-radius: 24px;
                    font-size: 14px;
                    outline: none;
                    background: #ffffff;
                    color: #333333;
                    text-align: right;
                    transition: all 0.3s ease;
                }

                .wc-smart-chat-input::placeholder {
                    color: #6c757d;
                }

                .wc-smart-chat-input:focus {
                    border-color: #495057;
                    box-shadow: 0 0 0 3px rgba(73, 80, 87, 0.1);
                }

                .wc-smart-send-button {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }

                .wc-smart-send-button:hover {
                    background: linear-gradient(135deg, #5a6268 0%, #343a40 100%);
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .wc-smart-send-button::before {
                    content: "←";
                    font-size: 16px;
                    font-weight: bold;
                }

                .wc-smart-typing {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                    padding: 8px 0;
                }

                .wc-smart-typing-dot {
                    width: 6px;
                    height: 6px;
                    background: #6c757d;
                    border-radius: 50%;
                    animation: typingDot 1.4s infinite;
                }

                .wc-smart-typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .wc-smart-typing-dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typingDot {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-8px); opacity: 1; }
                }

                /* Quick replies */
                .wc-smart-quick-replies {
                    padding: 10px 20px 0;
                    background: white;
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                }

                .wc-smart-quick-reply {
                    background: #f8f9fa;
                    color: #495057;
                    border: 1px solid #ced4da;
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-bottom: 10px;
                }

                .wc-smart-quick-reply:hover {
                    background: #e9ecef;
                    border-color: #adb5bd;
                    transform: scale(1.02);
                }

                @media (max-width: 480px) {
                    .wc-smart-chatbot-container {
                        right: 15px;
                        bottom: 15px;
                        max-width: calc(100vw - 80px);
                    }
                    .wc-smart-chat-window {
                        width: calc(100vw - 30px);
                        height: calc(100vh - 140px);
                        max-width: 350px;
                        max-height: 500px;
                    }
                    .wc-smart-chat-button {
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
            container.className = 'wc-smart-chatbot-container';
            container.innerHTML = `
                <button class="wc-smart-chat-button" id="wcSmartChatButton"></button>
                
                <div class="wc-smart-chat-window" id="wcSmartChatWindow">
                    <div class="wc-smart-chat-header">
                        <div class="wc-smart-assistant-avatar">👋</div>
                        <div class="wc-smart-assistant-info">
                            <h3>עוזר WearableCode</h3>
                            <p>תשובות מהירות ומדויקות</p>
                        </div>
                        <button class="wc-smart-close-button" id="wcSmartCloseButton">×</button>
                    </div>

                    <div class="wc-smart-chat-messages" id="wcSmartChatMessages"></div>
                    
                    <div class="wc-smart-quick-replies" id="wcSmartQuickReplies">
                        <div class="wc-smart-quick-reply" data-message="מחירים">מחירים</div>
                        <div class="wc-smart-quick-reply" data-message="משלוח">משלוח</div>
                        <div class="wc-smart-quick-reply" data-message="חבילה">מעקב חבילה</div>
                        <div class="wc-smart-quick-reply" data-message="צור קשר">צור קשר</div>
                    </div>

                    <div class="wc-smart-chat-input-container">
                        <input type="text" class="wc-smart-chat-input" id="wcSmartChatInput" placeholder="כתוב הודעה..." />
                        <button class="wc-smart-send-button" id="wcSmartSendButton"></button>
                    </div>
                </div>
            `;

            document.body.appendChild(container);
            
            this.chatButton = document.getElementById('wcSmartChatButton');
            this.chatWindow = document.getElementById('wcSmartChatWindow');
            this.chatMessages = document.getElementById('wcSmartChatMessages');
            this.chatInput = document.getElementById('wcSmartChatInput');
            this.sendButton = document.getElementById('wcSmartSendButton');
            this.closeButton = document.getElementById('wcSmartCloseButton');
            this.quickReplies = document.getElementById('wcSmartQuickReplies');
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

            // Quick replies
            this.quickReplies.addEventListener('click', (e) => {
                if (e.target.classList.contains('wc-smart-quick-reply')) {
                    const message = e.target.getAttribute('data-message');
                    this.chatInput.value = message;
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
            messageDiv.className = `wc-smart-message ${sender}`;
            messageDiv.innerHTML = `<div class="wc-smart-message-content">${content}</div>`;
            
            this.chatMessages.appendChild(messageDiv);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            
            this.messages.push({ content, sender, timestamp: new Date() });
        }

        showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'wc-smart-message bot';
            typingDiv.id = 'wcSmartTyping';
            typingDiv.innerHTML = `
                <div class="wc-smart-message-content">
                    <div class="wc-smart-typing">
                        <div class="wc-smart-typing-dot"></div>
                        <div class="wc-smart-typing-dot"></div>
                        <div class="wc-smart-typing-dot"></div>
                        <span style="margin-right: 8px; color: #6c757d; font-size: 13px;">כותב...</span>
                    </div>
                </div>
            `;
            
            this.chatMessages.appendChild(typingDiv);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }

        hideTyping() {
            const typingDiv = document.getElementById('wcSmartTyping');
            if (typingDiv) {
                typingDiv.remove();
            }
        }

        // פונקציה חכמה לחיפוש תשובה מתאימה
        findResponse(message) {
            const lowerMessage = message.toLowerCase().trim();
            
            // חיפוש מדויק במילות המפתח
            for (const [key, data] of Object.entries(CHATBOT_RESPONSES)) {
                // בדיקה אם המסר מכיל אחת ממילות המפתח
                if (data.keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
                    return data.response;
                }
            }
            
            // תשובות חכמות נוספות לשאלות נפוצות
            if (lowerMessage.includes('שלום') || lowerMessage.includes('היי') || lowerMessage.includes('בוקר טוב')) {
                return '👋 שלום וברוכים הבאים ל-WearableCode! איך אני יכול לעזור לך היום?';
            }
            
            if (lowerMessage.includes('תודה') || lowerMessage.includes('תנקיו')) {
                return '😊 בכיף! אני כאן בשבילך. יש עוד משהו שאני יכול לעזור בו?';
            }
            
            if (lowerMessage.includes('להתראות') || lowerMessage.includes('ביי')) {
                return '👋 להתראות! תמיד אפשר לחזור אלינו. תהיה בריא!';
            }
            
            // אם לא נמצאה תשובה ספציפית
            return '🤔 אני לא בטוח שהבנתי את השאלה. בואו ננסה כמה אפשרויות:\n\n• כתוב "מחירים" למידע על מחירים\n• כתוב "משלוח" לפרטי משלוח\n• כתוב "חבילה" למעקב אחר חבילה\n• כתוב "צור קשר" לפרטי התקשרות\n\nאו פשוט שאל אותי משהו ספציפי! 😊';
        }

        sendMessage() {
            const message = this.chatInput.value.trim();
            if (!message) return;

            // הוסף הודעת משתמש
            this.addMessage(message, 'user');
            this.chatInput.value = '';
            
            // הראה שהבוט כותב
            this.showTyping();

            // חפש תשובה ושלח אחרי דיליי קצר (לריאליזם)
            setTimeout(() => {
                this.hideTyping();
                const response = this.findResponse(message);
                this.addMessage(response, 'bot');
            }, 800 + Math.random() * 1000); // דיליי של 0.8-1.8 שניות
        }
    }

    // אתחול הצ'אט בוט
    function initSmartChatbot() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.WearableCodeSmartChatbot = new WearableCodeSmartChatbot();
            });
        } else {
            window.WearableCodeSmartChatbot = new WearableCodeSmartChatbot();
        }
    }

    // התחל!
    initSmartChatbot();

})();
