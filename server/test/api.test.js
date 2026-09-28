/**
 * api.test.js
 * Automated test suite for Personal Expense Tracker API (Day 5).
 * Uses native Node.js test runner (node:test) and native fetch.
 */
const { test, describe, before, after } = require('node:test')
const assert = require('node:assert/strict')
const http = require('http')

process.env.NODE_ENV = 'test'
process.env.PORT = '5099'
process.env.CLIENT_URL = 'http://localhost:5173'

const app = require('../src/app')

let server
let baseUrl

before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app)
    server.listen(0, () => {
      const port = server.address().port
      baseUrl = `http://localhost:${port}`
      resolve()
    })
  })
})

after(async () => {
  await new Promise((resolve) => server.close(resolve))
})

describe('1. Health Check Endpoint', () => {
  test('GET /api/health returns 200 with standard health message', async () => {
    const res = await fetch(`${baseUrl}/api/health`)
    assert.equal(res.status, 200)

    const json = await res.json()
    assert.deepEqual(json, {
      success: true,
      message: 'Expense Tracker API is running',
    })
  })
})

describe('2. CORS Headers Verification', () => {
  test('CORS responds with allowed origin matching CLIENT_URL', async () => {
    const res = await fetch(`${baseUrl}/api/health`, {
      headers: {
        Origin: 'http://localhost:5173',
      },
    })
    assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:5173')
  })
})

describe('3. 404 Route Not Found Handling', () => {
  test('GET /api/nonexistent returns 404 with structured JSON', async () => {
    const res = await fetch(`${baseUrl}/api/nonexistent`)
    assert.equal(res.status, 404)

    const json = await res.json()
    assert.equal(json.success, false)
    assert.match(json.message, /Route not found/)
  })
})

describe('4. Input Validation & Security for POST /api/transactions', () => {
  test('Rejects request missing title (400)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'expense',
        category: 'Food',
        amount: 25000,
        transaction_date: '2026-09-28',
      }),
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.match(json.message, /title is required/)
  })

  test('Rejects invalid transaction type (400)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Transfer Dana',
        type: 'transfer', // only income or expense allowed
        category: 'General',
        amount: 50000,
        transaction_date: '2026-09-28',
      }),
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.match(json.message, /type must be one of/)
  })

  test('Rejects non-positive amount: 0 (400)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Belanja',
        type: 'expense',
        category: 'Shopping',
        amount: 0,
        transaction_date: '2026-09-28',
      }),
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.match(json.message, /amount must be a number greater than 0/)
  })

  test('Rejects negative amount: -15000 (400)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Refund Negatif',
        type: 'expense',
        category: 'Bills',
        amount: -15000,
        transaction_date: '2026-09-28',
      }),
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.match(json.message, /amount must be a number greater than 0/)
  })

  test('Rejects missing category (400)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Bonus Proyek',
        type: 'income',
        category: '',
        amount: 1500000,
        transaction_date: '2026-09-28',
      }),
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.match(json.message, /category is required/)
  })

  test('Rejects invalid transaction_date (400)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Makan Malam',
        type: 'expense',
        category: 'Food',
        amount: 35000,
        transaction_date: 'not-a-valid-date',
      }),
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.match(json.message, /transaction_date must be a valid date/)
  })
})

describe('5. Input Validation for Parameterized Routes', () => {
  test('GET /api/transactions/:id rejects invalid ID like "abc" (400)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions/abc`)
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.equal(json.message, 'Invalid transaction ID')
  })

  test('DELETE /api/transactions/:id rejects negative ID like "-5" (400)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions/-5`, { method: 'DELETE' })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.equal(json.message, 'Invalid transaction ID')
  })

  test('PUT /api/transactions/:id rejects non-integer ID (400)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions/0`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Valid Title',
        type: 'income',
        category: 'Salary',
        amount: 5000000,
        transaction_date: '2026-09-28',
      }),
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.equal(json.message, 'Invalid transaction ID')
  })
})
