/**
 * Wraps an async route handler so rejected promises are forwarded
 * to the central Express error handler (works with Express 4 and 5).
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}