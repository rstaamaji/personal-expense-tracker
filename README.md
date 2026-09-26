# Personal Expense Tracker

A modern personal finance dashboard for tracking income, expenses, transactions, and financial insights.

Built by **Rustam Aji** as part of the **Aji 50 Days GitHub Challenge**.

---

## Project Status

**Day 1 — Foundation**

The core visual and architectural foundation of the Personal Expense Tracker has been established. The application features a clean, responsive SaaS dashboard layout with static mock data, preparing the structural baseline for upcoming state management, forms, storage, and charts.

---

## Features

### Currently Implemented (Day 1)
- **Dashboard UI**: Clean, professional SaaS finance dashboard layout designed desktop-first and fully mobile-friendly.
- **Header & Profile**: Personal greeting (`Good morning, Aji 👋`), date indicator, and workspace avatar badge.
- **Summary Cards**: Four reusable stat cards (`StatCard.jsx`) showcasing Total Balance, Total Income, Total Expense, and Transactions count with trend badges and distinct status accents.
- **Recent Transactions Mockup**: Formatted transaction stream highlighting categorization, contextual icons, timestamps, and income/expense status.
- **Spending Overview Placeholder**: Pure SVG historical monthly spending graph with interactive hover highlights, grid lines, and budget reference line (no heavy third-party chart dependencies).
- **Future Insights Hint**: Empty state preview card indicating upcoming analytics and AI recommendations for Day 6.
- **Responsive Layout**: Fluid CSS Grid and Flexbox system supporting desktop (4 columns), tablet (2x2 grid), and mobile (single column) without horizontal overflow.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler & Tooling**: [Vite 8](https://vite.dev/)
- **Linter**: [Oxlint](https://oxc.rs/)
- **Styling**: Modern CSS3 (CSS Custom Properties / Variables, Flexbox, CSS Grid)
- **Fonts**: Plus Jakarta Sans & Inter via Google Fonts
- **Package Manager**: npm

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Reusable top navigation with brand & profile
│   ├── Navbar.css          # Navigation styling & responsive breakpoints
│   ├── StatCard.jsx        # Reusable financial summary card component
│   └── StatCard.css        # Stat card styling & hover animations
│
├── pages/
│   ├── Dashboard.jsx       # Main dashboard page containing sections A & B
│   └── Dashboard.css       # Layout grid, SVG chart, and transactions styling
│
├── styles/
│   ├── variables.css       # Centralized design tokens (colors, radii, shadows)
│   └── globals.css         # Reset, typography, and base layout styles
│
├── App.jsx                 # Application layout container
└── main.jsx                # React root entry point
```

---

## Roadmap (50 Days Challenge - Days 1 to 10)

- [x] **Day 1** — Dashboard foundation *(Completed)*
- [ ] **Day 2** — Dashboard improvements
- [ ] **Day 3** — Transaction form
- [ ] **Day 4** — LocalStorage
- [ ] **Day 5** — Transaction history
- [ ] **Day 6** — Analytics
- [ ] **Day 7** — Charts
- [ ] **Day 8** — UI/UX improvements
- [ ] **Day 9** — Refactoring and testing
- [ ] **Day 10** — Deployment and documentation

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
