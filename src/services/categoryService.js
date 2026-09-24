import { apiGet } from "./apiClient.js";

/**
 * Category API (public).
 * Categories carry a slug so navigation can use clean URLs:
 *   { id, name, slug, description, image, count }
 */
export const categoryService = {
  /** GET /api/categories */
  async list() {
    const data = await apiGet("/categories", { auth: false });
    return data.categories;
  },

  /** GET /api/categories/:slug — matches slug or legacy plain name. */
  async getBySlug(slug) {
    const data = await apiGet(`/categories/${encodeURIComponent(slug)}`, {
      auth: false,
    });
    return data.category;
  },
};