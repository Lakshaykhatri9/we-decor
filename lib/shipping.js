import { COUNTRIES, getCountry } from "./countries";

function parseJsonEnv(key) {
  try {
    return JSON.parse(process.env[key] || "{}");
  } catch {
    throw new Error(`${key} must contain valid JSON.`);
  }
}

export function getCheckoutConfig(countryCode, method, products, quantities) {
  if (!COUNTRIES.some((country) => country.code === countryCode)) throw new Error("This delivery country is not supported.");
  const country = getCountry(countryCode);
  const taxes = parseJsonEnv("TAX_RATES_JSON");
  const shipping = parseJsonEnv("SHIPPING_RATES_JSON");
  const fx = parseJsonEnv("FX_RATES_JSON");
  const taxRate = taxes[country.code];
  if (!Number.isFinite(Number(taxRate)) || Number(taxRate) < 0) {
    throw new Error(`Checkout tax for ${country.name} is not configured.`);
  }
  const selectedMethod = method || (country.code === "IN" ? "STANDARD" : "AIR");
  const shippingRate = shipping[country.code]?.[selectedMethod];
  if (!shippingRate || !Number.isFinite(Number(shippingRate.baseMinor)) || Number(shippingRate.baseMinor) < 0 || !Number.isFinite(Number(shippingRate.perKgMinor)) || Number(shippingRate.perKgMinor) < 0) {
    throw new Error(`Shipping rates for ${country.name} (${selectedMethod}) are not configured.`);
  }
  const exchange = country.code === "IN" ? { currency: "INR", rate: 1 } : fx[country.code];
  if (!exchange || !exchange.currency || !Number.isFinite(Number(exchange.rate)) || Number(exchange.rate) <= 0) {
    throw new Error(`Currency conversion for ${country.name} is not configured.`);
  }
  const divisor = Number(shippingRate.volumetricDivisor || 0);
  const actualWeight = products.reduce((sum, product) => sum + Number(product.weightKg || 0) * quantities.get(String(product._id)), 0);
  const volumetricWeight = divisor > 0 ? products.reduce((sum, product) => {
    const dimensions = product.dimensions || {};
    const volume = Number(dimensions.lengthCm || 0) * Number(dimensions.widthCm || 0) * Number(dimensions.heightCm || 0);
    return sum + (volume / divisor) * quantities.get(String(product._id));
  }, 0) : 0;
  const weightKg = Math.max(actualWeight, volumetricWeight);
  return {
    country,
    currency: exchange.currency,
    fxRate: Number(exchange.rate),
    taxRate: Number(taxRate),
    shippingMethod: selectedMethod,
    weightKg,
    shippingMinor: Math.round(Number(shippingRate.baseMinor) + Number(shippingRate.perKgMinor) * weightKg),
  };
}

export function supportedPaymentMethods() {
  return process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? ["razorpay"] : [];
}
