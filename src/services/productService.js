import { apiGet } from "./apiClient.js";
import { categoryService } from "./categoryService.js";

/**
 * Frontend service for backend-driven catalog data.
 *
 * - fetchCategories()  -> GET /api/categories  (with slugs for clean URLs)
 * - listProducts()     -> GET /api/products    (shared filter builder)
 * - fetchProduct(id)   -> GET /api/products/:id
 * - searchProducts()   -> re-exported from searchService.js (GET /api/search)
 */

/** GET /api/categories — categories with slugs + live counts. */
export async function fetchCategories() {
  return categoryService.list();
}

/** GET /api/products — same params as /api/search (q, category, brand,
 *  price_min/max, rating, in_stock, featured, popular, facet_*, sort,
 *  page, limit). Returns { products, pagination, brands }. */
export async function listProducts(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
    } else {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  return apiGet(`/products${queryString ? `?${queryString}` : ""}`, {
    auth: false,
  });
}

/** GET /api/products/:id — one product + its gallery images. */
export async function fetchProduct(id) {
  const data = await apiGet(`/products/${id}`, { auth: false });
  return data.product;
}

export { searchProducts } from "./searchService.js";