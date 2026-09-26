import { apiGet } from "./apiClient.js";

/**
 * GET /api/delivery/check?pincode=...
 * Answers whether a PIN code is serviceable and how long delivery takes.
 *
 * Returns { pincode, serviceable, zone, etaMin, etaMax, etaLabel,
 *           codAvailable }. Throws with the backend message for malformed
 * / unserviceable PIN codes so the page can show it directly.
 */
export async function checkPincode(pincode) {
  const data = await apiGet(
    `/delivery/check?pincode=${encodeURIComponent(String(pincode).trim())}`,
    { auth: false }
  );
  return data;
}

export const deliveryService = { checkPincode };
