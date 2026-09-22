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
    "SELECT id, name, email, password FROM users WHERE email = ?",
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
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * GET /api/auth/me  (protected)
 * Returns the currently authenticated user from the JWT.
 */
export const me = asyncHandler(async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});