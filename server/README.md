# Personal Expense Tracker — Backend Server (Day 5)

REST API backend for Personal Expense Tracker powered by Node.js, Express.js, and PostgreSQL.

## Architecture

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Driver: `pg` Pool)
- **Security**: Parameterized queries ($1, $2, etc.), CORS restriction, environment isolation via `dotenv`, centralized error handling

## Directory Structure

```text
server/
├── database/
│   └── schema.sql                 # PostgreSQL table definition & triggers
├── src/
│   ├── config/
│   │   └── database.js            # Connection pool & health verification
│   ├── controllers/
│   │   └── transactionController.js # Transaction CRUD with input validation
│   ├── middleware/
│   │   └── errorHandler.js        # 404 & centralized error mask
│   ├── routes/
│   │   └── transactionRoutes.js   # Route mapping for /api/transactions
│   └── app.js                     # Express app setup & server entry
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
3. Initialize tables and triggers using `database/schema.sql`:
   ```bash
   psql -U postgres -d expense_tracker -f database/schema.sql
   ```

## Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your database credentials:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/expense_tracker
PORT=5000
CLIENT_URL=http://localhost:5173
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

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Service health check |
| GET | `/api/transactions` | Fetch all transactions |
| GET | `/api/transactions/:id` | Fetch single transaction by ID |
| POST | `/api/transactions` | Create a new transaction |
| PUT | `/api/transactions/:id` | Update an existing transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
