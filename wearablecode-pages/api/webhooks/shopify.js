export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      method: req.method,
      message: 'This endpoint only accepts POST requests'
    });
  }

  // Return success for POST
  res.status(200).json({ 
    success: true, 
    message: 'Shopify webhook endpoint is working!',
    timestamp: new Date().toISOString(),
    data: req.body
  });
}
