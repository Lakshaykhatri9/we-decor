"use client";

export function trackEvent(name, parameters = {}) {
  if (typeof window === "undefined" || window.localStorage.getItem("wd4u-consent") !== "accepted") return;
  if (typeof window.gtag !== "function" && typeof window.fbq !== "function") {
    window.__wd4uPendingEvents = window.__wd4uPendingEvents || [];
    window.__wd4uPendingEvents.push({ name, parameters });
    return;
  }
  const googleName = ({ PageView: "page_view", ViewContent: "view_item", AddToCart: "add_to_cart", InitiateCheckout: "begin_checkout", Lead: "generate_lead", Purchase: "purchase", Search: "search" })[name] || name.toLowerCase();
  if (typeof window.gtag === "function") window.gtag("event", googleName, parameters);
  if (typeof window.fbq === "function") window.fbq("track", name, parameters);
}
