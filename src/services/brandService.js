import { apiGet } from "./apiClient.js";

/**
 * Brand API (public) — every brand with a live product count,
 * used by the filter sidebars:
 *   { id, name, slug, count }
 */
export const brandService = {
  /** GET /api/brands */
  async list() {
    const data = await apiGet("/brands", { auth: false });
    return data.brands;
  },
};