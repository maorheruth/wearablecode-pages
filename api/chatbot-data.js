// api/chatbot-data.js
// ורסל API endpoint לניהול נתוני הצ'אטבוט
let chatbotData = {
    quickReplies: [
        { text: 'מחירים', icon: '💰', topic: 'מחירים' },
        { text: 'משלוח', icon: '🚚', topic: 'משלוח' },
        { text: 'מעקב', icon: '📦', topic: 'מעקב חבילה' },
        { text: 'צור קשר', icon: '📞', topic: 'צור קשר' }
    ],
    responses: {
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
    },
    lastUpdate: Date.now(),
    version: '1.0.0'
};

export default function handler(req, res) {
    console.log('🚀 API נקרא:', {
        method: req.method,
        url: req.url,
        query: req.query,
        origin: req.headers.origin,
        timestamp: new Date().toISOString()
    });

    // הגדרת CORS מתקדם כדי לאפשר גישה מכל הדומיינים של שופיפיי
    const origin = req.headers.origin;
    
    // רשימת דומיינים מורשים
    const allowedOrigins = [
        'https://wearablecode.com',
        'https://www.wearablecode.com',
        'https://wearablecode.myshopify.com'
    ];
    
    // אפשר לכל origin של שופיפיי או ורסל
    if (origin && (allowedOrigins.includes(origin) || origin.includes('shopify') || origin.includes('wearablecode') || origin.includes('vercel.app'))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // הגדרת Cache headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // טיפול ב-OPTIONS request (CORS preflight)
    if (req.method === 'OPTIONS') {
        console.log('✅ OPTIONS preflight handled');
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        // עדכון נתונים מהאדמין פאנל
        try {
            const newData = req.body;
            
            // ולידציה בסיסית
            if (!newData || typeof newData !== 'object') {
                console.log('❌ נתונים לא תקינים בPOST');
                return res.status(400).json({
                    success: false,
                    message: 'נתונים לא תקינים'
                });
            }

            // עדכון הנתונים (שמירה על המבנה הקיים)
            chatbotData = {
                ...chatbotData,
                ...newData,
                lastUpdate: Date.now()
            };
            
            console.log('🔄 נתוני הצ\'אטבוט עודכנו:', {
                timestamp: new Date().toISOString(),
                responses: Object.keys(chatbotData.responses || {}).length,
                quickReplies: (chatbotData.quickReplies || []).length
            });
            
            return res.status(200).json({ 
                success: true, 
                message: 'נתונים עודכנו בהצלחה',
                timestamp: chatbotData.lastUpdate,
                responses: Object.keys(chatbotData.responses || {}).length,
                quickReplies: (chatbotData.quickReplies || []).length
            });
        } catch (error) {
            console.error('❌ שגיאה בעדכון נתונים:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'שגיאה בעדכון הנתונים: ' + error.message
            });
        }
    }

    if (req.method === 'GET') {
        console.log('📡 בקשה לקריאת נתוני צ\'אטבוט:', new Date().toISOString());
        
        // בדיקה אם זה בקשת JSONP (עוקף CORS)
        const callback = req.query.callback;
        
        const responseData = {
            success: true,
            ...chatbotData,
            timestamp: Date.now(),
            source: 'vercel-api'
        };

        if (callback) {
            // JSONP response - עוקף בעיות CORS
            console.log('🔄 מחזיר JSONP עם callback:', callback);
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            const jsonpResponse = `${callback}(${JSON.stringify(responseData)});`;
            return res.status(200).send(jsonpResponse);
        } else {
            // JSON רגיל
            console.log('📤 מחזיר JSON רגיל');
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.status(200).json(responseData);
        }
    }

    // Method לא נתמך
    console.log('❌ שיטה לא נתמכת:', req.method);
    res.status(405).json({ 
        error: 'Method not allowed',
        allowedMethods: ['GET', 'POST', 'OPTIONS'],
        received: req.method
    });
}
