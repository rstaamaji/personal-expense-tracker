/**
 * transactionRoutes.js
 * Defines all /api/transactions routes (Protected by authMiddleware).
 */
const express = require('express')
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Require JWT authentication for all transaction operations
router.use(authMiddleware)

// GET  /api/transactions        — list all (scoped to authenticated user)
// POST /api/transactions        — create new (associated with authenticated user)
router.route('/').get(getTransactions).post(createTransaction)

// GET    /api/transactions/:id  — get one
// PUT    /api/transactions/:id  — update one
// DELETE /api/transactions/:id  — delete one
router
  .route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction)

module.exports = router
