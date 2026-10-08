import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { confirmCapturedOrder } from "@/lib/order-confirmation";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { sendVerifiedPurchase } from "@/lib/meta-capi";
import { jsonError } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request) {
  const raw = await request.text();
  if (!verifyWebhookSignature(raw, request.headers.get("x-razorpay-signature"))) return jsonError("Invalid webhook signature.", 401);
  let event;
  try { event = JSON.parse(raw); } catch { return jsonError("Invalid webhook payload."); }
  if (event.event !== "payment.captured") return Response.json({ ok: true, ignored: true });
  const payment = event.payload?.payment?.entity;
  if (!payment?.order_id || !payment?.id || payment.status !== "captured") return jsonError("Payment event is incomplete.");
  try {
    await dbConnect();
    const order = await Order.findOne({ gatewayOrderId: payment.order_id });
    if (!order) return jsonError("Order not found.", 404);
    if (Number(payment.amount) !== Number(order.totalMinor) || payment.currency !== order.currency) return jsonError("Payment amount does not match the order.", 409);
    const confirmed = await confirmCapturedOrder({ orderId: order._id, gatewayOrderId: payment.order_id, paymentId: payment.id, amount: payment.amount, currency: payment.currency });
    if (confirmed) await sendVerifiedPurchase(confirmed).catch(() => {});
    return Response.json({ ok: true });
  } catch {
    return jsonError("Unable to process the payment event.", 503);
  }
}
