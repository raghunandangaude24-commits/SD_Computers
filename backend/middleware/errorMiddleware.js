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
  // Operational errors raised by controllers with an explicit status +
  // client-safe message (e.g. the order stock race). Never logged as a
  // server fault and never leaks internals.
  if (err && err.status && err.clientMessage) {
    return res.status(err.status).json({
      success: false,
      message: err.clientMessage,
    });
  }

  // MySQL duplicate-key insertion. The specific message for each unique
  // key is produced by the controller that owns it (they catch locally);
  // anything reaching here is an unhandled race, so keep it generic.
  if (err && err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message: "That record already exists",
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