import { apiGet, apiPost, apiPut, apiDelete } from "./apiClient.js";

/**
 * Server-backed cart API (protected — requires a logged in user).
 *
 * Every mutation returns the full fresh cart so the UI can simply
 * replace its local state:
 *   { id, items: [{ ...product, quantity }], totalItems, subtotal }
 */
export const cartService = {
  /** GET /api/cart */
  async getCart() {
    const data = await apiGet("/cart");
    return data.cart;
  },

  /** POST /api/cart/items — adds (or increments) a product quantity. */
  async addItem(productId, quantity = 1) {
    const data = await apiPost("/cart/items", { productId, quantity });
    return data.cart;
  },

  /** PUT /api/cart/items/:productId — sets an absolute quantity. */
  async updateItem(productId, quantity) {
    const data = await apiPut(`/cart/items/${productId}`, { quantity });
    return data.cart;
  },

  /** DELETE /api/cart/items/:productId */
  async removeItem(productId) {
    const data = await apiDelete(`/cart/items/${productId}`);
    return data.cart;
  },

  /** DELETE /api/cart — empties the whole server cart. */
  async clearCart() {
    const data = await apiDelete("/cart");
    return data.cart;
  },

  /** POST /api/cart/sync — merges guest items into the server cart. */
  async syncCart(items) {
    const data = await apiPost("/cart/sync", { items });
    return data.cart;
  },
};