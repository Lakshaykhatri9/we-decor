"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { useCountry } from "@/components/CountryContext";
import { COUNTRIES } from "@/lib/countries";
import SearchBox from "@/components/SearchBox";

const links = [
  ["Interior Design", "/interior-design"], ["Event Decor", "/event-decor"], ["Shop", "/shop"], ["B2B", "/b2b"],
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useCart();
  const { country, setCountry } = useCountry();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return <>
    <div className="announcement">Thoughtful spaces, beautifully made <span>·</span> Designed around you</div>
    <header className="site-header">
      <Link href="/" className="brand-lockup" aria-label="WE DECOR 4U home"><span className="brand-mark">W</span><span><strong>WE DECOR 4U</strong><small>INTERIORS · CELEBRATIONS</small></span></Link>
      <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
        {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}
        <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
      </nav>
      <div className="header-actions">
        <SearchBox onChoose={() => setMenuOpen(false)} />
        <label className="country-select"><span className="sr-only">Delivery country</span><select value={country} onChange={(event) => setCountry(event.target.value)}>{COUNTRIES.map((item) => <option value={item.code} key={item.code}>{item.code} · {item.name}</option>)}</select></label>
        <Link href="/cart" className="cart-link" aria-label={`Shopping bag, ${count} items`}>Bag <span>{count}</span></Link>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}><span></span><span></span></button>
      </div>
    </header>
  </>;
}
