# Personal Expense Tracker

A modern personal finance dashboard for tracking income, expenses, transactions, and financial insights.

Built by **Rustam Aji** as part of the **Aji 50 Days GitHub Challenge**.

---

## Project Status

**Day 4 Completed (Accelerated Development: Day 3 + Day 4)**

The application now features comprehensive **Transaction Categories, Search & Combined Filtering** (Day 3) and full **Financial Analytics & Interactive Charts** (Day 4) using Recharts and live client-side data.

---

## Day 3 — Categories, Search & Filtering

### Implemented:
- **Static transaction categories**: Predefined expense categories (Food, Transportation, Education, Shopping, Bills, Entertainment, Health, Other) and income categories (Salary, Freelance, Business, Other).
- **Search transactions**: Real-time, case-insensitive keyword search by transaction title.
- **Income/expense filtering**: Segmented toggle to view All Types, Income only, or Expense only.
- **Category filtering**: Dynamic category dropdown that auto-adapts according to the selected transaction type.
- **Date filtering**: Quick timeframe selector for All Time, This Month, and This Week (Last 7 Days).
- **Combined filters**: Search, type, category, and date filters all work cooperatively.
- **Clear filters**: Dedicated reset button and removable filter chips to revert back to all transactions.
- **Improved empty states**: Tailored empty states for:
  - *No transactions in storage* ("No transactions yet.")
  - *No search matches* ("No transactions match your search.")
  - *No filter matches* ("No transactions match the selected filters.")

---

## Day 4 — Financial Analytics & Charts

### Implemented:
- **Income analytics**: Total earnings and count of income streams.
- **Expense analytics**: Total expenditures and count of expense payments.
- **Average expense**: Automatically calculated per expense transaction (`Total Expense / Expense Count`).
- **Largest transaction analysis**: Real-time identification of Largest Expense and Largest Income.
- **Savings rate**: Calculated as `((Income - Expense) / Income) * 100` with safe handling for zero income.
- **Category spending analysis**: Granular breakdown of expense categories with amount, transaction count, percentage allocation, and progress bars.
- **Income category analysis**: Breakdown of revenue sources with visual allocation indicators.
- **Income vs Expense Chart**: Recharts comparative bar chart grouped chronologically by month with Rupiah tooltips.
- **Spending Trend Chart**: Recharts smooth area timeline showing daily expense movements.
- **Category Donut Charts**: Recharts donut charts showcasing expense and income distributions.

---

## Privacy & Storage Considerations

- All transaction data is stored locally in the browser (`localStorage`) under the key `expense_tracker_transactions`.
- Data is **never** sent to an external server, API, GitHub, or third-party database.
- LocalStorage is intended for this frontend prototype and should **not** be considered secure storage for sensitive credentials.
- The repository contains only demo transactions.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Charts Library**: [Recharts](https://recharts.org/)
- **Bundler & Tooling**: [Vite 8](https://vite.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)
- **State & Storage**: React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) + Browser `localStorage`
- **Styling**: Modern CSS3 (CSS Custom Properties / Variables, Flexbox, CSS Grid) with Light/Dark Theme Support
- **Fonts**: Plus Jakarta Sans & Inter via Google Fonts
- **Package Manager**: npm

---

## Project Structure

```
src/
├── components/
│   ├── AnalyticsSection.jsx   # Day 4 financial metrics & Recharts visualizer
│   ├── AnalyticsSection.css   # Analytics metrics & chart container styles
│   ├── DeleteConfirmModal.jsx # Deletion confirmation dialog
│   ├── DeleteConfirmModal.css # Deletion dialog styling
│   ├── Navbar.jsx             # Top navigation with brand, links & theme toggle
│   ├── Navbar.css             # Navigation styling & responsive breakpoints
│   ├── StatCard.jsx           # Reusable financial summary card component
│   ├── StatCard.css           # Stat card styling & hover animations
│   ├── TransactionFilters.jsx # Day 3 search, type, category & date toolbar
│   ├── TransactionFilters.css # Search & filter toolbar styling
│   ├── TransactionForm.jsx    # Add/Edit modal form with validation
│   ├── TransactionForm.css    # Modal form styling & segmented controls
│   ├── TransactionItem.jsx    # Transaction list item with action buttons
│   └── TransactionItem.css    # Transaction row styling
│
├── hooks/
│   ├── useTheme.js            # Light/Dark theme persistence & management
│   └── useTransactions.js     # CRUD, Search, Filters, LocalStorage & Day 4 Analytics
│
├── pages/
│   ├── Dashboard.jsx          # Main dashboard orchestrator
│   └── Dashboard.css          # Layout grid & empty state styling
│
├── styles/
│   ├── variables.css          # Centralized light & dark design tokens
│   └── globals.css            # Reset, typography, smooth scrolling & base layout
│
├── utils/
│   ├── constants.js           # Categories, icons, palette & initial demo data
│   └── formatters.js          # Indonesian Rupiah & date formatters
│
├── App.jsx                    # Application layout container
└── main.jsx                   # React root entry point
```

---

## Day 5 — Backend API + PostgreSQL

### Implemented:
- **Backend Architecture**: Decoupled Express.js REST API with clean separation of concerns (`controllers/`, `routes/`, `middleware/`, `config/`, `database/`).
- **PostgreSQL Database**: Configured connection pool using `pg.Pool` with parameterized queries to prevent SQL injection vulnerabilities.
- **Database Schema**: Reusable DDL script (`server/database/schema.sql`) with `CHECK (type IN ('income', 'expense'))`, `CHECK (amount > 0)`, automatic `updated_at` trigger, and indexed fields.
- **Data Validation**: Strict server-side validation ensuring valid transaction types, positive numeric amounts, required title/category/date, and length constraints.
- **Centralized Error Handling**: Security-conscious error middleware that masks internal database errors, connection strings, and stack traces from clients.
- **CORS Protection**: Restricted CORS configuration permitting requests from client origin (`CLIENT_URL`).
- **Health Check & Startup Check**: `/api/health` endpoint and automatic database reachability verification on server start.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |
| GET | `/api/transactions` | Get transactions (ordered chronologically) |
| GET | `/api/transactions/:id` | Get transaction by ID |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

### Environment Variables (`server/.env.example`)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:PASSWORD@localhost:5432/expense_tracker` |
| `PORT` | Backend server port | `5000` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |

---

## 7-Day Roadmap

- [x] **Day 1** — Dashboard Foundation *(Completed)*
- [x] **Day 2** — Transaction CRUD + LocalStorage *(Completed)*
- [x] **Day 3** — Categories + Search + Filter *(Completed)*
- [x] **Day 4** — Financial Analytics + Charts *(Completed)*
- [x] **Day 5** — Backend API + PostgreSQL *(Completed)*
- [ ] **Day 6** — Authentication + Security + Integration
- [ ] **Day 7** — Testing + Polish + Deployment

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; v24 tested)
- npm (v9 or higher)
- PostgreSQL (v14 or higher)

### Frontend Setup
Clone the repository and install frontend dependencies:

```bash
git clone <repository-url>
cd "Personal expense tracker"
npm install
npm run dev
```

Frontend runs on [http://localhost:5173](http://localhost:5173).

### Backend Setup
Install backend dependencies and configure database:

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

Initialize database:
```bash
psql -U postgres -d expense_tracker -f database/schema.sql
```

Run backend server:
```bash
npm run dev
```

Backend runs on [http://localhost:5000](http://localhost:5000).

### Build
Create an optimized frontend production build:

```bash
npm run build
```

### Lint
Check for code quality issues:

```bash
npm run lint
```
