"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import { useCountry } from "@/components/CountryContext";
import { formatBasePrice } from "@/lib/format-money";

export default function CartPage() {
  const { items, setQuantity, removeItem, ready } = useCart();
  const moneyConfig = useCountry();
  const [products, setProducts] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [quote, setQuote] = useState(null);
  const [quoteError, setQuoteError] = useState("");
  const { country } = moneyConfig;
  useEffect(() => {
    if (!ready) return;
    if (!items.length) return;
    let active = true;
    const ids = [...new Set(items.map((item) => item.id))].join(",");
    fetch(`/api/products?ids=${encodeURIComponent(ids)}&limit=50`).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Current product prices could not be checked.");
      if (active) { setProducts(data.products || []); setState("ready"); }
    }).catch((reason) => { if (active) { setError(reason.message); setState("error"); } });
    return () => { active = false; };
  }, [items, ready]);
  useEffect(() => {
    if (!ready || !items.length) return;
    let active = true;
    fetch("/api/checkout/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: items.map(({ id, quantity, options }) => ({ productId: id, quantity, options })), country, shippingMethod: country === "IN" ? "STANDARD" : "AIR" }) }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Taxes and shipping are not configured for this destination.");
      if (active) { setQuote(data); setQuoteError(""); }
    }).catch((reason) => { if (active) { setQuote(null); setQuoteError(reason.message); } });
    return () => { active = false; };
  }, [items, country, ready]);
  const byId = new Map(products.map((product) => [product.id, product]));
  const itemTotal = items.reduce((sum, item) => sum + (Number(byId.get(item.id)?.priceInrPaise || 0) * item.quantity), 0);
  const missing = items.some((item) => !byId.has(item.id));
  if (!ready) return <p className="state-message">Checking your bag…</p>;
  if (!items.length) return <div className="empty-cart"><span className="empty-mark">✳</span><h2>Your bag is taking a little breather.</h2><p>Explore the collection and add something you love.</p><Link href="/shop" className="button button-dark">Explore catalog</Link></div>;
  if (state === "loading") return <p className="state-message">Checking your bag…</p>;
  return <div className="cart-layout">
    <div className="cart-items"><div className="cart-heading"><span className="eyebrow">YOUR SELECTION</span><span>{items.reduce((count, item) => count + item.quantity, 0)} items</span></div>
      {state === "error" && <div className="notice notice-error">{error}<p>Checkout is unavailable until current database prices can be confirmed.</p></div>}
      {items.map((item) => {
        const product = byId.get(item.id);
        return <article className="cart-row" key={item.key || item.id}>
          <Link href={product ? `/product/${product.slug}` : "/shop"} className="cart-thumb">{product?.mainImage ? <img src={product.mainImage} alt={product.name} /> : <span>WD</span>}</Link>
          <div className="cart-row-main"><h3>{product?.name || item.name || "Product"}</h3><small>{product?.category || "Catalog product"}</small>{Object.entries(item.options || {}).filter(([, value]) => value).map(([name, value]) => <small key={name}>{name}: {value}</small>)}<div className="quantity-control"><button onClick={() => setQuantity(item.key || item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button><span>{item.quantity}</span><button onClick={() => setQuantity(item.key || item.id, item.quantity + 1)} aria-label="Increase quantity" disabled={item.quantity >= 50}>+</button></div><button className="text-button" onClick={() => removeItem(item.key || item.id)}>Remove</button></div>
          <strong className="cart-line-price">{product ? formatBasePrice(product.priceInrPaise * item.quantity, moneyConfig).text : "Unavailable"}</strong>
        </article>;
      })}
      <Link href="/shop" className="text-link">← Continue shopping</Link>
    </div>
    <aside className="cart-summary"><span className="eyebrow">ORDER SUMMARY</span><div className="summary-line"><span>Items subtotal</span><strong>{quote ? new Intl.NumberFormat(undefined, { style: "currency", currency: quote.currency }).format(quote.subtotalMinor / 100) : formatBasePrice(itemTotal, moneyConfig).text}</strong></div><div className="summary-line"><span>GST / tax</span><strong>{quote ? new Intl.NumberFormat(undefined, { style: "currency", currency: quote.currency }).format(quote.taxMinor / 100) : "Calculated at checkout"}</strong></div><div className="summary-line"><span>Shipping</span><strong>{quote ? new Intl.NumberFormat(undefined, { style: "currency", currency: quote.currency }).format(quote.shippingMinor / 100) : "Calculated at checkout"}</strong></div><div className="summary-line"><span>Discount</span><strong>{quote ? new Intl.NumberFormat(undefined, { style: "currency", currency: quote.currency }).format(quote.discountMinor / 100) : "—"}</strong></div><div className="summary-line summary-total"><span>Estimated total</span><strong>{quote ? new Intl.NumberFormat(undefined, { style: "currency", currency: quote.currency }).format(quote.totalMinor / 100) : "Available at checkout"}</strong></div><p>{quoteError || "Tax and shipping use the configured rates for your delivery country."}</p>
      <Link href="/checkout" aria-disabled={state !== "ready" || missing} className={`button button-dark button-wide ${state !== "ready" || missing ? "is-disabled" : ""}`} onClick={(event) => { if (state !== "ready" || missing) event.preventDefault(); }}>Proceed to checkout</Link>
      {missing && <small className="checkout-note">One or more products are no longer published or available.</small>}
      <small className="checkout-note">Final prices are verified by the server before payment.</small>
    </aside>
  </div>;
}
