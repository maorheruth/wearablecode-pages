(function() {
    'use strict';
    
    if (window.WearableCodeChatbot) {
        return;
    }

    // נתוני הצ'אטבוט - ברירת מחדל (יתעדכנו מהפאנל אדמין)
    let CHATBOT_RESPONSES = {
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
            keywords: ['עיצוב', 'חולצה', 'סדרות', 'מימים', 'מצחיק', 'ציטוט', 'טישרט']
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

    const WELCOME_MESSAGES = [
        '👋 שלום! אני העוזר הווירטואלי של WearableCode. איך אני יכול לעזור לך היום?',
        '🎨 ברוכים הבאים ל-WearableCode! אני כאן לעזור לך למצוא את החולצה המושלמת',
        '👕 היי! רוצה לשמוע על החולצות הכי מגניבות בישראל? אני כאן בשבילך!',
        '😊 שלום וברוכים הבאים! אני יכול לעזור לך עם כל מה שקשור לחולצות שלנו'
    ];

    class WearableCodeChatbot {
        constructor() {
            this.isOpen = false;
            this.messages = [];
            this.isTyping = false;
            this.customQuickReplies = null; // כפתורים מותאמים מהפאנל אדמין
            this.hasLoadedFromAdmin = false; // האם כבר טענו נתונים מהאדמין
            this.init();
        }

        init() {
            this.addStyles();
            this.createChatbot();
            this.bindEvents();
            
            // טעינת נתונים ראשונית מהפאנל אדמין
            this.loadUpdatedResponses().then((success) => {
                if (success) {
                    console.log('✅ נתונים נטענו בהצלחה בהתחלה מהפאנל אדמין');
                    this.hasLoadedFromAdmin = true;
                } else {
                    console.log('⚠️ לא נמצאו נתונים מהפאנל אדמין, משתמש בברירות מחדל');
                }
                
                // עדכון כפתורים אחרי טעינה ראשונית
                this.updateQuickReplies();
            });
            
            const welcomeMessage = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
            this.addMessage(welcomeMessage, 'bot');
            
            setTimeout(() => {
                this.addMessage('💡 טיפ: נסה לכתוב "מחירים", "משלוח", "חבילה" או "מידות" לקבלת מידע מהיר!', 'bot');
            }, 2000);
        }

        // טעינת נתונים עדכניים מהשרת - רק כשנדרש
        async loadUpdatedResponses() {
            console.log('🔍 טוען נתונים מורסל API...');
            
            // ניסיון מספר 1: JSONP עם script tag (עוקף CORS)
            try {
                const jsonpUrl = `https://wearablecode-pages.vercel.app/api/chatbot-data?callback=wcChatbotData&_t=${Date.now()}&bust=${Math.random()}`;
                
                const success = await new Promise((resolve) => {
                    // יצירת callback גלובלי
                    window.wcChatbotData = (data) => {
                        console.log('📡 נתונים התקבלו דרך JSONP:', data);
                        
                        if (data.responses && Object.keys(data.responses).length > 0) {
                            // עדכון הנתונים הגלובליים
                            CHATBOT_RESPONSES = { ...data.responses };
                            
                            // עדכון כפתורי התגובה המהירה
                            if (data.quickReplies && Array.isArray(data.quickReplies)) {
                                this.customQuickReplies = [...data.quickReplies];
                                console.log('🔘 עודכנו כפתורי תגובה מהירה:', data.quickReplies);
                            }
                            
                            console.log('✅ נתונים נטענו מורסל API דרך JSONP בהצלחה!');
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                        
                        // ניקוי
                        delete window.wcChatbotData;
                        if (document.head.contains(script)) {
                            document.head.removeChild(script);
                        }
                    };
                    
                    // יצירת script tag
                    const script = document.createElement('script');
                    script.src = jsonpUrl;
                    script.onerror = () => {
                        console.log('❌ JSONP נכשל');
                        delete window.wcChatbotData;
                        if (document.head.contains(script)) {
                            document.head.removeChild(script);
                        }
                        resolve(false);
                    };
                    
                    // timeout של 10 שניות
                    setTimeout(() => {
                        if (window.wcChatbotData) {
                            console.log('⏰ JSONP timeout');
                            delete window.wcChatbotData;
                            if (document.head.contains(script)) {
                                document.head.removeChild(script);
                            }
                            resolve(false);
                        }
                    }, 10000);
                    
                    document.head.appendChild(script);
                });
                
                if (success) {
                    return true;
                }
                
            } catch (error) {
                console.log('❌ שגיאה ב-JSONP:', error.message);
            }
            
            // ניסיון מספר 2: Fetch רגיל
            try {
                const response = await fetch('https://wearablecode-pages.vercel.app/api/chatbot-data', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    },
                    mode: 'cors'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('📡 נתונים התקבלו מהשרת (fetch):', data);
                    
                    if (data.responses && Object.keys(data.responses).length > 0) {
                        CHATBOT_RESPONSES = { ...data.responses };
                        
                        if (data.quickReplies && Array.isArray(data.quickReplies)) {
                            this.customQuickReplies = [...data.quickReplies];
                            console.log('🔘 עודכנו כפתורי תגובה מהירה:', data.quickReplies);
                        }
                        
                        console.log('✅ נתונים נטענו מורסל API בהצלחה!');
                        return true;
                    }
                } else {
                    console.log('⚠️ שרת החזיר שגיאה:', response.status);
                }
            } catch (error) {
                console.log('❌ שגיאה בטעינה מורסל API:', error.message);
            }
            
            // אם הכל נכשל
            console.log('⚠️ כל הניסיונות נכשלו - משתמש בנתונים המוגדרים בקוד בלבד');
            return false;
        }

        // עדכון כפתורי התגובה המהירה
        updateQuickReplies() {
            console.log('🔄 מעדכן כפתורי תגובה מהירה...');
            
            if (!this.quickReplies) {
                console.log('❌ אלמנט quickReplies לא נמצא');
                return;
            }
            
            // ניקוי מלא של הכפתורים הקיימים
            this.quickReplies.innerHTML = '';
            
            // השתמש בכפתורים המותאמים אישית אם קיימים ונטענו מהאדמין
            let repliesData = this.customQuickReplies;
            
            // אם אין כפתורים מותאמים או שלא נטענו מהאדמין, השתמש בברירת מחדל מתקדמת
            if (!repliesData || !Array.isArray(repliesData) || repliesData.length === 0) {
                console.log('⚠️ לא נמצאו כפתורים מותאמים, משתמש בברירת מחדל מתקדמת');
                repliesData = [
                    { text: 'מחירים', icon: '💰', topic: 'מחירים' },
                    { text: 'משלוח', icon: '🚚', topic: 'משלוח' },
                    { text: 'מעקב', icon: '📦', topic: 'מעקב חבילה' },
                    { text: 'מידות', icon: '📏', topic: 'מידות' },
                    { text: 'החזרות', icon: '🔄', topic: 'החזרות' },
                    { text: 'צור קשר', icon: '📞', topic: 'צור קשר' }
                ];
            }
            
            console.log('🔘 יוצר כפתורים:', repliesData.length, repliesData);
            
            // יצירת הכפתורים החדשים
            repliesData.forEach((reply, index) => {
                const button = document.createElement('div');
                button.className = 'wc-quick-reply';
                button.setAttribute('data-message', reply.topic || reply.text);
                button.textContent = `${reply.icon || '💬'} ${reply.text}`;
                
                this.quickReplies.appendChild(button);
                console.log(`✅ נוצר כפתור ${index + 1}: ${reply.icon} ${reply.text}`);
            });
            
            console.log(`🎯 סה"כ נוצרו ${repliesData.length} כפתורים בממשק`);
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .wc-chatbot-container {
                    position: fixed;
                    bottom: 25px;
                    right: 25px;
                    z-index: 98;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                    direction: rtl;
                    max-width: 440px;
                }

                .wc-chat-button {
                    width: 48px;
                    height: 48px;
                    background: #e7e7e7;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    position: relative;
                    box-shadow: 0px 0px 12px rgb(27 0 151 / 40%);
                }

                .wc-chat-button:hover {
                    background: #e7e7e7;
                    transform: scale(1.05);
                }

                .wc-chat-button:active,
                .wc-chat-button:focus {
                    outline: none;
                }

                .wc-chat-button.active {
                    background: #000000;
                }

                .wc-chat-button-icon {
                    width: 24px;
                    height: 24px;
                    fill: #454545;
                    position: relative;
                    z-index: 1;
                    transition: transform 0.3s ease;
                }

                .wc-chat-button:hover .wc-chat-button-icon {
                    transform: scale(1.1);
                }

                .wc-chat-window {
                    position: absolute;
                    bottom: 40px;
                    right: 0;
                    width: 420px;
                    height: 640px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 
                        0 25px 50px rgba(0, 0, 0, 0.15), 
                        0 15px 35px rgba(0, 0, 0, 0.1),
                        0 5px 15px rgba(0, 0, 0, 0.08);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    direction: rtl;
                    backdrop-filter: blur(20px);
                }

                .wc-chat-window.open {
                    display: flex;
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes slideUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px) scale(0.95); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                }

                .wc-chat-header {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    padding: 24px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    position: relative;
                }

                .wc-assistant-avatar {
                    width: 48px;
                    height: 48px;
                    background: #ffffff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    flex-shrink: 0;
                    overflow: hidden;
                }

                .wc-assistant-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                }

                .wc-assistant-avatar svg {
                    width: 24px;
                    height: 24px;
                    fill: white;
                }

                .wc-assistant-info {
                    flex: 1;
                    text-align: right;
                }

                .wc-assistant-info h3 {
                    font-size: 16px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 2px;
                    line-height: 1.2;
                }

                .wc-assistant-info p {
                    font-size: 13px;
                    color: #64748b;
                    line-height: 1.3;
                }

                .wc-close-button {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    width: 32px;
                    height: 32px;
                    background: rgba(100, 116, 139, 0.1);
                    border: none;
                    border-radius: 8px;
                    color: #64748b;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .wc-close-button:hover {
                    background: rgba(100, 116, 139, 0.15);
                    color: #475569;
                }

                .wc-chat-messages {
                    flex: 1;
                    padding: 24px;
                    overflow-y: auto;
                    background: #fefefe;
                    direction: rtl;
                    scroll-behavior: smooth;
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 transparent;
                }

                .wc-chat-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .wc-chat-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                .wc-chat-messages::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }

                .wc-chat-messages::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }

                .wc-message {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                    animation: messageSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes messageSlide {
                    from { 
                        opacity: 0; 
                        transform: translateY(12px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }

                .wc-message.user {
                    justify-content: flex-start;
                }

                .wc-message.bot {
                    justify-content: flex-end;
                }

                .wc-message-content {
                    max-width: 85%;
                    padding: 12px 16px;
                    border-radius: 16px;
                    font-size: 14px;
                    line-height: 1.5;
                    white-space: pre-line;
                    word-wrap: break-word;
                    position: relative;
                }

                .wc-message.user .wc-message-content {
                    background: #3b82f6;
                    color: white;
                    border-bottom-right-radius: 6px;
                    border-bottom-left-radius: 16px;
                    text-align: right;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
                }

                .wc-message.bot .wc-message-content {
                    background: #f1f5f9;
                    color: #334155;
                    border-bottom-left-radius: 6px;
                    border-bottom-right-radius: 16px;
                    text-align: right;
                    border: 1px solid #e2e8f0;
                }

                .wc-typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    background: #f1f5f9;
                    border-radius: 16px;
                    border-bottom-right-radius: 6px;
                    max-width: 85%;
                    border: 1px solid #e2e8f0;
                }

                .wc-typing-dots {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }

                .wc-typing-dot {
                    width: 6px;
                    height: 6px;
                    background: #94a3b8;
                    border-radius: 50%;
                    animation: typingBounce 1.4s infinite ease-in-out;
                }

                .wc-typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .wc-typing-dot:nth-child(2) { animation-delay: -0.16s; }
                .wc-typing-dot:nth-child(3) { animation-delay: 0s; }

                @keyframes typingBounce {
                    0%, 80%, 100% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .wc-typing-text {
                    font-size: 12px;
                    color: #64748b;
                    font-style: italic;
                }

                .wc-quick-replies {
                    padding: 12px 24px 0;
                    background: #fefefe;
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    border-top: 1px solid #f1f5f9;
                }

                .wc-quick-reply {
                    background: #f8f9fa;
                    color: #475569;
                    border: 1px solid #e2e8f0;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-bottom: 8px;
                    font-weight: 500;
                    line-height: 1.2;
                }

                .wc-quick-reply:hover {
                    background: #f1f5f9;
                    border-color: #cbd5e1;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .wc-chat-input-container {
                    padding: 20px 24px;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    align-items: flex-end;
                    gap: 12px;
                    direction: rtl;
                }

                .wc-chat-input {
                    flex: 1;
                    min-height: 44px;
                    max-height: 120px;
                    padding: 12px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 22px;
                    font-size: 14px;
                    outline: none;
                    background: #f8f9fa;
                    color: #111827;
                    text-align: right;
                    transition: all 0.2s ease;
                    resize: none;
                    font-family: inherit;
                    line-height: 1.4;
                }

                .wc-chat-input::placeholder {
                    color: #9ca3af;
                }

                .wc-chat-input:focus {
                    border-color: #000000;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
                }

                .wc-send-button {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #000000 0%, #333333 100%);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    flex-shrink: 0;
                }

                .wc-send-button:hover {
                    background: linear-gradient(135deg, #333333 0%, #555555 100%);
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                .wc-send-button:disabled {
                    background: #e5e7eb;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .wc-send-button svg {
                    width: 20px;
                    height: 20px;
                    fill: currentColor;
                }

                @media (max-width: 480px) {
                    .wc-chatbot-container {
                        right: 20px;
                        bottom: 28px;
                        max-width: calc(100vw - 40px);
                    }
                    
                    .wc-chat-window {
                        width: calc(100vw - 40px);
                        height: calc(100vh - 120px);
                        max-width: 380px;
                        max-height: 600px;
                        bottom: 60px;
                    }
                    
                    .wc-chat-button {
                        width: 48px;
                        height: 48px;
                    }
                    
                    .wc-chat-button-icon {
                        width: 24px;
                        height: 24px;
                    }
                }

                @media (max-width: 360px) {
                    .wc-chatbot-container {
                        right: 15px;
                        bottom: 28px;
                    }
                    
                    .wc-chat-window {
                        bottom: 90px;
                    }
                    
                    .wc-chat-messages {
                        padding: 16px;
                    }
                    
                    .wc-chat-input-container {
                        padding: 16px;
                    }
                    
                    .wc-chat-header {
                        padding: 16px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        createChatbot() {
            const container = document.createElement('div');
            container.className = 'wc-chatbot-container';
            container.innerHTML = `
                <button class="wc-chat-button" id="wcChatButton">
                    <svg class="wc-chat-button-icon" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                </button>
                
                <div class="wc-chat-window" id="wcChatWindow">
                    <div class="wc-chat-header">
                        <div class="wc-assistant-avatar">
                            <img src="https://wearablecode-pages.vercel.app/assets/logos/wearablecode_favicon_48x48.png" alt="WearableCode Assistant" />
                        </div>
                        <div class="wc-assistant-info">
                            <h3>עוזר WearableCode</h3>
                            <p>כאן לעזור לך עם כל השאלות 🚀</p>
                        </div>
                        <button class="wc-close-button" id="wcCloseButton">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>

                    <div class="wc-chat-messages" id="wcChatMessages"></div>
                    
                    <div class="wc-quick-replies" id="wcQuickReplies">
                        <!-- כפתורים יתווספו דינמית -->
                    </div>

                    <div class="wc-chat-input-container">
                        <textarea class="wc-chat-input" id="wcChatInput" placeholder="כתוב הודעה..." rows="1"></textarea>
                        <button class="wc-send-button" id="wcSendButton">
                            <svg viewBox="0 0 24 24">
                                <path d="M22.01 3L2 10l7 2 2 7z"/>
                            </svg>
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
            this.closeButton = document.getElementById('wcCloseButton');
            this.quickReplies = document.getElementById('wcQuickReplies');
        }

        bindEvents() {
            this.chatButton.addEventListener('click', () => this.toggleChat());
            this.closeButton.addEventListener('click', () => this.toggleChat());
            this.sendButton.addEventListener('click', () => this.sendMessage());
            
            this.chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            this.chatInput.addEventListener('input', () => {
                this.chatInput.style.height = 'auto';
                this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
            });

            // Quick replies
            this.quickReplies.addEventListener('click', (e) => {
                if (e.target.classList.contains('wc-quick-reply')) {
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
                // טעינת עדכונים רק בפתיחה (לא אוטומטי)
                if (!this.hasLoadedFromAdmin) {
                    this.loadUpdatedResponses().then((success) => {
                        if (success) {
                            console.log('✅ נתונים עודכנו בפתיחת הצ\'אט');
                            this.hasLoadedFromAdmin = true;
                            this.updateQuickReplies();
                        }
                    });
                }
            } else {
                this.chatWindow.classList.remove('open');
            }
        }

        addMessage(content, sender, showTyping = false) {
            if (showTyping && sender === 'bot') {
                this.showTyping();
                setTimeout(() => {
                    this.hideTyping();
                    this.actuallyAddMessage(content, sender);
                }, 1000 + Math.random() * 1000);
            } else {
                this.actuallyAddMessage(content, sender);
            }
        }

        actuallyAddMessage(content, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `wc-message ${sender}`;
            messageDiv.innerHTML = `<div class="wc-message-content">${content}</div>`;
            
            this.chatMessages.appendChild(messageDiv);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            
            this.messages.push({ content, sender, timestamp: new Date() });
        }

        showTyping() {
            if (this.isTyping) return;
            this.isTyping = true;
            
            const typingDiv = document.createElement('div');
            typingDiv.className = 'wc-message bot';
            typingDiv.id = 'wcTyping';
            typingDiv.innerHTML = `
                <div class="wc-typing-indicator">
                    <div class="wc-typing-dots">
                        <div class="wc-typing-dot"></div>
                        <div class="wc-typing-dot"></div>
                        <div class="wc-typing-dot"></div>
                    </div>
                    <span class="wc-typing-text">כותב...</span>
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
            this.isTyping = false;
        }

        findResponse(message) {
            const lowerMessage = message.toLowerCase().trim();
            
            // חיפוש בתשובות העדכניות (כולל עדכונים מהפאנל אדמין)
            for (const [key, data] of Object.entries(CHATBOT_RESPONSES)) {
                if (data.keywords && data.keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
                    console.log(`🎯 נמצאה התאמה: "${message}" -> "${key}"`);
                    return data.response;
                }
            }
            
            // תשובות חכמות לברכות נפוצות
            if (lowerMessage.includes('שלום') || lowerMessage.includes('היי') || lowerMessage.includes('בוקר טוב')) {
                return '👋 שלום וברוכים הבאים ל-WearableCode! איך אני יכול לעזור לך היום?';
            }
            
            if (lowerMessage.includes('תודה') || lowerMessage.includes('תנקיו')) {
                return '😊 בכיף! אני כאן בשבילך. יש עוד משהו שאני יכול לעזור בו?';
            }
            
            if (lowerMessage.includes('להתראות') || lowerMessage.includes('ביי')) {
                return '👋 להתראות! תמיד אפשר לחזור אלינו. תהיה בריא!';
            }
            
            // תשובת ברירת מחדל עם האפשרויות העדכניות
            const availableTopics = Object.keys(CHATBOT_RESPONSES).slice(0, 4);
            const topicsList = availableTopics.map(topic => `• כתוב "${topic}" למידע על ${topic}`).join('\n');
            
            return `🤔 אני לא בטוח שהבנתי את השאלה. בואו ננסה כמה אפשרויות:\n\n${topicsList}\n\nאו פשוט שאל אותי משהו ספציפי! 😊`;
        }

        sendMessage() {
            const message = this.chatInput.value.trim();
            if (!message) return;

            // Add user message
            this.addMessage(message, 'user');
            this.chatInput.value = '';
            this.chatInput.style.height = 'auto';

            // Find and send bot response with typing effect
            const response = this.findResponse(message);
            this.addMessage(response, 'bot', true);
        }

        // פונקציה ידנית לעדכון (לקריאה מבחוץ)
        async forceUpdate() {
            console.log('🔄 עדכון ידני נדרש...');
            const success = await this.loadUpdatedResponses();
            if (success) {
                this.updateQuickReplies();
                console.log('✅ עדכון ידני הושלם בהצלחה!');
            }
            return success;
        }
    }

    // Initialize chatbot
    function initChatbot() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.WearableCodeChatbot = new WearableCodeChatbot();
                console.log('🚀 WearableCode Chatbot מוכן לפעולה!');
            });
        } else {
            window.WearableCodeChatbot = new WearableCodeChatbot();
            console.log('🚀 WearableCode Chatbot מוכן לפעולה!');
        }
    }

    // Start!
    initChatbot();

})();
