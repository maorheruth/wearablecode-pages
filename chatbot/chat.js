// api/chat.js - Vercel Serverless Function
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Using Hugging Face free API with environment variable
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_TOKEN}`, // מהמשתנה שהגדרת
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: formatMessageForHuggingFace(message),
          parameters: {
            max_length: 100,
            temperature: 0.7,
            do_sample: true
          }
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    const aiResponse = extractResponse(data);
    const finalResponse = postProcessResponse(aiResponse, message);

    return res.status(200).json({ 
      response: finalResponse,
      success: true 
    });

  } catch (error) {
    console.error('AI Error:', error);
    
    // Fallback to smart rule-based responses
    const fallbackResponse = getSmartFallback(message);
    
    return res.status(200).json({ 
      response: fallbackResponse,
      success: true,
      fallback: true
    });
  }
}

// Format message for Hugging Face
function formatMessageForHuggingFace(message) {
  const context = "אתה בוט מכירות ידידותי של חנות WearableCode שמוכרת חולצות מעוצבות. עזור ללקוחות למצוא מוצרים, ענה על שאלות על משלוח והחזרות.";
  return `${context}\n\nלקוח: ${message}\nמוכר:`;
}

// Extract response from Hugging Face
function extractResponse(data) {
  if (data && data[0] && data[0].generated_text) {
    const fullText = data[0].generated_text;
    const parts = fullText.split('מוכר:');
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
  }
  return null;
}

// Post-process and improve response
function postProcessResponse(aiResponse, originalMessage) {
  if (!aiResponse) {
    return getSmartFallback(originalMessage);
  }

  // Clean and improve the response
  let cleaned = aiResponse
    .replace(/לקוח:|מוכר:/g, '')
    .trim();

  // Add context-specific improvements
  if (originalMessage.toLowerCase().includes('מחיר')) {
    cleaned += '\n\n💰 המחירים שלנו התחרותיים! רוצה לראות מוצרים ספציפיים?';
  }

  if (originalMessage.toLowerCase().includes('משלוח')) {
    cleaned += '\n\n📦 משלוח חינם מעל ₪150!';
  }

  return cleaned;
}

// Smart fallback responses (if AI fails)
function getSmartFallback(message) {
  const lowerMessage = message.toLowerCase();
  
  const responses = {
    greeting: ['שלום', 'היי', 'בוקר טוב', 'ערב טוב'],
    products: ['מוצר', 'חולצה', 'בגד', 'קולקציה'],
    price: ['מחיר', 'כמה עולה', 'עלות', 'כסף'],
    shipping: ['משלוח', 'שילוח', 'דואר'],
    returns: ['החזרה', 'החלפה', 'החזרת'],
    sizes: ['מידה', 'גודל', 'מידות', 'גדלים'],
    help: ['עזרה', 'תמיכה', 'בעיה', 'שירות']
  };

  for (const [category, keywords] of Object.entries(responses)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return getCategoryResponse(category);
    }
  }

  return 'תודה על הפניה! 😊 איך אני יכול לעזור לך עם המוצרים שלנו? אני יכול לספר על החולצות, המחירים, המשלוח או כל דבר אחר שמעניין אותך.';
}

function getCategoryResponse(category) {
  const responses = {
    greeting: 'שלום ובברוכים הבאים ל-WearableCode! 👋 איך אני יכול לעזור לך היום? יש לנו חולצות מדהימות עם עיצובים ייחודיים!',
    
    products: '👕 המוצרים שלנו כוללים:\n• חולצות עם ציטוטים מפורסמים\n• עיצובים מינימליסטיים\n• הדפסים ייחודיים\n• איכות פרימיום\n\nרוצה לראות מוצר ספציפי?',
    
    price: '💰 המחירים שלנו:\n• חולצות רגילות: ₪79-89\n• מהדורות מוגבלות: ₪99\n• משלוח חינם מעל ₪150\n• הנחה 10% ללקוחות חדשים!\n\nאיזה מוצר מעניין אותך?',
    
    shipping: '📦 משלוח ואספקה:\n• משלוח חינם מעל ₪150\n• משלוח רגיל: ₪25 (3-5 ימים)\n• משלוח מהיר: ₪35 (1-2 ימים)\n• איסוף עצמי: חינם\n\nאיפה להשלח?',
    
    returns: '🔄 החזרות והחלפות:\n• החזרה עד 30 יום\n• החלפת מידה חינם\n• המוצר במצב מקורי\n• זיכוי מלא או החזר כספי\n\nצריך עזרה עם החזרה?',
    
    sizes: '📏 מדריך מידות:\n• S: חזה 92-96 ס"מ\n• M: חזה 96-100 ס"מ\n• L: חזה 100-104 ס"מ\n• XL: חזה 104-108 ס"מ\n\nאיזה מידה מתאימה לך?',
    
    help: '🆘 אני כאן לעזור!\n• שאלות על מוצרים\n• עזרה עם הזמנות\n• תמיכה טכנית\n• מידע על משלוח\n\nבמה בדיוק אני יכול לעזור?'
  };

  return responses[category];
}
