// api/chatbot-data.js
// ורסל API endpoint לניהול נתוני הצ'אטבוט

let chatbotData = {
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
    // הגדרת CORS כדי לאפשר גישה מכל הדומיינים
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // טיפול ב-OPTIONS request (CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        // עדכון נתונים מהאדמין פאנל
        try {
            chatbotData = req.body;
            console.log('🔄 נתוני הצ\'אטבוט עודכנו:', new Date().toISOString());
            return res.status(200).json({ 
                success: true, 
                message: 'נתונים עודכנו בהצלחה',
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('❌ שגיאה בעדכון נתונים:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'שגיאה בעדכון הנתונים' 
            });
        }
    }

    if (req.method === 'GET') {
        // קריאת נתונים לצ'אטבוט
        console.log('📡 בקשה לקריאת נתוני צ\'אטבוט:', new Date().toISOString());
        return res.status(200).json(chatbotData);
    }

    // Method לא נתמך
    res.status(405).json({ 
        error: 'Method not allowed',
        allowedMethods: ['GET', 'POST', 'OPTIONS']
    });
}
