import { initMongoose } from "../../../lib/mongoose";
import Product from "../../../models/product";

export async function findAllProducts() {
  return Product.find().exec();
}

export default async function handle(req, res) {
  await initMongoose();
  const { ids } = req.query;

  if (ids) {
    const idsArray = ids.split(',');
    const products = await Product.find({ _id: { $in: idsArray } }).exec();
    res.json(products);
  } else {
    res.json(await findAllProducts());
  }
}