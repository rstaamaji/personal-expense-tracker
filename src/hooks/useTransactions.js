/**
 * useTransactions.js
 * Custom hook for Transaction CRUD operations, Search, Filtering, and Financial Analytics.
 * Connected to the authenticated PostgreSQL backend API (Day 6).
 */
import { useState, useEffect, useMemo, useCallback } from 'react'
import { api } from '../utils/api'
import { useAuth } from './useAuth'
import {
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
 * Normalizes backend transaction row into frontend representation.
 */
function normalizeTransaction(row) {
  let dateStr = row.transaction_date || row.date || new Date().toISOString().slice(0, 10)
  if (typeof dateStr === 'string' && dateStr.length > 10) {
    dateStr = dateStr.slice(0, 10)
  }

  return {
    id: row.id,
    title: row.title || '',
    type: row.type || 'expense',
    category: row.category || 'Other',
    amount: Number(row.amount) || 0,
    date: dateStr,
    description: row.description || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export function useTransactions() {
  const { isAuthenticated, user } = useAuth()

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Search & Filter State (Day 3)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // 'all' | 'income' | 'expense'
  const [categoryFilter, setCategoryFilter] = useState('all') // 'all' | category name
  const [dateFilter, setDateFilter] = useState('all') // 'all' | 'this_month' | 'this_week'

  /**
   * Fetch all transactions from PostgreSQL API for the authenticated user.
   */
  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated) {
      setTransactions([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/transactions')
      if (res && res.data && Array.isArray(res.data)) {
        setTransactions(res.data.map(normalizeTransaction))
      } else {
        setTransactions([])
      }
    } catch (err) {
      console.warn('[Transactions] Fetch failed:', err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    let isMounted = true
    api.get('/transactions')
      .then((res) => {
        if (!isMounted) return
        if (res && res.data && Array.isArray(res.data)) {
          setTransactions(res.data.map(normalizeTransaction))
        } else {
          setTransactions([])
        }
      })
      .catch((err) => {
        if (!isMounted) return
        console.warn('[Transactions] Fetch failed:', err.message)
        setError(err.message)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, user?.id])

  /**
   * Add a new transaction via POST /api/transactions.
   */
  const addTransaction = useCallback(async (txData) => {
    try {
      setError(null)
      const payload = {
        title: txData.title.trim(),
        type: txData.type,
        category: txData.category,
        amount: Math.abs(Number(txData.amount)),
        transaction_date: txData.date,
        description: txData.description || null,
      }

      const res = await api.post('/transactions', payload)
      if (res && res.data) {
        const created = normalizeTransaction(res.data)
        setTransactions((prev) => [created, ...prev])
        return { success: true, data: created }
      }
      throw new Error((res && res.message) || 'Failed to create transaction')
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  /**
   * Update an existing transaction via PUT /api/transactions/:id.
   */
  const updateTransaction = useCallback(async (id, updatedData) => {
    try {
      setError(null)
      const payload = {
        title: updatedData.title.trim(),
        type: updatedData.type,
        category: updatedData.category,
        amount: Math.abs(Number(updatedData.amount)),
        transaction_date: updatedData.date,
        description: updatedData.description || null,
      }

      const res = await api.put(`/transactions/${id}`, payload)
      if (res && res.data) {
        const updated = normalizeTransaction(res.data)
        setTransactions((prev) => prev.map((item) => (item.id === id ? updated : item)))
        return { success: true, data: updated }
      }
      throw new Error((res && res.message) || 'Failed to update transaction')
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  /**
   * Delete a transaction by ID via DELETE /api/transactions/:id.
   */
  const deleteTransaction = useCallback(async (id) => {
    try {
      setError(null)
      await api.delete(`/transactions/${id}`)
      setTransactions((prev) => prev.filter((item) => item.id !== id))
      return { success: true }
    } catch (err) {
      setError(err.message)
      throw err
    }
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

      // Date range filter
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
   * Financial summary metrics and key analytics indicators (Day 4).
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
    const savingsRate =
      totalIncome > 0
        ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
        : totalExpense > 0
          ? -100
          : 0

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
   * Category spending breakdown for expense transactions (Day 4).
   */
  const expenseByCategory = useMemo(() => {
    const map = new Map()

    for (const tx of transactions) {
      if (tx.type === 'expense') {
        const current = map.get(tx.category) || {
          category: tx.category,
          amount: 0,
          count: 0,
        }
        current.amount += tx.amount
        current.count += 1
        map.set(tx.category, current)
      }
    }

    const totalExpense = stats.totalExpense || 1
    const list = Array.from(map.values()).map((item) => ({
      ...item,
      percentage: Math.round((item.amount / totalExpense) * 100),
      color: CATEGORY_COLORS[item.category] || '#a855f7',
      icon: CATEGORY_ICONS[item.category] || '🏷️',
    }))

    return list.sort((a, b) => b.amount - a.amount)
  }, [transactions, stats.totalExpense])

  /**
   * Category earnings breakdown for income transactions (Day 4).
   */
  const incomeByCategory = useMemo(() => {
    const map = new Map()

    for (const tx of transactions) {
      if (tx.type === 'income') {
        const current = map.get(tx.category) || {
          category: tx.category,
          amount: 0,
          count: 0,
        }
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

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
  }, [transactions])

  const clearError = () => setError(null)

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
    fetchTransactions,
    loading,
    error,
    clearError,
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
