import React, { useState } from 'react'
import StatCard from '../components/StatCard'
import TransactionItem from '../components/TransactionItem'
import TransactionForm from '../components/TransactionForm'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { useTransactions } from '../hooks/useTransactions'
import { formatRupiah } from '../utils/formatters'
import './Dashboard.css'

const MOCK_MONTHLY_CHART = [
  { month: 'Apr', expense: 1200000, height: 40 },
  { month: 'May', expense: 1900000, height: 65 },
  { month: 'Jun', expense: 1400000, height: 48 },
  { month: 'Jul', expense: 2100000, height: 72 },
  { month: 'Aug', expense: 1600000, height: 55 },
  { month: 'Sep', expense: 1750000, height: 60, current: true },
]

export default function Dashboard() {
  const {
    transactions,
    stats,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions()

  const [activeTimeframe, setActiveTimeframe] = useState('6M')
  const [hoveredMonth, setHoveredMonth] = useState('Sep')

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deletingTransaction, setDeletingTransaction] = useState(null)

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
  const handleFormSubmit = (data) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data)
    } else {
      addTransaction(data)
    }
  }

  // Open delete confirmation modal
  const handleOpenDelete = (tx) => {
    setDeletingTransaction(tx)
  }

  // Confirm delete
  const handleConfirmDelete = () => {
    if (deletingTransaction) {
      deleteTransaction(deletingTransaction.id)
      setDeletingTransaction(null)
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

  return (
    <div className="dashboard">
      {/* ==================================================
          Header Section
          ================================================== */}
      <header className="dashboard-header">
        <div className="dashboard-title-group">
          <h1 className="dashboard-title">Good morning, Aji 👋</h1>
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
            <span>September 27, 2026</span>
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
          Summary Cards (Dynamic Statistics)
          ================================================== */}
      <section className="summary-grid" aria-label="Financial Summary Cards">
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
          subtext="Stored in LocalStorage"
          type="transactions"
          badgeText={`${stats.transactionCount} total`}
          badgeTrend="neutral"
        />
      </section>

      {/* ==================================================
          Main Dashboard Content (Two Columns)
          ================================================== */}
      <div className="dashboard-main-grid">
        {/* SECTION A: Spending Overview */}
        <section className="dashboard-card" aria-label="Spending Overview">
          <div className="card-header-row">
            <div className="card-title-group">
              <h2 className="card-title">Spending Overview</h2>
              <span className="card-subtitle">Monthly spending</span>
            </div>

            <div className="chart-filter-pills">
              <button
                type="button"
                className={`chart-filter-btn ${activeTimeframe === '6M' ? 'active' : ''}`}
                onClick={() => setActiveTimeframe('6M')}
              >
                6 Months
              </button>
              <button
                type="button"
                className={`chart-filter-btn ${activeTimeframe === '1Y' ? 'active' : ''}`}
                onClick={() => setActiveTimeframe('1Y')}
              >
                This Year
              </button>
            </div>
          </div>

          {/* Visual SVG Chart Placeholder without external libraries */}
          <div className="chart-visual-wrapper">
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot purple" />
                <span>Monthly Spending</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot emerald" />
                <span>Budget Limit (Rp 2.5M)</span>
              </div>
            </div>

            <svg
              className="svg-chart"
              viewBox="0 0 540 200"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Spending bar chart showing monthly expenses from April to September"
            >
              {/* Background horizontal grid lines */}
              <line x1="50" y1="30" x2="520" y2="30" className="chart-grid-line" />
              <text x="42" y="34" className="chart-grid-text" textAnchor="end">Rp 3M</text>

              <line x1="50" y1="80" x2="520" y2="80" className="chart-grid-line" />
              <text x="42" y="84" className="chart-grid-text" textAnchor="end">Rp 2M</text>

              <line x1="50" y1="130" x2="520" y2="130" className="chart-grid-line" />
              <text x="42" y="134" className="chart-grid-text" textAnchor="end">Rp 1M</text>

              <line x1="50" y1="170" x2="520" y2="170" stroke="#cbd5e1" strokeWidth="1" />
              <text x="42" y="174" className="chart-grid-text" textAnchor="end">Rp 0</text>

              {/* Target budget reference line */}
              <line
                x1="50"
                y1="55"
                x2="520"
                y2="55"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity="0.75"
              />

              {/* Monthly Bars */}
              {MOCK_MONTHLY_CHART.map((item, index) => {
                const barWidth = 38
                const spacing = 75
                const x = 75 + index * spacing
                const barHeight = item.height * 1.8
                const y = 170 - barHeight
                const isSelected = hoveredMonth === item.month

                return (
                  <g
                    key={item.month}
                    className={`chart-bar-group ${isSelected ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredMonth(item.month)}
                  >
                    {/* Background bar highlight */}
                    <rect
                      x={x - 4}
                      y="20"
                      width={barWidth + 8}
                      height="150"
                      rx="8"
                      fill={isSelected ? '#f3e8ff' : 'transparent'}
                      opacity={isSelected ? 0.6 : 0}
                    />

                    {/* Primary Bar */}
                    <rect
                      className="bar-primary"
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="6"
                      fill={item.current ? '#7c3aed' : '#c4b5fd'}
                    />

                    {/* Month Label */}
                    <text
                      x={x + barWidth / 2}
                      y="190"
                      className={`chart-month-label ${isSelected ? 'active' : ''}`}
                    >
                      {item.month}
                    </text>

                    {/* Value Pill on Active Bar */}
                    {isSelected && (
                      <g>
                        <rect
                          x={x - 14}
                          y={y - 28}
                          width={barWidth + 28}
                          height="22"
                          rx="4"
                          fill="#1e1b4b"
                        />
                        <text
                          x={x + barWidth / 2}
                          y={y - 13}
                          fill="#ffffff"
                          fontSize="9.5"
                          fontWeight="700"
                          textAnchor="middle"
                          fontFamily="sans-serif"
                        >
                          Rp {(item.expense / 1000000).toFixed(2)}M
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}
            </svg>

            <div className="chart-footer-note">
              <span>Showing 6-month historical spending pattern</span>
              <span className="chart-highlight-badge">
                Selected: {hoveredMonth} ({formatRupiah(stats.totalExpense)})
              </span>
            </div>
          </div>
        </section>

        {/* SECTION B: Recent Transactions (Dynamic CRUD List) */}
        <section className="dashboard-card" aria-label="Recent Transactions">
          <div className="card-header-row">
            <div className="card-title-group">
              <h2 className="card-title">Recent Transactions</h2>
              <span className="card-subtitle">
                {transactions.length > 0
                  ? `${transactions.length} recorded movements`
                  : 'Latest account movements'}
              </span>
            </div>

            {transactions.length > 0 && (
              <button
                type="button"
                className="view-all-link"
                onClick={handleOpenAdd}
              >
                + Add New
              </button>
            )}
          </div>

          {/* Dynamic Transaction List or Clean Empty State */}
          {transactions.length === 0 ? (
            <div className="transactions-empty-state">
              <div className="empty-state-icon" aria-hidden="true">
                🧾
              </div>
              <h3 className="empty-state-title">No transactions yet</h3>
              <p className="empty-state-desc">
                Add your first transaction to start tracking your finances.
              </p>
              <button
                type="button"
                className="btn-primary empty-state-btn"
                onClick={handleOpenAdd}
              >
                + Add Transaction
              </button>
            </div>
          ) : (
            <ul className="transactions-list">
              {transactions.map((tx) => (
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
          Empty / Future State Hint
          ================================================== */}
      <section className="future-insights-card" aria-label="Future Insights">
        <div className="insights-content">
          <div className="insights-icon" aria-hidden="true">
            💡
          </div>
          <div className="insights-text-group">
            <h3 className="insights-title">Smart Financial Insights</h3>
            <p className="insights-desc">
              Your financial insights will appear here. Automated spending trends,
              budget health alerts, and savings opportunities will unlock on Day 4.
            </p>
          </div>
        </div>

        <span className="insights-badge">Roadmap: Day 4</span>
      </section>

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
      />
    </div>
  )
}
