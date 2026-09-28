/**
 * app.js
 * Main entry point for Personal Expense Tracker Backend API (Day 5).
 */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { testConnection } = require('./config/database')
const authRoutes = require('./routes/authRoutes')
const transactionRoutes = require('./routes/transactionRoutes')
const { notFound, errorHandler } = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// CORS configuration (restricted to client dev URL)
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// Body parser
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Expense Tracker API is running',
  })
})

// Authentication API routes (Day 6)
app.use('/api/auth', authRoutes)

// Transaction API routes (Protected by auth in transactionRoutes)
app.use('/api/transactions', transactionRoutes)

// 404 handler
app.use(notFound)

// Centralized error handler
app.use(errorHandler)

// Start server and test database connectivity
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, async () => {
    console.log(`[SERVER] Personal Expense Tracker API listening on port ${PORT}`)
    console.log(`[SERVER] CORS enabled for client origin: ${CLIENT_URL}`)
    await testConnection()
  })

  // Graceful shutdown
  const shutdown = () => {
    console.log('[SERVER] Shutting down gracefully...')
    server.close(() => {
      console.log('[SERVER] Closed remaining connections.')
      process.exit(0)
    })
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

module.exports = app
