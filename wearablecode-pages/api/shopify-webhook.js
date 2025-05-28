export default async function handler(req, res) {
  console.log('Shopify webhook endpoint reached');
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    // Simple response for testing
    res.status(200).json({
      success: true,
      message: 'Shopify webhook endpoint is working',
      timestamp: new Date().toISOString(),
      receivedData: req.body
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
