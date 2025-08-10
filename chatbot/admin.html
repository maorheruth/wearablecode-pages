<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ניהול צ'אטבוט WearableCode</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: #f8fafc;
            color: #1e293b;
            direction: rtl;
            overflow: hidden;
            height: 100vh;
        }

        /* Login Screen */
        .login-container {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .login-box {
            background: white;
            border-radius: 20px;
            padding: 48px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            max-width: 420px;
            width: 90%;
            text-align: center;
        }

        .login-box h1 {
            margin-bottom: 32px;
            color: #1e293b;
            font-size: 28px;
            font-weight: 700;
        }

        .login-input {
            width: 100%;
            padding: 16px 20px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            background: #f8fafc;
            color: #1e293b;
            font-size: 16px;
            margin-bottom: 24px;
            outline: none;
            transition: all 0.2s ease;
            text-align: center;
            font-family: 'Courier New', monospace;
            letter-spacing: 2px;
        }

        .login-input:focus {
            border-color: #3b82f6;
            background: white;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .login-input::placeholder {
            color: #64748b;
            letter-spacing: normal;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .login-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .login-btn:hover {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            transform: translateY(-1px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }

        .error-message {
            color: #ef4444;
            margin-top: 16px;
            font-size: 14px;
            font-weight: 500;
        }

        /* Main App Layout */
        .app-container {
            display: none;
            height: 100vh;
            background: #f8fafc;
        }

        .header {
            background: white;
            padding: 20px 32px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: between;
            align-items: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logout-btn {
            position: absolute;
            top: 24px;
            left: 32px;
            background: #ef4444;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .logout-btn:hover {
            background: #dc2626;
            transform: translateY(-1px);
        }

        .main-content {
            display: flex;
            height: calc(100vh - 80px);
        }

        /* Sidebar */
        .sidebar {
            width: 300px;
            background: white;
            border-left: 1px solid #e2e8f0;
            overflow-y: auto;
            padding: 24px;
        }

        .sidebar h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e2e8f0;
        }

        .question-item {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .question-item:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
            transform: translateX(-2px);
        }

        .question-item.active {
            background: #dbeafe;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .question-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
        }

        .question-keywords {
            font-size: 12px;
            color: #64748b;
        }

        .add-question-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 16px;
            transition: all 0.2s ease;
        }

        .add-question-btn:hover {
            background: linear-gradient(135deg, #059669, #047857);
            transform: translateY(-1px);
        }

        /* Main Editor */
        .editor-area {
            flex: 1;
            padding: 32px;
            background: white;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .editor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .editor-title {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
        }

        .save-btn {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .save-btn:hover {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            transform: translateY(-1px);
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .form-group label {
            font-weight: 600;
            color: #374151;
            font-size: 14px;
        }

        .form-group input,
        .form-group textarea {
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
            background: #f9fafb;
            color: #111827;
            transition: all 0.2s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #3b82f6;
            background: white;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group textarea {
            height: 120px;
            resize: vertical;
            line-height: 1.6;
        }

        /* Right Panel */
        .right-panel {
            width: 350px;
            background: white;
            border-right: 1px solid #e2e8f0;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        /* Preview */
        .preview-section {
            flex: 1;
        }

        .preview-section h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
        }

        .chatbot-preview {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            overflow: hidden;
            height: 400px;
            display: flex;
            flex-direction: column;
        }

        .preview-header {
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 16px;
            text-align: center;
            font-weight: 600;
        }

        .preview-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: white;
        }

        .preview-message {
            margin-bottom: 12px;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 13px;
            max-width: 85%;
            line-height: 1.4;
        }

        .preview-message.bot {
            background: #f1f5f9;
            color: #334155;
            margin-left: auto;
            text-align: right;
            border-bottom-right-radius: 4px;
        }

        .preview-message.user {
            background: #3b82f6;
            color: white;
            margin-right: auto;
            text-align: right;
            border-bottom-left-radius: 4px;
        }

        .preview-input-container {
            padding: 12px;
            background: #f8fafc;
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .preview-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 16px;
            text-align: right;
            font-size: 13px;
            background: white;
        }

        .preview-send-btn {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 14px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Actions */
        .actions-section h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
        }

        .action-btn {
            width: 100%;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            background: white;
            color: #374151;
            cursor: pointer;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .action-btn:hover {
            background: #f9fafb;
            border-color: #9ca3af;
        }

        .delete-btn {
            background: #fef2f2;
            color: #dc2626;
            border-color: #fecaca;
        }

        .delete-btn:hover {
            background: #fee2e2;
            border-color: #fca5a5;
        }

        /* Empty state */
        .empty-state {
            text-align: center;
            color: #64748b;
            padding: 48px 24px;
        }

        .empty-state h3 {
            font-size: 18px;
            margin-bottom: 8px;
            color: #374151;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .main-content {
                flex-direction: column;
            }
            
            .sidebar {
                width: 100%;
                height: 200px;
            }
            
            .right-panel {
                width: 100%;
                height: 300px;
            }
        }
    </style>
</head>
<body>
    <!-- Login Screen -->
    <div class="login-container" id="loginScreen">
        <div class="login-box">
            <h1>🤖 ניהול צ'אטבוט WearableCode</h1>
            <input type="password" id="passwordInput" class="login-input" placeholder="הכנס סיסמה..." autocomplete="off">
            <button id="loginButton" class="login-btn">כניסה</button>
            <div id="errorMessage" class="error-message"></div>
        </div>
    </div>

    <!-- Main App -->
    <div class="app-container" id="mainApp">
        <div class="header">
            <h1>🤖 ניהול צ'אטבוט WearableCode</h1>
            <button class="logout-btn" id="logoutButton">התנתק</button>
        </div>

        <div class="main-content">
            <!-- Sidebar - Questions List -->
            <div class="sidebar">
                <h2>שאלות ותשובות</h2>
                <div id="questionsList">
                    <!-- Questions will be loaded here -->
                </div>
                <button class="add-question-btn" id="addQuestionBtn">
                    ➕ הוסף שאלה חדשה
                </button>
            </div>

            <!-- Main Editor Area -->
            <div class="editor-area">
                <div class="editor-header">
                    <div class="editor-title" id="editorTitle">בחר שאלה לעריכה</div>
                    <button class="save-btn" id="saveBtn" style="display: none;">שמור שינויים</button>
                </div>

                <div id="editorContent" class="empty-state">
                    <h3>בחר שאלה מהרשימה</h3>
                    <p>בחר שאלה מהרשימה בצד ימין כדי להתחיל לערוך</p>
                </div>

                <div id="editorForm" style="display: none;">
                    <div class="form-group">
                        <label>שם השאלה:</label>
                        <input type="text" id="questionName">
                    </div>
                    
                    <div class="form-group">
                        <label>מילות מפתח (מופרדות בפסיקים):</label>
                        <input type="text" id="questionKeywords" placeholder="מחיר, כמה עולה, עלות">
                    </div>
                    
                    <div class="form-group">
                        <label>תשובת הבוט:</label>
                        <textarea id="questionResponse" placeholder="הכנס כאן את התשובה המלאה..."></textarea>
                    </div>
                </div>
            </div>

            <!-- Right Panel -->
            <div class="right-panel">
                <!-- Preview -->
                <div class="preview-section">
                    <h3>👀 תצוגה מקדימה</h3>
                    <div class="chatbot-preview">
                        <div class="preview-header">
                            עוזר WearableCode
                        </div>
                        <div class="preview-messages" id="previewMessages">
                            <div class="preview-message bot">שלום! איך אני יכול לעזור לך היום?</div>
                        </div>
                        <div class="preview-input-container">
                            <input type="text" id="previewInput" class="preview-input" placeholder="נסה לכתוב משהו...">
                            <button id="testChatbotButton" class="preview-send-btn">→</button>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="actions-section">
                    <h3>פעולות</h3>
                    <button class="action-btn" id="exportBtn">📁 ייצא לקובץ JS</button>
                    <button class="action-btn" id="saveLocalBtn">💾 שמור מקומית</button>
                    <button class="action-btn" id="loadLocalBtn">📂 טען שמור</button>
                    <button class="action-btn delete-btn" id="deleteBtn" style="display: none;">🗑️ מחק שאלה</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // הסיסמה הנדרשת
        const ADMIN_PASSWORD = 'Aawearableadmin';
        const PASSWORD_KEY = 'wearablecode_admin_auth';
        
        // מאגר התשובות (נתונים התחלתיים)
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

        let currentEditingKey = null;

        // Elements
        let loginScreen, mainApp, passwordInput, questionsList, editorTitle, editorContent, editorForm;
        let questionName, questionKeywords, questionResponse, saveBtn, deleteBtn;

        document.addEventListener('DOMContentLoaded', function() {
            initializeElements();
            bindEvents();
            checkAuth();
        });

        function initializeElements() {
            loginScreen = document.getElementById('loginScreen');
            mainApp = document.getElementById('mainApp');
            passwordInput = document.getElementById('passwordInput');
            questionsList = document.getElementById('questionsList');
            editorTitle = document.getElementById('editorTitle');
            editorContent = document.getElementById('editorContent');
            editorForm = document.getElementById('editorForm');
            questionName = document.getElementById('questionName');
            questionKeywords = document.getElementById('questionKeywords');
            questionResponse = document.getElementById('questionResponse');
            saveBtn = document.getElementById('saveBtn');
            deleteBtn = document.getElementById('deleteBtn');
        }

        function bindEvents() {
            document.getElementById('loginButton').addEventListener('click', checkPassword);
            document.getElementById('logoutButton').addEventListener('click', logout);
            document.getElementById('addQuestionBtn').addEventListener('click', addNewQuestion);
            document.getElementById('saveBtn').addEventListener('click', saveQuestion);
            document.getElementById('deleteBtn').addEventListener('click', deleteQuestion);
            document.getElementById('testChatbotButton').addEventListener('click', testChatbot);
            document.getElementById('exportBtn').addEventListener('click', exportToJS);
            document.getElementById('saveLocalBtn').addEventListener('click', saveToLocalStorage);
            document.getElementById('loadLocalBtn').addEventListener('click', loadFromLocalStorage);

            // Enter key events
            passwordInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') checkPassword();
            });

            document.getElementById('previewInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') testChatbot();
            });
        }

        function checkAuth() {
            const stored = localStorage.getItem(PASSWORD_KEY);
            if (stored === ADMIN_PASSWORD) {
                showMainApp();
            } else {
                showLoginScreen();
            }
        }

        function showLoginScreen() {
            loginScreen.style.display = 'flex';
            mainApp.style.display = 'none';
            passwordInput.focus();
        }

        function showMainApp() {
            loginScreen.style.display = 'none';
            mainApp.style.display = 'block';
            loadQuestionsList();
        }

        function checkPassword() {
            const password = passwordInput.value;
            const errorDiv = document.getElementById('errorMessage');
            
            if (password === ADMIN_PASSWORD) {
                localStorage.setItem(PASSWORD_KEY, password);
                showMainApp();
                errorDiv.textContent = '';
            } else {
                errorDiv.textContent = 'סיסמה שגויה. נסה שוב.';
                passwordInput.value = '';
                passwordInput.focus();
            }
        }

        function logout() {
            localStorage.removeItem(PASSWORD_KEY);
            showLoginScreen();
            passwordInput.value = '';
        }

        function loadQuestionsList() {
            questionsList.innerHTML = '';
            
            for (const [key, data] of Object.entries(chatbotData)) {
                const questionItem = document.createElement('div');
                questionItem.className = 'question-item';
                questionItem.setAttribute('data-key', key);
                questionItem.innerHTML = `
                    <div class="question-title">${key}</div>
                    <div class="question-keywords">${data.keywords.slice(0, 3).join(', ')}${data.keywords.length > 3 ? '...' : ''}</div>
                `;
                
                questionItem.addEventListener('click', () => selectQuestion(key));
                questionsList.appendChild(questionItem);
            }
        }

        function selectQuestion(key) {
            // Remove active class from all items
            document.querySelectorAll('.question-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to selected item
            document.querySelector(`[data-key="${key}"]`).classList.add('active');
            
            // Load question data
            currentEditingKey = key;
            const data = chatbotData[key];
            
            editorTitle.textContent = `עריכת: ${key}`;
            editorContent.style.display = 'none';
            editorForm.style.display = 'block';
            saveBtn.style.display = 'block';
            deleteBtn.style.display = 'block';
            
            questionName.value = key;
            questionKeywords.value = data.keywords.join(', ');
            questionResponse.value = data.response;
        }

        function addNewQuestion() {
            // Clear selection
            document.querySelectorAll('.question-item').forEach(item => {
                item.classList.remove('active');
            });
            
            currentEditingKey = null;
            editorTitle.textContent = 'שאלה חדשה';
            editorContent.style.display = 'none';
            editorForm.style.display = 'block';
            saveBtn.style.display = 'block';
            deleteBtn.style.display = 'none';
            
            questionName.value = '';
            questionKeywords.value = '';
            questionResponse.value = '';
            questionName.focus();
        }

        function saveQuestion() {
            const name = questionName.value.trim();
            const keywords = questionKeywords.value.split(',').map(k => k.trim()).filter(k => k);
            const response = questionResponse.value.trim();
            
            if (!name || !keywords.length || !response) {
                alert('אנא מלא את כל השדות');
                return;
            }

            // Remove old key if editing
            if (currentEditingKey && currentEditingKey !== name) {
                delete chatbotData[currentEditingKey];
            }

            // Add/update question
            chatbotData[name] = {
                response: response,
                keywords: keywords
            };

            currentEditingKey = name;
            loadQuestionsList();
            selectQuestion(name);
            
            // Success feedback
            const originalText = saveBtn.textContent;
            saveBtn.textContent = '✅ נשמר!';
            saveBtn.style.background = '#10b981';
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.style.background = '';
            }, 2000);
        }

        function deleteQuestion() {
            if (currentEditingKey && confirm('האם אתה בטוח שברצונך למחוק את השאלה הזו?')) {
                delete chatbotData[currentEditingKey];
                currentEditingKey = null;
                
                editorTitle.textContent = 'בחר שאלה לעריכה';
                editorContent.style.display = 'block';
                editorForm.style.display = 'none';
                saveBtn.style.display = 'none';
                deleteBtn.style.display = 'none';
                
                loadQuestionsList();
            }
        }

        function testChatbot() {
            const input = document.getElementById('previewInput');
            const message = input.value.trim();
            if (!message) return;

            addPreviewMessage(message, 'user');
            input.value = '';

            setTimeout(() => {
                const response = findResponse(message);
                addPreviewMessage(response, 'bot');
            }, 500);
        }

        function addPreviewMessage(text, sender) {
            const messages = document.getElementById('previewMessages');
            const div = document.createElement('div');
            div.className = `preview-message ${sender}`;
            div.textContent = text;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        function findResponse(message) {
            const lowerMessage = message.toLowerCase().trim();
            
            for (const [key, data] of Object.entries(chatbotData)) {
                if (data.keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
                    return data.response;
                }
            }
            
            return '🤔 אני לא בטוח שהבנתי את השאלה. נסה לשאול בצורה אחרת או צור קשר ישירות.';
        }

        function exportToJS() {
            const jsContent = `// WearableCode Chatbot Data - Generated ${new Date().toLocaleString('he-IL')}
const CHATBOT_RESPONSES = ${JSON.stringify(chatbotData, null, 2)};

// הוסף את הקוד הזה לתחילת קובץ הצ'אטבוט שלך
// החלף את המשתנה CHATBOT_RESPONSES הקיים בקוד החדש הזה
`;
            
            const blob = new Blob([jsContent], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'chatbot-responses.js';
            a.click();
            URL.revokeObjectURL(url);
        }

        function saveToLocalStorage() {
            localStorage.setItem('wearablecode_chatbot_data', JSON.stringify(chatbotData));
            
            const btn = document.getElementById('saveLocalBtn');
            const originalText = btn.textContent;
            btn.textContent = '✅ נשמר!';
            btn.style.background = '#10b981';
            btn.style.color = 'white';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 2000);
        }

        function loadFromLocalStorage() {
            const saved = localStorage.getItem('wearablecode_chatbot_data');
            if (saved) {
                chatbotData = JSON.parse(saved);
                loadQuestionsList();
                
                const btn = document.getElementById('loadLocalBtn');
                const originalText = btn.textContent;
                btn.textContent = '✅ נטען!';
                btn.style.background = '#10b981';
                btn.style.color = 'white';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 2000);
            } else {
                alert('לא נמצאו נתונים שמורים במחשב הזה');
            }
        }
    </script>
</body>
</html>
