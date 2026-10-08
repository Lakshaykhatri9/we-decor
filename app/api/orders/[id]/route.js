import { createHash } from "node:crypto";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { databaseError, jsonError } from "@/lib/http";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { id } = await params;
  const key = new URL(request.url).searchParams.get("key") || "";
  if (!/^[a-f\d]{24}$/i.test(id) || key.length < 32) return jsonError("Order not found.", 404);
  try {
    await dbConnect();
    const order = await Order.findById(id).lean();
    const hash = createHash("sha256").update(key).digest("hex");
    if (!order || order.confirmationTokenHash !== hash) return jsonError("Order not found.", 404);
    return Response.json({ order: {
      id: String(order._id), paymentStatus: order.paymentStatus, orderStatus: order.orderStatus,
      customer: { fullName: order.customer.fullName, email: order.customer.email },
      address: order.address, country: order.country, currency: order.currency,
      items: order.items, subtotalMinor: order.subtotalMinor, taxMinor: order.taxMinor,
      shippingMinor: order.shippingMinor, discountMinor: order.discountMinor, totalMinor: order.totalMinor,
      estimatedDelivery: order.estimatedDelivery, createdAt: order.createdAt,
    } });
  } catch (error) {
    return databaseError(error);
  }
}
