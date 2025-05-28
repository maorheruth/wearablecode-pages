export default async function handler(req, res) {
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Very simple processing
    const orderData = req.body || {};
    const orderNumber = orderData.order_number || 'unknown';
    
    return res.status(200).json({ 
      success: true, 
      message: 'Webhook received!',
      orderNumber: orderNumber,
      receivedData: Object.keys(orderData)
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error.toString()
    });
  }
}
