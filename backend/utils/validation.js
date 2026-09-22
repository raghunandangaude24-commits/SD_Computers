/**
 * Lightweight input validation helpers.
 * All validation is pure — no database access happens here.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s-]{10,15}$/;

export const PASSWORD_MIN_LENGTH = 8;

/** Trim whitespace and lowercase an email address before comparing/storing. */
export function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

/** Trim input strings; returns "" for null/undefined. */
export function cleanString(value) {
  return String(value ?? "").trim();
}

/** Validate the fields supplied to POST /api/auth/register. */
export function validateRegister({ name, email, phone, password }) {
  const errors = [];
  const cleanName = cleanString(name);
  const cleanPhone = cleanString(phone);

  if (!cleanName) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (cleanName.length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  }

  if (!cleanString(email)) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!EMAIL_RE.test(normalizeEmail(email))) {
    errors.push({ field: "email", message: "Email must be a valid email address" });
  }

  if (!cleanPhone) {
    errors.push({ field: "phone", message: "Phone number is required" });
  } else if (!PHONE_RE.test(cleanPhone)) {
    errors.push({ field: "phone", message: "Phone number must be a valid 10–15 digit number" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  } else if (String(password).length < PASSWORD_MIN_LENGTH) {
    errors.push({
      field: "password",
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    });
  }

  return errors;
}

/** Validate the fields supplied to POST /api/auth/login. */
export function validateLogin({ email, password }) {
  const errors = [];

  if (!cleanString(email)) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!EMAIL_RE.test(normalizeEmail(email))) {
    errors.push({ field: "email", message: "Email must be a valid email address" });
  }

  if (!password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return errors;
}

/** Validate /api/search query parameters; falls back to sane defaults. */
export function validateSearchParams(query = {}) {
  const page = parseInt(query.page, 10);
  const limit = parseInt(query.limit, 10);

  return {
    q: cleanString(query.q),
    category: cleanString(query.category),
    priceMin: query.price_min === undefined ? null : Number(query.price_min),
    priceMax: query.price_max === undefined ? null : Number(query.price_max),
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: Number.isInteger(limit) && limit > 0 ? Math.min(limit, 50) : 12,
  };
}