export default function handler(req, res) {
  console.log('Shopify webhook endpoint reached');
  console.log('Method:', req.method);
  
  // Handle GET requests for testing
  if (req.method === 'GET') {
    return res.status(200).json({
      message: "Shopify webhook endpoint is active!",
      info: "Send POST request to process webhook",
      timestamp: new Date().toISOString(),
      status: "working"
    });
  }
  
  // Handle POST requests for actual webhooks
  if (req.method === 'POST') {
    try {
      const orderData = req.body;
      
      return res.status(200).json({
        success: true,
        message: "Shopify webhook received successfully",
        timestamp: new Date().toISOString(),
        orderId: orderData?.id || 'unknown',
        receivedData: orderData
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
    message: 'This endpoint accepts GET (for testing) and POST requests',
    receivedMethod: req.method
  });
}
