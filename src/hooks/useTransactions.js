import { useState, useEffect, useMemo, useCallback } from 'react'
import { STORAGE_KEY, INITIAL_TRANSACTIONS } from '../utils/constants'

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
    // Fallback to initial transactions
    return INITIAL_TRANSACTIONS
  }
}

/**
 * Custom hook for Transaction CRUD operations and dynamic statistics.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState(() => loadTransactionsFromStorage())

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
   * @param {Omit<import('../types').Transaction, 'id'>} txData
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
   * @param {string} id
   * @param {Partial<import('../types').Transaction>} updatedData
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
   * @param {string} id
   */
  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id))
  }, [])

  /**
   * Sort transactions by date (newest first).
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
   * Dynamic statistics calculated from live transactions.
   */
  const stats = useMemo(() => {
    let totalIncome = 0
    let totalExpense = 0

    for (const tx of transactions) {
      if (tx.type === 'income') {
        totalIncome += tx.amount
      } else if (tx.type === 'expense') {
        totalExpense += tx.amount
      }
    }

    const totalBalance = totalIncome - totalExpense
    const transactionCount = transactions.length

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      transactionCount,
    }
  }, [transactions])

  return {
    transactions: sortedTransactions,
    rawTransactions: transactions,
    stats,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
