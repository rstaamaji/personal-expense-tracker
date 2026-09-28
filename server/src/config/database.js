/**
 * database.js
 * PostgreSQL connection pool using environment variables.
 * Never expose credentials — all values come from .env
 */
const { Pool } = require('pg')

// Use DATABASE_URL if provided, otherwise fall back to individual vars
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        // Uncomment for production SSL:
        // ssl: { rejectUnauthorized: false },
      }
    : {
        host:     process.env.DB_HOST     || 'localhost',
        port:     Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME     || 'expense_tracker',
        user:     process.env.DB_USER     || 'postgres',
        password: process.env.DB_PASSWORD || '',
      }
)

// Log connection events (errors only — never log credentials)
pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message)
})

/**
 * Test that the database is reachable.
 * Called at server startup.
 */
async function testConnection() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW() AS now')
    client.release()
    console.log(`[DB] PostgreSQL connected — server time: ${result.rows[0].now}`)
    return true
  } catch (err) {
    console.error('[DB] Connection failed:', err.message)
    return false
  }
}

module.exports = { pool, testConnection }
