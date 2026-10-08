import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  kind: { type: String, enum: ["interior", "event"], required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, required: true },
  propertyType: String,
  projectType: String,
  location: String,
  budget: String,
  preferredDate: Date,
  eventType: String,
  eventDate: Date,
  venue: String,
  expectedGuests: Number,
  requirements: String,
  message: String,
  status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
