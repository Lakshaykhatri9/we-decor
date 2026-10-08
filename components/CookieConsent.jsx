"use client";

import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(!window.localStorage.getItem("wd4u-consent")), 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  function choose(value) {
    window.localStorage.setItem("wd4u-consent", value);
    window.dispatchEvent(new Event("wd4u-consent"));
    setVisible(false);
  }
  return <aside className="cookie-banner" aria-label="Cookie preferences">
    <div><strong>Your privacy matters.</strong><p>Essential storage keeps your cart and country preference. Optional analytics helps us understand site use.</p></div>
    <div className="cookie-actions"><button className="button button-dark" onClick={() => choose("accepted")}>Accept optional cookies</button><button className="button button-light" onClick={() => choose("essential")}>Essential only</button></div>
  </aside>;
}
