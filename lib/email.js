const API_URL = "https://api.resend.com/emails";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

export async function sendBusinessNotification({ subject, replyTo, fields }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.BUSINESS_EMAIL;
  if (!apiKey || !from || !to) {
    throw new Error("Email notifications are not configured. Set RESEND_API_KEY, EMAIL_FROM, and BUSINESS_EMAIL.");
  }

  const rows = Object.entries(fields).filter(([, value]) => value !== undefined && value !== null && String(value).trim());
  const text = ["WE DECOR 4U enquiry", "", ...rows.map(([label, value]) => `${label}: ${String(value).trim()}`)].join("\n");
  const htmlRows = rows.map(([label, value]) => `<tr><th align="left" style="padding:8px;border-bottom:1px solid #e7e3da">${escapeHtml(label)}</th><td style="padding:8px;border-bottom:1px solid #e7e3da;white-space:pre-wrap">${escapeHtml(String(value).trim())}</td></tr>`).join("");
  const email = {
    from,
    to: [to],
    subject: String(subject).replace(/[\r\n]+/g, " ").slice(0, 180),
    text,
    html: `<div style="font-family:Arial,sans-serif;color:#25342e;max-width:680px"><h1 style="font-size:20px">New WE DECOR 4U enquiry</h1><table style="border-collapse:collapse;width:100%">${htmlRows}</table></div>`,
    ...(replyTo ? { reply_to: replyTo } : {}),
  };

  let response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(email),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    throw new Error("The email provider could not be reached. Please try again later.");
  }
  if (!response.ok) {
    console.error("Resend rejected a WE DECOR 4U enquiry notification.", response.status);
    throw new Error("The email provider could not send this notification. Check its sender and API configuration.");
  }
  return response.json();
}
