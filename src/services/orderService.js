import { apiGet, apiPost } from "./apiClient.js";

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
};