import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidId, validateReviewInput } from "../utils/validation.js";

const SUMMARY_SELECT = "rating, review_count";

/** Recalculate the rating / review_count aggregates on a product. */
async function recomputeProductRating(database, productId) {
  await database.query(
    `UPDATE products p
     SET p.rating = COALESCE(
           (SELECT ROUND(AVG(r.rating), 2) FROM reviews r WHERE r.product_id = p.id), 0),
         p.review_count = (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id)
     WHERE p.id = ?`,
    [productId]
  );
}

function toReviewJson(row) {
  return {
    id: row.id,
    productId: row.product_id,
    userName: row.user_name,
    rating: Number(row.rating),
    comment: row.comment ?? "",
    createdAt: row.created_at,
  };
}

/**
 * GET /api/reviews/:productId  (public)
 */
export const listReviews = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);
  if (!isValidId(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product id" });
  }

  const [productRows] = await pool.query(
    `SELECT ${SUMMARY_SELECT} FROM products WHERE id = ? LIMIT 1`,
    [productId]
  );
  if (!productRows[0]) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const [rows] = await pool.query(
    `SELECT r.id, r.product_id, r.rating, r.comment, r.created_at, u.name AS user_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC, r.id DESC`,
    [productId]
  );

  return res.json({
    success: true,
    reviews: rows.map(toReviewJson),
    summary: {
      rating: Number(productRows[0].rating),
      reviewCount: Number(productRows[0].review_count),
    },
  });
});

/**
 * POST /api/reviews/:productId  (protected)
 * { rating, comment } — one review per user per product.
 */
export const createReview = asyncHandler(async (req, res) => {
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

  const { rating, comment } = req.body ?? {};
  const errors = validateReviewInput({ rating, comment });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }

  const [existing] = await pool.query(
    "SELECT id FROM reviews WHERE user_id = ? AND product_id = ? LIMIT 1",
    [req.user.id, productId]
  );
  if (existing[0]) {
    return res.status(409).json({
      success: false,
      message: "You have already reviewed this product",
    });
  }

  const [result] = await pool.query(
    "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)",
    [req.user.id, productId, Number(rating), String(comment ?? "").trim()]
  );

  await recomputeProductRating(pool, productId);

  const [summaryRows] = await pool.query(
    `SELECT ${SUMMARY_SELECT} FROM products WHERE id = ?`,
    [productId]
  );

  return res.status(201).json({
    success: true,
    message: "Review submitted",
    review: {
      id: result.insertId,
      productId,
      userName: req.user.name,
      rating: Number(rating),
      comment: String(comment ?? "").trim(),
    },
    summary: {
      rating: Number(summaryRows[0].rating),
      reviewCount: Number(summaryRows[0].review_count),
    },
  });
});

/**
 * PUT /api/reviews/:id  (protected — owner only)
 */
export const updateReview = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ success: false, message: "Invalid review id" });
  }

  const [rows] = await pool.query(
    "SELECT * FROM reviews WHERE id = ? AND user_id = ? LIMIT 1",
    [id, req.user.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }

  const { rating, comment } = req.body ?? {};
  const errors = validateReviewInput({ rating, comment });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }

  await pool.query(
    "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
    [Number(rating), String(comment ?? "").trim(), id]
  );

  await recomputeProductRating(pool, rows[0].product_id);

  const [summaryRows] = await pool.query(
    `SELECT ${SUMMARY_SELECT} FROM products WHERE id = ?`,
    [rows[0].product_id]
  );

  return res.json({
    success: true,
    message: "Review updated",
    review: {
      id,
      productId: rows[0].product_id,
      userName: req.user.name,
      rating: Number(rating),
      comment: String(comment ?? "").trim(),
    },
    summary: {
      rating: Number(summaryRows[0].rating),
      reviewCount: Number(summaryRows[0].review_count),
    },
  });
});

/**
 * DELETE /api/reviews/:id  (protected — owner or admin)
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ success: false, message: "Invalid review id" });
  }

  const [rows] = await pool.query("SELECT * FROM reviews WHERE id = ? LIMIT 1", [id]);
  if (!rows[0]) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }

  const isOwner = Number(rows[0].user_id) === Number(req.user.id);
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: "You cannot delete this review" });
  }

  await pool.query("DELETE FROM reviews WHERE id = ?", [id]);
  await recomputeProductRating(pool, rows[0].product_id);

  return res.json({ success: true, message: "Review deleted" });
});