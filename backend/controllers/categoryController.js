import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanString } from "../utils/validation.js";

const CATEGORY_SELECT = `c.id, c.name, c.slug, c.description, c.image,
  (SELECT COUNT(*) FROM products p WHERE p.category = c.name) AS count`;

function toCategoryJson(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    image: row.image ?? "",
    count: Number(row.count ?? 0),
  };
}

/**
 * GET /api/categories
 * All categories (with live product counts) for the home tiles,
 * header dropdown and footer links.
 */
export const listCategories = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ${CATEGORY_SELECT} FROM categories c ORDER BY c.name ASC`
  );
  return res.json({
    success: true,
    categories: rows.map(toCategoryJson),
  });
});

/**
 * GET /api/categories/:slug
 * A single category (matches on slug, falling back to the exact name
 * for legacy ?name= links).
 */
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const slug = cleanString(req.params.slug);
  if (!slug) {
    return res.status(400).json({ success: false, message: "Missing category slug" });
  }

  const [rows] = await pool.query(
    `SELECT ${CATEGORY_SELECT} FROM categories c WHERE c.slug = ? OR c.name = ? LIMIT 1`,
    [slug, slug]
  );

  if (!rows[0]) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  return res.json({ success: true, category: toCategoryJson(rows[0]) });
});

/**
 * POST /api/categories  (admin)
 */
export const createCategory = asyncHandler(async (req, res) => {
  const name = cleanString(req.body?.name);
  const slug = cleanString(req.body?.slug);
  if (!name) {
    return res.status(400).json({ success: false, message: "Category name is required" });
  }

  const finalSlug =
    slug ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const [result] = await pool.query(
    "INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)",
    [name, finalSlug, cleanString(req.body?.description), cleanString(req.body?.image)]
  );

  const [rows] = await pool.query(
    `SELECT ${CATEGORY_SELECT} FROM categories c WHERE c.id = ?`,
    [result.insertId]
  );

  return res.status(201).json({ success: true, category: toCategoryJson(rows[0]) });
});

/**
 * PUT /api/categories/:id  (admin)
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Invalid category id" });
  }

  const [existing] = await pool.query("SELECT * FROM categories WHERE id = ? LIMIT 1", [id]);
  if (!existing[0]) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  const body = req.body ?? {};
  const name = cleanString(body.name) || existing[0].name;
  const slug = cleanString(body.slug) || existing[0].slug;

  await pool.query(
    "UPDATE categories SET name = ?, slug = ?, description = ?, image = ? WHERE id = ?",
    [name, slug, cleanString(body.description), cleanString(body.image), id]
  );

  const [rows] = await pool.query(
    `SELECT ${CATEGORY_SELECT} FROM categories c WHERE c.id = ?`,
    [id]
  );

  return res.json({ success: true, category: toCategoryJson(rows[0]) });
});

/**
 * DELETE /api/categories/:id  (admin)
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Invalid category id" });
  }

  const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Category not found" });
  }

  return res.json({ success: true, message: "Category deleted" });
});