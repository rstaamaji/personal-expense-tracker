-- =============================================================
-- Migration Day 6: Users & Transaction Ownership
-- Safe, idempotent migration script
-- =============================================================

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT         NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 2. Auto-update trigger for users table
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

-- 3. Safely add user_id to transactions table
DO $$
BEGIN
  -- Add user_id column if it doesn't already exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'user_id'
  ) THEN
    -- If existing transactions exist without users, create a development user placeholder
    IF EXISTS (SELECT 1 FROM transactions) AND NOT EXISTS (SELECT 1 FROM users) THEN
      INSERT INTO users (name, email, password_hash)
      VALUES (
        'Dev User',
        'dev@example.com',
        '$2b$10$wT8m9oR3R0V31eB0jTkgG.W420h5V3M2i8xL39.p3rM8c7h6y6Wq2'
      );
    END IF;

    -- Add nullable column first
    ALTER TABLE transactions ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

    -- Associate existing records to first user
    UPDATE transactions
    SET user_id = (SELECT id FROM users ORDER BY id ASC LIMIT 1)
    WHERE user_id IS NULL;

    -- Enforce NOT NULL constraint
    ALTER TABLE transactions ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- 4. Create index for fast user transaction queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
