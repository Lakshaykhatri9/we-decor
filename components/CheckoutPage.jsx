"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import { useCountry } from "@/components/CountryContext";
import { getCountry } from "@/lib/countries";
import { trackEvent } from "@/lib/client-tracking";

const formatMoney = (minor, currency = "INR") => {
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(minor || 0) / 100); }
  catch { return `${currency} ${(Number(minor || 0) / 100).toFixed(2)}`; }
};

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, ready, clearCart } = useCart();
  const { country } = useCountry();
  const [shippingMethod, setShippingMethod] = useState("STANDARD");
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState("");
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState({ fullName: "", email: "", phone: "", orderUpdates: true });
  const [address, setAddress] = useState({ house: "", street: "", apartment: "", landmark: "", city: "", state: "", postalCode: "" });
  const [trackingId, setTrackingId] = useState("");
  const checkoutTracked = useRef("");
  const productIds = useMemo(() => [...new Set(items.map((item) => item.id))].join(","), [items]);
  const effectiveShippingMethod = country === "IN" ? "STANDARD" : shippingMethod === "OCEAN" ? "OCEAN" : "AIR";
  const quoteRequestKey = JSON.stringify({ items: items.map(({ id, quantity, options }) => ({ id, quantity, options })), country, shippingMethod: effectiveShippingMethod });
  const activeQuote = quote?.requestKey === quoteRequestKey ? quote : null;
  useEffect(() => {
    if (!ready || !items.length) return;
    const signature = items.map((item) => `${item.id}:${item.quantity}`).sort().join("|");
    if (checkoutTracked.current !== signature) {
      checkoutTracked.current = signature;
      trackEvent("InitiateCheckout", { content_ids: items.map((item) => item.id), num_items: items.reduce((sum, item) => sum + item.quantity, 0) });
    }
  }, [ready, items]);
  useEffect(() => {
    if (!ready || !productIds) return;
    let active = true;
    fetch(`/api/products?ids=${encodeURIComponent(productIds)}&limit=50`).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We could not confirm your cart.");
      if (active) setProducts(data.products || []);
    }).catch((error) => { if (active) setQuoteError(error.message); });
    return () => { active = false; };
  }, [ready, productIds]);
  useEffect(() => {
    if (!ready || !items.length || items.some((item) => !products.some((product) => product.id === item.id))) return;
    let active = true;
    const timer = window.setTimeout(async () => {
      setQuoteError("");
      try {
        const response = await fetch("/api/checkout/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: items.map(({ id, quantity, options }) => ({ productId: id, quantity, options })), country, shippingMethod: effectiveShippingMethod }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "A checkout quote is not available.");
        if (active) setQuote({ ...data, requestKey: quoteRequestKey });
      } catch (error) { if (active) setQuoteError(error.message); }
    }, 180);
    return () => { active = false; window.clearTimeout(timer); };
  }, [items, country, effectiveShippingMethod, quoteRequestKey, products, ready]);
  async function pay(event) {
    event.preventDefault(); setState("loading"); setMessage("");
    const loaded = await loadRazorpay();
    if (!loaded) { setState("error"); setMessage("Payment checkout could not load. Check your connection and try again."); return; }
    try {
      const response = await fetch("/api/payments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        items: items.map(({ id, quantity, options }) => ({ productId: id, quantity, options })), country, shippingMethod: effectiveShippingMethod,
        customer: { ...customer, analyticsConsent: window.localStorage.getItem("wd4u-consent") === "accepted" }, address: { ...address, country },
      }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create an order.");
      setTrackingId(data.orderId);
      setState("idle");
      const checkout = new window.Razorpay({
        key: data.keyId, order_id: data.gatewayOrderId, amount: data.amount, currency: data.currency,
        name: "WE DECOR 4U", description: "Your home and decor order", prefill: data.customer,
        theme: { color: "#183d36" },
        handler: async (payment) => {
          setState("loading");
          try {
            const result = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: data.orderId, ...payment }) });
            const verified = await result.json();
            if (!result.ok || !verified.ok) throw new Error(verified.error || "Payment verification failed.");
            clearCart();
            router.push(`/thank-you?orderId=${encodeURIComponent(data.orderId)}&key=${encodeURIComponent(data.confirmationToken)}`);
          } catch (error) { setState("error"); setMessage(error.message); }
        },
        modal: { ondismiss: () => { setState("idle"); setMessage("Payment was not completed. Your order remains pending until the payment gateway confirms it."); } },
      });
      checkout.on("payment.failed", (failure) => { setState("error"); setMessage(failure.error?.description || "Payment failed. Please try again."); });
      checkout.open();
    } catch (error) { setState("error"); setMessage(error.message); }
  }
  if (!ready) return <p className="state-message">Preparing checkout…</p>;
  if (!items.length) return <div className="empty-cart"><h2>Your bag is empty.</h2><p>Add a catalog item before continuing.</p><Link href="/shop" className="button button-dark">Explore catalog</Link></div>;
  const methods = activeQuote?.paymentMethods || [];
  const india = country === "IN";
  const countryName = getCountry(country).name;
  return <form className="checkout-layout" onSubmit={pay}>
    <div className="checkout-main">
      <section className="checkout-section"><span className="eyebrow">01 · YOUR DETAILS</span><h2>Customer information</h2><div className="form-grid">
        <label className="full-field">Full name<input required autoComplete="name" value={customer.fullName} onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })} /></label>
        <label>Email<input type="email" required autoComplete="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} /></label>
        <label>Phone with country code<input type="tel" required autoComplete="tel" placeholder={india ? "+91 98765 43210" : "+1 555 123 4567"} value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} /></label>
        <label className="checkbox-field full-field"><input type="checkbox" checked={customer.orderUpdates} onChange={(e) => setCustomer({ ...customer, orderUpdates: e.target.checked })} /> Send me order updates by email or phone</label>
      </div></section>
      <section className="checkout-section"><span className="eyebrow">02 · DELIVERY</span><h2>Delivery address</h2><div className="form-grid">
        <label>{india ? "House / flat" : "Address line 1"}<input required autoComplete="address-line1" value={address.house} onChange={(e) => setAddress({ ...address, house: e.target.value })} /></label>
        <label>{india ? "Street / area" : "Address line 2"}<input required autoComplete="address-line2" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} /></label>
        <label>Apartment / unit <span className="optional">(optional)</span><input autoComplete="address-line3" value={address.apartment} onChange={(e) => setAddress({ ...address, apartment: e.target.value })} /></label>
        <label>Landmark <span className="optional">(optional)</span><input value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} /></label>
        <label>City<input required autoComplete="address-level2" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /></label>
        <label>{india ? "State" : "State / province / region"}<input required autoComplete="address-level1" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} /></label>
        <label>{india ? "PIN code" : "Postal / ZIP code"}<input required autoComplete="postal-code" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} /></label>
        {!india && <label>Country<input value={countryName} readOnly /></label>}
        <label>Shipping method<select value={effectiveShippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>{india ? <option value="STANDARD">Standard doorstep delivery</option> : <><option value="AIR">Air freight · indicative 7–14 business days</option><option value="OCEAN">Ocean freight · indicative 30–60 business days</option></>}</select></label>
      </div><p className="checkout-hint">International import duties, VAT, customs handling and DDU/DDP terms depend on destination and are confirmed before order acceptance. Delivery ranges are indicative.</p></section>
      <section className="checkout-section"><span className="eyebrow">03 · PAYMENT</span><h2>Secure payment</h2>{methods.includes("razorpay") ? <div className="payment-method"><span className="radio-dot"></span><span><strong>Online payment</strong><small>Payment options shown by Razorpay at checkout.</small></span><span className="payment-mark">Razorpay</span></div> : <div className="notice notice-info">Online payment is not configured for this store. Add Razorpay credentials to enable checkout.</div>}</section>
      {quoteError && <div className="notice notice-error">{quoteError}<p>Checkout needs a published database catalog, approved tax/shipping rates, and currency configuration for this destination.</p></div>}
      {message && <div className="notice notice-error">{message}{trackingId && <p>Your pending order reference: {trackingId}</p>}</div>}
      <button className="button button-dark button-wide" disabled={!activeQuote || !methods.length || state === "loading"}>{state === "loading" ? "Preparing secure payment…" : activeQuote ? `Pay ${formatMoney(activeQuote.totalMinor, activeQuote.currency)}` : "Checkout unavailable"}</button>
      <small className="checkout-disclaimer">By continuing, you agree to the applicable <Link href="/terms">shop terms</Link> and <Link href="/shipping-policy">shipping policy</Link>.</small>
    </div>
    <aside className="checkout-summary"><span className="eyebrow">YOUR ORDER</span>
      {activeQuote?.items?.map((item) => <div className="checkout-item" key={`${item.productId}-${JSON.stringify(item.options || {})}`}><div className="checkout-thumb">{item.image ? <img src={item.image} alt="" /> : <span>WD</span>}<i>{item.quantity}</i></div><div><strong>{item.name}</strong><small>Qty {item.quantity}</small>{Object.entries(item.options || {}).filter(([, value]) => value).map(([name, value]) => <small key={name}>{name}: {value}</small>)}</div><b>{formatMoney(item.lineTotalMinor, activeQuote.currency)}</b></div>)}
      <div className="summary-line"><span>Subtotal</span><strong>{activeQuote ? formatMoney(activeQuote.subtotalMinor, activeQuote.currency) : "—"}</strong></div>
      <div className="summary-line"><span>Tax</span><strong>{activeQuote ? formatMoney(activeQuote.taxMinor, activeQuote.currency) : "—"}</strong></div>
      <div className="summary-line"><span>Shipping</span><strong>{activeQuote ? formatMoney(activeQuote.shippingMinor, activeQuote.currency) : "—"}</strong></div>
      <div className="summary-line summary-total"><span>Total</span><strong>{activeQuote ? formatMoney(activeQuote.totalMinor, activeQuote.currency) : "—"}</strong></div>
      <p className="summary-trust">Product prices and stock are checked again on the server before payment is created.</p>
    </aside>
  </form>;
}
