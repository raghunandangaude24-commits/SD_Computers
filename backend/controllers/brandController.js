import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanString } from "../utils/validation.js";

/**
 * GET /api/brands
 * All brands (with live product counts) for the filter sidebar.
 */
export const listBrands = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT b.id, b.name, b.slug, COUNT(p.id) AS count
     FROM brands b
     LEFT JOIN products p ON p.brand = b.name
     GROUP BY b.id, b.name, b.slug
     ORDER BY b.name ASC`
  );

  return res.json({
    success: true,
    brands: rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      count: Number(row.count),
    })),
  });
});

/**
 * POST /api/brands  (admin)
 */
export const createBrand = asyncHandler(async (req, res) => {
  const name = cleanString(req.body?.name);
  if (!name) {
    return res.status(400).json({ success: false, message: "Brand name is required" });
  }

  const slug =
    cleanString(req.body?.slug) ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const [result] = await pool.query("INSERT INTO brands (name, slug) VALUES (?, ?)", [name, slug]);
  return res.status(201).json({ success: true, brand: { id: result.insertId, name, slug } });
});

/**
 * PUT /api/brands/:id  (admin)
 */
export const updateBrand = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Invalid brand id" });
  }

  const [existing] = await pool.query("SELECT * FROM brands WHERE id = ? LIMIT 1", [id]);
  if (!existing[0]) {
    return res.status(404).json({ success: false, message: "Brand not found" });
  }

  const name = cleanString(req.body?.name) || existing[0].name;
  const slug = cleanString(req.body?.slug) || existing[0].slug;
  await pool.query("UPDATE brands SET name = ?, slug = ? WHERE id = ?", [name, slug, id]);

  return res.json({ success: true, brand: { id, name, slug } });
});

/**
 * DELETE /api/brands/:id  (admin)
 */
export const deleteBrand = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Invalid brand id" });
  }

  const [result] = await pool.query("DELETE FROM brands WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Brand not found" });
  }

  return res.json({ success: true, message: "Brand deleted" });
});