export function toMinor(amount) {
  return Math.round(Number(amount) * 100);
}

export function fromMinor(amount) {
  return Number(amount) / 100;
}

export function safeQuantity(value) {
  const quantity = Number(value);
  return Number.isInteger(quantity) && quantity > 0 && quantity <= 50 ? quantity : null;
}

export function calculateTax(subtotalMinor, ratePercent) {
  return Math.round(subtotalMinor * (Number(ratePercent) / 100));
}

export function calculateShipping(baseMinor, perKgMinor, totalWeightKg) {
  return Math.round(Number(baseMinor) + Number(perKgMinor) * Number(totalWeightKg));
}

export function calculateTotal(subtotalMinor, taxMinor, shippingMinor, discountMinor = 0) {
  return Math.max(0, subtotalMinor + taxMinor + shippingMinor - discountMinor);
}
