/**
 * authController.js
 * Handles user registration, login, profile retrieval, and logout.
 * Implements bcrypt hashing and JWT token issuance.
 */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { pool } = require('../config/database')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_fallback_secret_for_local_tests'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validate registration input data.
 * Returns array of error messages.
 */
function validateRegistration({ name, email, password }) {
  const errors = []

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required')
  } else if (name.trim().length > 100) {
    errors.push('Name must be 100 characters or fewer')
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email is required')
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push('Please enter a valid email address')
  } else if (email.trim().length > 150) {
    errors.push('Email must be 150 characters or fewer')
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required')
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  return errors
}

// ================================================================
// POST /api/auth/register
// Registers a new user account with hashed password
// ================================================================
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body

    const errors = validateRegistration({ name, email, password })
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join('; '),
      })
    }

    const sanitizedEmail = email.trim().toLowerCase()
    const sanitizedName = name.trim()

    // Check duplicate email
    const existing = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = $1',
      [sanitizedEmail]
    )

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      })
    }

    // Hash password with bcrypt (salt rounds = 10)
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert user into PostgreSQL
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [sanitizedName, sanitizedEmail, passwordHash]
    )

    const user = rows[0]

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    })
  } catch (err) {
    next(err)
  }
}

// ================================================================
// POST /api/auth/login
// Verifies credentials and returns a JWT
// ================================================================
async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    const sanitizedEmail = email.trim().toLowerCase()

    // Find user by email
    const { rows } = await pool.query(
      'SELECT id, name, email, password_hash FROM users WHERE LOWER(email) = $1',
      [sanitizedEmail]
    )

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const user = rows[0]

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    })
  } catch (err) {
    next(err)
  }
}

// ================================================================
// GET /api/auth/me
// Returns current authenticated user profile
// ================================================================
async function getMe(req, res, next) {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    const user = rows[0]

    return res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    })
  } catch (err) {
    next(err)
  }
}

// ================================================================
// POST /api/auth/logout
// Acknowledges logout for stateless JWT client
// ================================================================
function logout(req, res) {
  return res.json({
    success: true,
    message: 'Logged out successfully',
  })
}

module.exports = {
  register,
  login,
  getMe,
  logout,
  validateRegistration,
}
