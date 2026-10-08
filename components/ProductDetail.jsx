"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import ProductCard from "@/components/ProductCard";
import { trackEvent } from "@/lib/client-tracking";
import { useCountry } from "@/components/CountryContext";
import { formatBasePrice } from "@/lib/format-money";

export default function ProductDetail({ product, related = [] }) {
  const [image, setImage] = useState(product.mainImage || product.galleryImages?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [message, setMessage] = useState("");
  const { addItem } = useCart();
  const router = useRouter();
  const moneyConfig = useCountry();
  const available = !product.previewOnly && Number(product.stock) > 0;
  useEffect(() => { if (!product.previewOnly) trackEvent("ViewContent", { content_ids: [product.id], content_name: product.name, content_category: product.category, value: Number(product.priceInrPaise) / 100, currency: "INR" }); }, [product]);
  function add(buyNow) {
    if (!available) return;
    const missing = (product.variants || []).find((variant) => variant.options?.length && !selectedOptions[variant.name]);
    if (missing) { setMessage(`Choose ${missing.name.toLowerCase()} before adding this product.`); return; }
    addItem(product, quantity, selectedOptions);
    const destination = moneyConfig.configured ? moneyConfig.currency : "INR";
    const rate = moneyConfig.configured ? moneyConfig.fxRate : 1;
    trackEvent("AddToCart", { content_ids: [product.id], content_name: product.name, value: Number(product.priceInrPaise * quantity) / 100 * rate, currency: destination, items: [{ item_id: product.id, item_name: product.name, price: Number(product.priceInrPaise) / 100 * rate, quantity }] });
    setMessage("Added to your bag.");
    if (buyNow) router.push("/checkout");
  }
  const gallery = [...new Set([product.mainImage, ...(product.galleryImages || []), ...(product.lifestyleImages || [])].filter(Boolean))];
  return <>
    <div className="breadcrumb"><Link href="/shop">Shop</Link><span>/</span><span>{product.category}</span></div>
    <div className="product-detail-layout">
      <div className="product-gallery">
        <div className="product-main-image">{image ? <img src={image} alt={product.name} /> : <div className="product-image-empty">WE DECOR 4U</div>}</div>
        {gallery.length > 1 && <div className="gallery-thumbs">{gallery.map((src, index) => <button key={src} onClick={() => setImage(src)} className={image === src ? "selected" : ""} aria-label={`View image ${index + 1}`}><img src={src} alt="" /></button>)}</div>}
      </div>
      <section className="product-detail-copy">
        <span className="eyebrow">{product.category}</span><h1>{product.name}</h1>
        {product.brand && <p className="product-brand">Designed by {product.brand}</p>}
        <p className="product-price">{product.previewOnly ? "Pricing to be confirmed" : <>{formatBasePrice(product.priceInrPaise, moneyConfig).text} <small>{moneyConfig.currency}</small></>}</p>
        <p className="tax-note">{product.previewOnly ? "This concept listing is not connected to inventory and cannot be purchased." : moneyConfig.configured ? `Destination price shown in ${moneyConfig.currency}. Applicable tax and shipping are confirmed at checkout.` : "Catalog price is shown in INR. Destination currency conversion is not configured yet."}</p>
        <p className={`detail-stock ${available ? "in-stock" : "out-stock"}`}>{product.previewOnly ? "Concept preview · not for sale" : available ? "Available to order" : "Currently unavailable"}</p>
        <div className="product-description">{product.description.split("\n").filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        {product.sku && <p className="sku-line">SKU <span>{product.sku}</span></p>}
        {product.variants?.map((variant) => <div className="variant-block" key={variant.name}><label htmlFor={`variant-${variant.name}`}>{variant.name}</label><select id={`variant-${variant.name}`} value={selectedOptions[variant.name] || ""} onChange={(event) => { setSelectedOptions({ ...selectedOptions, [variant.name]: event.target.value }); setMessage(""); }}><option value="">Choose {variant.name.toLowerCase()}</option>{variant.options?.map((option) => <option key={option}>{option}</option>)}</select></div>)}
        {!product.previewOnly && <div className="detail-actions"><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => setQuantity((n) => Math.max(1, n - 1))}>−</button><span>{quantity}</span><button aria-label="Increase quantity" disabled={quantity >= Math.min(50, product.stock || 1)} onClick={() => setQuantity((n) => Math.min(50, product.stock, n + 1))}>+</button></div><button className="button button-dark" disabled={!available} onClick={() => add(false)}>Add to bag</button><button className="button button-outline" disabled={!available} onClick={() => add(true)}>Buy now</button></div>}
        {message && <p className="form-feedback success">{message}</p>}
        <div className="product-detail-notes">{product.previewOnly ? <p><strong>Concept preview.</strong> This design is here to help shape the collection. Final product specifications, pricing, and availability need confirmation.</p> : <><p><strong>Made for your home.</strong> Product images and specifications reflect the information provided for this listing.</p><p><strong>Delivery.</strong> Shipping options and charges are calculated for your selected destination at checkout.</p></>}</div>
      </section>
    </div>
    {related.length > 0 && <section className="section related-products"><div className="section-heading"><div><span className="eyebrow">MORE TO DISCOVER</span><h2>Explore the collection</h2></div><Link href="/shop" className="text-link">View all →</Link></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
  </>;
}
