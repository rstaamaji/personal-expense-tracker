/**
 * errorHandler.js
 * Centralized Express error-handling middleware.
 * Ensures no stack traces or credentials leak to the client.
 */

/**
 * 404 handler — attach after all routes.
 */
function notFound(req, res, _next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}

/**
 * Global error handler — must have 4 parameters for Express to recognize it.
 */
function errorHandler(err, req, res, _next) {
  // Log the full error server-side only
  console.error('[ERROR]', err.message)

  // Determine status code
  const statusCode = err.statusCode || err.status || 500

  // Build a clean response — never expose internals
  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? 'Internal server error'
        : err.message || 'Something went wrong',
  })
}

module.exports = { notFound, errorHandler }
