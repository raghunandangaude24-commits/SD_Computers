/**
 * Lightweight input validation helpers.
 * All validation is pure — no database access happens here.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s-]{10,15}$/;
const PINCODE_RE = /^[0-9]{6}$/;

export const PASSWORD_MIN_LENGTH = 8;
export const RATING_MIN = 1;
export const RATING_MAX = 5;
export const MAX_ORDER_ITEM_QTY = 99;

/** Trim whitespace and lowercase an email address before comparing/storing. */
export function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

/** Trim input strings; returns "" for null/undefined. */
export function cleanString(value) {
  return String(value ?? "").trim();
}

/** True when value is a positive integer id (used for :id params). */
export function isValidId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
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

/** Validate /api/search and /api/products query parameters; sane defaults. */
export function validateSearchParams(query = {}) {
  const page = parseInt(query.page, 10);
  const limit = parseInt(query.limit, 10);
  const emptyIfMissing = (v) => v === undefined || v === "";

  return {
    q: cleanString(query.q),
    category: cleanString(query.category),
    brand: cleanString(query.brand),
    priceMin: emptyIfMissing(query.price_min) ? null : Number(query.price_min),
    priceMax: emptyIfMissing(query.price_max) ? null : Number(query.price_max),
    rating: emptyIfMissing(query.rating) ? null : Number(query.rating),
    inStock: query.in_stock === "1" || query.in_stock === "true",
    featured: query.featured === "1" || query.featured === "true",
    popular: query.popular === "1" || query.popular === "true",
    sort: cleanString(query.sort),
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: Number.isInteger(limit) && limit > 0 ? Math.min(limit, 50) : 12,
  };
}

/** Validate a cart or order line item { productId, quantity }. */
export function validateCartItem({ productId, quantity }) {
  const errors = [];
  if (!isValidId(productId)) {
    errors.push({ field: "productId", message: "A valid product id is required" });
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) {
    errors.push({ field: "quantity", message: "Quantity must be at least 1" });
  } else if (qty > MAX_ORDER_ITEM_QTY) {
    errors.push({ field: "quantity", message: "Quantity is too large" });
  }

  return errors;
}

/** Validate the items array of an order or cart sync request. */
export function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return [{ field: "items", message: "Your cart is empty" }];
  }

  const errors = [];
  items.forEach((item, index) => {
    const itemErrors = validateCartItem(item ?? {});
    itemErrors.forEach((e) => errors.push({ field: `items[${index}].${e.field}`, message: e.message }));
  });
  return errors;
}

/** Validate the shipping block used by the checkout. */
export function validateShipping(shipping = {}) {
  const errors = [];
  const required = [
    ["name", "Full name is required"],
    ["phone", "Phone number is required"],
    ["address", "Delivery address is required"],
    ["city", "City is required"],
    ["state", "State is required"],
    ["pincode", "PIN code is required"],
  ];

  for (const [field, message] of required) {
    if (!cleanString(shipping[field])) {
      errors.push({ field: `shipping.${field}`, message });
    }
  }

  const name = cleanString(shipping.name);
  if (name && name.length < 2) {
    errors.push({ field: "shipping.name", message: "Name must be at least 2 characters" });
  }

  const phone = cleanString(shipping.phone);
  if (phone && !PHONE_RE.test(phone)) {
    errors.push({ field: "shipping.phone", message: "Phone number must be a valid 10–15 digit number" });
  }

  const pincode = cleanString(shipping.pincode);
  if (pincode && !PINCODE_RE.test(pincode)) {
    errors.push({ field: "shipping.pincode", message: "PIN code must be 6 digits" });
  }

  return errors;
}

/** Only Cash on Delivery is currently enabled. */
export function validatePaymentMethod(method) {
  return method === "cod";
}

/** Validate a rating submit { rating, comment }. */
export function validateReviewInput({ rating, comment }) {
  const errors = [];
  const r = Number(rating);
  if (!Number.isInteger(r) || r < RATING_MIN || r > RATING_MAX) {
    errors.push({ field: "rating", message: `Rating must be between ${RATING_MIN} and ${RATING_MAX}` });
  }
  if (String(comment ?? "").trim().length > 2000) {
    errors.push({ field: "comment", message: "Comment is too long (max 2000 characters)" });
  }
  return errors;
}

/** Validate a contact page submission. */
export function validateContactInput({ name, email, phone, subject, message }) {
  const errors = [];
  if (!cleanString(name)) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (cleanString(name).length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  }

  if (!cleanString(email)) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!EMAIL_RE.test(normalizeEmail(email))) {
    errors.push({ field: "email", message: "Email must be a valid email address" });
  }

  const cleanSubject = cleanString(subject);
  if (cleanSubject.length > 200) {
    errors.push({ field: "subject", message: "Subject is too long (max 200 characters)" });
  }

  const cleanPhone = cleanString(phone);
  if (cleanPhone && !PHONE_RE.test(cleanPhone)) {
    errors.push({ field: "phone", message: "Phone number must be a valid 10–15 digit number" });
  }

  if (!cleanString(message)) {
    errors.push({ field: "message", message: "Message is required" });
  } else if (cleanString(message).length > 5000) {
    errors.push({ field: "message", message: "Message is too long (max 5000 characters)" });
  }

  return errors;
}

/** Validate profile edits { name, email, phone }. */
export function validateProfileUpdate({ name, email, phone }) {
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

  return errors;
}

/** Validate a password change { currentPassword, newPassword }. */
export function validatePasswordChange({ currentPassword, newPassword }) {
  const errors = [];
  if (!currentPassword) {
    errors.push({ field: "currentPassword", message: "Current password is required" });
  }
  if (!newPassword) {
    errors.push({ field: "newPassword", message: "New password is required" });
  } else if (String(newPassword).length < PASSWORD_MIN_LENGTH) {
    errors.push({
      field: "newPassword",
      message: `New password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    });
  }
  return errors;
}