import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export const runtime = "nodejs";

const xml = (value) => String(value ?? "").replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char]);

export async function GET() {
  if (!process.env.MONGODB_URI) return new Response("Catalog feed is unavailable until the database is configured.", { status: 503 });
  try {
    await dbConnect();
    const products = await Product.find({ active: true }).sort({ createdAt: -1 }).limit(5000).lean();
    const base = process.env.SITE_URL?.replace(/\/$/, "");
    if (!base) return new Response("Set SITE_URL to publish canonical product links.", { status: 503 });
    let shippingRates;
    try { shippingRates = JSON.parse(process.env.SHIPPING_RATES_JSON || "{}"); }
    catch { return new Response("SHIPPING_RATES_JSON must contain valid JSON.", { status: 503 }); }
    const domesticRate = shippingRates.IN?.STANDARD;
    if (!domesticRate || !Number.isFinite(Number(domesticRate.baseMinor)) || !Number.isFinite(Number(domesticRate.perKgMinor))) return new Response("Configure India standard shipping rates before publishing the catalog feed.", { status: 503 });
    const items = products.map((product) => {
      const actualWeight = Number(product.weightKg || 0);
      const dimensions = product.dimensions || {};
      const volume = Number(dimensions.lengthCm || 0) * Number(dimensions.widthCm || 0) * Number(dimensions.heightCm || 0);
      const divisor = Number(domesticRate.volumetricDivisor || 0);
      const chargeableWeight = Math.max(actualWeight, divisor > 0 ? volume / divisor : 0);
      const shippingMinor = Math.round(Number(domesticRate.baseMinor) + Number(domesticRate.perKgMinor) * chargeableWeight);
      return `
      <item>
        <g:id>${xml(product.sku || product._id)}</g:id>
        <g:title>${xml(product.name)}</g:title>
        <g:description>${xml(product.description)}</g:description>
        <g:link>${xml(`${base}/product/${product.slug}`)}</g:link>
        ${product.mainImage ? `<g:image_link>${xml(product.mainImage)}</g:image_link>` : ""}
        <g:price>${(Number(product.priceInrPaise) / 100).toFixed(2)} INR</g:price>
        <g:availability>${product.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>
        ${product.brand ? `<g:brand>${xml(product.brand)}</g:brand>` : ""}
        <g:identifier_exists>${product.sku ? "yes" : "no"}</g:identifier_exists>
        <g:condition>new</g:condition>
        <g:shipping><g:country>IN</g:country><g:service>Standard</g:service><g:price>${(shippingMinor / 100).toFixed(2)} INR</g:price></g:shipping>
      </item>`;
    }).join("");
    const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>WE DECOR 4U Catalog</title><link>${xml(base)}</link><description>Live product catalog</description>${items}</channel></rss>`;
    return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } });
  } catch {
    return new Response("Catalog feed is temporarily unavailable.", { status: 503 });
  }
}
