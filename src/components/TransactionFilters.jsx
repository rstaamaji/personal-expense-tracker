import React from 'react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, ALL_CATEGORIES } from '../utils/constants'
import './TransactionFilters.css'

/**
 * Filter and Search toolbar component for transactions.
 */
export default function TransactionFilters({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  categoryFilter,
  onCategoryChange,
  dateFilter,
  onDateChange,
  onReset,
  totalCount,
  filteredCount,
  hasActiveFilters,
}) {
  // Determine relevant categories based on active type filter
  const categoryOptions =
    typeFilter === 'income'
      ? INCOME_CATEGORIES
      : typeFilter === 'expense'
        ? EXPENSE_CATEGORIES
        : ALL_CATEGORIES

  return (
    <div className="filters-container" role="search" aria-label="Transaction filters and search">
      {/* Row 1: Search + Clear Filters */}
      <div className="filters-top-row">
        <div className="search-wrapper">
          <svg
            className="search-icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by transaction name…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search transactions by name"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-x"
              onClick={() => onSearchChange('')}
              title="Clear search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Type Filter Pills */}
        <div className="type-filter-group" role="group" aria-label="Filter by transaction type">
          <button
            type="button"
            className={`type-filter-btn ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => { onTypeChange('all') }}
          >
            All Types
          </button>
          <button
            type="button"
            className={`type-filter-btn ${typeFilter === 'income' ? 'active-income' : ''}`}
            onClick={() => {
              onTypeChange('income')
              if (!INCOME_CATEGORIES.includes(categoryFilter) && categoryFilter !== 'all') {
                onCategoryChange('all')
              }
            }}
          >
            Income
          </button>
          <button
            type="button"
            className={`type-filter-btn ${typeFilter === 'expense' ? 'active-expense' : ''}`}
            onClick={() => {
              onTypeChange('expense')
              if (!EXPENSE_CATEGORIES.includes(categoryFilter) && categoryFilter !== 'all') {
                onCategoryChange('all')
              }
            }}
          >
            Expense
          </button>
        </div>
      </div>

      {/* Row 2: Category + Date + Clear */}
      <div className="filters-bottom-row">
        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={dateFilter}
          onChange={(e) => onDateChange(e.target.value)}
          aria-label="Filter by date range"
        >
          <option value="all">All Time</option>
          <option value="this_month">This Month</option>
          <option value="this_week">This Week</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-btn"
            onClick={onReset}
            title="Reset all filters"
          >
            <span>✕</span>
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Status Bar */}
      <div className="filters-status-bar">
        <span className="filter-count-text">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> transactions
        </span>

        {hasActiveFilters && (
          <div className="active-filter-chips">
            {searchQuery && (
              <span className="filter-chip">
                "{searchQuery}"
                <span className="filter-chip-remove" onClick={() => onSearchChange('')}>×</span>
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="filter-chip">
                {typeFilter === 'income' ? 'Income' : 'Expense'}
                <span className="filter-chip-remove" onClick={() => onTypeChange('all')}>×</span>
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="filter-chip">
                {categoryFilter}
                <span className="filter-chip-remove" onClick={() => onCategoryChange('all')}>×</span>
              </span>
            )}
            {dateFilter !== 'all' && (
              <span className="filter-chip">
                {dateFilter === 'this_month' ? 'This Month' : 'This Week'}
                <span className="filter-chip-remove" onClick={() => onDateChange('all')}>×</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
