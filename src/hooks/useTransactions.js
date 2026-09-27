import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  STORAGE_KEY,
  INITIAL_TRANSACTIONS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
} from '../utils/constants'
import {
  isDateInThisMonth,
  isDateInThisWeek,
  formatShortDate,
  formatMonthYear,
} from '../utils/formatters'

/**
 * Generate a unique ID using crypto.randomUUID with fallback.
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Validate and sanitize a single transaction item.
 * Ensures properties exist and have valid types.
 */
function isValidTransaction(tx) {
  return (
    tx &&
    typeof tx === 'object' &&
    typeof tx.id === 'string' &&
    typeof tx.title === 'string' &&
    tx.title.trim().length > 0 &&
    (tx.type === 'income' || tx.type === 'expense') &&
    typeof tx.category === 'string' &&
    typeof tx.amount === 'number' &&
    !isNaN(tx.amount) &&
    tx.amount > 0 &&
    typeof tx.date === 'string'
  )
}

/**
 * Read and parse transactions from LocalStorage.
 * Handles missing storage, empty storage, invalid JSON, and corrupted data.
 */
function loadTransactionsFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_TRANSACTIONS
  }

  try {
    const rawData = window.localStorage.getItem(STORAGE_KEY)

    // First visit: storage key does not exist yet -> initialize with initial demo data
    if (rawData === null) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS))
      return INITIAL_TRANSACTIONS
    }

    const parsed = JSON.parse(rawData)

    if (!Array.isArray(parsed)) {
      console.warn('[LocalStorage] Expected array of transactions, received:', typeof parsed)
      return INITIAL_TRANSACTIONS
    }

    // Filter and sanitize corrupted data
    const sanitized = parsed.filter(isValidTransaction)
    return sanitized
  } catch (error) {
    console.error('[LocalStorage] Failed to load transactions from localStorage:', error)
    return INITIAL_TRANSACTIONS
  }
}

/**
 * Custom hook for Transaction CRUD operations, Search, Filtering, and Financial Analytics.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState(() => loadTransactionsFromStorage())

  // Search & Filter State (Day 3)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // 'all' | 'income' | 'expense'
  const [categoryFilter, setCategoryFilter] = useState('all') // 'all' | category name
  const [dateFilter, setDateFilter] = useState('all') // 'all' | 'this_month' | 'this_week'

  // Persist to LocalStorage whenever transactions state changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    } catch (error) {
      console.error('[LocalStorage] Failed to save transactions to localStorage:', error)
    }
  }, [transactions])

  /**
   * Add a new transaction.
   */
  const addTransaction = useCallback((txData) => {
    const newTx = {
      id: generateId(),
      title: txData.title.trim(),
      type: txData.type,
      category: txData.category,
      amount: Math.abs(Number(txData.amount)),
      date: txData.date,
    }

    setTransactions((prev) => [newTx, ...prev])
    return newTx
  }, [])

  /**
   * Update an existing transaction.
   */
  const updateTransaction = useCallback((id, updatedData) => {
    setTransactions((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        return {
          ...item,
          title: updatedData.title ? updatedData.title.trim() : item.title,
          type: updatedData.type || item.type,
          category: updatedData.category || item.category,
          amount: updatedData.amount !== undefined ? Math.abs(Number(updatedData.amount)) : item.amount,
          date: updatedData.date || item.date,
        }
      })
    )
  }, [])

  /**
   * Delete a transaction by ID.
   */
  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id))
  }, [])

  /**
   * Reset all filters back to default.
   */
  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setTypeFilter('all')
    setCategoryFilter('all')
    setDateFilter('all')
  }, [])

  /**
   * Check if any filter is active.
   */
  const hasActiveFilters = Boolean(
    searchQuery.trim().length > 0 ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    dateFilter !== 'all'
  )

  /**
   * Sort transactions chronologically (newest first).
   */
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      if (dateB !== dateA) {
        return dateB - dateA
      }
      return 0
    })
  }, [transactions])

  /**
   * Filtered transactions meeting all active criteria (Day 3).
   */
  const filteredTransactions = useMemo(() => {
    const trimmedSearch = searchQuery.trim().toLowerCase()

    return sortedTransactions.filter((tx) => {
      // Search filter (by title)
      if (trimmedSearch && !tx.title.toLowerCase().includes(trimmedSearch)) {
        return false
      }

      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false
      }

      // Category filter
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
        return false
      }

      // Date filter
      if (dateFilter === 'this_month' && !isDateInThisMonth(tx.date)) {
        return false
      }
      if (dateFilter === 'this_week' && !isDateInThisWeek(tx.date)) {
        return false
      }

      return true
    })
  }, [sortedTransactions, searchQuery, typeFilter, categoryFilter, dateFilter])

  /**
   * Comprehensive Financial Statistics (Day 4).
   */
  const stats = useMemo(() => {
    let totalIncome = 0
    let totalExpense = 0
    let incomeCount = 0
    let expenseCount = 0
    let largestExpense = 0
    let largestIncome = 0

    for (const tx of transactions) {
      if (tx.type === 'income') {
        totalIncome += tx.amount
        incomeCount += 1
        if (tx.amount > largestIncome) {
          largestIncome = tx.amount
        }
      } else if (tx.type === 'expense') {
        totalExpense += tx.amount
        expenseCount += 1
        if (tx.amount > largestExpense) {
          largestExpense = tx.amount
        }
      }
    }

    const totalBalance = totalIncome - totalExpense
    const transactionCount = transactions.length
    const averageExpense = expenseCount > 0 ? Math.round(totalExpense / expenseCount) : 0

    // Savings rate = ((Income - Expense) / Income) * 100
    // Handles zero income safely without NaN or Infinity
    const savingsRate =
      totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      transactionCount,
      incomeCount,
      expenseCount,
      averageExpense,
      largestExpense,
      largestIncome,
      savingsRate,
    }
  }, [transactions])

  /**
   * Expense breakdown by category (Day 4).
   */
  const expenseByCategory = useMemo(() => {
    const map = new Map()

    for (const tx of transactions) {
      if (tx.type === 'expense') {
        const current = map.get(tx.category) || { category: tx.category, amount: 0, count: 0 }
        current.amount += tx.amount
        current.count += 1
        map.set(tx.category, current)
      }
    }

    const totalExpense = stats.totalExpense || 1
    const list = Array.from(map.values()).map((item) => ({
      ...item,
      percentage: Math.round((item.amount / totalExpense) * 100),
      color: CATEGORY_COLORS[item.category] || '#64748b',
      icon: CATEGORY_ICONS[item.category] || '🏷️',
    }))

    // Sort by amount descending
    return list.sort((a, b) => b.amount - a.amount)
  }, [transactions, stats.totalExpense])

  /**
   * Income breakdown by category (Day 4).
   */
  const incomeByCategory = useMemo(() => {
    const map = new Map()

    for (const tx of transactions) {
      if (tx.type === 'income') {
        const current = map.get(tx.category) || { category: tx.category, amount: 0, count: 0 }
        current.amount += tx.amount
        current.count += 1
        map.set(tx.category, current)
      }
    }

    const totalIncome = stats.totalIncome || 1
    const list = Array.from(map.values()).map((item) => ({
      ...item,
      percentage: Math.round((item.amount / totalIncome) * 100),
      color: CATEGORY_COLORS[item.category] || '#10b981',
      icon: CATEGORY_ICONS[item.category] || '💰',
    }))

    return list.sort((a, b) => b.amount - a.amount)
  }, [transactions, stats.totalIncome])

  /**
   * Income vs Expense comparison dataset (Day 4).
   * Grouped chronologically by month (YYYY-MM).
   */
  const incomeVsExpenseData = useMemo(() => {
    if (transactions.length === 0) return []

    const map = new Map()

    // Aggregate by month
    for (const tx of transactions) {
      const monthKey = tx.date ? tx.date.substring(0, 7) : '2026-09'
      const existing = map.get(monthKey) || {
        monthKey,
        name: formatMonthYear(tx.date) || monthKey,
        Income: 0,
        Expense: 0,
      }

      if (tx.type === 'income') {
        existing.Income += tx.amount
      } else {
        existing.Expense += tx.amount
      }

      map.set(monthKey, existing)
    }

    // Sort chronologically
    return Array.from(map.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey))
  }, [transactions])

  /**
   * Spending Trend dataset (Day 4).
   * Expenses aggregated chronologically by date.
   */
  const spendingTrendData = useMemo(() => {
    const map = new Map()

    for (const tx of transactions) {
      if (tx.type === 'expense') {
        const dateKey = tx.date
        const existing = map.get(dateKey) || {
          date: dateKey,
          label: formatShortDate(dateKey),
          amount: 0,
        }
        existing.amount += tx.amount
        map.set(dateKey, existing)
      }
    }

    // Sort chronologically ascending for the timeline
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
  }, [transactions])

  return {
    transactions: sortedTransactions,
    filteredTransactions,
    stats,
    expenseByCategory,
    incomeByCategory,
    incomeVsExpenseData,
    spendingTrendData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    // Filters
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    dateFilter,
    setDateFilter,
    resetFilters,
    hasActiveFilters,
  }
}
