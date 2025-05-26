// Shopify Webhook Handler for WearableCode
import crypto from 'crypto';

// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Verify Shopify webhook signature
function verifyShopifyWebhook(data, signature, secret) {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(data, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'base64'),
    Buffer.from(computedSignature, 'base64')
  );
}

// Generate QR code using QR Code Monkey
async function generateQRCode(orderId) {
  const qrUrl = `https://qr.wearablecode.com/activate/${orderId}`;
  
  try {
    const response = await fetch('https://api.qrcode-monkey.com/qr/custom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: qrUrl,
        config: {
          body: 'square',
          eye: 'frame0',
          eyeBall: 'ball0',
          bodyColor: '#000000',
          bgColor: '#FFFFFF',
          eye1Color: '#000000',
          eye2Color: '#000000',
          eye3Color: '#000000',
          eyeBall1Color: '#000000',
          eyeBall2Color: '#000000',
          eyeBall3Color: '#000000'
        },
        size: 300,
        download: 'imageUrl',
        file: 'png'
      })
    });

    const result = await response.json();
    return result.imageUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

// Store order data in Firebase
async function storeOrderData(orderData) {
  try {
    const orderRef = doc(db, 'orders', orderData.orderId);
    await setDoc(orderRef, {
      ...orderData,
      createdAt: new Date(),
      status: 'pending_activation',
      activated: false
    });
    
    console.log('Order stored successfully:', orderData.orderId);
    return true;
  } catch (error) {
    console.error('Error storing order:', error);
    throw error;
  }
}

// Main webhook handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get webhook signature
    const signature = req.headers['x-shopify-hmac-sha256'];
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    
    // Get raw body
    const body = JSON.stringify(req.body);
    
    // Verify webhook signature
    if (!verifyShopifyWebhook(body, signature, secret)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const orderData = req.body;
    
    // Create WearableCode order
    const order = {
      orderId: `WC-${orderData.order_number}`,
      shopifyOrderId: orderData.id,
      customerEmail: orderData.email,
      customerName: `${orderData.billing_address?.first_name || ''} ${orderData.billing_address?.last_name || ''}`.trim(),
      totalPrice: orderData.total_price,
      currency: orderData.currency,
      orderDate: orderData.created_at
    };

    console.log('Processing new order:', order.orderId);

    // Generate QR code
    const qrImageUrl = await generateQRCode(order.orderId);
    order.qrImageUrl = qrImageUrl;
    order.activationUrl = `https://qr.wearablecode.com/activate/${order.orderId}`;

    // Store in Firebase
    await storeOrderData(order);

    console.log('Order processed successfully:', order.orderId);
    
    return res.status(200).json({ success: true, orderId: order.orderId });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
