"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/client-tracking";

const money = (minor, currency) => {
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(minor || 0) / 100); }
  catch { return `${currency} ${(Number(minor || 0) / 100).toFixed(2)}`; }
};

export default function ThankYouPage() {
  const search = useSearchParams();
  const orderId = search.get("orderId");
  const key = search.get("key");
  const [order, setOrder] = useState(null);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!orderId || !key) return;
    let active = true;
    fetch(`/api/orders/${encodeURIComponent(orderId)}?key=${encodeURIComponent(key)}`, { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Order details could not be loaded.");
      if (active) { setOrder(data.order); setState("ready"); }
    }).catch((reason) => { if (active) { setError(reason.message); setState("error"); } });
    return () => { active = false; };
  }, [orderId, key]);
  useEffect(() => {
    if (state !== "ready" || order?.paymentStatus !== "paid" || window.localStorage.getItem(`wd4u-purchase-${order.id}`)) return;
    trackEvent("Purchase", {
      transaction_id: order.id, value: Number(order.totalMinor) / 100, currency: order.currency,
      content_ids: order.items.map((item) => String(item.productId)),
      items: order.items.map((item) => ({ item_id: String(item.productId), item_name: item.productName, price: Number(item.priceMinor) / 100, quantity: item.quantity })),
    });
    window.localStorage.setItem(`wd4u-purchase-${order.id}`, "1");
  }, [state, order]);
  if (!orderId || !key) return <main className="confirmation-page page-width"><span className="eyebrow">ORDER CONFIRMATION</span><h1>We couldn’t load this order.</h1><p>This confirmation link is incomplete.</p><Link href="/contact" className="button button-dark">Contact support</Link></main>;
  if (state === "loading") return <main className="confirmation-page page-width"><p className="state-message">Verifying your order…</p></main>;
  if (state === "error") return <main className="confirmation-page page-width"><span className="eyebrow">ORDER CONFIRMATION</span><h1>We couldn’t load this order.</h1><p>{error}</p><Link href="/contact" className="button button-dark">Contact support</Link></main>;
  const paid = order.paymentStatus === "paid";
  return <main className="confirmation-page page-width">
    <div className={`confirmation-icon ${paid ? "confirmed" : "pending"}`}>{paid ? "✓" : "…"}</div>
    <span className="eyebrow">{paid ? "ORDER CONFIRMED" : "PAYMENT PENDING"}</span>
    <h1>{paid ? "Thank you for choosing us." : "Your order is awaiting payment confirmation."}</h1>
    <p>{paid ? "Your payment has been verified by the payment gateway. We’ll share the next steps using the contact details on your order." : "We have not received verified payment yet. The order will only be confirmed after the payment gateway reports a captured payment."}</p>
    <div className="order-receipt"><div className="summary-line"><span>Order reference</span><strong>{order.id}</strong></div>{order.items.map((item, index) => <div className="checkout-item" key={`${item.productId}-${index}`}><div className="checkout-thumb">{item.image ? <img src={item.image} alt="" /> : <span>WD</span>}<i>{item.quantity}</i></div><div><strong>{item.productName}</strong>{Object.entries(item.options || {}).filter(([, value]) => value).map(([name, value]) => <small key={name} className="receipt-option">{name}: {value}</small>)}</div><b>{money(item.priceMinor * item.quantity, order.currency)}</b></div>)}<div className="summary-line"><span>Subtotal</span><strong>{money(order.subtotalMinor, order.currency)}</strong></div><div className="summary-line"><span>Tax</span><strong>{money(order.taxMinor, order.currency)}</strong></div><div className="summary-line"><span>Shipping</span><strong>{money(order.shippingMinor, order.currency)}</strong></div><div className="summary-line summary-total"><span>Total</span><strong>{money(order.totalMinor, order.currency)}</strong></div><div className="receipt-address"><strong>Delivery address</strong><p>{order.address.house}, {order.address.street}{order.address.apartment ? `, ${order.address.apartment}` : ""}<br />{order.address.city}, {order.address.state} {order.address.postalCode}<br />{order.country}</p></div></div>
    {order.estimatedDelivery && <p className="estimated-delivery">Indicative delivery: {order.estimatedDelivery}</p>}
    <Link href="/shop" className="button button-dark">Continue shopping</Link>
  </main>;
}
