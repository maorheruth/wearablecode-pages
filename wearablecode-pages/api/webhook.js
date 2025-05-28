export default function handler(req, res) {
  console.log('Webhook endpoint reached - SUCCESS!');
  console.log('Method:', req.method);
  
  // Handle GET requests for testing
  if (req.method === 'GET') {
    return res.status(200).json({
      message: "🎉 WEBHOOK WORKING! 🎉",
      info: "This is your Shopify webhook endpoint",
      timestamp: new Date().toISOString(),
      status: "success",
      url: req.url
    });
  }
  
  // Handle POST requests for actual webhooks
  if (req.method === 'POST') {
    try {
      const orderData = req.body;
      
      return res.status(200).json({
        success: true,
        message: "Shopify order received!",
        timestamp: new Date().toISOString(),
        orderId: orderData?.id || 'unknown',
        orderNumber: orderData?.order_number || orderData?.name || 'unknown',
        email: orderData?.email || 'unknown',
        total: orderData?.total_price || 'unknown'
      });
      
    } catch (error) {
      console.error('Error processing webhook:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
  
  // Handle other methods
  return res.status(405).json({
    error: 'Method not allowed',
    message: 'This endpoint accepts GET and POST requests',
    receivedMethod: req.method
  });
}
