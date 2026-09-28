-- =============================================================
-- Personal Expense Tracker — Database Schema
-- Day 5: PostgreSQL Setup
-- =============================================================
-- Run this file to initialize the database schema.
-- It is safe to run multiple times (uses IF NOT EXISTS).
-- =============================================================

-- Create the database (run this separately as a superuser if needed):
-- CREATE DATABASE expense_tracker;

-- Connect to the expense_tracker database before running the rest.

-- ---- Transactions Table ----
CREATE TABLE IF NOT EXISTS transactions (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(150)   NOT NULL,
  type             VARCHAR(20)    NOT NULL CHECK (type IN ('income', 'expense')),
  category         VARCHAR(50)    NOT NULL,
  amount           NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  transaction_date DATE           NOT NULL,
  description      TEXT,
  created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- ---- Auto-update updated_at on row change ----
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON transactions;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ---- Useful indexes ----
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
