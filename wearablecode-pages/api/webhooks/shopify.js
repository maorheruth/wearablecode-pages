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
  const qrUrl = `https://wearablecode-pages.vercel.app/setup.html?id=${orderId}`;
  
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

// Store order data in Firebase (shirts collection)
async function storeOrderData(orderData) {
  try {
    const shirtRef = doc(db, 'shirts', orderData.orderId);
    await setDoc(shirtRef, {
      orderId: orderData.orderId,
      shopifyOrderId: orderData.shopifyOrderId,
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      qrImageUrl: orderData.qrImageUrl,
      activationUrl: orderData.activationUrl,
      setupUrl: orderData.setupUrl,
      createdAt: new Date(),
      status: 'pending_activation',
      activated: false,
      // Default values - customer will fill these during activation
      instagram: '',
      message: ''
    });
    
    console.log('Order stored successfully:', orderData.orderId);
    return true;
  } catch (error) {
    console.error('Error storing order:', error);
    throw error;
  }
}

// Send welcome email to customer
async function sendWelcomeEmail(customerEmail, orderId, customerName, setupUrl) {
  // This is a placeholder - implement your preferred email service
  const emailData = {
    to: customerEmail,
    from: 'hello@wearablecode.com',
    subject: 'Your WearableCode shirt is on the way! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to WearableCode!</h1>
        <p>Hi ${customerName},</p>
        <p>Thank you for your order! Your personalized WearableCode shirt is being printed and will be shipped soon.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>What's Next?</h3>
          <p>Once you receive your shirt:</p>
          <ol>
            <li>Scan the QR code on the back of your shirt</li>
            <li>Set up your personal profile and message</li>
            <li>Share your unique code with the world!</li>
          </ol>
          <p>Or set up directly: <strong><a href="${setupUrl}">${setupUrl}</a></strong></p>
        </div>
        
        <p>We can't wait to see what you create with your WearableCode shirt!</p>
        <p>Best regards,<br>The WearableCode Team</p>
      </div>
    `
  };

  // Implement your email sending logic here
  console.log('Email would be sent:', emailData);
  return true;
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
    
// Verify webhook signature (TEMPORARILY DISABLED FOR TESTING)
// if (!verifyShopifyWebhook(body, signature, secret)) {
//   return res.status(401).json({ error: 'Unauthorized' });
// }

    const orderData = req.body;
    
    // Create WearableCode order
    const orderId = `WC-${orderData.order_number}`;
    const order = {
      orderId: orderId,
      shopifyOrderId: orderData.id,
      customerEmail: orderData.email,
      customerName: `${orderData.billing_address?.first_name || ''} ${orderData.billing_address?.last_name || ''}`.trim(),
      totalPrice: orderData.total_price,
      currency: orderData.currency,
      orderDate: orderData.created_at
    };

    console.log('Processing new order:', order.orderId);

    // Generate QR code (points to setup page)
    const qrImageUrl = await generateQRCode(order.orderId);
    order.qrImageUrl = qrImageUrl;
    order.setupUrl = `https://wearablecode-pages.vercel.app/setup.html?id=${order.orderId}`;
    order.activationUrl = `https://wearablecode-pages.vercel.app/index.html?id=${order.orderId}`;

    // Store in Firebase (shirts collection)
    await storeOrderData(order);

    // Send welcome email to customer
    await sendWelcomeEmail(order.customerEmail, order.orderId, order.customerName, order.setupUrl);

    console.log('Order processed successfully:', order.orderId);
    
    return res.status(200).json({ 
      success: true, 
      orderId: order.orderId,
      setupUrl: order.setupUrl,
      qrImageUrl: order.qrImageUrl
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
