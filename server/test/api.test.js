/**
 * api.test.js
 * Automated integration test suite for Personal Expense Tracker API (Day 6).
 * Verifies Auth routes, JWT middleware protection, CORS, and Transaction validation.
 */
const { test, describe, before, after } = require('node:test')
const assert = require('node:assert/strict')
const http = require('http')
const jwt = require('jsonwebtoken')

process.env.NODE_ENV = 'test'
process.env.PORT = '5099'
process.env.CLIENT_URL = 'http://localhost:5173'
process.env.JWT_SECRET = 'test_jwt_secret_for_automated_testing_12345'

const app = require('../src/app')

let server
let baseUrl
let validAuthHeader

before(async () => {
  const token = jwt.sign(
    { id: 1, email: 'tester@example.com', name: 'Test User' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
  validAuthHeader = `Bearer ${token}`

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

describe('4. Authentication Route Validation (Day 6)', () => {
  test('POST /api/auth/register rejects missing name (400)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid@example.com',
        password: 'password123',
      }),
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.match(json.message, /Name is required/i)
  })

  test('POST /api/auth/register rejects invalid email format (400)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rustam',
        email: 'not-an-email',
        password: 'password123',
      }),
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.match(json.message, /valid email/i)
  })

  test('POST /api/auth/register rejects short password < 8 chars (400)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rustam',
        email: 'rustam@example.com',
        password: 'short',
      }),
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.match(json.message, /at least 8 characters/i)
  })

  test('POST /api/auth/login rejects missing credentials (400)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
  })

  test('GET /api/auth/me rejects unauthenticated request (401)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`)
    assert.equal(res.status, 401)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.match(json.message, /Authentication required/i)
  })

  test('POST /api/auth/logout returns 200 with success message', async () => {
    const res = await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' })
    assert.equal(res.status, 200)
    const json = await res.json()
    assert.equal(json.success, true)
    assert.match(json.message, /Logged out successfully/i)
  })
})

describe('5. Protected Transaction Routes - JWT Enforcement (Day 6)', () => {
  test('GET /api/transactions rejects request without Bearer token (401)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions`)
    assert.equal(res.status, 401)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.match(json.message, /Authentication required/i)
  })

  test('POST /api/transactions rejects request without Bearer token (401)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Makan',
        type: 'expense',
        category: 'Food',
        amount: 25000,
        transaction_date: '2026-09-28',
      }),
    })
    assert.equal(res.status, 401)
  })

  test('GET /api/transactions/:id rejects request with invalid token (401)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions/1`, {
      headers: { Authorization: 'Bearer this.is.invalid' },
    })
    assert.equal(res.status, 401)
    const json = await res.json()
    assert.equal(json.success, false)
  })
})

describe('6. Input Validation on Authenticated Transaction Routes', () => {
  test('Rejects request missing title (400)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: validAuthHeader,
      },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: validAuthHeader,
      },
      body: JSON.stringify({
        title: 'Transfer Dana',
        type: 'transfer',
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: validAuthHeader,
      },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: validAuthHeader,
      },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: validAuthHeader,
      },
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: validAuthHeader,
      },
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

  test('GET /api/transactions/:id rejects invalid ID like "abc" (400)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions/abc`, {
      headers: { Authorization: validAuthHeader },
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.equal(json.message, 'Invalid transaction ID')
  })

  test('DELETE /api/transactions/:id rejects negative ID like "-5" (400)', async () => {
    const res = await fetch(`${baseUrl}/api/transactions/-5`, {
      method: 'DELETE',
      headers: { Authorization: validAuthHeader },
    })
    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.success, false)
    assert.equal(json.message, 'Invalid transaction ID')
  })
})
