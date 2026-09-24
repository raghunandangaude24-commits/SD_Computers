/**
 * One-shot cleanup of QA/smoke-test data created by the verification
 * suites (verify-api, verify-ui, verify-shell, verify-consistency...).
 *
 * Removes:
 *   - every user registered with an @sd.test email and their
 *     carts / wishlists / orders / reviews / order_items,
 *   - contact messages sent from @sd.test addresses or with
 *     "UI audit" content,
 *   - then repairs derived data: stock restored for the deleted
 *     order items, product rating/review_count recomputed.
 *
 * Usage:  node scripts/cleanup-qa-data.js
 * Safe to run repeatedly (no-op when there is nothing to clean).
 */
import pool from "../config/db.js";

const QA_EMAIL = "%@sd.test";

const [users] = await pool.query(
  "SELECT id, email FROM users WHERE email LIKE ?",
  [QA_EMAIL],
);

const userIds = users.map((u) => u.id);

// Stock that was decremented by QA orders, per product.
let stockBack = [];
if (userIds.length > 0) {
  const [rows] = await pool.query(
    `SELECT oi.product_id AS productId, SUM(oi.quantity) AS qty
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
      WHERE o.user_id IN (?)
      GROUP BY oi.product_id`,
    [userIds],
  );
  stockBack = rows;
}

const conn = await pool.getConnection();
try {
  await conn.beginTransaction();

  let deleted = { users: 0, orders: 0, orderItems: 0, reviews: 0, carts: 0, wishlists: 0, contacts: 0 };

  if (userIds.length > 0) {
    const [r1] = await conn.query(
      "DELETE oi FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.user_id IN (?)",
      [userIds],
    );
    deleted.orderItems = r1.affectedRows;

    const [r2] = await conn.query("DELETE FROM orders WHERE user_id IN (?)", [userIds]);
    deleted.orders = r2.affectedRows;

    const [r3] = await conn.query("DELETE FROM reviews WHERE user_id IN (?)", [userIds]);
    deleted.reviews = r3.affectedRows;

    const [r4] = await conn.query(
      "DELETE ci FROM cart_items ci JOIN carts c ON c.id = ci.cart_id WHERE c.user_id IN (?)",
      [userIds],
    );
    deleted.carts = r4.affectedRows;

    await conn.query("DELETE FROM carts WHERE user_id IN (?)", [userIds]);

    const [r5] = await conn.query(
      "DELETE wi FROM wishlist_items wi JOIN wishlists w ON w.id = wi.wishlist_id WHERE w.user_id IN (?)",
      [userIds],
    );
    deleted.wishlists = r5.affectedRows;

    await conn.query("DELETE FROM wishlists WHERE user_id IN (?)", [userIds]);

    const [r6] = await conn.query("DELETE FROM users WHERE id IN (?)", [userIds]);
    deleted.users = r6.affectedRows;
  }

  const [r7] = await conn.query(
    "DELETE FROM contact_messages WHERE email LIKE ? OR subject LIKE ? OR message LIKE ?",
    [QA_EMAIL, "%UI audit%", "%UI audit%"],
  );
  deleted.contacts = r7.affectedRows;

  // Restore stock for products ordered by the removed QA orders.
  for (const row of stockBack) {
    await conn.query("UPDATE products SET stock = stock + ? WHERE id = ?", [
      Number(row.qty),
      row.productId,
    ]);
  }

  // Recompute rating aggregates so removed QA reviews leave no trace.
  await conn.query(
    `UPDATE products p
        LEFT JOIN (
          SELECT product_id, AVG(rating) AS avgRating, COUNT(*) AS cnt
            FROM reviews GROUP BY product_id
        ) r ON r.product_id = p.id
      SET p.rating = COALESCE(ROUND(r.avgRating, 1), 0),
          p.review_count = COALESCE(r.cnt, 0)`,
  );

  await conn.commit();
  console.log("QA cleanup done:", JSON.stringify(deleted), "| stock rows restored:", stockBack.length);
} catch (err) {
  await conn.rollback();
  console.error("QA cleanup failed, rolled back:", err.message);
  process.exitCode = 1;
} finally {
  conn.release();
  await pool.end();
}
