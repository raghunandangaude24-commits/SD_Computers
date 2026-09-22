import { formatINR } from "./format.js";

/**
 * Converts a raw `products` table row into the exact JSON shape the
 * frontend UI consumes (shared by search results and product detail).
 */
export function toProductJson(row) {
  let specifications = [];
  if (row.specifications) {
    try {
      const parsed = JSON.parse(row.specifications);
      specifications = Array.isArray(parsed) ? parsed : [String(parsed).trim()];
    } catch {
      specifications = String(row.specifications)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    image: row.image,
    price: formatINR(row.price),
    oldPrice: row.old_price == null ? null : formatINR(row.old_price),
    discount: row.discount || null,
    specifications,
  };
}