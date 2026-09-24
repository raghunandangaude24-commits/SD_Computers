import {
  apiGet,
  apiPost,
  getToken,
  getUser,
  setSession,
  clearSession,
} from "./apiClient.js";

export const authService = {
  /** POST /api/auth/login — stores the JWT + user on success. */
  async login(email, password) {
    const data = await apiPost("/auth/login", { email, password });
    setSession(data.token, data.user);
    return data;
  },

  /** POST /api/auth/register */
  async register({ name, email, phone, password }) {
    return apiPost("/auth/register", { name, email, phone, password });
  },

  /** GET /api/auth/me — current authenticated user. */
  async me() {
    return apiGet("/auth/me");
  },

  /** POST /api/auth/logout — best-effort; the JWT is discarded client-side. */
  async logout() {
    return apiPost("/auth/logout");
  },

  getToken,
  getUser,
  clearSession,
};