import pool from "../config/db.js";
import { validateSearchParams } from "../utils/validation.js";
import { formatINR } from "../utils/format.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Whitelisted sort options. User input is mapped through this map,
 * so arbitrary SQL can never reach the ORDER BY clause.
 */
const SORT_MAP = {
  relevance: "p.id ASC",
  price_asc: "p.price ASC",
  price_desc: "p.price DESC",
  name_asc: "p.name ASC",
  name_desc: "p.name DESC",
};

/** Parse a comma-separated brand list coming from the frontend. */
function parseBrands(query) {
  const raw = query.brand ?? query.brands;
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : String(raw).split(",");
  return [...new Set(list.map((b) => String(b).trim()).filter(Boolean))];
}

/** Convert a DB row into the exact shape the existing UI consumes. */
function toProductJson(row) {
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

/**
 * GET /api/search
 * Supports ?q, ?category, ?brand, ?price_min, ?price_max,
 * ?sort and ?page / ?limit. All queries are parameterized.
 */
export const search = asyncHandler(async (req, res) => {
  const { q, category, priceMin, priceMax, page, limit } = validateSearchParams(
    req.query
  );
  const brands = parseBrands(req.query);
  const sort = SORT_MAP[String(req.query.sort ?? "relevance")] ?? "p.id ASC";

  // Conditions shared by the results query and the facet query.
  const baseConditions = [];
  const baseParams = [];

  if (q) {
    const like = `%${q}%`;
    baseConditions.push(
      "(p.name LIKE ? OR p.brand LIKE ? OR p.category LIKE ? OR p.specifications LIKE ?)"
    );
    baseParams.push(like, like, like, like);
  }

  if (category && category !== "All Categories") {
    baseConditions.push("p.category = ?");
    baseParams.push(category);
  }

  if (priceMin !== null && !Number.isNaN(priceMin)) {
    baseConditions.push("p.price >= ?");
    baseParams.push(priceMin);
  }

  if (priceMax !== null && !Number.isNaN(priceMax)) {
    baseConditions.push("p.price <= ?");
    baseParams.push(priceMax);
  }

  // Conditions for the results query only (adds brand filtering).
  const conditions = [...baseConditions];
  const params = [...baseParams];

  if (brands.length > 0) {
    conditions.push(`p.brand IN (${brands.map(() => "?").join(", ")})`);
    params.push(...brands);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const baseWhere =
    baseConditions.length > 0 ? `WHERE ${baseConditions.join(" AND ")}` : "";

  const offset = (page - 1) * limit;

  // Total count (for pagination)
  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM products p ${where}`,
    params
  );
  const total = Number(countRows[0].total);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Page of results
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.brand, p.category, p.price, p.old_price,
            p.discount, p.image, p.specifications
     FROM products p
     ${where}
     ORDER BY ${sort}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  // Brand facet counts for the sidebar filter (computed without the
  // brand filter itself, so all available brands stay visible).
  const [brandRows] = await pool.query(
    `SELECT p.brand AS name, COUNT(*) AS count
     FROM products p
     ${baseWhere}
     GROUP BY p.brand
     ORDER BY count DESC, p.brand ASC`,
    baseParams
  );

  return res.json({
    success: true,
    results: rows.map(toProductJson),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    brands: brandRows.map((row) => ({
      name: row.name,
      count: Number(row.count),
    })),
  });
});