import {
  apiGet,
  apiPost,
  getToken,
  getUser,
  setSession,
  clearSession,
} from "./apiClient.js";

export const authService = {
  /** POST /api/auth/login — stores the JWT + user on success.
   *  `remember` controls persistence: true → localStorage (survives
   *  browser restart), false → sessionStorage (ends with the tab). */
  async login(email, password, remember = true) {
    const data = await apiPost("/auth/login", { email, password });
    setSession(data.token, data.user, { persistent: remember });
    return data;
  },

  /** POST /api/auth/register — stores the JWT + user so a new account is
   *  signed in the moment it lands on the homepage. */
  async register({ name, email, phone, password }) {
    const data = await apiPost("/auth/register", {
      name,
      email,
      phone,
      password,
    });
    if (data?.token) setSession(data.token, data.user, { persistent: true });
    return data;
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