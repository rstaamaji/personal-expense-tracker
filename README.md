# Personal Expense Tracker

A modern personal finance dashboard for tracking income, expenses, transactions, and financial insights.

Built by **Rustam Aji** as part of the **Aji 50 Days GitHub Challenge**.

---

## Project Status

**Day 2 — Transaction CRUD + LocalStorage**

The application now supports full client-side Transaction CRUD functionality backed by browser LocalStorage persistence, live statistics recalculation, Indonesian Rupiah formatting, and robust modal forms with input validation.

---

## Day 2 — Transaction CRUD + LocalStorage

### Implemented:
- **Create transaction**: Interactive modal form to create income and expense transactions with validation.
- **Read transactions**: Dynamic list sorted chronologically (newest first) with category icons and timestamps.
- **Update transaction**: Edit existing transactions via pre-filled modal form with auto-recalculation.
- **Delete transaction**: Safe deletion with dedicated confirmation dialog (no browser `alert()`).
- **LocalStorage persistence**: Storage key `expense_tracker_transactions` handling missing, empty, or corrupted data gracefully.
- **Dynamic balance**: Automatically computed as `Total Income - Total Expense`.
- **Dynamic income**: Sum of all recorded income transactions.
- **Dynamic expense**: Sum of all recorded expense transactions.
- **Dynamic transaction count**: Live count of recorded transactions.
- **Indonesian Rupiah formatting**: Reusable currency formatter producing standard `Rp X.XXX.XXX` formats.
- **Form validation**: Clear inline validation rules (name, positive amount, type, category, date).
- **Responsive transaction interface**: Desktop, tablet, and mobile optimized list, cards, and modal dialogs.
- **Empty state**: Clean placeholder guiding the user when no transactions exist.

### Privacy & Storage Considerations:
- Transactions are stored locally in the browser (`localStorage`) and are **not** sent to a server, external API, GitHub, or third-party database in this version.
- LocalStorage is suitable for this frontend prototype, but it should **NOT** be considered secure storage for passwords, authentication secrets, or highly sensitive financial credentials.
- The application makes no claim of bank-grade security.
- The repository contains only demo and mock transactions.
- Day 2 is strictly frontend-only.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Tooling**: [Vite 8](https://vite.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)
- **State & Storage**: React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) + Browser `localStorage`
- **Styling**: Modern CSS3 (CSS Custom Properties / Variables, Flexbox, CSS Grid)
- **Fonts**: Plus Jakarta Sans & Inter via Google Fonts
- **Package Manager**: npm

---

## Project Structure

```
src/
├── components/
│   ├── DeleteConfirmModal.jsx # Deletion confirmation dialog
│   ├── DeleteConfirmModal.css # Deletion dialog styling
│   ├── Navbar.jsx             # Top navigation with brand & profile
│   ├── Navbar.css             # Navigation styling & responsive breakpoints
│   ├── StatCard.jsx           # Reusable financial summary card component
│   ├── StatCard.css           # Stat card styling & hover animations
│   ├── TransactionForm.jsx    # Add/Edit modal form with validation
│   ├── TransactionForm.css    # Modal form styling & segmented controls
│   ├── TransactionItem.jsx    # Transaction list item with action buttons
│   └── TransactionItem.css    # Transaction row styling
│
├── hooks/
│   └── useTransactions.js     # CRUD operations, LocalStorage sync & live calculations
│
├── pages/
│   ├── Dashboard.jsx          # Main dashboard page
│   └── Dashboard.css          # Layout grid, SVG chart, and transactions styling
│
├── styles/
│   ├── variables.css          # Centralized design tokens (colors, radii, shadows)
│   └── globals.css            # Reset, typography, and base layout styles
│
├── utils/
│   ├── constants.js           # Categories, icons, and default seed data
│   └── formatters.js          # Indonesian Rupiah & date formatters
│
├── App.jsx                    # Application layout container
└── main.jsx                   # React root entry point
```

---

## 7-Day Roadmap

- [x] **Day 1** — Dashboard Foundation
- [x] **Day 2** — Transaction CRUD + LocalStorage *(Completed)*
- [ ] **Day 3** — Categories + Search + Filter
- [ ] **Day 4** — Charts + Financial Analytics
- [ ] **Day 5** — Backend API + PostgreSQL
- [ ] **Day 6** — Authentication + Security + Integration
- [ ] **Day 7** — Testing + Polish + Deployment

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; v24 tested)
- npm (v9 or higher)

### Installation
Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd "Personal expense tracker"
npm install
```

### Development Server
Run the local development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the dashboard.

### Build
Create an optimized production build:

```bash
npm run build
```

### Lint
Check for code quality issues:

```bash
npm run lint
```
