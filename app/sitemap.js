import dbConnect from "@/lib/db";
import Product from "@/models/Product";

const staticPaths = ["/", "/interior-design", "/event-decor", "/shop", "/book-survey", "/contact", "/b2b", "/shipping-policy", "/return-policy", "/terms", "/privacy-policy", "/interior-terms", "/event-terms", "/b2b-terms", "/warranty"];

export default async function sitemap() {
  const base = process.env.SITE_URL?.replace(/\/$/, "");
  if (!base) return [];
  const entries = staticPaths.map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly", priority: path === "/" ? 1 : 0.6 }));
  if (process.env.MONGODB_URI) {
    try {
      await dbConnect();
      const products = await Product.find({ active: true }).select("slug updatedAt").limit(5000).lean();
      entries.push(...products.map((product) => ({ url: `${base}/product/${product.slug}`, lastModified: product.updatedAt, changeFrequency: "weekly", priority: 0.7 })));
    } catch { /* Static routes remain available if the catalog is offline. */ }
  }
  return entries;
}
