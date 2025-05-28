export default async function handler(req, res) {
  console.log('Shopify webhook endpoint reached');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  // Allow GET for testing
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Shopify webhook endpoint is active',
      info: 'Send POST request to process webhook',
      timestamp: new Date().toISOString(),
      status: 'working'
    });
  }
  
  // Only allow POST for actual webhook processing
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint accepts GET (for testing) and POST requests'
    });
  }

  try {
    // Process webhook data
    const orderData = req.body;
    
    // Simple response for now
    res.status(200).json({
      success: true,
      message: 'Shopify webhook received successfully',
      timestamp: new Date().toISOString(),
      orderId: orderData?.id || 'unknown',
      receivedData: orderData
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
