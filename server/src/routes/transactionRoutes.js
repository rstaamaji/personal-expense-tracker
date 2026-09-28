/**
 * transactionRoutes.js
 * Defines all /api/transactions routes.
 */
const express = require('express')
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController')

const router = express.Router()

// GET  /api/transactions        — list all
// POST /api/transactions        — create new
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
