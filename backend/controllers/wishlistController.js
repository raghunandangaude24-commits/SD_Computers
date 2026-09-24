import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toProductJson } from "../utils/productMapper.js";
import { isValidId } from "../utils/validation.js";

async function ensureWishlist(userId, db = pool) {
  const [rows] = await db.query("SELECT id FROM wishlists WHERE user_id = ? LIMIT 1", [userId]);
  if (rows[0]) return rows[0].id;

  try {
    const [result] = await db.query("INSERT INTO wishlists (user_id) VALUES (?)", [userId]);
    return result.insertId;
  } catch (err) {
    // Concurrent create (unique key uq_wishlists_user) — reuse its row.
    if (err && err.code === "ER_DUP_ENTRY") {
      const [again] = await db.query("SELECT id FROM wishlists WHERE user_id = ? LIMIT 1", [userId]);
      if (again[0]) return again[0].id;
    }
    throw err;
  }
}

/** Load the full wishlist product list for a user. */
async function fetchWishlistForUser(userId) {
  const wishlistId = await ensureWishlist(userId);

  const [rows] = await pool.query(
    `SELECT p.id, p.slug, p.name, p.brand, p.category, p.price, p.old_price,
            p.discount, p.image, p.description, p.specifications, p.facets,
            p.stock, p.rating, p.review_count, p.featured, p.popular
     FROM wishlist_items wi
     JOIN products p ON p.id = wi.product_id
     WHERE wi.wishlist_id = ?
     ORDER BY wi.created_at DESC, wi.id DESC`,
    [wishlistId]
  );

  return {
    id: wishlistId,
    items: rows.map(toProductJson),
  };
}

/**
 * GET /api/wishlist  (protected)
 */
export const listWishlist = asyncHandler(async (req, res) => {
  const wishlist = await fetchWishlistForUser(req.user.id);
  return res.json({ success: true, wishlist });
});

/**
 * POST /api/wishlist/:productId  (protected)
 */
export const addToWishlist = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);
  if (!isValidId(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product id" });
  }

  const [productRows] = await pool.query(
    "SELECT id FROM products WHERE id = ? LIMIT 1",
    [productId]
  );
  if (!productRows[0]) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const wishlistId = await ensureWishlist(req.user.id);
  await pool.query(
    "INSERT IGNORE INTO wishlist_items (wishlist_id, product_id) VALUES (?, ?)",
    [wishlistId, productId]
  );

  const wishlist = await fetchWishlistForUser(req.user.id);
  return res.json({ success: true, wishlist });
});

/**
 * DELETE /api/wishlist/:productId  (protected)
 */
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);
  if (!isValidId(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product id" });
  }

  const wishlistId = await ensureWishlist(req.user.id);
  await pool.query(
    "DELETE FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?",
    [wishlistId, productId]
  );

  const wishlist = await fetchWishlistForUser(req.user.id);
  return res.json({ success: true, wishlist });
});