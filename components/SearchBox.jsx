"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/client-tracking";
import { useCountry } from "@/components/CountryContext";
import { formatBasePrice } from "@/lib/format-money";

export default function SearchBox({ onChoose }) {
  const moneyConfig = useCountry();
  const [query, setQuery] = useState("");
  const [state, setState] = useState("idle");
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  useEffect(() => {
    if (!query.trim()) return undefined;
    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Search is unavailable.");
        if (!active) return;
        setProducts(data.products || []);
        setState(data.products?.length ? "results" : "empty");
        trackEvent("Search", { search_string: query.trim() });
      } catch {
        if (!active) return;
        setProducts([]);
        setState("error");
      }
    }, 300);
    return () => { active = false; window.clearTimeout(timer); controller.abort(); };
  }, [query]);
  useEffect(() => {
    function close(event) { if (!boxRef.current?.contains(event.target)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return <div className="search-box" ref={boxRef}>
    <label className="sr-only" htmlFor="site-search">Search products</label>
    <input id="site-search" type="search" placeholder="Search products..." value={query} onChange={(event) => { const next = event.target.value; setQuery(next); setOpen(true); if (next.trim()) setState("loading"); else { setProducts([]); setState("idle"); } }} onFocus={() => setOpen(true)} autoComplete="off" />
    <span className="search-icon" aria-hidden="true">⌕</span>
    {open && query.trim() && <div className="search-dropdown" role="listbox" aria-label="Search results">
      {state === "loading" && <p className="search-note">Searching…</p>}
      {state === "empty" && <p className="search-note">No products found for “{query}”.</p>}
      {state === "error" && <p className="search-note">Search is unavailable right now. Please try again.</p>}
      {state === "results" && products.map((product) => <Link className="search-result" href={`/product/${product.slug}`} key={product.id} onClick={() => { setOpen(false); onChoose?.(); }}>
        {product.mainImage ? <img src={product.mainImage} alt="" /> : <span className="search-placeholder">WD</span>}
        <span><strong>{product.name}</strong><small>{product.category} · {product.stock > 0 ? "Available" : "Out of stock"}</small></span>
        <b>{formatBasePrice(product.priceInrPaise, moneyConfig).text}</b>
      </Link>)}
    </div>}
  </div>;
}
