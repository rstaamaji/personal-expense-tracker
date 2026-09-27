/**
 * Constants for Transaction categories, storage keys, and visual tokens.
 */

export const STORAGE_KEY = 'expense_tracker_transactions'

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Education',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Other',
]

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Other',
]

export const ALL_CATEGORIES = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES.filter((c) => !EXPENSE_CATEGORIES.includes(c)),
]

export const CATEGORY_ICONS = {
  Food: '🍔',
  Transportation: '🚗',
  Education: '📚',
  Shopping: '🛍️',
  Bills: '🧾',
  Entertainment: '🎬',
  Health: '💊',
  Salary: '💰',
  Freelance: '💼',
  Business: '📈',
  Other: '🏷️',
}

export const CATEGORY_COLORS = {
  Food: '#f97316',
  Transportation: '#3b82f6',
  Education: '#8b5cf6',
  Shopping: '#ec4899',
  Bills: '#eab308',
  Entertainment: '#06b6d4',
  Health: '#14b8a6',
  Salary: '#10b981',
  Freelance: '#6366f1',
  Business: '#0ea5e9',
  Other: '#64748b',
}

/**
 * Palette array for chart distribution
 */
export const CHART_PALETTE = [
  '#7c3aed',
  '#10b981',
  '#f59e0b',
  '#3b82f6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#6366f1',
  '#f43f5e',
  '#64748b',
]

/**
 * Initial demo data seeded only if local storage has never been initialized.
 */
export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Makan Siang',
    type: 'expense',
    category: 'Food',
    amount: 25000,
    date: '2026-09-27',
  },
  {
    id: 'tx-2',
    title: 'Transportasi',
    type: 'expense',
    category: 'Transportation',
    amount: 15000,
    date: '2026-09-27',
  },
  {
    id: 'tx-3',
    title: 'Freelance Project',
    type: 'income',
    category: 'Freelance',
    amount: 500000,
    date: '2026-09-26',
  },
  {
    id: 'tx-4',
    title: 'Buku Kuliah',
    type: 'expense',
    category: 'Education',
    amount: 75000,
    date: '2026-09-24',
  },
]
