import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema({
  name: String,
  email: String,
  address: String,
  city: String,
  phoneno: String,
  products: [{
    productId: String,
    name: String,
    quantity: Number,
    price: Number,
    picture: String
  }],
  subtotal: Number,
  delivery: Number,
  total: Number,
  orderDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'pending'
  }
});

const Order = models.Order || model('Order', OrderSchema);
export default Order;