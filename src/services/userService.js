import { apiGet, apiPut } from "./apiClient.js";

/**
 * Account API (protected) for the Profile page.
 */
export const userService = {
  /** GET /api/users/profile */
  async getProfile() {
    const data = await apiGet("/users/profile");
    return data.user;
  },

  /** PUT /api/users/profile — { name, email, phone } */
  async updateProfile(payload) {
    const data = await apiPut("/users/profile", payload);
    return data.user;
  },

  /** PUT /api/users/password — { currentPassword, newPassword } */
  async updatePassword(payload) {
    return apiPut("/users/password", payload);
  },
};