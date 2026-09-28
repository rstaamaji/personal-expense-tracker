# Personal Expense Tracker — Backend Server (Day 6)

REST API backend for Personal Expense Tracker powered by Node.js, Express.js, and PostgreSQL with JWT Authentication and User Data Isolation.

## Architecture

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: Stateless JSON Web Tokens (`jsonwebtoken`), secure password hashing (`bcrypt`)
- **Database**: PostgreSQL (Driver: `pg` Pool)
- **Security**: Parameterized queries ($1, $2, etc.), CORS restriction, user isolation on all transaction queries (`WHERE user_id = $1`), environment isolation via `dotenv`, centralized error handling

## Directory Structure

```text
server/
├── database/
│   ├── schema.sql                 # Complete PostgreSQL schema (users + transactions)
│   └── migration_day6.sql         # Idempotent migration for existing Day 5 databases
├── src/
│   ├── config/
│   │   └── database.js            # Connection pool & health verification
│   ├── controllers/
│   │   ├── authController.js      # User registration, login, profile, and logout
│   │   └── transactionController.js # Authenticated transaction CRUD with validation
│   ├── middleware/
│   │   ├── authMiddleware.js      # Bearer JWT verification & user attachment
│   │   └── errorHandler.js        # 404 & centralized error mask
│   ├── routes/
│   │   ├── authRoutes.js          # Route mapping for /api/auth
│   │   └── transactionRoutes.js   # Route mapping for /api/transactions
│   └── app.js                     # Express app setup & server entry
├── test/
│   ├── api.test.js                # Integration tests for auth & transaction routes
│   └── controller.test.js         # Unit tests for controller queries & security
├── .env.example                   # Environment configuration template
├── package.json                   # Backend dependencies & scripts
└── README.md                      # Backend documentation
```

## Database Setup

1. Make sure PostgreSQL is installed and running on your system.
2. Create database:
   ```sql
   CREATE DATABASE expense_tracker;
   ```
3. Initialize tables and triggers using `database/schema.sql` (fresh setup):
   ```bash
   psql -U postgres -d expense_tracker -f database/schema.sql
   ```
4. If migrating from Day 5:
   ```bash
   psql -U postgres -d expense_tracker -f database/migration_day6.sql
   ```

## Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your database credentials and secret key:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/expense_tracker
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=change_this_to_a_secure_random_secret
```

## Running the Server

Install dependencies:
```bash
cd server
npm install
```

Start development server with auto-reload:
```bash
npm run dev
```

Start production server:
```bash
npm start
```

Run automated backend tests:
```bash
npm test
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create account with name, email, password |
| POST | `/api/auth/login` | Public | Sign in with email and password, returns JWT |
| GET | `/api/auth/me` | Protected | Retrieve profile of authenticated user |
| POST | `/api/auth/logout` | Public | Stateless client logout acknowledgment |

### Transaction Endpoints (Protected by JWT)

All transaction endpoints require the `Authorization` header:
```text
Authorization: Bearer <JWT_TOKEN>
```

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/transactions` | Protected | Fetch transactions belonging to current user |
| GET | `/api/transactions/:id` | Protected | Fetch single transaction (must belong to user) |
| POST | `/api/transactions` | Protected | Create new transaction bound to current user |
| PUT | `/api/transactions/:id` | Protected | Update existing transaction (must belong to user) |
| DELETE | `/api/transactions/:id` | Protected | Delete transaction (must belong to user) |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Public service health check |
