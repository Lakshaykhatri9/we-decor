import { createHash, randomBytes } from "node:crypto";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { calculateTax, calculateTotal, safeQuantity } from "@/lib/commerce.mjs";
import { getCheckoutConfig, supportedPaymentMethods } from "@/lib/shipping";
import { createGatewayOrder } from "@/lib/razorpay";
import { cleanText, databaseError, isEmail, isPhone, jsonError, readJson } from "@/lib/http";

export const runtime = "nodejs";

function validateAddress(address, country) {
  const required = ["house", "street", "city", "state", "postalCode"];
  if (country !== "IN") required.push("country");
  return required.every((key) => cleanText(address?.[key], 180));
}

export async function POST(request) {
  if (!supportedPaymentMethods().includes("razorpay")) return jsonError("Online payment is not configured yet.", 503);
  const body = await readJson(request);
  const customer = body?.customer || {};
  const address = body?.address || {};
  const countryCode = String(body?.country || "IN").toUpperCase();
  if (!body || !Array.isArray(body.items) || !body.items.length) return jsonError("Your cart is empty.");
  if (!cleanText(customer.fullName, 160) || !isEmail(customer.email) || !isPhone(customer.phone)) return jsonError("Enter valid customer name, email, and phone details.");
  if (!validateAddress(address, countryCode)) return jsonError("Complete the required delivery address fields.");
  const requested = new Map();
  for (const row of body.items) {
    const id = String(row?.productId || "");
    const quantity = safeQuantity(row?.quantity);
    if (!/^[a-f\d]{24}$/i.test(id) || !quantity) return jsonError("A cart item or quantity is invalid.");
    requested.set(id, (requested.get(id) || 0) + quantity);
  }
  try {
    await dbConnect();
    const products = await Product.find({ _id: { $in: [...requested.keys()] }, active: true }).lean();
    if (products.length !== requested.size) return jsonError("One or more products are no longer available.", 409);
    for (const product of products) {
      const quantity = requested.get(String(product._id));
      if (product.stock < quantity) return jsonError(`${product.name} does not have enough stock.`, 409);
    }
    const config = getCheckoutConfig(countryCode, body.shippingMethod, products, requested);
    const productById = new Map(products.map((product) => [String(product._id), product]));
    const items = body.items.map((row) => {
      const product = productById.get(String(row.productId));
      const quantity = safeQuantity(row.quantity);
      if (!product || !quantity) throw new Error("A cart item or quantity is invalid.");
      return {
        productId: product._id,
        productName: product.name,
        slug: product.slug,
        quantity,
        priceMinor: Math.round(Number(product.priceInrPaise) * config.fxRate),
        image: product.mainImage || "",
        options: Object.fromEntries((product.variants || []).map((variant) => {
          const chosen = cleanText(row.options?.[variant.name], 100);
          if (variant.options?.length && !variant.options.includes(chosen)) throw new Error(`Choose a valid ${variant.name.toLowerCase()} for ${product.name}.`);
          return [variant.name, chosen];
        })),
      };
    });
    const subtotalMinor = items.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0);
    const taxMinor = calculateTax(subtotalMinor, config.taxRate);
    const totalMinor = calculateTotal(subtotalMinor, taxMinor, config.shippingMinor);
    const token = randomBytes(32).toString("hex");
    const [firstName, ...lastParts] = cleanText(customer.fullName, 160).split(/\s+/);
    const order = await Order.create({
      customer: {
        fullName: cleanText(customer.fullName, 160), firstName, lastName: lastParts.join(" "),
        email: cleanText(customer.email, 180).toLowerCase(), phone: cleanText(customer.phone, 40),
        orderUpdates: Boolean(customer.orderUpdates), analyticsConsent: Boolean(customer.analyticsConsent), country: countryCode,
      },
      address: Object.fromEntries(["house", "street", "apartment", "landmark", "city", "state", "postalCode"].map((key) => [key, cleanText(address[key], 180)])),
      country: countryCode, currency: config.currency, shippingMethod: config.shippingMethod, items,
      subtotalMinor, taxMinor, shippingMinor: config.shippingMinor, discountMinor: 0, totalMinor,
      estimatedDelivery: countryCode === "IN" ? undefined : config.shippingMethod === "AIR" ? "7–14 business days (indicative)" : "30–60 business days (indicative)",
      paymentStatus: "pending", orderStatus: "pending",
      confirmationTokenHash: createHash("sha256").update(token).digest("hex"),
    });
    try {
      const gatewayOrder = await createGatewayOrder({ amount: totalMinor, currency: config.currency, receipt: String(order._id) });
      order.gatewayOrderId = gatewayOrder.id;
      await order.save();
      return Response.json({
        orderId: String(order._id), confirmationToken: token,
        gatewayOrderId: gatewayOrder.id, keyId: process.env.RAZORPAY_KEY_ID,
        amount: gatewayOrder.amount, currency: gatewayOrder.currency,
        customer: { name: order.customer.fullName, email: order.customer.email, contact: order.customer.phone },
      }, { status: 201 });
    } catch (error) {
      order.paymentStatus = "failed";
      await order.save();
      return jsonError(error.message || "Unable to start payment.", 502);
    }
  } catch (error) {
      if (error?.message?.startsWith("Choose a valid")) return jsonError(error.message, 400);
    if (error?.message?.includes("is not configured") || error?.message?.includes("must contain valid JSON")) return jsonError(error.message, 503);
    return databaseError(error);
  }
}
