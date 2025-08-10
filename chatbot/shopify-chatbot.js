<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>עוזר WearableCode</title>
    <style>
        /* Chatbot Styles - הכל נשאר כמו קודם */
        .wc-chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            direction: rtl;
        }

        .wc-chat-button {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #000000 0%, #333333 100%);
            border: none;
            border-radius: 50%;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .wc-chat-button:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
        }

        .wc-chat-button img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
        }

        .wc-chat-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 380px;
            height: 500px;
            background: white;
            border-radius: 20px;
            box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.15), 
                0 15px 35px rgba(0, 0, 0, 0.1),
                0 5px 15px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            transform: translateY(20px) scale(0.9);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
        }

        .wc-chat-window.open {
            transform: translateY(0) scale(1);
            opacity: 1;
            visibility: visible;
        }

        .wc-chat-header {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            color: #1e293b;
            padding: 24px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            align-items: center;
            gap: 16px;
            font-weight: 600;
        }

        .wc-chat-avatar {
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

        .wc-chat-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }

        .wc-assistant-info {
            flex: 1;
            text-align: right;
        }

        .wc-assistant-info h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin: 0 0 2px 0;
            line-height: 1.2;
        }

        .wc-assistant-info p {
            font-size: 13px;
            color: #64748b;
            margin: 0;
            line-height: 1.3;
        }

        .wc-close-button {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #64748b;
            padding: 4px;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        .wc-close-button:hover {
            background: #f1f5f9;
            color: #1e293b;
        }

        .wc-chat-messages {
            flex: 1;
            padding: 24px;
            overflow-y: auto;
            background: #fefefe;
            min-height: 300px;
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
            text-align: right;
        }

        .wc-message.user .wc-message-content {
            background: #3b82f6;
            color: white;
            border-bottom-right-radius: 6px;
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
        }

        .wc-message.bot .wc-message-content {
            background: #f1f5f9;
            color: #334155;
            border-bottom-left-radius: 6px;
            border: 1px solid #e2e8f0;
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

        .wc-send-button svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        /* Scrollbar */
        .wc-chat-messages::-webkit-scrollbar {
            width: 4px;
        }

        .wc-chat-messages::-webkit-scrollbar-track {
            background: #f8f9fa;
        }

        .wc-chat-messages::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 2px;
        }

        .wc-chat-messages::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }

        /* Mobile Responsive */
        @media (max-width: 420px) {
            .wc-chatbot-container {
                bottom: 10px;
                right: 10px;
            }

            .wc-chat-window {
                width: calc(100vw - 20px);
                height: calc(100vh - 100px);
                right: -10px;
            }
        }
    </style>
</head>
<body>
    <div class="wc-chatbot-container" id="wcChatbot">
        <!-- Chat Button -->
        <button class="wc-chat-button" id="wcChatButton">
            <img src="https://wearablecode-pages.vercel.app/assets/logos/wearablecode_favicon_48x48.png" alt="WearableCode Assistant" />
        </button>

        <!-- Chat Window -->
        <div class="wc-chat-window" id="wcChatWindow">
            <div class="wc-chat-header">
                <div class="wc-chat-avatar">
                    <img src="https://wearablecode-pages.vercel.app/assets/logos/wearablecode_favicon_48x48.png" alt="WearableCode Assistant" />
                </div>
                <div class="wc-assistant-info">
                    <h3>עוזר WearableCode</h3>
                    <p>כאן לעזור לך עם כל השאלות 🚀</p>
                </div>
                <button class="wc-close-button" id="wcCloseButton">×</button>
            </div>
            
            <div class="wc-chat-messages" id="wcChatMessages">
                <div class="wc-message bot">
                    <div class="wc-message-content">שלום! איך אני יכול לעזור לך היום? 😊</div>
                </div>
            </div>

            <div class="wc-quick-replies" id="wcQuickReplies">
                <div class="wc-quick-reply" data-message="מחירים">💰 מחירים</div>
                <div class="wc-quick-reply" data-message="משלוח">🚚 משלוח</div>
                <div class="wc-quick-reply" data-message="חבילה">📦 מעקב</div>
                <div class="wc-quick-reply" data-message="צור קשר">📞 צור קשר</div>
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
    </div>

    <script>
        // נתונים ברירת מחדל של הצ'אטבוט - בדיוק כמו שהיו לך קודם
        let chatbotData = {
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
            'החזרות': {
                response: '🔄 מדיניות החזרות נדיבה:\n• החזרה תוך 30 יום\n• החלפת מידה חינם\n• החזר כספי מלא (לא כולל משלוח)\n• המוצר חייב להיות במצב חדש\n• פשוט ליצור קשר ונסדר!',
                keywords: ['החזרה', 'החלפה', 'החזר', 'לא מתאים', 'מידה לא טובה', 'להחליף']
            },
            'צור קשר': {
                response: '📞 אפשר ליצור קשר:\n• WhatsApp: 050-123-4567\n• מייל: hello@wearablecode.com\n• פייסבוק: WearableCode Israel\n• אינסטגרם: @wearablecode_il\n\nאנחנו כאן בשבילכם! 😊',
                keywords: ['צור קשר', 'טלפון', 'מייל', 'פייסבוק', 'אינסטגרם', 'ווטסאפ', 'עזרה']
            }
        };

        // אלמנטים - הכל נשאר אותו דבר
        var chatButton = document.getElementById('wcChatButton');
        var chatWindow = document.getElementById('wcChatWindow');
        var closeButton = document.getElementById('wcCloseButton');
        var chatInput = document.getElementById('wcChatInput');
        var sendButton = document.getElementById('wcSendButton');
        var messagesContainer = document.getElementById('wcChatMessages');
        var quickReplies = document.getElementById('wcQuickReplies');

        // פתיחה/סגירה של הצ'אט - אותו דבר
        chatButton.addEventListener('click', function() {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open')) {
                chatInput.focus();
            }
        });

        closeButton.addEventListener('click', function() {
            chatWindow.classList.remove('open');
        });

        // שליחת הודעה - אותו דבר
        function sendMessage() {
            var message = chatInput.value.trim();
            if (!message) return;

            // הוסף הודעת משתמש
            addMessage(message, 'user');
            chatInput.value = '';
            chatInput.style.height = 'auto';

            // חפש תשובה
            setTimeout(function() {
                var response = findResponse(message);
                addMessage(response, 'bot');
            }, 500);
        }

        // הוספת הודעה - אותו דבר
        function addMessage(text, sender) {
            var messageDiv = document.createElement('div');
            messageDiv.className = 'wc-message ' + sender;
            
            var contentDiv = document.createElement('div');
            contentDiv.className = 'wc-message-content';
            contentDiv.textContent = text;
            
            messageDiv.appendChild(contentDiv);
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // חיפוש תשובה - כאן ההשינוי היחיד! כעת משתמש בנתונים מעודכנים
        function findResponse(message) {
            var lowerMessage = message.toLowerCase().trim();
            
            // חיפוש בנתונים העדכניים (כולל עדכונים מפאנל האדמין)
            for (var key in chatbotData) {
                if (chatbotData.hasOwnProperty(key)) {
                    var data = chatbotData[key];
                    for (var i = 0; i < data.keywords.length; i++) {
                        if (lowerMessage.indexOf(data.keywords[i].toLowerCase()) !== -1) {
                            return data.response;
                        }
                    }
                }
            }
            
            return '🤔 אני לא בטוח שהבנתי את השאלה. נסה לשאול בצורה אחרת או צור קשר ישירות.';
        }

        // Auto-resize textarea - אותו דבר
        chatInput.addEventListener('input', function() {
            chatInput.style.height = 'auto';
            chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
        });

        // Enter לשליחה - אותו דבר
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // כפתור שליחה - אותו דבר
        sendButton.addEventListener('click', sendMessage);

        // Quick replies - אותו דבר
        quickReplies.addEventListener('click', function(e) {
            if (e.target.classList.contains('wc-quick-reply')) {
                var message = e.target.getAttribute('data-message');
                chatInput.value = message;
                sendMessage();
            }
        });

        // **🔥 הפונקציות החדשות - זה מה שהוספתי!**
        
        // טעינת נתונים מעודכנים מהפאנל
        function loadUpdatedData() {
            var savedData = localStorage.getItem('wearablecode_chatbot_data');
            if (savedData) {
                try {
                    var newData = JSON.parse(savedData);
                    // עדכון הנתונים עם המידע החדש מהפאנל
                    chatbotData = {...chatbotData, ...newData};
                    console.log('✅ הצ\'אטבוט עודכן עם נתונים חדשים מהפאנל!', chatbotData);
                    
                    // עדכון ה-Quick Replies בהתאם לנתונים החדשים
                    updateQuickReplies();
                } catch (e) {
                    console.log('❌ שגיאה בטעינת נתונים מעודכנים');
                }
            }
        }

        // עדכון Quick Replies בהתאם לנתונים החדשים
        function updateQuickReplies() {
            var keys = Object.keys(chatbotData).slice(0, 4); // רק 4 הראשונים
            quickReplies.innerHTML = '';
            
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var quickReply = document.createElement('div');
                quickReply.className = 'wc-quick-reply';
                quickReply.setAttribute('data-message', key);
                quickReply.textContent = getEmojiForKey(key) + ' ' + key;
                quickReplies.appendChild(quickReply);
            }
        }

        // פונקציה לקבלת אמוג'י מתאים לכל מפתח
        function getEmojiForKey(key) {
            const emojiMap = {
                'מחירים': '💰',
                'משלוח': '🚚',
                'מעקב חבילה': '📦',
                'חבילה': '📦',
                'מידות': '📏',
                'החזרות': '🔄',
                'צור קשר': '📞',
                'איכות': '⭐',
                'עיצובים': '🎨',
                'מבצעים': '🎉'
            };
            return emojiMap[key] || '💬';
        }

        // האזנה לשינויים ב-localStorage - זה מזהה כשהפאנל מעדכן משהו
        window.addEventListener('storage', function(e) {
            if (e.key === 'wearablecode_chatbot_data') {
                console.log('🔄 זוהה עדכון מפאנל האדמין!');
                loadUpdatedData();
            }
        });

        // טעינה ראשונית - בודק אם יש נתונים שמורים בעת הטעינה
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 צ\'אטבוט WearableCode נטען...');
            loadUpdatedData();
        });
    </script>
</body>
</html>
