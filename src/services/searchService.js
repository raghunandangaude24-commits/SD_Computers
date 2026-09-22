import { apiGet } from "./apiClient.js";

/**
 * GET /api/search?q=...&category=...&brand=...&sort=...&page=...&limit=...
 * Search is public (no JWT required) — matching the existing page behavior.
 */
export function searchProducts(params = {}) {
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
  return apiGet(`/search${queryString ? `?${queryString}` : ""}`, {
    auth: false,
  });
}