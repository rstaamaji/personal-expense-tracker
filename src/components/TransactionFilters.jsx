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
    <div className="transaction-filters" role="search" aria-label="Transaction filters and search">
      {/* Top Row: Search Input */}
      <div className="filters-main-row">
        <div className="filter-search-box">
          <svg
            className="search-icon"
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            className="filter-search-input"
            placeholder="Search by transaction name... (e.g. Makan, Salary)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search transactions by name"
          />

          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}
        </div>

        {/* Clear Filters Button (shown when any filter is active) */}
        {hasActiveFilters && (
          <button
            type="button"
            className="clear-filters-btn"
            onClick={onReset}
            title="Reset search and all active filters"
          >
            <span>✕</span>
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Controls Row: Type Pills, Category Dropdown, Date Dropdown */}
      <div className="filters-controls-row">
        <div className="filters-left-group">
          {/* Type Segmented Filter */}
          <div className="type-filter-group" role="group" aria-label="Filter by transaction type">
            <button
              type="button"
              className={`type-filter-btn ${typeFilter === 'all' ? 'active' : ''}`}
              onClick={() => {
                onTypeChange('all')
                if (!ALL_CATEGORIES.includes(categoryFilter) && categoryFilter !== 'all') {
                  onCategoryChange('all')
                }
              }}
            >
              All Types
            </button>
            <button
              type="button"
              className={`type-filter-btn ${typeFilter === 'income' ? 'active' : ''}`}
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
              className={`type-filter-btn ${typeFilter === 'expense' ? 'active' : ''}`}
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

          {/* Category Dropdown */}
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Date Filter Dropdown */}
          <select
            className="filter-select"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            aria-label="Filter by date range"
          >
            <option value="all">All Time</option>
            <option value="this_month">This Month</option>
            <option value="this_week">This Week (Last 7 Days)</option>
          </select>
        </div>
      </div>

      {/* Status Bar */}
      <div className="filters-status-bar">
        <span>
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> transactions
        </span>

        {hasActiveFilters && (
          <div className="active-filter-chips">
            {searchQuery && (
              <span className="filter-chip">
                "{searchQuery}"
                <span className="chip-remove" onClick={() => onSearchChange('')}>
                  ×
                </span>
              </span>
            )}
            {typeFilter !== 'all' && (
              <span className="filter-chip">
                {typeFilter === 'income' ? 'Income' : 'Expense'}
                <span className="chip-remove" onClick={() => onTypeChange('all')}>
                  ×
                </span>
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="filter-chip">
                {categoryFilter}
                <span className="chip-remove" onClick={() => onCategoryChange('all')}>
                  ×
                </span>
              </span>
            )}
            {dateFilter !== 'all' && (
              <span className="filter-chip">
                {dateFilter === 'this_month' ? 'This Month' : 'This Week'}
                <span className="chip-remove" onClick={() => onDateChange('all')}>
                  ×
                </span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
