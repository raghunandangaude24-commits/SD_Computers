import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { formatINR } from "../utils/format.js";
import {
  validateItems,
  validateShipping,
  validatePaymentMethod,
  isValidId,
  cleanString,
} from "../utils/validation.js";

function toOrderItemJson(row) {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.product_name,
    price: formatINR(row.price),
    quantity: Number(row.quantity),
    image: row.image,
  };
}

function toOrderJson(order, items) {
  return {
    id: order.id,
    totalAmount: formatINR(order.total_amount),
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    orderStatus: order.order_status,
    createdAt: order.created_at,
    shipping: {
      name: order.shipping_name,
      phone: order.shipping_phone,
      address: order.shipping_address,
      city: order.shipping_city,
      state: order.shipping_state,
      pincode: order.shipping_pincode,
    },
    items: items.map(toOrderItemJson),
    itemCount: items.reduce((sum, item) => sum + Number(item.quantity), 0),
  };
}

/**
 * POST /api/orders  (protected)
 * { items: [{productId, quantity}], shipping: {...}, paymentMethod }
 *
 * Creates the order, snapshots product name/price/image into order_items,
 * decrements stock and removes only the purchased items from the user's
 * cart (the cart page supports per-item checkout selection) — all in one
 * transaction. Only Cash on Delivery is enabled (online payment is a UI
 * placeholder).
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shipping, paymentMethod = "cod" } = req.body ?? {};

  const errors = [...validateItems(items), ...validateShipping(shipping)];
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }

  if (!validatePaymentMethod(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: "Only Cash on Delivery (COD) is available. Online payment is not configured yet.",
    });
  }

  // Validate products and stock before opening the transaction.
  const ids = items.map((item) => Number(item.productId));
  const [productRows] = await pool.query(
    `SELECT id, name, price, stock, image FROM products WHERE id IN (${ids.map(() => "?").join(", ")})`,
    ids
  );
  const productMap = new Map(productRows.map((row) => [row.id, row]));

  const lineItems = [];
  for (const item of items) {
    const product = productMap.get(Number(item.productId));
    if (!product) {
      return res.status(400).json({
        success: false,
        message: `Product #${item.productId} no longer exists`,
      });
    }
    const quantity = Number(item.quantity);
    if (quantity > Number(product.stock)) {
      return res.status(400).json({
        success: false,
        message: `"${product.name}" only has ${Number(product.stock)} unit(s) in stock`,
      });
    }
    lineItems.push({ product, quantity });
  }

  const totalAmount = lineItems.reduce(
    (sum, line) => sum + Number(line.product.price) * line.quantity,
    0
  );

  const connection = await pool.getConnection();
  let orderId;
  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders
         (user_id, total_amount, shipping_name, shipping_phone, shipping_address,
          shipping_city, shipping_state, shipping_pincode, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        totalAmount,
        cleanString(shipping.name),
        cleanString(shipping.phone),
        cleanString(shipping.address),
        cleanString(shipping.city),
        cleanString(shipping.state),
        cleanString(shipping.pincode),
        String(paymentMethod),
      ]
    );
    orderId = orderResult.insertId;

    for (const line of lineItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          line.product.id,
          line.product.name,
          line.product.price,
          line.quantity,
          line.product.image,
        ]
      );
      const [stockResult] = await connection.query(
        "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
        [line.quantity, line.product.id, line.quantity]
      );
      // The pre-check above can lose a race with a concurrent order —
      // if the guarded UPDATE matched no rows we must not oversell.
      if (stockResult.affectedRows === 0) {
        const err = new Error("Stock changed while placing the order");
        err.status = 409;
        err.clientMessage = `"${line.product.name}" just went out of stock — please review your cart`;
        throw err;
      }
    }

    // Only the purchased items leave the cart — unselected items stay.
    const [cartRows] = await connection.query(
      "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
      [req.user.id]
    );
    if (cartRows[0]) {
      await connection.query(
        `DELETE FROM cart_items
         WHERE cart_id = ? AND product_id IN (${ids.map(() => "?").join(", ")})`,
        [cartRows[0].id, ...ids]
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  const [orderRows] = await pool.query("SELECT * FROM orders WHERE id = ?", [orderId]);
  const [itemRows] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [orderId]);

  return res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order: toOrderJson(orderRows[0], itemRows),
  });
});

/**
 * POST /api/orders/:id/cancel  (protected)
 *
 * Cancels the caller's own order while it is still cancellable and puts
 * the reserved stock back on the shelf.
 *
 * Only "pending" and "confirmed" orders can be cancelled — once a parcel
 * has been handed to the courier ("shipped") or signed for ("delivered")
 * it is out of our hands. Cash on Delivery is never charged up front, so
 * the payment is simply closed out alongside the order (no refund exists
 * to record).
 */
const CANCELLABLE_STATUSES = ["pending", "confirmed"];

export const cancelOrder = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ success: false, message: "Invalid order id" });
  }

  // Ownership check first — never reveal whether the id exists elsewhere.
  const [orderRows] = await pool.query(
    "SELECT id, order_status FROM orders WHERE id = ? AND user_id = ? LIMIT 1",
    [id, req.user.id]
  );

  if (!orderRows[0]) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (!CANCELLABLE_STATUSES.includes(orderRows[0].order_status)) {
    return res.status(409).json({
      success: false,
      message: `This order can no longer be cancelled — its status is "${orderRows[0].order_status}".`,
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Guarded update: if another request cancelled/shipped this order
    // between the check above and here, affectedRows is 0 and we bail
    // instead of double-restoring stock.
    const [updated] = await connection.query(
      `UPDATE orders SET order_status = 'cancelled', payment_status = 'cancelled'
        WHERE id = ? AND user_id = ? AND order_status IN ('pending', 'confirmed')`,
      [id, req.user.id]
    );

    if (updated.affectedRows === 0) {
      const err = new Error("Order is no longer cancellable");
      err.status = 409;
      err.clientMessage = "This order can no longer be cancelled.";
      throw err;
    }

    const [itemRows] = await connection.query(
      "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
      [id]
    );

    for (const item of itemRows) {
      await connection.query(
        "UPDATE products SET stock = stock + ? WHERE id = ?",
        [Number(item.quantity), item.product_id]
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  const [freshOrder] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
  const [freshItems] = await pool.query(
    "SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC",
    [id]
  );

  return res.json({
    success: true,
    message: "Order cancelled",
    order: toOrderJson(freshOrder[0], freshItems),
  });
});

/**
 * GET /api/orders  (protected)
 * Lists the current user's orders, newest first, with their items.
 */
export const listOrders = asyncHandler(async (req, res) => {
  const [orderRows] = await pool.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC, id DESC",
    [req.user.id]
  );

  let itemRows = [];
  if (orderRows.length > 0) {
    const ids = orderRows.map((order) => order.id);
    [itemRows] = await pool.query(
      `SELECT * FROM order_items WHERE order_id IN (${ids.map(() => "?").join(", ")}) ORDER BY id ASC`,
      ids
    );
  }

  const itemsByOrder = new Map();
  itemRows.forEach((row) => {
    if (!itemsByOrder.has(row.order_id)) itemsByOrder.set(row.order_id, []);
    itemsByOrder.get(row.order_id).push(row);
  });

  return res.json({
    success: true,
    orders: orderRows.map((order) => toOrderJson(order, itemsByOrder.get(order.id) ?? [])),
  });
});

/**
 * GET /api/orders/:id  (protected)
 * Own order only — users can never read another user's order.
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!isValidId(id)) {
    return res.status(400).json({ success: false, message: "Invalid order id" });
  }

  const [orderRows] = await pool.query(
    "SELECT * FROM orders WHERE id = ? AND user_id = ? LIMIT 1",
    [id, req.user.id]
  );

  if (!orderRows[0]) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const [itemRows] = await pool.query(
    "SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC",
    [id]
  );

  return res.json({
    success: true,
    order: toOrderJson(orderRows[0], itemRows),
  });
});