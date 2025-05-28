// Simple Shopify Webhook Handler - Working Version
export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Webhook received:', req.body);

    const orderData = req.body;
    
    // Create WearableCode order
    const orderId = `WC-${orderData.order_number}`;
    const order = {
      orderId: orderId,
      customerEmail: orderData.email,
      customerName: `${orderData.billing_address?.first_name || ''} ${orderData.billing_address?.last_name || ''}`.trim(),
      setupUrl: `https://wearablecode-pages.vercel.app/setup.html?id=${orderId}`,
      activationUrl: `https://wearablecode-pages.vercel.app/index.html?id=${orderId}`
    };

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
