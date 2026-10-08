import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { databaseError } from "@/lib/http";
import { isLocalCatalogPreview, searchStarterCatalog } from "@/lib/starter-catalog";

export const runtime = "nodejs";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request) {
  const query = new URL(request.url).searchParams.get("q")?.trim().slice(0, 80) || "";
  if (!query) return Response.json({ products: [] });
  if (isLocalCatalogPreview()) return Response.json({ products: searchStarterCatalog(query), previewMode: true });
  try {
    await dbConnect();
    const pattern = new RegExp(escapeRegex(query), "i");
    const products = await Product.find({ active: true, $or: [
      { name: pattern }, { category: pattern }, { description: pattern }, { brand: pattern }, { tags: pattern },
    ] }).select("name slug priceInrPaise stock mainImage category").limit(8).lean();
    return Response.json({ products: products.map((product) => ({ ...product, id: String(product._id) })) });
  } catch (error) {
    return databaseError(error);
  }
}
