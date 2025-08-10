// WearableCode Smart Chatbot - Claude Style Design
// גרסה מעודכנת עם עיצוב בסגנון Claude - נקי, מודרני ונעים

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
                /* Claude-Style Chatbot - Modern & Clean */
                .wc-claude-chatbot-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    direction: rtl;
                    max-width: 440px;
                }

                .wc-claude-chat-button {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 8px 32px rgba(249, 115, 22, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    font-size: 24px;
                    color: white;
                    animation: gentlePulse 4s ease-in-out infinite;
                }

                .wc-claude-chat-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 12px 40px rgba(249, 115, 22, 0.4);
                }

                .wc-claude-chat-button::before {
                    content: "💬";
                    font-size: 28px;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
                }

                @keyframes gentlePulse {
                    0%, 100% { 
                        transform: scale(1);
                        box-shadow: 0 8px 32px rgba(249, 115, 22, 0.3);
                    }
                    50% { 
                        transform: scale(1.02);
                        box-shadow: 0 12px 40px rgba(249, 115, 22, 0.4);
                    }
                }

                .wc-claude-chat-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 400px;
                    height: 600px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid rgba(0, 0, 0, 0.06);
                    direction: rtl;
                }

                .wc-claude-chat-window.open {
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

                .wc-claude-chat-header {
                    background: white;
                    padding: 20px 24px;
                    color: #1f2937;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    direction: rtl;
                    text-align: right;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                    position: relative;
                }

                .wc-claude-assistant-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #f97316, #ea580c);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    color: white;
                    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
                }

                .wc-claude-assistant-info h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 2px;
                    color: #1f2937;
                }

                .wc-claude-assistant-info p {
                    font-size: 13px;
                    color: #6b7280;
                    font-weight: 400;
                }

                .wc-claude-close-button {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    width: 32px;
                    height: 32px;
                    background: rgba(107, 114, 128, 0.1);
                    border: none;
                    border-radius: 8px;
                    color: #6b7280;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: all 0.2s ease;
                }

                .wc-claude-close-button:hover {
                    background: rgba(107, 114, 128, 0.15);
                    color: #374151;
                }

                .wc-claude-chat-messages {
                    flex: 1;
                    padding: 24px;
                    overflow-y: auto;
                    background: #fafafa;
                    direction: rtl;
                    scroll-behavior: smooth;
                }

                .wc-claude-message {
                    margin-bottom: 16px;
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
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

                .wc-claude-message.user {
                    justify-content: flex-start;
                }

                .wc-claude-message.bot {
                    justify-content: flex-end;
                }

                .wc-claude-message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .wc-claude-message.user .wc-claude-message-avatar {
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                }

                .wc-claude-message.bot .wc-claude-message-avatar {
                    background: linear-gradient(135deg, #f97316, #ea580c);
                    color: white;
                }

                .wc-claude-message-content {
                    max-width: 75%;
                    padding: 12px 16px;
                    border-radius: 16px;
                    font-size: 14px;
                    line-height: 1.5;
                    white-space: pre-line;
                }

                .wc-claude-message.user .wc-claude-message-content {
                    background: white;
                    color: #1f2937;
                    text-align: right;
                    border: 1px solid rgba(0, 0, 0, 0.06);
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
                }

                .wc-claude-message.bot .wc-claude-message-content {
                    background: white;
                    color: #1f2937;
                    text-align: right;
                    border: 1px solid rgba(0, 0, 0, 0.06);
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
                }

                .wc-claude-chat-input-container {
                    padding: 20px 24px;
                    background: white;
                    border-top: 1px solid rgba(0, 0, 0, 0.06);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    direction: rtl;
                }

                .wc-claude-chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    border-radius: 24px;
                    font-size: 14px;
                    outline: none;
                    background: #fafafa;
                    color: #1f2937;
                    text-align: right;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                .wc-claude-chat-input::placeholder {
                    color: #9ca3af;
                }

                .wc-claude-chat-input:focus {
                    border-color: #f97316;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
                }

                .wc-claude-send-button {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #f97316, #ea580c);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
                }

                .wc-claude-send-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
                }

                .wc-claude-send-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .wc-claude-send-button::before {
                    content: "↵";
                    font-size: 16px;
                    font-weight: 600;
                }

                .wc-claude-typing {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                    padding: 8px 0;
                    color: #9ca3af;
                    font-size: 13px;
                }

                .wc-claude-typing-dot {
                    width: 6px;
                    height: 6px;
                    background: #9ca3af;
                    border-radius: 50%;
                    animation: typingPulse 1.4s infinite;
                }

                .wc-claude-typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .wc-claude-typing-dot:nth-child(3) { animation-delay: 0.4s; }

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
                .wc-claude-quick-replies {
                    padding: 8px 24px 16px;
                    background: white;
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                    border-top: 1px solid rgba(0, 0, 0, 0.04);
                }

                .wc-claude-quick-reply {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid rgba(0, 0, 0, 0.06);
                    padding: 6px 12px;
                    border-radius: 16px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }

                .wc-claude-quick-reply:hover {
                    background: #e5e7eb;
                    border-color: rgba(0, 0, 0, 0.1);
                    transform: translateY(-1px);
                }

                /* Scrollbar styling */
                .wc-claude-chat-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .wc-claude-chat-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                .wc-claude-chat-messages::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 3px;
                }

                .wc-claude-chat-messages::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.2);
                }

                @media (max-width: 480px) {
                    .wc-claude-chatbot-container {
                        right: 16px;
                        bottom: 16px;
                        max-width: calc(100vw - 32px);
                    }
                    .wc-claude-chat-window {
                        width: calc(100vw - 32px);
                        height: calc(100vh - 120px);
                        max-width: 360px;
                        max-height: 580px;
                    }
                    .wc-claude-chat-button {
                        width: 56px;
                        height: 56px;
                    }
                    .wc-claude-chat-button::before {
                        font-size: 24px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        createChatbot() {
            const container = document.createElement('div');
            container.className = 'wc-claude-chatbot-container';
            container.innerHTML = `
                <button class="wc-claude-chat-button" id="wcClaudeChatButton"></button>
                
                <div class="wc-claude-chat-window" id="wcClaudeChatWindow">
                    <div class="wc-claude-chat-header">
                        <div class="wc-claude-assistant-avatar">🤖</div>
                        <div class="wc-claude-assistant-info">
                            <h3>עוזר WearableCode</h3>
                            <p>כאן לעזור לך 24/7</p>
                        </div>
                        <button class="wc-claude-close-button" id="wcClaudeCloseButton">×</button>
                    </div>

                    <div class="wc-claude-chat-messages" id="wcClaudeChatMessages"></div>
                    
                    <div class="wc-claude-quick-replies" id="wcClaudeQuickReplies">
                        <div class="wc-claude-quick-reply" data-message="מחירים">💰 מחירים</div>
                        <div class="wc-claude-quick-reply" data-message="משלוח">🚚 משלוח</div>
                        <div class="wc-claude-quick-reply" data-message="חבילה">📦 מעקב</div>
                        <div class="wc-claude-quick-reply" data-message="צור קשר">📞 צור קשר</div>
                    </div>

                    <div class="wc-claude-chat-input-container">
                        <input type="text" class="wc-claude-chat-input" id="wcClaudeChatInput" placeholder="כתוב הודעה..." />
                        <button class="wc-claude-send-button" id="wcClaudeSendButton"></button>
                    </div>
                </div>
            `;

            document.body.appendChild(container);
            
            this.chatButton = document.getElementById('wcClaudeChatButton');
            this.chatWindow = document.getElementById('wcClaudeChatWindow');
            this.chatMessages = document.getElementById('wcClaudeChatMessages');
            this.chatInput = document.getElementById('wcClaudeChatInput');
            this.sendButton = document.getElementById('wcClaudeSendButton');
            this.closeButton = document.getElementById('wcClaudeCloseButton');
            this.quickReplies = document.getElementById('wcClaudeQuickReplies');
        }

        bindEvents() {
            this.chatButton.addEventListener('click', () => this.toggleChat());
            this.closeButton.addEventListener('click', () => this.toggleChat());
            this.sendButton.addEventListener('click', () => this.sendMessage());
            
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            this.chatInput.addEventListener('input', () => {
                this.sendButton.disabled = !this.chatInput.value.trim();
            });

            // Quick replies
            this.quickReplies.addEventListener('click', (e) => {
                if (e.target.classList.contains('wc-claude-quick-reply')) {
                    const message = e.target.getAttribute('data-message');
                    this.chatInput.value = message;
                    this.sendMessage();
                }
            });

            // Close on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.toggleChat();
                }
            });
        }

        toggleChat() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.chatWindow.classList.add('open');
                this.chatInput.focus();
                this.sendButton.disabled = !this.chatInput.value.trim();
            } else {
                this.chatWindow.classList.remove('open');
            }
        }

        addMessage(content, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `wc-claude-message ${sender}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'wc-claude-message-avatar';
            avatar.textContent = sender === 'bot' ? '🤖' : '👤';
            
            const messageContent = document.createElement('div');
            messageContent.className = 'wc-claude-message-content';
            messageContent.textContent = content;
            
            if (sender === 'user') {
                messageDiv.appendChild(avatar);
                messageDiv.appendChild(messageContent);
            } else {
                messageDiv.appendChild(messageContent);
                messageDiv.appendChild(avatar);
            }
            
            this.chatMessages.appendChild(messageDiv);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            
            this.messages.push({ content, sender, timestamp: new Date() });
        }

        showTyping() {
            if (this.isTyping) return;
            this.isTyping = true;
            
            const typingDiv = document.createElement('div');
            typingDiv.className = 'wc-claude-message bot';
            typingDiv.id = 'wcClaudeTyping';
            
            const avatar = document.createElement('div');
            avatar.className = 'wc-claude-message-avatar';
            avatar.textContent = '🤖';
            
            const typingContent = document.createElement('div');
            typingContent.className = 'wc-claude-message-content';
            typingContent.innerHTML = `
                <div class="wc-claude-typing">
                    <div class="wc-claude-typing-dot"></div>
                    <div class="wc-claude-typing-dot"></div>
                    <div class="wc-claude-typing-dot"></div>
                    <span style="margin-right: 8px;">כותב...</span>
                </div>
            `;
            
            typingDiv.appendChild(typingContent);
            typingDiv.appendChild(avatar);
            
            this.chatMessages.appendChild(typingDiv);
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }

        hideTyping() {
            const typingDiv = document.getElementById('wcClaudeTyping');
            if (typingDiv) {
                typingDiv.remove();
            }
            this.isTyping = false;
        }

        // פונקציה חכמה לחיפוש תשובה מתאימה
        findResponse(message) {
            const lowerMessage = message.toLowerCase().trim();
            
            // חיפוש מדויק במילות המפתח
            for (const [key, data] of Object.entries(CHATBOT_RESPONSES)) {
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
            if (!message || this.isTyping) return;

            // הוסף הודעת משתמש
            this.addMessage(message, 'user');
            this.chatInput.value = '';
            this.sendButton.disabled = true;
            
            // הראה שהבוט כותב
            this.showTyping();

            // חפש תשובה ושלח אחרי דיליי קצר (לריאליזם)
            setTimeout(() => {
                this.hideTyping();
                const response = this.findResponse(message);
                this.addMessage(response, 'bot');
                this.sendButton.disabled = false;
                this.chatInput.focus();
            }, 1200 + Math.random() * 800); // דיליי של 1.2-2 שניות
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
