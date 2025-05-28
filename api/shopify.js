export default function handler(req, res) {
  console.log('🎯 Shopify webhook endpoint reached!');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  // Handle GET requests for testing
  if (req.method === 'GET') {
    return res.status(200).json({
      message: "🎉 Shopify webhook is ACTIVE!",
      info: "Ready to receive Shopify orders",
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
        total: orderData?.total_price
      });
      
      // TODO: Here we'll add Firebase saving and QR code generation
      
      return res.status(200).json({
        success: true,
        message: "✅ Shopify order processed successfully!",
        timestamp: new Date().toISOString(),
        order: {
          id: orderData?.id || 'unknown',
          number: orderData?.order_number || orderData?.name || 'unknown',
          email: orderData?.email || 'unknown',
          total: orderData?.total_price || 'unknown',
          currency: orderData?.currency || 'USD'
        }
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
