import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  brand: String,
  sku: { type: String, sparse: true, unique: true },
  tags: [String],
  priceInrPaise: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  weightKg: { type: Number, default: 0, min: 0 },
  dimensions: { lengthCm: Number, widthCm: Number, heightCm: Number },
  mainImage: String,
  galleryImages: [String],
  lifestyleImages: [String],
  variants: [{ name: String, options: [String] }],
  active: { type: Boolean, default: true, index: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
