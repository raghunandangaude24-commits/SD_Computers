import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  validateProfileUpdate,
  validatePasswordChange,
  normalizeEmail,
  cleanString,
} from "../utils/validation.js";

const PASSWORD_HASH_ROUNDS = 10;

function toProfileJson(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role ?? "customer",
    createdAt: row.created_at ?? null,
  };
}

/**
 * GET /api/users/profile  (protected)
 */
export const getProfile = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1",
    [req.user.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res.json({ success: true, user: toProfileJson(rows[0]) });
});

/**
 * PUT /api/users/profile  (protected)
 * { name, email, phone }
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body ?? {};
  const errors = validateProfileUpdate({ name, email, phone });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }

  const normalizedEmail = normalizeEmail(email);

  const [duplicate] = await pool.query(
    "SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1",
    [normalizedEmail, req.user.id]
  );
  if (duplicate[0]) {
    return res.status(409).json({ success: false, message: "Email already in use" });
  }

  await pool.query(
    "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
    [cleanString(name), normalizedEmail, cleanString(phone), req.user.id]
  );

  const [rows] = await pool.query(
    "SELECT id, name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1",
    [req.user.id]
  );

  return res.json({ success: true, user: toProfileJson(rows[0]) });
});

/**
 * PUT /api/users/password  (protected)
 * { currentPassword, newPassword }
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};
  const errors = validatePasswordChange({ currentPassword, newPassword });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }

  const [rows] = await pool.query(
    "SELECT password FROM users WHERE id = ? LIMIT 1",
    [req.user.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const match = await bcrypt.compare(currentPassword, rows[0].password);
  if (!match) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  const hashed = await bcrypt.hash(newPassword, PASSWORD_HASH_ROUNDS);
  await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashed, req.user.id]);

  return res.json({
    success: true,
    message: "Password updated successfully",
  });
});