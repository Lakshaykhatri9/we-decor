import { createHash } from "node:crypto";

const normalize = (value) => String(value || "").trim().toLowerCase();
const hash = (value) => createHash("sha256").update(normalize(value)).digest("hex");

export async function sendVerifiedPurchase(order) {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const version = process.env.META_CAPI_API_VERSION;
  if (!token || !pixelId || !version || !order.customer?.analyticsConsent) return;
  const url = new URL(`https://graph.facebook.com/${version}/${pixelId}/events`);
  url.searchParams.set("access_token", token);
  const customer = order.customer || {};
  const userData = {};
  if (customer.email) userData.em = [hash(customer.email)];
  if (customer.phone) userData.ph = [hash(customer.phone.replace(/\D/g, ""))];
  if (customer.firstName) userData.fn = [hash(customer.firstName)];
  if (customer.lastName) userData.ln = [hash(customer.lastName)];
  if (customer.country) userData.country = [hash(customer.country)];
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [{
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      event_id: String(order._id),
      action_source: "website",
      event_source_url: process.env.SITE_URL ? `${process.env.SITE_URL}/thank-you` : undefined,
      user_data: userData,
      custom_data: {
        currency: order.currency,
        value: order.totalMinor / 100,
        order_id: String(order._id),
        content_type: "product",
        content_ids: order.items.map((item) => String(item.productId)),
        num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    }] }),
  });
  if (!response.ok) console.error("Meta CAPI rejected a verified purchase event.");
}
