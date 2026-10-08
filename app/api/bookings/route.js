import dbConnect from "@/lib/db";
import Booking from "@/models/Booking";
import { cleanText, isEmail, isPhone, jsonError, readJson } from "@/lib/http";
import { sendBusinessNotification } from "@/lib/email";

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
  let emailSent = false;
  let emailError;
  try {
    const isEvent = data.kind === "event";
    await sendBusinessNotification({
      subject: `[WE DECOR 4U] ${isEvent ? "Event decor" : "Interior consultation"} enquiry from ${name}`,
      replyTo: email,
      fields: {
        "Enquiry type": isEvent ? "Event decor" : "Interior consultation / site survey",
        Name: name, Email: email, Phone: phone,
        "Property type": data.propertyType, "Project type": data.projectType,
        Location: data.location, Budget: data.budget,
        "Preferred survey date": data.preferredDate?.toISOString(),
        "Event type": data.eventType, "Event date": data.eventDate?.toISOString(),
        Venue: data.venue, "Expected guests": data.expectedGuests,
        Requirements: data.requirements, Message: data.message,
      },
    });
    emailSent = true;
  } catch (error) { emailError = error; }

  let stored = false;
  if (process.env.MONGODB_URI) {
    try {
      await dbConnect();
      const booking = await Booking.create(data);
      stored = Boolean(booking?._id);
    } catch { console.error("Unable to store a booking enquiry in MongoDB."); }
  }
  if (!emailSent && !stored) {
    const message = emailError?.message || "Your booking request could not be delivered or stored. Please try again later.";
    return jsonError(message, 503);
  }
  const message = emailSent
    ? stored ? "Your request was emailed to the team and saved." : "Your request was emailed to the team; database storage is not configured."
    : "Your request was saved, but the email notification could not be sent.";
  return Response.json({ ok: true, emailSent, stored, message }, { status: 201 });
}
