import { db } from '../../firebase-config.js';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      method: req.method,
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    // Get the order data from Shopify webhook
    const orderData = req.body;
    
    console.log('Received Shopify webhook:', orderData);

    // Extract relevant information
    const order = {
      orderId: orderData.id,
      orderNumber: orderData.order_number || orderData.name,
      email: orderData.email,
      totalPrice: orderData.total_price,
      currency: orderData.currency,
      createdAt: orderData.created_at,
      billingAddress: orderData.billing_address,
      lineItems: orderData.line_items?.map(item => ({
        productId: item.product_id,
        variantId: item.variant_id,
        title: item.title,
        quantity: item.quantity,
        price: item.price
      })) || [],
      customerInfo: {
        firstName: orderData.billing_address?.first_name,
        lastName: orderData.billing_address?.last_name,
        email: orderData.email
      }
    };

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'orders'), order);
    console.log('Order saved to Firestore with ID:', docRef.id);

    // For each line item, create a shirt entry
    for (const item of order.lineItems) {
      const shirtData = {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        email: order.email,
        productId: item.productId,
        variantId: item.variantId,
        productTitle: item.title,
        quantity: item.quantity,
        customerFirstName: order.customerInfo.firstName,
        customerLastName: order.customerInfo.lastName,
        createdAt: new Date().toISOString(),
        status: 'pending_setup', // Customer needs to set up their shirt
        isActivated: false
      };

      const shirtRef = await addDoc(collection(db, 'shirts'), shirtData);
      console.log('Shirt created with ID:', shirtRef.id);
    }

    // Return success response
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully',
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      itemsProcessed: order.lineItems.length
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
