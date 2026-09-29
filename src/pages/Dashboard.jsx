import React, { useState, useCallback } from 'react'
import StatCard from '../components/StatCard'
import AnalyticsSection from '../components/AnalyticsSection'
import AnimatedEye from '../components/AnimatedEye'
import TransactionFilters from '../components/TransactionFilters'
import TransactionItem from '../components/TransactionItem'
import TransactionForm from '../components/TransactionForm'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import SkeletonLoader, { SkeletonStatCard, SkeletonChartCard } from '../components/SkeletonLoader'
import ApiErrorBanner from '../components/ApiErrorBanner'
import Toast from '../components/Toast'
import { useTransactions } from '../hooks/useTransactions'
import { useAuth } from '../hooks/useAuth'
import { formatRupiah } from '../utils/formatters'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const {
    transactions,
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
    // Filters (Day 3)
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
  } = useTransactions()

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deletingTransaction, setDeletingTransaction] = useState(null)
  const [deleteConfirming, setDeleteConfirming] = useState(false)

  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  const dismissToast = useCallback(() => {
    setToast({ message: '', type: 'success' })
  }, [])

  // Open modal in Add mode
  const handleOpenAdd = () => {
    setEditingTransaction(null)
    setIsFormOpen(true)
  }

  // Open modal in Edit mode
  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx)
    setIsFormOpen(true)
  }

  // Handle form submission (Add or Edit)
  const handleFormSubmit = async (data) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data)
        showToast(`"${data.title}" updated successfully.`, 'success')
      } else {
        await addTransaction(data)
        showToast(`"${data.title}" added successfully.`, 'success')
      }
    } catch {
      showToast('Failed to save transaction. Please try again.', 'error')
    }
  }

  // Open delete confirmation modal
  const handleOpenDelete = (tx) => {
    setDeletingTransaction(tx)
  }

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return
    const titleCopy = deletingTransaction.title
    setDeleteConfirming(true)
    try {
      await deleteTransaction(deletingTransaction.id)
      setDeletingTransaction(null)
      showToast(`"${titleCopy}" deleted.`, 'success')
    } catch {
      showToast('Failed to delete transaction. Please try again.', 'error')
    } finally {
      setDeleteConfirming(false)
    }
  }

  // Cancel delete
  const handleCancelDelete = () => {
    setDeletingTransaction(null)
  }

  // Calculate expense ratio percentage for supporting text
  const expenseRatio =
    stats.totalIncome > 0
      ? Math.round((stats.totalExpense / stats.totalIncome) * 100)
      : 0

  const hasData = transactions.length > 0

  return (
    <div className="dashboard">
      {/* ================================================
          Toast Notification
          ================================================ */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={dismissToast}
      />

      {/* ==================================================
          Header Section
          ================================================== */}
      <header className="dashboard-header" id="dashboard">
        <div className="dashboard-title-group">
          <h1 className="dashboard-title">Good morning, {user?.name || 'Rustam Aji'} 👋</h1>
          <p className="dashboard-subtitle">Here's an overview of your finances.</p>
        </div>

        <div className="dashboard-header-actions">
          <div className="date-indicator">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          <button
            type="button"
            className="header-action-btn"
            onClick={handleOpenAdd}
            aria-label="Add a new transaction"
          >
            <span>+ Add Transaction</span>
          </button>
        </div>
      </header>

      {/* ==================================================
          Summary Cards (Live Dynamic Statistics)
          ================================================== */}
      <section className="summary-grid" aria-label="Financial Summary Cards">
        {loading ? (
          <>
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </>
        ) : (
          <>
            <StatCard
              label="Total Balance"
              value={formatRupiah(stats.totalBalance)}
              subtext={stats.totalBalance >= 0 ? 'Net positive savings' : 'Expenses exceed income'}
              type="balance"
              badgeText={stats.totalBalance >= 0 ? 'Healthy' : 'Deficit'}
              badgeTrend={stats.totalBalance >= 0 ? 'up' : 'down'}
            />

            <StatCard
              label="Total Income"
              value={formatRupiah(stats.totalIncome)}
              subtext="Total earned funds"
              type="income"
              badgeText="Active"
              badgeTrend="up"
            />

            <StatCard
              label="Total Expense"
              value={formatRupiah(stats.totalExpense)}
              subtext={`${expenseRatio}% of income spent`}
              type="expense"
              badgeText="Spent"
              badgeTrend="down"
            />

            <StatCard
              label="Transactions"
              value={String(stats.transactionCount)}
              subtext="Stored in PostgreSQL"
              type="transactions"
              badgeText={`${stats.transactionCount} total`}
              badgeTrend="neutral"
            />
          </>
        )}
      </section>

      {/* ==================================================
          Financial Analytics & Charts (Day 4)
          ================================================== */}
      <div id="analytics-section">
        <div className="section-header-block">
          <div className="section-title-wrap">
            <h2 className="section-title">Financial Vision</h2>
            <p className="section-subtitle">Real-time intelligence, trend models, and category distributions</p>
          </div>
        </div>

        {loading ? (
          /* Analytics loading skeleton */
          <div className="analytics-skeleton-grid">
            <SkeletonChartCard />
            <SkeletonChartCard />
          </div>
        ) : !hasData ? (
          /* Analytics empty state — no transactions at all */
          <div className="analytics-empty-hero">
            <div className="analytics-empty-hero-icon" aria-hidden="true">📊</div>
            <h3 className="analytics-empty-hero-title">No data to analyse yet</h3>
            <p className="analytics-empty-hero-desc">
              Add your first income or expense transaction to start seeing charts, trends, and category breakdowns here.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={handleOpenAdd}
            >
              + Add First Transaction
            </button>
          </div>
        ) : (
          /* Full analytics — Eye hero + charts */
          <>
            {/* Animated Eye Hero */}
            <div className="analytics-eye-hero">
              <AnimatedEye stats={stats} />
            </div>

            <AnalyticsSection
              stats={stats}
              expenseByCategory={expenseByCategory}
              incomeByCategory={incomeByCategory}
              incomeVsExpenseData={incomeVsExpenseData}
              spendingTrendData={spendingTrendData}
            />
          </>
        )}
      </div>

      {/* ==================================================
          Transactions Section with Search & Filtering (Day 3)
          ================================================== */}
      <div id="transactions-section">
        <div className="section-header-block">
          <div className="section-title-wrap">
            <h2 className="section-title">Transaction Activity</h2>
            <p className="section-subtitle">
              Search, filter, and manage your income and expenses
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={handleOpenAdd}
            aria-label="Add transaction"
          >
            + Add Transaction
          </button>
        </div>

        <section className="dashboard-card" style={{ gap: '1rem', marginTop: '1rem' }} aria-label="Transaction records and search">
          {/* API Error Banner */}
          {error && (
            <div style={{ padding: '1rem 1.25rem 0' }}>
              <ApiErrorBanner
                error={error}
                onRetry={fetchTransactions}
                onDismiss={clearError}
              />
            </div>
          )}

          {/* Search and Filters Toolbar (Day 3) */}
          <TransactionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            dateFilter={dateFilter}
            onDateChange={setDateFilter}
            onReset={resetFilters}
            totalCount={transactions.length}
            filteredCount={filteredTransactions.length}
            hasActiveFilters={hasActiveFilters}
          />

          {loading ? (
            /* Loading skeleton */
            <SkeletonLoader rows={5} />
          ) : transactions.length === 0 ? (
            /* State 1: No transactions in storage */
            <div className="transactions-empty-state">
              <div className="empty-state-icon" aria-hidden="true">🧾</div>
              <h3 className="empty-state-title">No transactions yet.</h3>
              <p className="empty-state-desc">
                Add your first transaction to start tracking your finances.
              </p>
              <button
                type="button"
                className="btn-primary empty-state-btn"
                onClick={handleOpenAdd}
              >
                + Add First Transaction
              </button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            /* State 2 & 3: Filter or Search yielded 0 results */
            <div className="transactions-empty-state">
              <div className="empty-state-icon" aria-hidden="true">🔍</div>
              <h3 className="empty-state-title">
                {searchQuery.trim().length > 0
                  ? 'No transactions match your search.'
                  : 'No transactions match the selected filters.'}
              </h3>
              <p className="empty-state-desc">
                {searchQuery.trim().length > 0
                  ? `No records found containing "${searchQuery}". Try a different keyword or reset filters.`
                  : 'Try adjusting your type, category, or date range to see more results.'}
              </p>
              <div className="empty-state-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetFilters}
                >
                  Clear Filters
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleOpenAdd}
                >
                  + Add New
                </button>
              </div>
            </div>
          ) : (
            /* State 4: Filtered Transactions List */
            <ul className="transactions-list">
              {filteredTransactions.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ==================================================
          Transaction Modal (Add / Edit)
          ================================================== */}
      {isFormOpen && (
        <TransactionForm
          key={editingTransaction ? editingTransaction.id : 'add-transaction'}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingTransaction}
        />
      )}

      {/* ==================================================
          Delete Confirmation Modal
          ================================================== */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingTransaction)}
        transactionTitle={deletingTransaction?.title || ''}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        confirming={deleteConfirming}
      />
    </div>
  )
}
