import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { calculateTax, calculateTotal, safeQuantity } from "@/lib/commerce.mjs";
import { getCheckoutConfig, supportedPaymentMethods } from "@/lib/shipping";
import { databaseError, jsonError, readJson } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request) {
  const body = await readJson(request);
  if (!body || !Array.isArray(body.items) || body.items.length < 1 || body.items.length > 50) return jsonError("Your cart is empty or invalid.");
  const requested = new Map();
  for (const row of body.items) {
    const id = String(row?.productId || "");
    const quantity = safeQuantity(row?.quantity);
    if (!/^[a-f\d]{24}$/i.test(id) || !quantity) return jsonError("A cart item or quantity is invalid.");
    requested.set(id, (requested.get(id) || 0) + quantity);
  }
  if ([...requested.values()].some((quantity) => quantity > 50)) return jsonError("A product quantity exceeds the allowed limit.");
  const countryCode = String(body.country || "IN").toUpperCase();
  try {
    await dbConnect();
    const products = await Product.find({ _id: { $in: [...requested.keys()] }, active: true }).lean();
    if (products.length !== requested.size) return jsonError("One or more products are no longer available.", 409);
    for (const product of products) {
      const quantity = requested.get(String(product._id));
      if (product.stock < quantity) throw new Error(`${product.name} does not have enough stock.`);
    }
    const byId = new Map(products.map((product) => [String(product._id), product]));
    const lines = body.items.map((row) => {
      const product = byId.get(String(row.productId));
      const options = Object.fromEntries((product.variants || []).map((variant) => {
        const chosen = typeof row.options?.[variant.name] === "string" ? row.options[variant.name].trim() : "";
        if (variant.options?.length && !variant.options.includes(chosen)) throw new Error(`Choose a valid ${variant.name.toLowerCase()} for ${product.name}.`);
        return [variant.name, chosen];
      }));
      return { product, quantity: safeQuantity(row.quantity), options, exchangeRate: 0 };
    });
    const config = getCheckoutConfig(countryCode, body.shippingMethod, products, requested);
    let subtotalMinor = 0;
    for (const line of lines) {
      line.exchangeRate = config.fxRate;
      line.priceMinor = Math.round(Number(line.product.priceInrPaise) * config.fxRate);
      subtotalMinor += line.priceMinor * line.quantity;
    }
    const taxMinor = calculateTax(subtotalMinor, config.taxRate);
    const totalMinor = calculateTotal(subtotalMinor, taxMinor, config.shippingMinor);
    return Response.json({
      currency: config.currency,
      country: config.country.code,
      shippingMethod: config.shippingMethod,
      items: lines.map(({ product, quantity, priceMinor, options }) => ({
        productId: String(product._id), name: product.name, slug: product.slug,
        image: product.mainImage || "", quantity, unitPriceMinor: priceMinor,
        lineTotalMinor: priceMinor * quantity, options,
      })),
      subtotalMinor, taxMinor, shippingMinor: config.shippingMinor,
      discountMinor: 0, totalMinor,
      paymentMethods: supportedPaymentMethods(),
      weightKg: config.weightKg,
    });
  } catch (error) {
    if (error?.message?.startsWith("Choose a valid")) return jsonError(error.message, 400);
    if (error?.message?.includes("is not configured") || error?.message?.includes("must contain valid JSON") || error?.message?.includes("does not have enough stock")) return jsonError(error.message, 503);
    return databaseError(error);
  }
}
