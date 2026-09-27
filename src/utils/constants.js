/**
 * Constants for Transaction categories and storage keys.
 */

export const STORAGE_KEY = 'expense_tracker_transactions'

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Education',
  'Shopping',
  'Bills',
  'Entertainment',
  'Other',
]

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Other',
]

export const CATEGORY_ICONS = {
  Food: '🍔',
  Transportation: '🚗',
  Education: '📚',
  Shopping: '🛍️',
  Bills: '🧾',
  Entertainment: '🎬',
  Salary: '💰',
  Freelance: '💼',
  Business: '📈',
  Other: '🏷️',
}

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
