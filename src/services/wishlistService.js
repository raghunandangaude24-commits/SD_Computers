import { apiGet, apiPost, apiDelete } from "./apiClient.js";

/**
 * Server-backed wishlist API (protected).
 * The wishlist is a plain list of full products:
 *   { id, items: [product, ...] }
 */
export const wishlistService = {
  /** GET /api/wishlist */
  async list() {
    const data = await apiGet("/wishlist");
    return data.wishlist;
  },

  /** POST /api/wishlist/:productId — idempotent */
  async add(productId) {
    const data = await apiPost(`/wishlist/${productId}`);
    return data.wishlist;
  },

  /** DELETE /api/wishlist/:productId */
  async remove(productId) {
    const data = await apiDelete(`/wishlist/${productId}`);
    return data.wishlist;
  },
};