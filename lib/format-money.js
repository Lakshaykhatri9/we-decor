export function formatBasePrice(priceInrPaise, { currency = "INR", fxRate = 1, configured = true } = {}) {
  const displayCurrency = configured ? currency : "INR";
  const amount = (Number(priceInrPaise || 0) / 100) * (configured ? Number(fxRate || 1) : 1);
  const locale = displayCurrency === "INR" ? "en-IN" : undefined;
  return {
    text: new Intl.NumberFormat(locale, { style: "currency", currency: displayCurrency, maximumFractionDigits: 2 }).format(amount),
    currency: displayCurrency,
    configured,
  };
}
