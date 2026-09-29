# Personal Expense Tracker

A full-stack personal finance and expense management dashboard designed to track income, expenses, transactions, and real-time financial intelligence.

Built by **Rustam Aji** as part of the **Aji 50 Days GitHub Challenge**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Structure](#database-structure)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
  - [PostgreSQL Setup](#1-postgresql-setup)
  - [Backend Setup](#2-backend-setup)
  - [Frontend Setup](#3-frontend-setup)
- [How to Run Locally](#how-to-run-locally)
- [Authentication Flow](#authentication-flow)
- [API Overview](#api-overview)
- [Testing Instructions](#testing-instructions)
- [Security Notes](#security-notes)
- [Project Roadmap](#project-roadmap)
- [What I Learned](#what-i-learned)

---

## Project Overview

Personal Expense Tracker provides individuals with a transparent, responsive platform to manage personal finances. It combines a client-side React single-page application with a Node.js/Express.js REST API backed by PostgreSQL. The interface delivers instant feedback via skeleton loaders, toast notifications, dynamic chart models, and strict tenant isolation.

---

## Features

- **User Authentication**: Secure registration and login with bcrypt password hashing and 7-day stateless JWT tokens.
- **Transaction CRUD**: Full creation, editing, deletion, and chronological viewing of financial transactions.
- **Combined Search & Filtering**: Real-time keyword search, transaction type toggles (Income/Expense), adaptive category filters, and timeframe filters (All Time, This Month, This Week).
- **Financial Analytics & Charts**:
  - Live summary stat cards: Total Balance, Total Income, Total Expense, Transaction Count.
  - Granular metrics: Average Expense, Largest Expense, Largest Income, and Savings Rate percentage.
  - Interactive Recharts: Monthly comparative bar charts, daily spending trend area charts, and category donut/progress allocations.
- **Polished UX States**:
  - Shimmer skeleton loaders for transaction rows, stat cards, and charts.
  - Inline API error feedback with single-click retry connection button.
  - Floating toast notifications for CRUD actions.
  - Deletion confirmation dialog with in-progress spinner state.
  - Contextual empty states for transactions, filtered queries, and analytics.
- **Strict Form Validation**: Real-time and submission validation for required fields, RFC email format, password minimum length, confirmation matching, numeric limits, non-future dates, and duplicate registration email detection.

---

## Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Charts Library**: [Recharts 3](https://recharts.org/)
- **Linter**: [Oxlint](https://oxc.rs/)
- **Styling**: Vanilla CSS3 with CSS Custom Properties (Design Tokens), Flexbox, CSS Grid
- **Typography**: Plus Jakarta Sans & Inter via Google Fonts

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v18+; v24 tested)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database Driver**: [`pg`](https://node-postgres.com/) (node-postgres connection pool)
- **Authentication**: [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken) (JWT) & [`bcrypt`](https://github.com/kelektiv/node.bcrypt.js)
- **Security & Config**: [`cors`](https://github.com/expressjs/cors) & [`dotenv`](https://github.com/motdotla/dotenv)
- **Test Runner**: Node.js Native Test Runner (`node:test`)

### Database
- **Database**: [PostgreSQL 14+](https://www.postgresql.org/)

---

## System Architecture

```
[ Client Browser ]
        │  ▲
        │  │  HTTPS / JSON
        │  │  (JWT Bearer Token)
        ▼  │
[ Express.js REST API (Port 5000) ]
   ├── CORS & Body Parsers
   ├── authMiddleware (JWT Verification)
   ├── authController (Register / Login / Session)
   ├── transactionController (CRUD + User Scoping)
   └── errorHandler (Centralized Masking)
        │  ▲
        │  │  Parameterized SQL Queries
        ▼  │  (pg.Pool Connection)
[ PostgreSQL Database (Port 5432) ]
   ├── users (Credentials & Profiles)
   └── transactions (Financial Ledger with User Isolation)
```

---

## Database Structure

The PostgreSQL database enforces relational integrity and data constraints at the engine level:

### 1. `users` Table
Stores registered accounts with hashed credentials.
```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### 2. `transactions` Table
Stores income and expense records with foreign key user isolation.
```sql
CREATE TABLE transactions (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title            VARCHAR(150) NOT NULL,
  type             VARCHAR(10)  NOT NULL CHECK (type IN ('income', 'expense')),
  category         VARCHAR(50)  NOT NULL,
  amount           NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  transaction_date DATE NOT NULL,
  description      TEXT,
  created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
```

---

## Environment Variables

### Backend Configuration (`server/.env`)
Copy `server/.env.example` to `server/.env`:

```env
# PostgreSQL Connection URL
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/expense_tracker

# Backend Server Port
PORT=5000

# Allowed Frontend Client Origin for CORS
CLIENT_URL=http://localhost:5173

# JWT Secret for Signing Authentication Tokens
JWT_SECRET=your_super_secret_random_key_here
```

### Frontend Configuration (`.env`)
Optional custom backend endpoint (defaults to `http://localhost:5000/api`):

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation & Setup

### 1. PostgreSQL Setup
Create the PostgreSQL database and execute the schema:

```bash
# Log in to PostgreSQL CLI
psql -U postgres

# Create database
CREATE DATABASE expense_tracker;
\q

# Apply schema file
psql -U postgres -d expense_tracker -f server/database/schema.sql
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit server/.env with your database credentials
```

### 3. Frontend Setup
```bash
# From project root
npm install
```

---

## How to Run Locally

You need two terminal sessions running concurrently:

### Terminal 1: Backend Server
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2: Frontend Client
```bash
# In project root
npm run dev
# Vite runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## Authentication Flow

```
1. Registration / Login:
   User submits credentials -> POST /api/auth/register or POST /api/auth/login
   Server verifies or hashes password -> Issues signed JWT token
   Client stores token in localStorage (`auth_token`)

2. Authenticated API Requests:
   Client requests include header: `Authorization: Bearer <token>`
   authMiddleware verifies token -> Injects req.user = { id, email, name }
   All queries execute with: WHERE user_id = req.user.id

3. Session Restoration & Expiry:
   On page refresh -> Client calls GET /api/auth/me to restore user profile
   If token is expired/invalid (401) -> Client clears storage and redirects to sign in
```

---

## API Overview

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register user account with hashed password |
| `POST` | `/api/auth/login` | Public | Verify credentials and receive JWT |
| `GET` | `/api/auth/me` | Protected | Get profile for currently authenticated user |
| `POST` | `/api/auth/logout` | Public | Acknowledge user logout |

### Transactions (`/api/transactions`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/transactions` | Protected | List all transactions belonging to authenticated user |
| `POST` | `/api/transactions` | Protected | Create a new transaction |
| `GET` | `/api/transactions/:id` | Protected | Fetch a single transaction (ownership verified) |
| `PUT` | `/api/transactions/:id` | Protected | Update transaction (ownership verified) |
| `DELETE` | `/api/transactions/:id` | Protected | Delete transaction (ownership verified) |

### Health Check

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Returns API status and health check |

---

## Testing Instructions

### 1. Run Backend Automated Test Suite
Runs all 30 unit, integration, and security tests:

```bash
cd server
npm test
```

### 2. Run Frontend Linter
Checks code style and linting rules across all JavaScript/JSX files:

```bash
npm run lint
```

### 3. Run Production Build
Verifies that client assets compile cleanly into minified bundles:

```bash
npm run build
```

---

## Security Notes

- **Password Hashing**: Implements bcrypt with 10 salt rounds. Raw passwords are never stored, logged, or returned in API responses.
- **SQL Injection Prevention**: Every SQL query uses parameterized placeholders (`$1`, `$2`) through `pg.Pool`.
- **Tenant Isolation**: Every database interaction on the transaction table explicitly filters by `WHERE user_id = req.user.id` to prevent cross-account data leakage.
- **Error Masking**: Database connection strings, stack traces, and internal server exceptions are logged internally and masked from client responses.
- **CORS Restriction**: Configured via Express middleware to strictly accept requests origin matching `CLIENT_URL`.
- **JWT Best Practice Note**: In this educational development project, tokens are stored in `localStorage` for accessibility. In enterprise production environments, `HttpOnly`, `SameSite=Strict` cookies are recommended to prevent XSS-based token theft.

---

## Project Roadmap

- [x] **Day 1** — Dashboard Foundation & Layout *(Completed)*
- [x] **Day 2** — Transaction CRUD + LocalStorage Prototype *(Completed)*
- [x] **Day 3** — Categories, Multi-field Search & Filters *(Completed)*
- [x] **Day 4** — Financial Analytics & Interactive Recharts *(Completed)*
- [x] **Day 5** — Node.js / Express REST API & PostgreSQL Database *(Completed)*
- [x] **Day 6** — User Authentication, JWT Security & Database Integration *(Completed)*
- [x] **Day 7** — UX Polish, States, Validation, Testing & Documentation *(Completed)*

---

## What I Learned

Through building this application from scratch across the 7-day challenge, key learnings included:

1. **Full-Stack Relational Architecture**: Connecting React with an asynchronous PostgreSQL database pool highlighted the importance of strict schema constraints (`CHECK`, `FOREIGN KEY ON DELETE CASCADE`) to maintain transactional data integrity.
2. **Stateless JWT Security & Tenant Isolation**: Implementing user isolation reinforced that security must be enforced on the backend at the database query level (`WHERE user_id = $1`), rather than relying solely on client-side route guards.
3. **Resilient UX State Management**: Developing clear empty states, skeleton shimmer placeholders, and optimistic feedback toasts dramatically improves user confidence during network latency or transient server errors.
4. **Defensive Form Validation**: Handling validation both client-side (for immediate user-friendly inline feedback) and server-side (for tamper protection) ensures a clean, robust data pipeline.
