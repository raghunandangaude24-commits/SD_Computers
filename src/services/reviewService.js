import { apiGet, apiPost } from "./apiClient.js";

/**
 * Product review API.
 * list() is public; create() requires a logged-in user.
 */
export const reviewService = {
  /** GET /api/reviews/:productId — { reviews, summary } */
  async list(productId) {
    return apiGet(`/reviews/${productId}`, { auth: false });
  },

  /** POST /api/reviews/:productId — { rating, comment } (one per user). */
  async create(productId, payload) {
    return apiPost(`/reviews/${productId}`, payload);
  },
};