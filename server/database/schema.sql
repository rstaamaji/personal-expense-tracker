-- =============================================================
-- Personal Expense Tracker — Database Schema (Day 6)
-- PostgreSQL Setup with User Authentication
-- =============================================================
-- Run this file to initialize the complete database schema.
-- It is safe to run multiple times (uses IF NOT EXISTS).
-- =============================================================

-- ---- 1. Users Table ----
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT         NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ---- 2. Transactions Table ----
CREATE TABLE IF NOT EXISTS transactions (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title            VARCHAR(150)   NOT NULL,
  type             VARCHAR(20)    NOT NULL CHECK (type IN ('income', 'expense')),
  category         VARCHAR(50)    NOT NULL,
  amount           NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  transaction_date DATE           NOT NULL,
  description      TEXT,
  created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- ---- 3. Auto-update triggers ----
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_users_updated_at ON users;
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_transactions_updated_at ON transactions;
CREATE TRIGGER set_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ---- 4. Performance Indexes ----
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
