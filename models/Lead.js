import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  kind: { type: String, enum: ["contact", "b2b"], required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  company: String,
  gstin: String,
  requirements: String,
  status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
