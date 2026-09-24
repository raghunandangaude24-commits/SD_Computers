import jwt from "jsonwebtoken";

/**
 * JWT authentication middleware.
 *
 * Expects:  Authorization: Bearer <token>
 * Verifies the token, extracts the user id / role, and attaches the
 * authenticated user to req.user.
 */
export function authenticate(req, res, next) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role ?? "customer",
    };
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

/**
 * Admin-only guard — must run after `authenticate`.
 * Protects product/category/brand management endpoints.
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  return next();
}