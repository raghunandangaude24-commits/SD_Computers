import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toProductJson } from "../utils/productMapper.js";

/**
 * GET /api/products/:id
 * Returns a single product for the Product Detail page.
 */
export const getProductById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product id",
    });
  }

  const [rows] = await pool.query(
    `SELECT id, name, brand, category, price, old_price,
            discount, image, specifications
     FROM products
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  if (!rows[0]) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  return res.json({
    success: true,
    product: toProductJson(rows[0]),
  });
});