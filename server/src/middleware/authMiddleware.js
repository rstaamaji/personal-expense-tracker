/**
 * authMiddleware.js
 * Verifies incoming JSON Web Tokens (JWT) from the Authorization header.
 * Attaches the authenticated user payload to req.user.
 */
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_fallback_secret_for_local_tests'

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
  }

  const token = authHeader.split(' ')[1]

  if (!token || !token.trim()) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    // Ensure token contains valid user ID
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
      })
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    }

    next()
  } catch (err) {
    // Log message server-side only; never expose token details to client
    console.warn('[AUTH] Token verification failed:', err.message)
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    })
  }
}

module.exports = authMiddleware
