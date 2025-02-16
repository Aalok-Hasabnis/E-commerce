import { initMongoose } from "../../../lib/mongoose";
import Order from "../../../models/order";
import Product from "../../../models/product";

export default async function handler(req, res) {
  await initMongoose();
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      name,
      email,
      address,
      city,
      phoneno,
      products: productIds
    } = req.body;

    // Convert comma-separated string to array
    const productIdArray = productIds.split(',');

    // Get unique product IDs and their quantities
    const productCounts = {};
    productIdArray.forEach(id => {
      productCounts[id] = (productCounts[id] || 0) + 1;
    });

    // Fetch product details and calculate totals
    const productDetails = [];
    let subtotal = 0;
    
    for (const [productId, quantity] of Object.entries(productCounts)) {
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).json({ error: `Product ${productId} not found` });
        return;
      }
      
      productDetails.push({
        productId: product._id.toString(),
        name: product.name,
        quantity: quantity,
        price: product.price,
        picture: product.picture
      });
      
      subtotal += product.price * quantity;
    }

    const delivery = productDetails.length > 0 ? 5 : 0;
    const total = subtotal + delivery;

    // Create the order
    const order = await Order.create({
      name,
      email,
      address,
      city,
      phoneno,
      products: productDetails,
      subtotal,
      delivery,
      total
    });

    // Redirect to invoice page
    res.redirect(303, `/invoice/${order._id}`);

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Error processing order' });
  }
}