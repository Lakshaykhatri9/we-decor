import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import { cleanText, databaseError, isEmail, isPhone, jsonError, readJson } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(request) {
  const body = await readJson(request);
  if (!body || !["interior", "event"].includes(body.kind)) return jsonError("Choose a valid enquiry type.");
  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 180).toLowerCase();
  const phone = cleanText(body.phone, 40);
  if (!name || !isEmail(email) || !isPhone(phone)) return jsonError("Enter your name, a valid email, and phone number.");
  const data = {
    kind: body.kind, name, email, phone,
    propertyType: cleanText(body.propertyType, 100), projectType: cleanText(body.projectType, 120),
    location: cleanText(body.location, 200), budget: cleanText(body.budget, 100),
    eventType: cleanText(body.eventType, 120), venue: cleanText(body.venue, 200),
    requirements: cleanText(body.requirements, 2000), message: cleanText(body.message, 2000),
    preferredDate: body.preferredDate ? new Date(body.preferredDate) : undefined,
    eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
    expectedGuests: body.expectedGuests ? Number(body.expectedGuests) : undefined,
  };
  if ((data.preferredDate && Number.isNaN(data.preferredDate.getTime())) || (data.eventDate && Number.isNaN(data.eventDate.getTime()))) return jsonError("Enter a valid date.");
  if (data.expectedGuests !== undefined && (!Number.isInteger(data.expectedGuests) || data.expectedGuests < 1 || data.expectedGuests > 100000)) return jsonError("Enter a valid guest count.");
  if (body.kind === "event" && (!data.eventType || !data.eventDate || !data.venue)) return jsonError("Event type, date, and venue are required.");
  try {
    await dbConnect();
    const booking = await Booking.create(data);
    return Response.json({ ok: true, id: String(booking._id) }, { status: 201 });
  } catch (error) {
    return databaseError(error);
  }
}
