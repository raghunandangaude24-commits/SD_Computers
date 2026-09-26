import { apiGet, apiPost } from "./apiClient.js";

/** Order statuses the customer is still allowed to cancel themselves. */
export const CANCELLABLE_STATUSES = ["pending", "confirmed"];

/** True when this order can still be cancelled from the UI. */
export function isCancellable(order) {
  return CANCELLABLE_STATUSES.includes(order?.orderStatus || "pending");
}

/**
 * Order API (protected).
 *
 * create() payload:
 *   { items: [{ productId, quantity }], shipping: {...}, paymentMethod: "cod" }
 *
 * Order shape:
 *   { id, totalAmount, paymentMethod, paymentStatus, orderStatus, createdAt,
 *     shipping: {...}, items: [{ id, productId, name, price, quantity, image }] }
 */
export const orderService = {
  /** POST /api/orders — place a Cash-on-Delivery order. */
  async create(payload) {
    const data = await apiPost("/orders", payload);
    return data.order;
  },

  /** GET /api/orders — the current user's orders, newest first. */
  async list() {
    const data = await apiGet("/orders");
    return data.orders;
  },

  /** GET /api/orders/:id — one owned order. */
  async get(id) {
    const data = await apiGet(`/orders/${id}`);
    return data.order;
  },

  /**
   * POST /api/orders/:id/cancel — cancel a pending/confirmed order and
   * return the stock. Throws with the backend message (e.g. already
   * shipped) so the caller can show it directly.
   */
  async cancel(id) {
    const data = await apiPost(`/orders/${id}/cancel`);
    return data.order;
  },
};