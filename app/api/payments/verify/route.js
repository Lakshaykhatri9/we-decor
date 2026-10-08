import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { verifyCheckoutSignature, getGatewayPayment } from "@/lib/razorpay";
import { confirmCapturedOrder } from "@/lib/order-confirmation";
import { sendVerifiedPurchase } from "@/lib/meta-capi";
import { databaseError, jsonError, readJson } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request) {
  const body = await readJson(request);
  const orderId = String(body?.orderId || "");
  const gatewayOrderId = String(body?.razorpay_order_id || "");
  const paymentId = String(body?.razorpay_payment_id || "");
  const signature = String(body?.razorpay_signature || "");
  if (!/^[a-f\d]{24}$/i.test(orderId) || !gatewayOrderId || !paymentId || !signature) return jsonError("Payment details are incomplete.", 400);
  try {
    await dbConnect();
    const order = await Order.findById(orderId);
    if (!order || order.gatewayOrderId !== gatewayOrderId) return jsonError("Order not found.", 404);
    if (!verifyCheckoutSignature(order.gatewayOrderId, paymentId, signature)) return jsonError("Payment signature verification failed.", 401);
    if (order.paymentStatus === "paid") return Response.json({ ok: true, orderId: String(order._id) });
    const payment = await getGatewayPayment(paymentId);
    if (payment.order_id !== gatewayOrderId || payment.status !== "captured" || Number(payment.amount) !== Number(order.totalMinor) || payment.currency !== order.currency) {
      return jsonError("The payment has not been captured for this order.", 409);
    }
    const confirmed = await confirmCapturedOrder({ orderId: order._id, gatewayOrderId, paymentId, amount: payment.amount, currency: payment.currency });
    if (confirmed) await sendVerifiedPurchase(confirmed).catch(() => {});
    return Response.json({ ok: true, orderId: String(order._id) });
  } catch (error) {
    if (error?.message?.includes("Razorpay is not configured")) return jsonError(error.message, 503);
    return databaseError(error);
  }
}
