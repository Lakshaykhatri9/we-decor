import test from "node:test";
import assert from "node:assert/strict";
import { calculateShipping, calculateTax, calculateTotal, fromMinor, safeQuantity, toMinor } from "../lib/commerce.mjs";

test("converts decimal amounts to minor units without losing cents", () => {
  assert.equal(toMinor(1234.56), 123456);
  assert.equal(fromMinor(123456), 1234.56);
});

test("validates cart quantities within the server limit", () => {
  assert.equal(safeQuantity(1), 1);
  assert.equal(safeQuantity(50), 50);
  assert.equal(safeQuantity(0), null);
  assert.equal(safeQuantity(1.5), null);
  assert.equal(safeQuantity(51), null);
});

test("calculates configured tax, weight shipping and final total", () => {
  assert.equal(calculateTax(10000, 18), 1800);
  assert.equal(calculateShipping(500, 250, 2), 1000);
  assert.equal(calculateTotal(10000, 1800, 1000, 500), 12300);
});
