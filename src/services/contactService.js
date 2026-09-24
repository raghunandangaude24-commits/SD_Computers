import { apiPost } from "./apiClient.js";

/**
 * Contact form API (public).
 * { name, email, phone, subject, message }
 */
export const contactService = {
  /** POST /api/contact */
  async send(payload) {
    return apiPost("/contact", payload, { auth: false });
  },
};