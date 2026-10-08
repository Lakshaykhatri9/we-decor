import { COUNTRIES } from "@/lib/countries";
import { jsonError } from "@/lib/http";

export async function GET(request) {
  const countryCode = new URL(request.url).searchParams.get("country")?.toUpperCase() || "IN";
  const country = COUNTRIES.find((entry) => entry.code === countryCode);
  if (!country) return jsonError("This delivery country is not supported.", 400);
  if (country.code === "IN") return Response.json({ country: "IN", currency: "INR", fxRate: 1 });
  try {
    const rates = JSON.parse(process.env.FX_RATES_JSON || "{}");
    const exchange = rates[country.code];
    if (!exchange?.currency || !Number.isFinite(Number(exchange.rate)) || Number(exchange.rate) <= 0) return jsonError(`Currency conversion for ${country.name} is not configured.`, 503);
    return Response.json({ country: country.code, currency: exchange.currency, fxRate: Number(exchange.rate) });
  } catch {
    return jsonError("FX_RATES_JSON must contain valid JSON.", 503);
  }
}
