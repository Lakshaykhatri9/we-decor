"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState(["All"]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  useEffect(() => {
    let active = true;
    fetch(`/api/products?limit=24&page=1${category === "All" ? "" : `&category=${encodeURIComponent(category)}`}`).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Catalog is unavailable.");
      if (active) { setProducts(data.products || []); setCategories(["All", ...(data.categories || [])]); setHasMore(data.hasMore); setPage(1); setState("ready"); }
    }).catch((reason) => { if (active) { setError(reason.message); setState("error"); } });
    return () => { active = false; };
  }, [category]);
  async function loadMore() {
    setMoreLoading(true);
    try {
      const response = await fetch(`/api/products?limit=24&page=${page + 1}${category === "All" ? "" : `&category=${encodeURIComponent(category)}`}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "More products could not be loaded.");
      setProducts((current) => [...current, ...(data.products || [])]);
      setPage(data.page);
      setHasMore(data.hasMore);
      setError("");
    } catch (reason) { setError(reason.message); }
    finally { setMoreLoading(false); }
  }
  function changeCategory(value) { setProducts([]); setError(""); setState("loading"); setCategory(value); }
  return <>
    <div className="catalog-tools"><div><span className="eyebrow">THE COLLECTION</span><h2>Made for living</h2></div><label>Filter by <select value={category} onChange={(event) => changeCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label></div>
    {state === "loading" && <p className="state-message">Loading the collection…</p>}
    {state === "error" && <div className="state-message state-error"><strong>We couldn’t load the catalog.</strong><p>{error}</p><p>Connect the product database to publish your collection.</p></div>}
    {state === "ready" && products.length === 0 && <div className="empty-catalog"><span className="empty-mark">✳</span><h3>Something considered is on its way.</h3><p>There are no published products in this collection yet. Add products through your database to begin selling.</p></div>}
    {state === "ready" && products.length > 0 && <><div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>{hasMore && <div className="load-more-wrap"><button className="button button-outline" onClick={loadMore} disabled={moreLoading}>{moreLoading ? "Loading…" : "Load more"}</button>{error && <p className="form-feedback error">{error}</p>}</div>}</>}
  </>;
}
