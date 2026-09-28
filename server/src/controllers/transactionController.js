/**
 * transactionController.js
 * Handles all CRUD operations for the transactions table.
 * Uses parameterized queries to prevent SQL injection.
 */
const { pool } = require('../config/database')

// ---- Allowed values (used for server-side validation) ----
const VALID_TYPES = ['income', 'expense']

/**
 * Validate incoming transaction body.
 * Returns an array of error strings (empty = valid).
 */
function validateTransaction(body) {
  const errors = []

  const { title, type, category, amount, transaction_date } = body

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('title is required')
  } else if (title.trim().length > 150) {
    errors.push('title must be 150 characters or fewer')
  }

  if (!type || !VALID_TYPES.includes(type)) {
    errors.push(`type must be one of: ${VALID_TYPES.join(', ')}`)
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    errors.push('category is required')
  }

  const parsedAmount = Number(amount)
  if (amount === undefined || amount === null || amount === '' || isNaN(parsedAmount) || parsedAmount <= 0) {
    errors.push('amount must be a number greater than 0')
  }

  if (!transaction_date) {
    errors.push('transaction_date is required (YYYY-MM-DD)')
  } else {
    const dateObj = new Date(transaction_date)
    if (isNaN(dateObj.getTime())) {
      errors.push('transaction_date must be a valid date (YYYY-MM-DD)')
    }
  }

  return errors
}

// ================================================================
// GET /api/transactions
// Returns all transactions ordered by transaction_date DESC
// ================================================================
async function getTransactions(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, type, category, amount, transaction_date, description, created_at, updated_at
       FROM transactions
       ORDER BY transaction_date DESC, created_at DESC`
    )
    res.json({ success: true, data: rows })
  } catch (err) {
    next(err)
  }
}

// ================================================================
// GET /api/transactions/:id
// Returns a single transaction by ID
// ================================================================
async function getTransactionById(req, res, next) {
  try {
    const { id } = req.params

    // Validate that id is a positive integer
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid transaction ID' })
    }

    const { rows } = await pool.query(
      `SELECT id, title, type, category, amount, transaction_date, description, created_at, updated_at
       FROM transactions
       WHERE id = $1`,
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found' })
    }

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
}

// ================================================================
// POST /api/transactions
// Creates a new transaction
// ================================================================
async function createTransaction(req, res, next) {
  try {
    const errors = validateTransaction(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join('; ') })
    }

    const { title, type, category, amount, transaction_date, description } = req.body

    const { rows } = await pool.query(
      `INSERT INTO transactions (title, type, category, amount, transaction_date, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, type, category, amount, transaction_date, description, created_at, updated_at`,
      [
        title.trim(),
        type,
        category.trim(),
        Number(amount),
        transaction_date,
        description ? description.trim() : null,
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: rows[0],
    })
  } catch (err) {
    next(err)
  }
}

// ================================================================
// PUT /api/transactions/:id
// Updates an existing transaction
// ================================================================
async function updateTransaction(req, res, next) {
  try {
    const { id } = req.params

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid transaction ID' })
    }

    const errors = validateTransaction(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors.join('; ') })
    }

    const { title, type, category, amount, transaction_date, description } = req.body

    const { rows } = await pool.query(
      `UPDATE transactions
       SET title            = $1,
           type             = $2,
           category         = $3,
           amount           = $4,
           transaction_date = $5,
           description      = $6
       WHERE id = $7
       RETURNING id, title, type, category, amount, transaction_date, description, created_at, updated_at`,
      [
        title.trim(),
        type,
        category.trim(),
        Number(amount),
        transaction_date,
        description ? description.trim() : null,
        id,
      ]
    )

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found' })
    }

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: rows[0],
    })
  } catch (err) {
    next(err)
  }
}

// ================================================================
// DELETE /api/transactions/:id
// Deletes a transaction
// ================================================================
async function deleteTransaction(req, res, next) {
  try {
    const { id } = req.params

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid transaction ID' })
    }

    const { rows } = await pool.query(
      `DELETE FROM transactions
       WHERE id = $1
       RETURNING id`,
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaction not found' })
    }

    res.json({ success: true, message: 'Transaction deleted successfully' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
}
