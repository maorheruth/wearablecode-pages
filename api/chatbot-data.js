// api/chatbot-data.js
// ורסל API endpoint לניהול נתוני הצ'אטבוט - גרסה עם Upstash Redis

import { Redis } from '@upstash/redis';

// ⚡ פתרון cache של ורסל
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// יצירת חיבור לUpstash Redis
const redis = Redis.fromEnv();

// מפתח לשמירה ב-Redis
const REDIS_KEY = 'wearablecode_chatbot_data';

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

// פונקציה לטעינת נתונים מ-Redis
async function loadDataFromRedis() {
    try {
        console.log('📡 מנסה לטעון נתונים מ-Upstash Redis...');
        const data = await redis.get(REDIS_KEY);
        
        if (data && typeof data === 'object') {
            console.log('✅ נתונים נטענו מ-Redis בהצלחה!', {
                responses: Object.keys(data.responses || {}).length,
                quickReplies: (data.quickReplies || []).length,
                lastUpdate: data.lastUpdate
            });
            return data;
        } else {
            console.log('📝 נתונים לא נמצאו ב-Redis, יוצר ברירת מחדל חדשה');
            // שמור ברירת מחדל ב-Redis
            await saveDataToRedis(defaultData);
            return defaultData;
        }
    } catch (error) {
        console.error('❌ שגיאה בטעינת נתונים מ-Redis:', error);
        return defaultData;
    }
}

// פונקציה לשמירת נתונים ב-Redis
async function saveDataToRedis(data) {
    try {
        console.log('💾 שומר נתונים ב-Upstash Redis...', {
            responses: Object.keys(data.responses || {}).length,
            quickReplies: (data.quickReplies || []).length
        });
        
        await redis.set(REDIS_KEY, data);
        console.log('✅ נתונים נשמרו ב-Redis בהצלחה!');
        return true;
    } catch (error) {
        console.error('❌ שגיאה בשמירת נתונים ב-Redis:', error);
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
    
    // הגדרת Cache headers מחוזק -
