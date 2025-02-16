// src/pages/api/order.js
import { initMongoose } from "../../../lib/mongoose";
import Order from "../../../models/order";

export default async function handler(req, res) {
  await initMongoose();

  const { orderId } = req.query;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching order" });
  }
}
