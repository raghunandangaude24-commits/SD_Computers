/**
 * Central Express error handling.
 * Keeps all API errors in a consistent JSON shape and never leaks
 * SQL queries, stack traces, or credentials to the client.
 */

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // MySQL duplicate-key insertion
  if (err && err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message: "Email already registered",
    });
  }

  // Malformed JSON request body
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
    });
  }

  console.error("[server error]", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}