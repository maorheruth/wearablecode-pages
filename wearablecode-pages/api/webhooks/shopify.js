// Shopify Webhook Handler for WearableCode - Vercel Compatible
import crypto from 'crypto';

// Vercel serverless function handler
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Webhook received:', req.body);

    // Skip signature verification for testing (TEMPORARY)
    // const signature = req.headers['x-shopify-hmac-sha256'];
    // const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

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

    // For now, just create basic QR URL without generating actual QR image
    order.setupUrl = `https://wearablecode-pages.vercel.app/setup.html?id=${order.orderId}`;
    order.activationUrl = `https://wearablecode-pages.vercel.app/index.html?id=${order.orderId}`;

    // TODO: Add Firebase storage here
    // TODO: Add QR code generation here
    // TODO: Add email sending here

    console.log('Order processed successfully:', order.orderId);
    
    return res.status(200).json({ 
      success: true, 
      orderId: order.orderId,
      setupUrl: order.setupUrl,
      message: 'Webhook received and processed successfully'
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
}
