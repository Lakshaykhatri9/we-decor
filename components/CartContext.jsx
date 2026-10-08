"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(window.localStorage.getItem("wd4u-cart") || "[]");
        if (Array.isArray(saved)) setItems(saved.filter((item) => item?.id && Number.isInteger(item.quantity) && item.quantity > 0).map((item) => ({ ...item, options: item.options || {}, key: item.key || `${item.id}:${JSON.stringify(item.options || {})}` })));
      } catch { setItems([]); }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (ready) window.localStorage.setItem("wd4u-cart", JSON.stringify(items));
  }, [items, ready]);
  const addItem = useCallback((product, quantity = 1, options = null) => {
    const id = String(product.id || product._id);
    if (!id) return;
    const normalizedOptions = Object.fromEntries(Object.entries(options || {}).filter(([, value]) => value).sort(([a], [b]) => a.localeCompare(b)));
    const key = `${id}:${JSON.stringify(normalizedOptions)}`;
    setItems((current) => {
      const found = current.find((item) => item.key === key);
      if (found) return current.map((item) => item.key === key ? { ...item, quantity: Math.min(50, item.quantity + quantity) } : item);
      return [...current, { key, id, slug: product.slug, name: product.name, image: product.mainImage || "", priceInrPaise: product.priceInrPaise, quantity, options: normalizedOptions }];
    });
  }, []);
  const setQuantity = useCallback((key, quantity) => {
    setItems((current) => quantity < 1 ? current.filter((item) => item.key !== key) : current.map((item) => item.key === key ? { ...item, quantity: Math.min(50, quantity) } : item));
  }, []);
  const removeItem = useCallback((key) => setItems((current) => current.filter((item) => item.key !== key)), []);
  const clearCart = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, ready, addItem, setQuantity, removeItem, clearCart }), [items, ready, addItem, setQuantity, removeItem, clearCart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
