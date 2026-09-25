import { formatINR } from "./format.js";
import { parseSpecifications, buildProductDetails } from "./productDetails.js";

/**
 * Converts a raw `products` table row into the exact JSON shape the
 * frontend UI consumes (shared by listings, product detail and cart).
 */

/** Parse a JSON column that MySQL may return as a string. */
function parseJson(value, fallback) {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/** Stored `details` column — rebuilt from the row when it is missing
 *  (rows written before the column existed, or by an older admin form). */
function detailRows(row) {
  const stored = parseJson(row.details, null);
  return Array.isArray(stored) && stored.length > 0 ? stored : buildProductDetails(row);
}

/**
 * Discount is stored as a numeric percent. Legacy rows may carry the
 * old "8% OFF" string — normalize both to a plain number (or null).
 */
function normalizeDiscount(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Math.round(value);
  const parsed = parseInt(String(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function toProductJson(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug ?? "",
    brand: row.brand,
    category: row.category,
    image: row.image,
    price: formatINR(row.price),
    oldPrice: row.old_price == null ? null : formatINR(row.old_price),
    discount: normalizeDiscount(row.discount),
    specifications: parseSpecifications(row.specifications),
    facets: parseJson(row.facets, null),
    // Structured spec table for the detail page (cores, threads, GHz,
    // DDR generation, MHz ...) — see detailRows() above.
    details: detailRows(row),
    description: row.description ?? "",
    stock: Number(row.stock ?? 0),
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    featured: Number(row.featured ?? 0) === 1,
    popular: Number(row.popular ?? 0) === 1,
  };
}

/**
 * Formats a cart line from a JOINed product row that also has a
 * `quantity` column (cart_items × products).
 */
export function toCartItemJson(row) {
  return {
    ...toProductJson(row),
    quantity: Number(row.quantity),
  };
}