import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import ProductDetail from "@/components/ProductDetail";
import { canonical, productJsonLd } from "@/lib/seo";
import { getStarterProduct, isConceptCatalogPreview } from "@/lib/starter-catalog";

export const runtime = "nodejs";
export const dynamicParams = true;

async function findProduct(slug) {
  if (isConceptCatalogPreview()) return getStarterProduct(slug);
  await dbConnect();
  return Product.findOne({ slug, active: true }).lean();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const product = await findProduct(slug);
    if (!product) return { title: "Product not found" };
    return {
      title: product.name,
      description: product.description.slice(0, 160),
      alternates: canonical(`/product/${product.slug}`) ? { canonical: canonical(`/product/${product.slug}`) } : undefined,
      openGraph: { title: product.name, description: product.description.slice(0, 160), images: product.mainImage ? [product.mainImage] : [] },
    };
  } catch { return { title: "Product catalog" }; }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  let product;
  let related = [];
  try {
    product = await findProduct(slug);
    if (!product) notFound();
    if (!product.previewOnly) related = await Product.find({ active: true, category: product.category, _id: { $ne: product._id } }).sort({ createdAt: -1 }).limit(4).lean();
  } catch (error) {
    if (error?.digest?.startsWith("NEXT_HTTP_ERROR_FALLBACK")) throw error;
    return <main className="page-width unavailable-page"><span className="eyebrow">PRODUCT CATALOG</span><h1>Catalog temporarily unavailable.</h1><p>{error.message?.includes("MONGODB_URI") ? "Connect the product database to publish and view product details." : "Please try again shortly."}</p></main>;
  }
  const clean = (item) => ({ ...item, id: String(item.id || item._id) });
  const data = product.previewOnly ? null : productJsonLd(product, canonical(`/product/${product.slug}`));
  return <main className="product-page page-width">{data && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />}<ProductDetail product={clean(product)} related={related.map(clean)} /></main>;
}
