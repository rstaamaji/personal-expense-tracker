/**
 * authRoutes.js
 * Defines all /api/auth routes.
 */
const express = require('express')
const { register, login, getMe, logout } = require('../controllers/authController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Public auth routes
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

// Protected auth route
router.get('/me', authMiddleware, getMe)

module.exports = router
