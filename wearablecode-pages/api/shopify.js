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
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      method: req.method,
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    // Get the order data from Shopify webhook
    const orderData = req.body;
    
    console.log('Received Shopify webhook:', orderData);
    
    // Extract relevant information
    const order = {
      orderId: orderData.id,
      orderNumber: orderData.order_number || orderData.name,
      email: orderData.email,
      totalPrice: orderData.total_price,
      currency: orderData.currency,
      createdAt: orderData.created_at,
      billingAddress: {
        firstName: orderData.billing_address?.first_name,
        lastName: orderData.billing_address?.last_name
      },
      lineItems: orderData.line_items?.map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price
      }))
    };

    // Save to Firebase
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      processedAt: new Date().toISOString(),
      source: 'shopify_webhook'
    });

    console.log('Order saved to Firebase with ID:', docRef.id);

    // Generate QR code data for each line item
    const qrCodes = [];
    for (const item of orderData.line_items || []) {
      // Generate unique QR code URL for each item
      const qrCodeUrl = `https://wearablecode-pages.vercel.app/product/${item.id}?order=${orderData.id}`;
      qrCodes.push({
        itemId: item.id,
        itemTitle: item.title,
        qrCodeUrl: qrCodeUrl
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Webhook received and processed',
      orderId: orderData.id,
      firebaseDocId: docRef.id,
      qrCodes: qrCodes
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
