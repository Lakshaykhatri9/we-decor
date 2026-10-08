"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { COUNTRIES } from "@/lib/countries";

const CountryContext = createContext(null);

export function CountryProvider({ children }) {
  const [country, setCountry] = useState("IN");
  const [money, setMoney] = useState({ currency: "INR", fxRate: 1, configured: true });
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("wd4u-country");
      if (COUNTRIES.some((item) => item.code === saved)) setCountry(saved);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    let active = true;
    fetch(`/api/commerce/currency?country=${encodeURIComponent(country)}`).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Currency is not configured.");
      if (active) setMoney({ currency: data.currency, fxRate: data.fxRate, configured: true });
    }).catch(() => { if (active) setMoney(country === "IN" ? { currency: "INR", fxRate: 1, configured: true } : { currency: "INR", fxRate: 1, configured: false }); });
    return () => { active = false; };
  }, [country]);
  const value = useMemo(() => ({
    country,
    ...money,
    setCountry(code) {
      if (!COUNTRIES.some((item) => item.code === code)) return;
      window.localStorage.setItem("wd4u-country", code);
      setCountry(code);
    },
  }), [country, money]);
  return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>;
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (!context) throw new Error("useCountry must be used inside CountryProvider");
  return context;
}
