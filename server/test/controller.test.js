/**
 * controller.test.js
 * Unit & Integration tests for transactionController, authController, and errorHandler.
 * Verifies parameterized SQL execution, user isolation, and security error masking.
 */
const { test, describe, beforeEach, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const { pool } = require('../src/config/database')
const transactionController = require('../src/controllers/transactionController')
const authController = require('../src/controllers/authController')
const { errorHandler } = require('../src/middleware/errorHandler')

// Helper to create mock Express req/res/next
function createMockContext({ params = {}, body = {}, query = {}, user = { id: 1, email: 'test@example.com', name: 'Test' } } = {}) {
  const req = { params, body, query, user, method: 'GET', originalUrl: '/test' }
  const res = {
    statusCode: 200,
    headers: {},
    jsonData: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(data) {
      this.jsonData = data
      return this
    },
  }
  let nextError = null
  const next = (err) => {
    nextError = err
  }
  return { req, res, getNextError: () => nextError, next }
}

describe('Transaction Controller Unit & User Isolation Verification (Day 6)', { concurrency: 1 }, () => {
  let originalQuery

  beforeEach(() => {
    originalQuery = pool.query
  })

  afterEach(() => {
    pool.query = originalQuery
  })

  test('getTransactions filters strictly by req.user.id', async () => {
    const mockRows = [
      {
        id: 1,
        user_id: 1,
        title: 'Gaji Bulanan',
        type: 'income',
        category: 'Salary',
        amount: '10000000.00',
        transaction_date: '2026-09-01',
      },
    ]

    pool.query = async (text, params) => {
      assert.match(text, /WHERE user_id = \$1/is)
      assert.equal(params[0], 1)
      return { rows: mockRows }
    }

    const { req, res } = createMockContext({ user: { id: 1 } })
    await transactionController.getTransactions(req, res, () => {})

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.jsonData, {
      success: true,
      data: mockRows,
    })
  })

  test('getTransactionById filters by both id and user_id', async () => {
    const mockRow = {
      id: 42,
      user_id: 1,
      title: 'Kopi Kenangan',
      type: 'expense',
      category: 'Food',
      amount: '22000.00',
      transaction_date: '2026-09-28',
    }

    pool.query = async (text, params) => {
      assert.match(text, /WHERE id = \$1 AND user_id = \$2/i)
      assert.deepEqual(params, ['42', 1])
      return { rows: [mockRow] }
    }

    const { req, res } = createMockContext({ params: { id: '42' }, user: { id: 1 } })
    await transactionController.getTransactionById(req, res, () => {})

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.jsonData, {
      success: true,
      data: mockRow,
    })
  })

  test('getTransactionById returns 404 when transaction does not belong to user', async () => {
    pool.query = async () => ({ rows: [] })

    const { req, res } = createMockContext({ params: { id: '9999' }, user: { id: 1 } })
    await transactionController.getTransactionById(req, res, () => {})

    assert.equal(res.statusCode, 404)
    assert.deepEqual(res.jsonData, {
      success: false,
      message: 'Transaction not found',
    })
  })

  test('createTransaction inserts user_id into transactions table', async () => {
    const newTx = {
      title: 'Makan Siang',
      type: 'expense',
      category: 'Food',
      amount: 25000,
      transaction_date: '2026-09-28',
      description: 'Lunch with colleagues',
    }

    const createdRow = {
      id: 10,
      user_id: 1,
      ...newTx,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    pool.query = async (text, params) => {
      assert.match(text, /INSERT INTO transactions/i)
      assert.match(text, /user_id/i)
      assert.equal(params[0], 1) // req.user.id
      assert.equal(params[1], 'Makan Siang')
      assert.equal(params[2], 'expense')
      assert.equal(params[3], 'Food')
      assert.equal(params[4], 25000)
      assert.equal(params[5], '2026-09-28')
      assert.equal(params[6], 'Lunch with colleagues')
      return { rows: [createdRow] }
    }

    const { req, res } = createMockContext({ body: newTx, user: { id: 1 } })
    await transactionController.createTransaction(req, res, () => {})

    assert.equal(res.statusCode, 201)
    assert.deepEqual(res.jsonData, {
      success: true,
      message: 'Transaction created successfully',
      data: createdRow,
    })
  })

  test('updateTransaction isolates by req.user.id', async () => {
    const updateData = {
      title: 'Makan Malam Enak',
      type: 'expense',
      category: 'Food',
      amount: 45000,
      transaction_date: '2026-09-28',
      description: 'Dinner',
    }

    const updatedRow = { id: 10, user_id: 1, ...updateData }

    pool.query = async (text, params) => {
      assert.match(text, /WHERE id = \$7 AND user_id = \$8/i)
      assert.equal(params[6], '10')
      assert.equal(params[7], 1) // req.user.id
      return { rows: [updatedRow] }
    }

    const { req, res } = createMockContext({ params: { id: '10' }, body: updateData, user: { id: 1 } })
    await transactionController.updateTransaction(req, res, () => {})

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.jsonData, {
      success: true,
      message: 'Transaction updated successfully',
      data: updatedRow,
    })
  })

  test('deleteTransaction isolates by req.user.id', async () => {
    pool.query = async (text, params) => {
      assert.match(text, /DELETE FROM transactions\s+WHERE id = \$1 AND user_id = \$2/i)
      assert.equal(params[0], '10')
      assert.equal(params[1], 1) // req.user.id
      return { rows: [{ id: 10 }] }
    }

    const { req, res } = createMockContext({ params: { id: '10' }, user: { id: 1 } })
    await transactionController.deleteTransaction(req, res, () => {})

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.jsonData, {
      success: true,
      message: 'Transaction deleted successfully',
    })
  })
})

describe('Auth Controller Unit & Security Tests (Day 6)', { concurrency: 1 }, () => {
  let originalQuery

  beforeEach(() => {
    originalQuery = pool.query
  })

  afterEach(() => {
    pool.query = originalQuery
  })

  test('register detects duplicate email and returns 409', async () => {
    pool.query = async () => ({ rows: [{ id: 99 }] }) // existing user found

    const { req, res } = createMockContext({
      body: {
        name: 'Rustam Aji',
        email: 'rustam@example.com',
        password: 'password123',
      },
    })

    await authController.register(req, res, () => {})

    assert.equal(res.statusCode, 409)
    assert.equal(res.jsonData.success, false)
    assert.equal(res.jsonData.message, 'Email is already registered')
  })

  test('login returns 401 when user email is not found', async () => {
    pool.query = async () => ({ rows: [] }) // no user found

    const { req, res } = createMockContext({
      body: {
        email: 'unknown@example.com',
        password: 'password123',
      },
    })

    await authController.login(req, res, () => {})

    assert.equal(res.statusCode, 401)
    assert.equal(res.jsonData.success, false)
    assert.equal(res.jsonData.message, 'Invalid email or password')
  })

  test('getMe returns user profile without password_hash', async () => {
    const mockUser = {
      id: 5,
      name: 'Rustam Aji',
      email: 'aji@example.com',
      created_at: new Date().toISOString(),
    }

    pool.query = async () => ({ rows: [mockUser] })

    const { req, res } = createMockContext({ user: { id: 5 } })
    await authController.getMe(req, res, () => {})

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.jsonData, {
      success: true,
      data: {
        user: {
          id: 5,
          name: 'Rustam Aji',
          email: 'aji@example.com',
        },
      },
    })
  })

  test('errorHandler masks internal database error from client (never exposes credentials/stack)', () => {
    const internalErr = new Error('FATAL: password authentication failed for user "postgres" at host localhost:5432')
    const { req, res } = createMockContext()

    errorHandler(internalErr, req, res, () => {})

    assert.equal(res.statusCode, 500)
    assert.deepEqual(res.jsonData, {
      success: false,
      message: 'Internal server error',
    })
  })
})
