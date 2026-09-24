import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toProductJson } from "../utils/productMapper.js";
import {
  queryProducts,
  parseBrands,
  parseFacetParams,
} from "../utils/queryBuilder.js";
import { validateSearchParams } from "../utils/validation.js";

/**
 * GET /api/search
 * Full-text-ish product search sharing the same query builder as
 * /api/products. Supports ?q, ?category, ?brand, ?price_min/max,
 * ?rating, ?in_stock, facet_*, ?sort and ?page / ?limit.
 */
export const search = asyncHandler(async (req, res) => {
  const params = validateSearchParams(req.query);
  const brands = parseBrands(req.query.brand ?? req.query.brands);
  const facets = parseFacetParams(req.query);

  const result = await queryProducts({
    q: params.q,
    category: params.category === "All Categories" ? "" : params.category,
    brands,
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    rating: params.rating,
    inStock: params.inStock,
    featured: params.featured,
    popular: params.popular,
    facets,
    sort: params.sort,
    page: params.page,
    limit: params.limit,
  });

  return res.json({
    success: true,
    results: result.rows.map(toProductJson),
    pagination: result.pagination,
    brands: result.brands,
  });
});

/**
 * GET /api/search/categories
 * Returns the distinct product categories currently in the catalog,
 * so the Home page and category navigation never hardcode category names.
 */
export const listCategories = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT category AS name, COUNT(*) AS count
     FROM products
     GROUP BY category
     ORDER BY name ASC`
  );

  return res.json({
    success: true,
    categories: rows.map((row) => ({
      name: row.name,
      count: Number(row.count),
    })),
  });
});