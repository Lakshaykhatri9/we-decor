export function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function databaseError(error) {
  if (error?.message?.includes("MONGODB_URI")) return jsonError(error.message, 503);
  return jsonError("The service is temporarily unavailable. Please try again shortly.", 503);
}

export function cleanText(value, max = 500) {
  return typeof value === "string" ? value.trim().replace(/[<>]/g, "").slice(0, max) : "";
}

export function isEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isPhone(value) {
  return typeof value === "string" && /^[+\d][\d\s().-]{6,24}$/.test(value.trim());
}
