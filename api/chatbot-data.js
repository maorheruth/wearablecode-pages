// api/chatbot-data.js
// ורסל API endpoint לניהול נתוני הצ'אטבוט - גרסה עם Upstash KV

import { kv } from '@vercel/kv';

// ⚡ פתרון cache של ורסל
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// מפתח לשמירה ב-KV
const KV_KEY = 'wearablecode_chatbot_data';

// ברירות מחדל
const defaultData = {
    quickReplies: [
        { text: 'מחירים', icon: '💰', topic: 'מחירים' },
        { text: 'משלוח', icon: '🚚', topic: 'משלוח' },
        { text: 'מעקב', icon: '📦', topic: 'מעקב חבילה' },
        { text: 'מידות', icon: '📏', topic: 'מידות' },
        { text: 'החזרות', icon: '🔄', topic: 'החזרות' },
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

// פונקציה לטעינת נתונים מ-KV
async function loadDataFromKV() {
    try {
        console.log('📡 מנסה לטעון נתונים מ-KV...');
        const data = await kv.get(KV_KEY);
        
        if (data && typeof data === 'object') {
            console.log('✅ נתונים נטענו מ-KV בהצלחה!');
            return data;
        } else {
            console.log('📝 נתונים לא נמצאו ב-KV, משתמש בברירת מחדל');
            // שמור ברירת מחדל ב-KV
            await saveDataToKV(defaultData);
            return defaultData;
        }
    } catch (error) {
        console.error('❌ שגיאה בטעינת נתונים מ-KV:', error);
        return defaultData;
    }
}

// פונקציה לשמירת נתונים ב-KV
async function saveDataToKV(data) {
    try {
        console.log('💾 שומר נתונים ב-KV...');
        await kv.set(KV_KEY, data);
        console.log('✅ נתונים נשמרו ב-KV בהצלחה!');
        return true;
    } catch (error) {
        console.error('❌ שגיאה בשמירת נתונים ב-KV:', error);
        return false;
    }
}

export default async function handler(req, res) {
    // הגדרות CORS מיידיות
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'false');
    res.setHeader('Access-Control-Max-Age', '86400');
    
    // הגדרת Cache headers מחוזק
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('X-Vercel-Cache', 'MISS');
    
    console.log('🚀 API נקרא:', {
        method: req.method,
        url: req.url,
        query: req.query,
        timestamp: new Date().toISOString()
    });

    // טיפול ב-OPTIONS request
    if (req.method === 'OPTIONS') {
        console.log('✅ OPTIONS preflight handled');
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const newData = req.body;
            
            if (!newData || typeof newData !== 'object') {
                console.log('❌ נתונים לא תקינים בPOST');
                return res.status(400).json({
                    success: false,
                    message: 'נתונים לא תקינים'
                });
            }

            // הוסף timestamp לנתונים
            const dataWithTimestamp = {
                ...newData,
                lastUpdate: Date.now()
            };

            // שמור ב-KV Database
            const saved = await saveDataToKV(dataWithTimestamp);
            
            if (saved) {
                console.log('🔄 נתוני הצ\'אטבוט עודכנו ונשמרו ב-KV:', {
                    timestamp: new Date().toISOString(),
                    responses: Object.keys(dataWithTimestamp.responses || {}).length,
                    quickReplies: (dataWithTimestamp.quickReplies || []).length,
                    dataSource: 'admin-panel'
                });
                
                return res.status(200).json({ 
                    success: true, 
                    message: 'נתונים עודכנו ונשמרו בהצלחה ב-KV Database',
                    timestamp: dataWithTimestamp.lastUpdate,
                    responses: Object.keys(dataWithTimestamp.responses || {}).length,
                    quickReplies: (dataWithTimestamp.quickReplies || []).length,
                    dataSource: 'admin-panel',
                    storage: 'kv-database'
                });
            } else {
                throw new Error('שגיאה בשמירה ב-KV');
            }
        } catch (error) {
            console.error('❌ שגיאה בעדכון נתונים:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'שגיאה בעדכון הנתונים: ' + error.message
            });
        }
    }

    if (req.method === 'GET') {
        try {
            console.log('📡 בקשה לקריאת נתוני צ\'אטבוט:', new Date().toISOString());
            
            // טען נתונים מ-KV Database
            const savedData = await loadDataFromKV();
            
            const callback = req.query.callback;
            
            const responseData = {
                success: true,
                ...savedData,
                timestamp: Date.now(),
                source: 'vercel-api',
                dataSource: 'kv-database',
                cacheStatus: 'NO-CACHE'
            };

            if (callback) {
                console.log('🔄 מחזיר JSONP עם callback:', callback);
                res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
                const jsonpResponse = `${callback}(${JSON.stringify(responseData)});`;
                return res.status(200).send(jsonpResponse);
            } else {
                console.log('📤 מחזיר JSON רגיל מ-KV Database');
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.status(200).json(responseData);
            }
        } catch (error) {
            console.error('❌ שגיאה בקריאת נתונים:', error);
            
            // במקרה של שגיאה, החזר ברירת מחדל
            const responseData = {
                success: true,
                ...defaultData,
                timestamp: Date.now(),
                source: 'vercel-api',
                dataSource: 'default-fallback',
                error: error.message
            };
            
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
