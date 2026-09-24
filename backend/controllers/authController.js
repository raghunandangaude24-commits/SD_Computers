import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import {
  validateRegister,
  validateLogin,
  normalizeEmail,
  cleanString,
} from "../utils/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const PASSWORD_HASH_ROUNDS = 10;

/** Public user shape — never includes the password hash. */
function toPublicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? "",
    role: row.role ?? "customer",
    createdAt: row.created_at ?? null,
  };
}

/**
 * POST /api/auth/register
 * { name, email, phone, password }
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body ?? {};

  const errors = validateRegister({ name, email, phone, password });
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }

  const normalizedEmail = normalizeEmail(email);
  const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);

  try {
    await pool.query(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [cleanString(name), normalizedEmail, cleanString(phone), hashedPassword]
    );
  } catch (err) {
    // Catch duplicate email race condition (unique key on users.email)
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }
    throw err;
  }

  return res.status(201).json({
    success: true,
    message: "Registration successful",
  });
});

/**
 * POST /api/auth/login
 * { email, password }
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};

  const errors = validateLogin({ email, password });
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }

  const normalizedEmail = normalizeEmail(email);

  const [rows] = await pool.query(
    "SELECT id, name, email, phone, password, role FROM users WHERE email = ?",
    [normalizedEmail]
  );

  const user = rows[0];

  // Same message for missing user and wrong password — don't leak which failed.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role ?? "customer" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    success: true,
    message: "Login successful",
    token,
    user: toPublicUser(user),
  });
});

/**
 * GET /api/auth/me  (protected)
 * Returns fresh profile data straight from the database, so profile
 * edits are reflected without re-login.
 */
export const me = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1",
    [req.user.id]
  );

  if (!rows[0]) {
    return res.status(401).json({
      success: false,
      message: "Account no longer exists",
    });
  }

  return res.json({
    success: true,
    user: toPublicUser(rows[0]),
  });
});

/**
 * POST /api/auth/logout
 * The JWT is stateless, so logging out simply means the client
 * discards the stored token. This endpoint exists for a clean UI flow.
 */
export const logout = asyncHandler(async (req, res) => {
  return res.json({
    success: true,
    message: "Logged out successfully",
  });
});