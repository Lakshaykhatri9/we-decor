import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { databaseError } from "@/lib/http";
import { getStarterCatalog, isLocalCatalogPreview } from "@/lib/starter-catalog";

export const runtime = "nodejs";

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const ids = params.get("ids")?.split(",").filter(Boolean) || [];
  const category = params.get("category") || "";
  const limit = Math.min(Math.max(Number(params.get("limit")) || 48, 1), 100);
  const page = ids.length ? 1 : Math.min(Math.max(Number(params.get("page")) || 1, 1), 1000);
  if (isLocalCatalogPreview()) return Response.json(getStarterCatalog({ category, ids, page, limit }));
  try {
    await dbConnect();
    const filter = { active: true };
    if (ids.length) filter._id = { $in: ids };
    if (category) filter.category = category;
    const query = Product.find(filter).sort({ createdAt: -1 });
    if (!ids.length) query.skip((page - 1) * limit).limit(limit + 1);
    const found = await query.lean();
    const hasMore = !ids.length && found.length > limit;
    const products = ids.length ? found : found.slice(0, limit);
    const categories = ids.length ? [] : await Product.distinct("category", { active: true });
    return Response.json({ products: products.map((product) => ({ ...product, id: String(product._id) })), categories, hasMore, page });
  } catch (error) {
    return databaseError(error);
  }
}
