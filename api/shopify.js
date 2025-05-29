import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  console.log('🎯 Shopify webhook endpoint reached!');
  console.log('Method:', req.method);
  
  // Handle GET requests for testing
  if (req.method === 'GET') {
    return res.status(200).json({
      message: "🎉 Shopify webhook is ACTIVE!",
      info: "Using simple order notes for hybrid approach",
      timestamp: new Date().toISOString(),
      status: "working",
      endpoint: "/api/shopify"
    });
  }
  
  // Handle POST requests (actual Shopify webhooks)
  if (req.method === 'POST') {
    try {
      const orderData = req.body;
      
      console.log('📦 New Shopify order received:', {
        orderId: orderData?.id,
        orderNumber: orderData?.order_number || orderData?.name,
        email: orderData?.email,
        total: orderData?.total_price,
        note: orderData?.note
      });

      // Check if customer provided a custom link in order notes
      const orderNote = orderData?.note || '';
      let customLink = '';
      
      // Look for links in the order note
      const urlPattern = /(https?:\/\/[^\s]+)/gi;
      const foundUrls = orderNote.match(urlPattern);
      
      if (foundUrls && foundUrls.length > 0) {
        customLink = foundUrls[0]; // Take the first URL found
        console.log('🔗 Custom link found in order notes:', customLink);
      } else {
        console.log('📝 No custom link found in order notes');
      }

      // Generate unique QR code data for each line item
      const qrCodes = [];
      
      for (const item of orderData?.line_items || []) {
        const uniqueId = `${orderData.id}_${item.id}_${Date.now()}`;
        
        // Determine QR code destination
        let qrCodeUrl;
        if (customLink && customLink.trim()) {
          // Customer provided a link - direct QR to ready page
          qrCodeUrl = `https://wearablecode-pages.vercel.app/product/${uniqueId}?link=${encodeURIComponent(customLink.trim())}&ready=true`;
        } else {
          // No link provided - QR to setup page
          qrCodeUrl = `https://wearablecode-pages.vercel.app/product/${uniqueId}?setup=true`;
        }
        
        qrCodes.push({
          itemId: item.id,
          itemTitle: item.title,
          uniqueId: uniqueId,
          qrCodeUrl: qrCodeUrl,
          isReady: !!customLink?.trim()
        });
      }

      // Prepare order data for Firebase
      const orderRecord = {
        // Order details
        orderId: orderData.id,
        orderNumber: orderData.order_number || orderData.name,
        email: orderData.email,
        totalPrice: orderData.total_price,
        currency: orderData.currency,
        createdAt: orderData.created_at,
        orderNote: orderNote,
        
        // Customer details
        customer: {
          email: orderData.email,
          firstName: orderData.billing_address?.first_name || orderData.customer?.first_name,
          lastName: orderData.billing_address?.last_name || orderData.customer?.last_name
        },
        
        // Line items with QR codes
        items: orderData.line_items?.map((item, index) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          uniqueId: qrCodes[index]?.uniqueId,
          qrCodeUrl: qrCodes[index]?.qrCodeUrl,
          isReady: qrCodes[index]?.isReady
        })),
        
        // Custom link if provided
        customLink: customLink || null,
        
        // QR codes summary
        qrCodes: qrCodes,
        
        // Processing info
        processedAt: new Date().toISOString(),
        source: 'shopify_simple_webhook',
        status: 'processed'
      };

      // Save to Firebase
      const docRef = await addDoc(collection(db, 'orders'), orderRecord);
      
      console.log('✅ Order saved to Firebase with ID:', docRef.id);

      // Return success response to Shopify
      return res.status(200).json({
        success: true,
        message: "✅ Order processed with simple notes approach!",
        timestamp: new Date().toISOString(),
        order: {
          id: orderData.id,
          number: orderData.order_number || orderData.name,
          firebaseId: docRef.id,
          hasCustomLink: !!customLink?.trim(),
          customLink: customLink || null,
          orderNote: orderNote,
          qrCodesGenerated: qrCodes.length
        },
        qrCodes: qrCodes
      });
      
    } catch (error) {
      console.error('❌ Error processing Shopify webhook:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Handle other HTTP methods
  return res.status(405).json({
    error: 'Method not allowed',
    message: 'This endpoint accepts GET (testing) and POST (webhooks) requests only',
    receivedMethod: req.method,
    timestamp: new Date().toISOString()
  });
}
