import { apiGet } from "./apiClient.js";

/**
 * Frontend service for backend-driven catalog data.
 *
 * - fetchCategories()  -> GET /api/search/categories
 * - fetchProduct(id)   -> GET /api/products/:id
 * - searchProducts()   -> re-exported from searchService.js (GET /api/search)
 */

/** GET /api/search/categories — distinct categories from the database. */
export async function fetchCategories() {
  const data = await apiGet("/search/categories", { auth: false });
  return data.categories ?? [];
}

/** GET /api/products/:id — one product for the Product Detail page. */
export async function fetchProduct(id) {
  const data = await apiGet(`/products/${id}`, { auth: false });
  return data.product;
}

export { searchProducts } from "./searchService.js";