// WearableCode Simple Chatbot - תשובות מוכנות מראש בלבד
// צ'אטבוט חכם עם תשובות שאתה שולט בהן 100%

(function() {
    'use strict';
    
    // בדיקה שלא נטען כבר
    if (window.WearableCodeSimpleChatbot) {
        return;
    }

    // *** תשובות מוכנות מראש - ערוך כאן את התשובות שלך! ***
    const CHATBOT_RESPONSES = {
        // שאלות כלליות על החברה
        'מה זה wearablecode': {
            response: '🎨 WearableCode זה המקום הכי מגניב לחולצות עם עיצובים יחודיים! אנחנו מתמחים בציטוטים מסדרות, מימים ישראליים, ועיצובים שלא תמצאו בשום מקום אחר 👕',
            keywords: ['מה זה wearablecode', 'מה זה החברה', 'מה אתם עושים', 'על החברה']
        },
        
        // מחירים
        'מחירים': {
            response: '💰 המחירים שלנו:\n• חולצה רגילה: ₪79-89\n• חולצה פרימיום: ₪99-109\n• מבצע ללקוחות חדשים: 15% הנחה!\n• משלוח חינם מעל ₪150',
            keywords: ['מחיר', 'כמה עולה', 'עלות', 'כסף', '₪', 'זול', 'יקר']
        },
        
        // הזמנה
        'איך מזמינים': {
            response: '🛒 תהליך ההזמנה פשוט:\n1️⃣ בחר חולצה שאתה אוהב\n2️⃣ בחר מידה וכמות\n3️⃣ הוסף לעגלה\n4️⃣ עבור לקופה ותשלום מאובטח\n5️⃣ נשלח אליך תוך 3-5 ימים!',
            keywords: ['איך מזמין', 'איך קונים', 'הזמנה', 'רכישה', 'לקנות']
        },
        
        // משלוחים
        'משלוח': {
            response: '🚚 פרטי משלוח:\n• משלוח רגיל: ₪25 (3-5 ימי עסקים)\n• משלוח מהיר: ₪35 (1-2 ימי עסקים)\n• משלוח חינם מעל ₪150!\n• שליח עד הבית או לנקודת איסוף',
            keywords: ['משלוח', 'דואר', 'הגעה', 'כמה זמן', 'שליח', 'איסוף']
        },
        
        // מידות
        'מידות': {
            response: '📏 המידות שלנו:\n• S - חזה 90-94 ס"מ\n• M - חזה 94-98 ס"מ\n• L - חזה 98-104 ס"מ\n• XL - חזה 104-110 ס"מ\n• XXL - חזה 110-116 ס"מ\n\nיש מדריך מידות מלא באתר!',
            keywords: ['מידה', 'גודל', 'מידות', 'small', 'medium', 'large', 's', 'm', 'l', 'xl', 'xxl']
        },
        
        // איכות
        'איכות': {
            response: '⭐ איכות פרימיום:\n• 100% כותנה איכותית\n• הדפסה עמידה במכונת כביסה\n• תפרים חזקים ועמידים\n• צבעים שלא דוהים\n• אחריות על כל מוצר!',
            keywords: ['איכות', 'חומר', 'כותנה', 'הדפסה', 'עמיד', 'כביסה']
        },
        
        // החזרות והחלפות
        'החזרות': {
            response: '🔄 מדיניות החזרות נדיבה:\n• החזרה תוך 30 יום\n• החלפת מידה חינם\n• החזר כספי מלא (לא כולל משלוח)\n• המוצר חייב להיות במצב חדש\n• פשוט ליצור קשר ונסדר!',
            keywords: ['החזרה', 'החלפה', 'החזר', 'לא מתאים', 'מידה לא טובה', 'להחליף']
        },
        
        // עיצובים
        'עיצובים': {
            response: '🎨 הקטגוריות שלנו:\n• ציטוטים מסדרות (יו, חברים, משרד וכו\')\n• מימים ישראליים\n• עיצובים מצחיקים\n• ציטוטים מעצימים\n• עיצובים מותאמים אישית\n\nכל העיצובים יחודיים ובלעדיים!',
            keywords: ['עיצוב', 'חולצה', 'דיזני', 'סדרות', 'מימים', 'מצחיק', 'ציטוט']
        },
        
        // נשים
        'נשים': {
            response: '👩‍🎨 קולקציה מיוחדת לנשים:\n• חתכים נשיים\n• עיצובים פמיניסטיים\n• ציטוטים מעצימים\n• מידות מיוחדות לנשים\n• חומרים רכים ונעימים\n\nגם לנשים יש זכות להיות מגניבות! 💪',
            keywords: ['נשים', 'אישה', 'בנות', 'נשי', 'פמיניסטי']
        },
        
        // צור קשר
        'צור קשר': {
            response: '📞 אפשר ליצור קשר:\n• WhatsApp: 050-123-4567\n• מייל: hello@wearablecode.com\n• פייסבוק: WearableCode Israel\n• אינסטגרם: @wearablecode_il\n\nאנחנו כאן בשבילכם! 😊',
            keywords: ['צור קשר', 'טלפון', 'מייל', 'פייסבוק', 'אינסטגרם', 'ווטסאפ', 'עזרה']
        },
        
        // מבצעים
        'מבצעים': {
            response: '🎉 המבצעים הנוכחיים:\n• 15% הנחה ללקוחות חדשים (קוד: NEW15)\n• קנה 2 קבל שלישית ב-50% הנחה\n• משלוח חינם מעל ₪150\n• מבצע חברי מועדון: 20% הנחה\n\nעקבו אחרינו לעוד מבצעים!',
            keywords: ['מבצע', 'הנחה', 'זול יותר', 'קופון', 'קוד', 'חסכון']
        },
        
        // ברירת מחדל לשאלות לא מזוהות
        'default': {
            response: '🤔 אני לא בטוח שהבנתי את השאלה. בואו ננסה כמה אפשרויות:\n\n• כתבו "מחירים" למידע על מחירים\n• כתבו "משלוח" לפרטי משלוח\n• כתבו "מידות" למדריך מידות\n• כתבו "צור קשר" לפרטי התקשרות\n\nאו פשוט שאלו אותי משהו ספציפי! 😊'
        }
    };

    // הודעות פתיחה אקראיות
    const WELCOME_MESSAGES = [
        '👋 שלום! אני העוזר הווירטואלי של WearableCode. איך אני יכול לעזור לך היום?',
        '🎨 ברוכים הבאים ל-WearableCode! אני כאן לעזור לך למצוא את החולצה המושלמת',
        '👕 היי! רוצה לשמוע על החולצות הכי מגניבות בישראל? אני כאן בשבילך!',
        '😊 שלום וברוכים הבאים! אני יכול לעזור לך עם כל מה שקשור לחולצות שלנו'
    ];

    // יצירת הצ'אט בוט הפשוט
    class WearableCodeSimpleChatbot {
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
                this.addMessage('💡 טיפ: נסה לכתוב "מחירים", "משלוח" או "מידות" לקבלת מידע מהיר!', 'bot');
            }, 2000);
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .wc-simple-chatbot-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    direction: rtl;
                    max-width: 420px;
                }

                .wc-simple-chat-button {
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

                .wc-simple-chat-button:hover {
                    transform: scale(1.08);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
                    background: linear-gradient(135deg, #404040 0%, #2c2c2c 100%);
                }

                .wc-simple-chat-button::before {
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

                .wc-simple-chat-window {
                    position: absolute;
                    bottom: 85px;
                    right: 0;
                    width: 400px;
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

                .wc-simple-chat-window.open {
                    display: flex;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .wc-simple-chat-header {
                    background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
                    padding: 20px;
                    color: white;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    direction: rtl;
                    text-align: right;
                    border-bottom: 1px solid #404040;
                    position: relative;
                }

                .wc-simple-assistant-avatar {
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

                .wc-simple-assistant-info h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 2px;
                    color: #ffffff;
                }

                .wc-simple-assistant-info p {
                    font-size: 12px;
                    opacity: 0.8;
                    color: #cccccc;
                }

                .wc-simple-close-button {
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

                .wc-simple-close-button:hover {
                    background: rgba(255,255,255,0.2);
                    transform: scale(1.1);
                }

                .wc-simple-chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: #1a1a1a;
                    direction: rtl;
                    scroll-behavior: smooth;
                }

                .wc-simple-message {
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

                .wc-simple-message.user {
                    justify-content: flex-start;
                }

                .wc-simple-message.bot {
                    justify-content: flex-end;
                }

                .wc-simple-message-content {
                    max-width: 80%;
                    padding: 12px 16px;
                    border-radius: 16px;
                    font-size: 14px;
                    line-height: 1.5;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    white-space: pre-line;
                }

                .wc-simple-message.user .wc-simple-message-content {
                    background: linear-gradient(135deg, #404040 0%, #2c2c2c 100%);
                    color: white;
                    border-bottom-left-radius: 4px;
                    text-align: right;
                    border: 1px solid #555;
                }

                .wc-simple-message.bot .wc-simple-message-content {
                    background: linear-gradient(135deg, #808080 0%, #666666 100%);
                    color: #ffffff;
                    border-bottom-right-radius: 4px;
                    text-align: right;
                    border: 1px solid #999;
                }

                .wc-simple-chat-input-container {
                    padding: 16px 20px;
                    background: #2c2c2c;
                    border-top: 1px solid #404040;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    direction: rtl;
                }

                .wc-simple-chat-input {
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

                .wc-simple-chat-input::placeholder {
                    color: #aaa;
                }

                .wc-simple-chat-input:focus {
                    border-color: #666;
                    background: #4a4a4a;
                    box-shadow: 0 0 0 3px rgba(102, 102, 102, 0.2);
                }

                .wc-simple-send-button {
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

                .wc-simple-send-button:hover {
                    background: linear-gradient(135deg, #4a4a4a 0%, #363636 100%);
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                }

                .wc-simple-send-button::before {
                    content: "←";
                    font-size: 16px;
                    font-weight: bold;
                }

                .wc-simple-typing {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                    padding: 8px 0;
                }

                .wc-simple-typing-dot {
                    width: 6px;
                    height: 6px;
                    background: #ccc;
                    border-radius: 50%;
                    animation: typingDot 1.4s infinite;
                }

                .wc-simple-typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .wc-simple-typing-dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typingDot {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-8px); opacity: 1; }
                }

                /* Quick replies */
                .wc-simple-quick-replies {
                    padding: 10px 20px 0;
                    background: #1a1a1a;
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                }

                .wc-simple-quick-reply {
                    background: #404040;
                    color: white;
                    border: 1px solid #666;
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-bottom: 10px;
                }

                .wc-simple-quick-reply:hover {
                    background: #4a4a4a;
                    transform: scale(1.02);
                }

                @media (max-width: 480px) {
                    .wc-simple-chatbot-container {
                        right: 15px;
                        bottom: 15px;
                        max-width: calc(100vw - 80px);
                    }
                    .wc-simple-chat-window {
                        width: calc(100vw - 30px);
                        height: calc(100vh - 140px);
                        max-width: 350px;
                        max-height: 500px;
                    }
                    .wc-simple-chat-button {
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
            container.className = 'wc-simple-chatbot-container';
            container.innerHTML = `
                <button class="wc-simple-chat-button" id="wcSimpleChatButton"></button>
                
                <div class="wc-simple-chat-window" id="wcSimpleChatWindow">
                    <div class="wc-simple-chat-header">
                        <div class="wc-simple-assistant-avatar">👋</div>
                        <div class="wc-simple-assistant-info">
                            <h3>עוזר WearableCode</h3>
                            <p>תשובות מהירות ומדויקות</p>
                        </div>
                        <button class="wc-simple-close-button" id="wcSimpleCloseButton">×</button>
                    </div>

                    <div class="wc-simple-chat-messages" id="wcSimpleChatMessages"></div>
                    
                    <div class="wc-simple-quick-replies" id="wcSimpleQuickReplies">
                        <div class="wc-simple-quick-reply" data-message="מחירים">מחירים</div>
                        <div class="wc-simple-quick-reply" data-message="משלוח">משלוח</div>
                        <div class="wc-simple-quick-reply" data-message="מידות">מידות</div>
                        <div class="wc-simple-quick-reply" data-message="צור קשר">צור קשר</div>
                    </div>

                    <div class="wc-simple-chat-input-container">
                        <input type="text" class="wc-simple-chat-input" id="wcSimpleChatInput" placeholder="כתוב הודעה..." />
                        <button class="wc-simple-send-button" id="wcSimpleSendButton"></button>
                    </div>
                </div>
            `;

            document.body.appendChild(container);
            
            this.chatButton = document.getElementById('wcSimpleChatButton');
            this.chatWindow = document.getElementById('wcSimpleChatWindow');
            this.chatMessages = document.getElementById('wcSimpleChatMessages');
            this.chatInput = document.getElementById('wcSimpleChatInput');
            this.sendButton = document.getElementById('wcSimpleSendButton');
            this.closeButton = document.getElementById('wcSimpleCloseButton');
            this.quickReplies = document.getElementById('wcSimpleQuickReplies');
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
                if (e.target.classList.contains('wc-simple-quick-reply')) {
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
            messageDiv.className = `wc-simple-message ${sender}`;
            messageDiv.innerHTML = `<div class="wc-simple-message-content">${content}</div>`;
            
            this.chatMessages.appendChild(messageDiv);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            
            this.messages.push({ content, sender, timestamp: new Date() });
        }

        showTyping() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'wc-simple-message bot';
            typingDiv.id = 'wcSimpleTyping';
            typingDiv.innerHTML = `
                <div class="wc-simple-message-content">
                    <div class="wc-simple-typing">
                        <div class="wc-simple-typing-dot"></div>
                        <div class="wc-simple-typing-dot"></div>
                        <div class="wc-simple-typing-dot"></div>
                        <span style="margin-right: 8px; color: #ccc; font-size: 13px;">כותב...</span>
                    </div>
                </div>
            `;
            
            this.chatMessages.appendChild(typingDiv);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }

        hideTyping() {
            const typingDiv = document.getElementById('wcSimpleTyping');
            if (typingDiv) {
                typingDiv.remove();
            }
        }

        // פונקציה לחיפוש תשובה מתאימה
        findResponse(message) {
            const lowerMessage = message.toLowerCase().trim();
            
            // חיפוש מדויק במילות המפתח
            for (const [key, data] of Object.entries(CHATBOT_RESPONSES)) {
                if (key === 'default') continue;
                
                // בדיקה אם המסר מכיל אחת ממילות המפתח
                if (data.keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
                    return data.response;
                }
            }
            
            // אם לא נמצאה תשובה, החזר את ברירת המחדל
            return CHATBOT_RESPONSES.default.response;
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
    function initSimpleChatbot() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.WearableCodeSimpleChatbot = new WearableCodeSimpleChatbot();
            });
        } else {
            window.WearableCodeSimpleChatbot = new WearableCodeSimpleChatbot();
        }
    }

    // התחל!
    initSimpleChatbot();

})();
