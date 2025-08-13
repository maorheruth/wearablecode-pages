// api/chatbot-store.js - Vercel KV Database API
import { kv } from '@vercel/kv';

const CHATBOT_KEY = 'wearablecode_chatbot_data';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Aawearableadmin';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // טעינת נתונים מהמסד
      console.log('📖 טוען נתונים מ-KV...');
      const data = await kv.get(CHATBOT_KEY);
      
      if (!data) {
        // נתונים ברירת מחדל אם אין כלום
        const defaultData = {
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
            'צור קשר': {
              response: '📞 אפשר ליצור קשר:\n• WhatsApp: 050-123-4567\n• מייל: hello@wearablecode.com\n• פייסבוק: WearableCode Israel\n• אינסטגרם: @wearablecode_il\n\nאנחנו כאן בשבילכם! 😊',
              keywords: ['צור קשר', 'טלפון', 'מייל', 'פייסבוק', 'אינסטגרם', 'ווטסאפ', 'עזרה']
            }
          },
          lastUpdate: Date.now(),
          version: '1.0.0'
        };
        
        await kv.set(CHATBOT_KEY, defaultData);
        console.log('🔧 נתונים ברירת מחדל נוצרו');
        return res.json({ success: true, data: defaultData });
      }
      
      console.log('✅ נתונים נטענו בהצלחה');
      return res.json({ success: true, data });
      
    } else if (req.method === 'POST') {
      // שמירת נתונים במסד
      const { password, data } = req.body;
      
      // בדיקת סיסמה
      if (password !== ADMIN_PASSWORD) {
        console.log('❌ סיסמה שגויה');
        return res.status(401).json({ success: false, message: 'סיסמה שגויה' });
      }
      
      if (!data) {
        return res.status(400).json({ success: false, message: 'אין נתונים לשמירה' });
      }
      
      // שמירה ב-KV
      const dataToSave = {
        ...data,
        lastUpdate: Date.now()
      };
      
      await kv.set(CHATBOT_KEY, dataToSave);
      console.log('💾 נתונים נשמרו ב-KV');
      
      return res.json({ 
        success: true, 
        message: 'נתונים נשמרו בהצלחה',
        timestamp: dataToSave.lastUpdate
      });
    }
    
  } catch (error) {
    console.error('❌ שגיאה ב-API:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'שגיאת שרת: ' + error.message 
    });
  }
  
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
