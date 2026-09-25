import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { toCartItemJson } from "../utils/productMapper.js";
import { formatINR } from "../utils/format.js";
import {
  validateCartItem,
  validateItems,
  isValidId,
  MAX_ORDER_ITEM_QTY,
} from "../utils/validation.js";

/** Full product columns JOINed with cart item quantity. */
const CART_SELECT = `p.id, p.slug, p.name, p.brand, p.category, p.price, p.old_price,
  p.discount, p.image, p.description, p.specifications, p.facets, p.details, p.stock,
  p.rating, p.review_count, p.featured, p.popular, ci.quantity`;

async function ensureCart(userId, db = pool) {
  const [rows] = await db.query("SELECT id FROM carts WHERE user_id = ? LIMIT 1", [userId]);
  if (rows[0]) return rows[0].id;

  try {
    const [result] = await db.query("INSERT INTO carts (user_id) VALUES (?)", [userId]);
    return result.insertId;
  } catch (err) {
    // A concurrent request created the cart between our SELECT and INSERT
    // (unique key uq_carts_user) — use the row it created instead of 500ing.
    if (err && err.code === "ER_DUP_ENTRY") {
      const [again] = await db.query("SELECT id FROM carts WHERE user_id = ? LIMIT 1", [userId]);
      if (again[0]) return again[0].id;
    }
    throw err;
  }
}

/** Load the full cart payload for a user (items + totals). */
async function fetchCartForUser(userId) {
  const cartId = await ensureCart(userId);

  const [items] = await pool.query(
    `SELECT ${CART_SELECT}
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = ?
     ORDER BY ci.created_at DESC, ci.id DESC`,
    [cartId]
  );

  const productItems = items.map(toCartItemJson);
  const totalItems = productItems.reduce((sum, item) => sum + item.quantity, 0);

  const [totalRows] = await pool.query(
    `SELECT COALESCE(SUM(p.price * ci.quantity), 0) AS total
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = ?`,
    [cartId]
  );

  return {
    id: cartId,
    items: productItems,
    totalItems,
    subtotal: formatINR(totalRows[0].total),
  };
}

/**
 * GET /api/cart  (protected)
 */
export const getCart = asyncHandler(async (req, res) => {
  const cart = await fetchCartForUser(req.user.id);
  return res.json({ success: true, cart });
});

/**
 * POST /api/cart/items  (protected)
 * { productId, quantity } — adds to the existing quantity if present.
 */
export const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body ?? {};
  const errors = validateCartItem({ productId, quantity });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }

  const [productRows] = await pool.query(
    "SELECT id, stock FROM products WHERE id = ? LIMIT 1",
    [productId]
  );
  const product = productRows[0];
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const cartId = await ensureCart(req.user.id);

  const [existing] = await pool.query(
    "SELECT quantity FROM cart_items WHERE cart_id = ? AND product_id = ? LIMIT 1",
    [cartId, productId]
  );
  const current = existing[0] ? Number(existing[0].quantity) : 0;
  const newQuantity = current + Number(quantity);

  if (newQuantity > Number(product.stock)) {
    return res.status(400).json({
      success: false,
      message: `Only ${Number(product.stock)} unit(s) of this product are in stock`,
    });
  }

  await pool.query(
    `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = ?`,
    [cartId, productId, newQuantity, newQuantity]
  );

  const cart = await fetchCartForUser(req.user.id);
  return res.json({ success: true, cart });
});

/**
 * PUT /api/cart/items/:productId  (protected)
 * { quantity } — sets the absolute quantity.
 */
export const updateItem = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);
  const quantity = Number(req.body?.quantity);

  if (!isValidId(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product id" });
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ORDER_ITEM_QTY) {
    return res.status(400).json({
      success: false,
      message: `Quantity must be between 1 and ${MAX_ORDER_ITEM_QTY}`,
    });
  }

  const cartId = await ensureCart(req.user.id);

  const [existing] = await pool.query(
    `SELECT ci.quantity, p.stock FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = ? AND ci.product_id = ? LIMIT 1`,
    [cartId, productId]
  );

  if (!existing[0]) {
    return res.status(404).json({ success: false, message: "Item not in cart" });
  }

  if (quantity > Number(existing[0].stock)) {
    return res.status(400).json({
      success: false,
      message: `Only ${Number(existing[0].stock)} unit(s) of this product are in stock`,
    });
  }

  await pool.query(
    "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?",
    [quantity, cartId, productId]
  );

  const cart = await fetchCartForUser(req.user.id);
  return res.json({ success: true, cart });
});

/**
 * DELETE /api/cart/items/:productId  (protected)
 */
export const removeItem = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);
  if (!isValidId(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product id" });
  }

  const cartId = await ensureCart(req.user.id);
  await pool.query(
    "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?",
    [cartId, productId]
  );

  const cart = await fetchCartForUser(req.user.id);
  return res.json({ success: true, cart });
});

/**
 * DELETE /api/cart  (protected) — empties the whole cart.
 */
export const clearCart = asyncHandler(async (req, res) => {
  const cartId = await ensureCart(req.user.id);
  await pool.query("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);

  const cart = await fetchCartForUser(req.user.id);
  return res.json({ success: true, cart });
});

/**
 * POST /api/cart/sync  (protected)
 * { items: [{ productId, quantity }] } — merges guest-cart contents
 * into the server cart after login (quantities add up).
 *
 * Runs in one transaction and never fails the merge because of a single
 * stale line: products deleted since the guest added them are skipped,
 * and quantities are clamped to current stock (the returned cart is the
 * source of truth for what was actually merged).
 */
export const syncCart = asyncHandler(async (req, res) => {
  const items = req.body?.items;

  const errors = validateItems(items);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }

  // The cart row is permanent — create it before opening the transaction
  // so a first-ever-cart race can't abort the merge mid-flight.
  const cartId = await ensureCart(req.user.id);

  const connection = await pool.getConnection();
  const skipped = [];
  try {
    await connection.beginTransaction();

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);

      const [productRows] = await connection.query(
        "SELECT id, stock FROM products WHERE id = ? LIMIT 1",
        [productId]
      );
      if (!productRows[0]) {
        skipped.push(productId);
        continue;
      }

      const stock = Number(productRows[0].stock ?? 0);
      if (stock <= 0) {
        skipped.push(productId);
        continue;
      }

      const [existing] = await connection.query(
        "SELECT quantity FROM cart_items WHERE cart_id = ? AND product_id = ? LIMIT 1",
        [cartId, productId]
      );
      const newQuantity = Math.min(
        (existing[0] ? Number(existing[0].quantity) : 0) + quantity,
        stock
      );

      await connection.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE quantity = ?`,
        [cartId, productId, newQuantity, newQuantity]
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  const cart = await fetchCartForUser(req.user.id);
  return res.json({ success: true, cart, ...(skipped.length > 0 ? { skipped } : {}) });
});