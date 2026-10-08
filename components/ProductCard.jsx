"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { trackEvent } from "@/lib/client-tracking";
import { useCountry } from "@/components/CountryContext";
import { formatBasePrice } from "@/lib/format-money";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const moneyConfig = useCountry();
  const [added, setAdded] = useState(false);
  function addToBag(buyNow = false) {
    if (product.variants?.some((variant) => variant.options?.length)) {
      router.push(`/product/${product.slug}`);
      return;
    }
    addItem(product);
    const destination = moneyConfig.configured ? moneyConfig.currency : "INR";
    const rate = moneyConfig.configured ? moneyConfig.fxRate : 1;
    trackEvent("AddToCart", { content_ids: [product.id], content_name: product.name, value: Number(product.priceInrPaise) / 100 * rate, currency: destination, items: [{ item_id: product.id, item_name: product.name, price: Number(product.priceInrPaise) / 100 * rate, quantity: 1 }] });
    if (buyNow) window.location.assign("/checkout");
    else { setAdded(true); window.setTimeout(() => setAdded(false), 1600); }
  }
  return <article className="product-card">
    <Link href={`/product/${product.slug}`} className="product-image-link" aria-label={`View ${product.name}`}>
      {product.mainImage ? <img src={product.mainImage} alt={product.name} loading="lazy" /> : <span className="product-image-empty">WE DECOR 4U</span>}
      <span className={`stock-badge ${product.stock > 0 ? "available" : "unavailable"}`}>{product.stock > 0 ? "Available" : "Out of stock"}</span>
    </Link>
    <div className="product-card-copy"><div><small>{product.category}</small><h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3><b>{formatBasePrice(product.priceInrPaise, moneyConfig).text}</b><small>{moneyConfig.configured ? `${moneyConfig.currency} · taxes calculated at checkout` : "INR base price · destination currency not configured"}</small></div>
      <div className="product-card-buttons"><button className="add-icon" disabled={product.stock < 1} onClick={() => addToBag(false)} aria-label={product.variants?.length ? `Choose options for ${product.name}` : `Add ${product.name} to cart`}>{added ? "✓" : product.variants?.length ? "↗" : "+"}</button><button className="quick-buy" disabled={product.stock < 1} onClick={() => addToBag(true)}>{product.variants?.length ? "Options" : "Buy now"}</button></div></div>
  </article>;
}
