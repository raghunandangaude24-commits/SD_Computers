import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toProductJson } from "../utils/productMapper.js";
import { buildProductDetails } from "../utils/productDetails.js";
import {
  queryProducts,
  parseBrands,
  parseFacetParams,
} from "../utils/queryBuilder.js";
import { validateSearchParams, isValidId, cleanString } from "../utils/validation.js";

/** Columns selected whenever a single product row is returned. */
const PRODUCT_SELECT = `id, slug, name, brand, category, price, old_price, discount,
  image, description, specifications, facets, details, stock, rating, review_count,
  featured, popular`;

function slugify(text) {
  return cleanString(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * GET /api/products
 * Public listing shared by the Shop / Category / Home sections.
 * Supports q, category, brand(s), price_min/max, rating, in_stock,
 * featured, popular, facet_<key>, sort, page, limit. All parameterized.
 */
export const listProducts = asyncHandler(async (req, res) => {
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
    products: result.rows.map(toProductJson),
    pagination: result.pagination,
    brands: result.brands,
  });
});

/**
 * GET /api/products/:id
 * Returns a single product plus its gallery images for the
 * Product Detail page.
 */
export const getProductById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (!isValidId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product id",
    });
  }

  const [rows] = await pool.query(
    `SELECT ${PRODUCT_SELECT} FROM products WHERE id = ? LIMIT 1`,
    [id]
  );

  if (!rows[0]) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  let galleryImages = [];
  try {
    const [imageRows] = await pool.query(
      "SELECT image FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC",
      [id]
    );
    galleryImages = imageRows.map((row) => row.image);
  } catch {
    // product_images may not exist on an un-migrated legacy DB — ignore.
  }

  const images = [
    rows[0].image,
    ...galleryImages.filter((img) => img && img !== rows[0].image),
  ];

  return res.json({
    success: true,
    product: { ...toProductJson(rows[0]), images },
  });
});

/** Validate admin product create/update payloads. */
function validateProductInput(body = {}) {
  const errors = [];
  const name = cleanString(body.name);
  const brand = cleanString(body.brand);
  const category = cleanString(body.category);

  if (!name) errors.push({ field: "name", message: "Name is required" });
  if (!brand) errors.push({ field: "brand", message: "Brand is required" });
  if (!category) errors.push({ field: "category", message: "Category is required" });

  const price = Number(body.price);
  if (!Number.isFinite(price) || price < 0) {
    errors.push({ field: "price", message: "Price must be a valid non-negative number" });
  }

  const stock =
    body.stock === "" || body.stock === null || body.stock === undefined
      ? 10
      : Number(body.stock);
  if (!Number.isInteger(stock) || stock < 0) {
    errors.push({ field: "stock", message: "Stock must be a non-negative integer" });
  }

  const rawOldPrice =
    body.old_price === "" || body.old_price === null || body.old_price === undefined
      ? null
      : Number(body.old_price);
  if (rawOldPrice !== null && (!Number.isFinite(rawOldPrice) || rawOldPrice < 0)) {
    errors.push({ field: "old_price", message: "Old price must be a valid non-negative number" });
  }

  const rawDiscount =
    body.discount === "" || body.discount === null || body.discount === undefined
      ? null
      : Number(body.discount);
  if (rawDiscount !== null && (!Number.isFinite(rawDiscount) || rawDiscount < 0 || rawDiscount > 100)) {
    errors.push({ field: "discount", message: "Discount must be between 0 and 100" });
  }

  const data = {
    name,
    brand,
    category,
    price,
    stock,
    old_price: rawOldPrice,
    discount: rawDiscount,
    slug: body.slug ? slugify(body.slug) : slugify(name),
    image: cleanString(body.image),
    description: body.description == null ? "" : String(body.description),
    specifications:
      body.specifications &&
      (Array.isArray(body.specifications)
        ? JSON.stringify(body.specifications)
        : String(body.specifications)),
    facets:
      body.facets && typeof body.facets === "object"
        ? JSON.stringify(body.facets)
        : body.facets
          ? String(body.facets)
          : null,
  };

  // Structured spec table for the detail page (cores / threads / GHz,
  // DDR generation and MHz, VRAM ...) — rebuilt on every write so it
  // always matches the specs and facets that were just saved.
  data.details = JSON.stringify(buildProductDetails(data));

  return { errors, data };
}

/**
 * POST /api/products  (admin)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { errors, data } = validateProductInput(req.body ?? {});
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }

  const [result] = await pool.query(
    `INSERT INTO products
       (name, slug, brand, category, price, old_price, discount, image,
        description, specifications, facets, details, stock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name, data.slug, data.brand, data.category, data.price,
      data.old_price, data.discount, data.image, data.description,
      data.specifications, data.facets, data.details, data.stock,
    ]
  );

  const [rows] = await pool.query(
    `SELECT ${PRODUCT_SELECT} FROM products WHERE id = ?`,
    [result.insertId]
  );

  return res.status(201).json({ success: true, product: toProductJson(rows[0]) });
});

/**
 * PUT /api/products/:id  (admin)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ success: false, message: "Invalid product id" });
  }

  const [existing] = await pool.query(
    "SELECT * FROM products WHERE id = ? LIMIT 1",
    [id]
  );
  if (!existing[0]) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const merged = { ...existing[0], ...(req.body ?? {}) };
  const { errors, data } = validateProductInput(merged);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }

  await pool.query(
    `UPDATE products SET
       name = ?, slug = ?, brand = ?, category = ?, price = ?, old_price = ?,
       discount = ?, image = ?, description = ?, specifications = ?, facets = ?,
       details = ?, stock = ?
     WHERE id = ?`,
    [
      data.name, data.slug, data.brand, data.category, data.price,
      data.old_price, data.discount, data.image, data.description,
      data.specifications, data.facets, data.details, data.stock, id,
    ]
  );

  const [rows] = await pool.query(
    `SELECT ${PRODUCT_SELECT} FROM products WHERE id = ?`,
    [id]
  );

  return res.json({ success: true, product: toProductJson(rows[0]) });
});

/**
 * DELETE /api/products/:id  (admin)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ success: false, message: "Invalid product id" });
  }

  const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  return res.json({ success: true, message: "Product deleted" });
});