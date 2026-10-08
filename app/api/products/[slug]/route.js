import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { databaseError, jsonError } from "@/lib/http";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const product = await Product.findOne({ slug, active: true }).lean();
    if (!product) return jsonError("Product not found.", 404);
    return Response.json({ product: { ...product, id: String(product._id) } });
  } catch (error) {
    return databaseError(error);
  }
}
