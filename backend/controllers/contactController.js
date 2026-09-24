import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateContactInput, cleanString } from "../utils/validation.js";

/**
 * POST /api/contact  (public)
 * { name, email, phone, subject, message }
 */
export const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body ?? {};

  const errors = validateContactInput({ name, email, phone, subject, message });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }

  await pool.query(
    "INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)",
    [
      cleanString(name),
      cleanString(email).toLowerCase(),
      cleanString(phone),
      cleanString(subject),
      cleanString(message),
    ]
  );

  return res.status(201).json({
    success: true,
    message: "Message sent! We will get back to you soon.",
  });
});