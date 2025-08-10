// WearableCode Smart Chatbot - Dark Mode Claude Style
// גרסה מעודכנת עם עיצוב dark mode בסגנון Claude עם RTL נכון

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
            this.isTyping = false;
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
                /* Dark Mode Chatbot - Claude Style */
                .wc-dark-chatbot-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    direction: rtl;
                    max-width: 440px;
                }

                .wc-dark-chat-button {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    font-size: 24px;
                    color: white;
                    animation: gentlePulse 4s ease-in-out infinite;
                }

                .wc-dark-chat-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
                }

                .wc-dark-chat-button::before {
                    content: "💬";
                    font-size: 28px;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
                }

                @keyframes gentlePulse {
                    0%, 100% { 
                        transform: scale(1);
                        box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
                    }
                    50% { 
                        transform: scale(1.02);
                        box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
                    }
                }

                .wc-dark-chat-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 400px;
                    height: 600px;
                    background: #0f1419;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid #334155;
                    direction: rtl;
                }

                .wc-dark-chat-window.open {
                    display: flex;
                    animation: slideUpFade 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes slideUpFade {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px) scale(0.95);
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) scale(1);
                    }
                }

                .wc-dark-chat-header {
                    background: #1e293b;
                    padding: 20px 24px;
                    color: #f1f5f9;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    direction: rtl;
                    text-align: right;
                    border-bottom: 1px solid #334155;
                    position: relative;
                }

                .wc-dark-assistant-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    color: white;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
                }

                .wc-dark-assistant-info h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 2px;
                    color: #f1f5f9;
                }

                .wc-dark-assistant-info p {
                    font-size: 13px;
                    color: #94a3b8;
                    font-weight: 400;
                }

                .wc-dark-close-button {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    width: 32px;
                    height: 32px;
                    background: rgba(148, 163, 184, 0.1);
                    border: none;
                    border-radius: 8px;
                    color: #94a3b8;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: all 0.2s ease;
                }

                .wc-dark-close-button:hover {
                    background: rgba(148, 163, 184, 0.2);
                    color: #f1f5f9;
                }

                .wc-dark-chat-messages {
                    flex: 1;
                    padding: 24px;
                    overflow-y: auto;
                    background: #0f1419;
                    direction: rtl;
                    scroll-behavior: smooth;
                }

                .wc-dark-message {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    animation: messageSlideIn 0.3s ease;
                }

                @keyframes messageSlideIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(8px);
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0);
                    }
                }

                .wc-dark-message.user {
                    justify-content: flex-end;
                    flex-direction: row;
                }

                .wc-dark-message.bot {
                    justify-content: flex-start;
                    flex-direction: row-reverse;
                }

                .wc-dark-message-content {
                    max-width: 75%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.5;
                    white-space: pre-line;
                    text-align: right;
                }

                .wc-dark-message.user .wc-dark-message-content {
                    background: #3b82f6;
                    color: white;
                    border-bottom-right-radius: 4px;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
                }

                .wc-dark-message.bot .wc-dark-message-content {
                    background: #374151;
                    color: #f1f5f9;
                    border-bottom-left-radius: 4px;
                    border: 1px solid #4b5563;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .wc-dark-chat-input-container {
                    padding: 20px 24px;
                    background: #1e293b;
                    border-top: 1px solid #334155;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    direction: rtl;
                }

                .wc-dark-chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #475569;
                    border-radius: 24px;
                    font-size: 14px;
                    outline: none;
                    background: #0f172a;
                    color: #f1f5f9;
                    text-align: right;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                .wc-dark-chat-input::placeholder {
                    color: #64748b;
                }

                .wc-dark-chat-input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .wc-dark-send-button {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
                }

                .wc-dark-send-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                }

                .wc-dark-send-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .wc-dark-send-button::before {
                    content: "↵";
                    font-size: 16px;
                    font-weight: 600;
                }

                .wc-dark-typing {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                    padding: 8px 0;
                    color: #64748b;
                    font-size: 13px;
                }

                .wc-dark-typing-dot {
                    width: 6px;
                    height: 6px;
                    background: #64748b;
                    border-radius: 50%;
                    animation: typingPulse 1.4s infinite;
                }

                .wc-dark-typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .wc-dark-typing-dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typingPulse {
                    0%, 60%, 100% { 
                        transform: scale(1); 
                        opacity: 0.4; 
                    }
                    30% { 
                        transform: scale(1.2); 
                        opacity: 1; 
                    }
                }

                /* Quick replies */
                .wc-dark-quick-replies {
                    padding: 8px 24px 16px;
                    background: #1e293b;
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                    border-top: 1px solid rgba(51, 65, 85, 0.5);
                }

                .wc-dark-quick-reply {
                    background: #374151;
                    color: #d1d5db;
                    border: 1px solid #4b5563;
                    padding: 6px 12px;
                    border-radius: 16px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }

                .wc-dark-quick-reply:hover {
                    background: #4b5563;
                    border-color: #6b7280;
                    transform: translateY(-1px);
                    color: #f1f5f9;
                }

                /* Scrollbar styling */
                .wc-dark-chat-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .wc-dark-chat-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                .wc-dark-chat-messages::-webkit-scrollbar-thumb {
                    background: rgba(75, 85, 99, 0.5);
                    border-radius: 3px;
                }

                .wc-dark-chat-messages::-webkit-scrollbar-thumb:hover {
                    background: rgba(75, 85, 99, 0.8);
                }

                @media (max-width: 480px) {
                    .wc-dark-chatbot-container {
                        right: 16px;
                        bottom: 16px;
                        max-width: calc(100vw - 32px);
                    }
                    .wc-dark-chat-window {
                        width: calc(100vw - 32px);
                        height: calc(100vh - 120px);
                        max-width: 360px;
                        max-height: 580px;
                    }
                    .wc-dark-chat-button {
                        width: 56px;
                        height: 56px;
                    }
                    .wc-dark-chat-button::before {
                        font-size: 24px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        createChatbot() {
            const container = document.createElement('div');
            container.className = 'wc-dark-chatbot-container';
            container.innerHTML = `
                <button class="wc-dark-chat-button" id="wcDarkChatButton"></button>
                
                <div class="wc-dark-chat-window" id="wcDarkChatWindow">
                    <div class="wc-dark-chat-header">
                        <div class="wc-dark-assistant-avatar">🤖</div>
                        <div class="wc-dark-assistant-info">
                            <h3>עוזר WearableCode</h3>
                            <p>כאן לעזור לך 24/7</p>
                        </div>
