import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customer: {
    fullName: { type: String, required: true },
    firstName: String,
    lastName: String,
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    orderUpdates: { type: Boolean, default: false },
    analyticsConsent: { type: Boolean, default: false },
    country: { type: String, required: true },
  },
  address: {
    house: String, street: String, apartment: String, landmark: String,
    city: String, state: String, postalCode: String,
  },
  country: { type: String, required: true },
  currency: { type: String, required: true },
  shippingMethod: String,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: String, slug: String, quantity: Number,
    priceMinor: Number, image: String, options: mongoose.Schema.Types.Mixed,
  }],
  subtotalMinor: Number,
  taxMinor: Number,
  shippingMinor: Number,
  discountMinor: { type: Number, default: 0 },
  totalMinor: Number,
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending", index: true },
  paymentId: String,
  gatewayOrderId: { type: String, index: true },
  confirmationTokenHash: { type: String, required: true },
  stockCommittedAt: Date,
  inventoryIssue: String,
  orderStatus: { type: String, enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
  estimatedDelivery: String,
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
