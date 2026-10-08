import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";
import { cleanText, isEmail, isPhone, jsonError, readJson } from "@/lib/http";
import { sendBusinessNotification } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request) {
  const body = await readJson(request);
  if (!body || !["contact", "b2b"].includes(body.kind)) return jsonError("Choose a valid enquiry type.");
  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 180).toLowerCase();
  const phone = cleanText(body.phone, 40);
  if (!name || !isEmail(email) || !isPhone(phone)) return jsonError("Enter your name, a valid email, and phone number.");
  const requirements = cleanText(body.requirements, 3000);
  if (!requirements) return jsonError("Please tell us how we can help.");
  const data = {
    kind: body.kind, name, email, phone, requirements,
    company: cleanText(body.company, 180), gstin: cleanText(body.gstin, 30).toUpperCase(),
  };
  let emailSent = false;
  let emailError;
  try {
    const isB2b = data.kind === "b2b";
    await sendBusinessNotification({
      subject: `[WE DECOR 4U] ${isB2b ? "B2B quote" : "Contact"} enquiry from ${name}`,
      replyTo: email,
      fields: {
        "Enquiry type": isB2b ? "B2B quote" : "Contact",
        Name: name, Email: email, Phone: phone,
        Company: data.company, GSTIN: data.gstin, Requirements: requirements,
      },
    });
    emailSent = true;
  } catch (error) { emailError = error; }

  let stored = false;
  if (process.env.MONGODB_URI) {
    try {
      await dbConnect();
      const lead = await Lead.create(data);
      stored = Boolean(lead?._id);
    } catch { console.error("Unable to store a contact or B2B lead in MongoDB."); }
  }
  if (!emailSent && !stored) {
    const message = emailError?.message || "Your enquiry could not be delivered or stored. Please try again later.";
    return jsonError(message, 503);
  }
  const message = emailSent
    ? stored ? "Your enquiry was emailed to the team and saved." : "Your enquiry was emailed to the team; database storage is not configured."
    : "Your enquiry was saved, but the email notification could not be sent.";
  return Response.json({ ok: true, emailSent, stored, message }, { status: 201 });
}
