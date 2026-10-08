import mongoose from "mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function confirmCapturedOrder({ orderId, gatewayOrderId, paymentId, amount, currency }) {
  const session = await mongoose.startSession();
  let confirmed = null;
  try {
    await session.withTransaction(async () => {
      const order = await Order.findOne({ _id: orderId, gatewayOrderId, paymentStatus: { $ne: "paid" } }).session(session);
      if (!order) return;
      if (Number(order.totalMinor) !== Number(amount) || order.currency !== currency) throw new Error("Payment amount does not match the order.");
      for (const item of order.items) {
        const result = await Product.updateOne(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session },
        );
        if (result.modifiedCount !== 1) throw new Error("inventory_unavailable");
      }
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = paymentId;
      order.stockCommittedAt = new Date();
      await order.save({ session });
      confirmed = order.toObject();
    });
  } catch (error) {
    if (error.message === "inventory_unavailable") {
      const order = await Order.findOneAndUpdate(
        { _id: orderId, gatewayOrderId, paymentStatus: { $ne: "paid" } },
        { $set: { paymentStatus: "paid", paymentId, orderStatus: "pending", inventoryIssue: "Stock changed after checkout; manual fulfilment review required." } },
        { new: true },
      );
      confirmed = order?.toObject() || null;
    } else {
      throw error;
    }
  } finally {
    await session.endSession();
  }
  return confirmed;
}
