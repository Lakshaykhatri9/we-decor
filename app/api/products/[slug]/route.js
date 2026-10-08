import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { databaseError, jsonError } from "@/lib/http";
import { getStarterProduct, isConceptCatalogPreview } from "@/lib/starter-catalog";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { slug } = await params;
  if (isConceptCatalogPreview()) {
    const product = getStarterProduct(slug);
    return product ? Response.json({ product, previewMode: true }) : jsonError("Product not found.", 404);
  }
  try {
    await dbConnect();
    const product = await Product.findOne({ slug, active: true }).lean();
    if (!product) return jsonError("Product not found.", 404);
    return Response.json({ product: { ...product, id: String(product._id) } });
  } catch (error) {
    return databaseError(error);
  }
}
