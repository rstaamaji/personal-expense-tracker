/**
 * controller.test.js
 * Unit & Integration tests for transactionController and errorHandler.
 * Verifies parameterized SQL execution, response schemas, and error masking.
 */
const { test, describe, beforeEach, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const { pool } = require('../src/config/database')
const controller = require('../src/controllers/transactionController')
const { errorHandler } = require('../src/middleware/errorHandler')

// Helper to create mock Express req/res/next
function createMockContext({ params = {}, body = {}, query = {} } = {}) {
  const req = { params, body, query, method: 'GET', originalUrl: '/test' }
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

describe('Transaction Controller Unit & Response Format Verification', { concurrency: 1 }, () => {
  let originalQuery

  beforeEach(() => {
    originalQuery = pool.query
  })

  afterEach(() => {
    pool.query = originalQuery
  })

  test('getTransactions returns 200 with { success: true, data: [...] }', async () => {
    const mockRows = [
      {
        id: 1,
        title: 'Gaji Bulanan',
        type: 'income',
        category: 'Salary',
        amount: '10000000.00',
        transaction_date: '2026-09-01',
      },
    ]

    pool.query = async (text, _params) => {
      assert.match(text, /SELECT.*FROM transactions.*ORDER BY/is)
      return { rows: mockRows }
    }

    const { req, res } = createMockContext()
    await controller.getTransactions(req, res, () => {})

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.jsonData, {
      success: true,
      data: mockRows,
    })
  })

  test('getTransactionById returns 200 with { success: true, data: {...} } when found', async () => {
    const mockRow = {
      id: 42,
      title: 'Kopi Kenangan',
      type: 'expense',
      category: 'Food',
      amount: '22000.00',
      transaction_date: '2026-09-28',
    }

    pool.query = async (text, params) => {
      assert.match(text, /WHERE id = \$1/i)
      assert.deepEqual(params, ['42'])
      return { rows: [mockRow] }
    }

    const { req, res } = createMockContext({ params: { id: '42' } })
    await controller.getTransactionById(req, res, () => {})

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.jsonData, {
      success: true,
      data: mockRow,
    })
  })

  test('getTransactionById returns 404 when transaction does not exist', async () => {
    pool.query = async () => ({ rows: [] })

    const { req, res } = createMockContext({ params: { id: '9999' } })
    await controller.getTransactionById(req, res, () => {})

    assert.equal(res.statusCode, 404)
    assert.deepEqual(res.jsonData, {
      success: false,
      message: 'Transaction not found',
    })
  })

  test('createTransaction returns 201 with success message and data', async () => {
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
      ...newTx,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    pool.query = async (text, params) => {
      assert.match(text, /INSERT INTO transactions/i)
      assert.match(text, /VALUES \(\$1, \$2, \$3, \$4, \$5, \$6\)/i)
      assert.equal(params[0], 'Makan Siang')
      assert.equal(params[1], 'expense')
      assert.equal(params[2], 'Food')
      assert.equal(params[3], 25000)
      assert.equal(params[4], '2026-09-28')
      assert.equal(params[5], 'Lunch with colleagues')
      return { rows: [createdRow] }
    }

    const { req, res } = createMockContext({ body: newTx })
    await controller.createTransaction(req, res, () => {})

    assert.equal(res.statusCode, 201)
    assert.deepEqual(res.jsonData, {
      success: true,
      message: 'Transaction created successfully',
      data: createdRow,
    })
  })

  test('updateTransaction returns 200 on success and uses parameterized $1..$7', async () => {
    const updateData = {
      title: 'Makan Malam Enak',
      type: 'expense',
      category: 'Food',
      amount: 45000,
      transaction_date: '2026-09-28',
      description: 'Dinner',
    }

    const updatedRow = { id: 10, ...updateData }

    pool.query = async (text, params) => {
      assert.match(text, /UPDATE transactions/i)
      assert.match(text, /WHERE id = \$7/i)
      assert.equal(params[6], '10')
      return { rows: [updatedRow] }
    }

    const { req, res } = createMockContext({ params: { id: '10' }, body: updateData })
    await controller.updateTransaction(req, res, () => {})

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.jsonData, {
      success: true,
      message: 'Transaction updated successfully',
      data: updatedRow,
    })
  })

  test('updateTransaction returns 404 when target id not found', async () => {
    pool.query = async () => ({ rows: [] })

    const { req, res } = createMockContext({
      params: { id: '404' },
      body: {
        title: 'Test',
        type: 'expense',
        category: 'Food',
        amount: 10000,
        transaction_date: '2026-09-28',
      },
    })
    await controller.updateTransaction(req, res, () => {})

    assert.equal(res.statusCode, 404)
    assert.deepEqual(res.jsonData, {
      success: false,
      message: 'Transaction not found',
    })
  })

  test('deleteTransaction returns 200 on success', async () => {
    pool.query = async (text, params) => {
      assert.match(text, /DELETE FROM transactions\s+WHERE id = \$1/i)
      assert.equal(params[0], '10')
      return { rows: [{ id: 10 }] }
    }

    const { req, res } = createMockContext({ params: { id: '10' } })
    await controller.deleteTransaction(req, res, () => {})

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.jsonData, {
      success: true,
      message: 'Transaction deleted successfully',
    })
  })

  test('deleteTransaction returns 404 when transaction not found', async () => {
    pool.query = async () => ({ rows: [] })

    const { req, res } = createMockContext({ params: { id: '888' } })
    await controller.deleteTransaction(req, res, () => {})

    assert.equal(res.statusCode, 404)
    assert.deepEqual(res.jsonData, {
      success: false,
      message: 'Transaction not found',
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
