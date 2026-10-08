import dbConnect from "@/lib/db";
import Lead from "@/models/Lead";
import { cleanText, databaseError, isEmail, isPhone, jsonError, readJson } from "@/lib/http";

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
  try {
    await dbConnect();
    const lead = await Lead.create({
      kind: body.kind, name, email, phone, requirements,
      company: cleanText(body.company, 180), gstin: cleanText(body.gstin, 30).toUpperCase(),
    });
    return Response.json({ ok: true, id: String(lead._id) }, { status: 201 });
  } catch (error) {
    return databaseError(error);
  }
}
