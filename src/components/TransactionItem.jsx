import React from 'react'
import { formatRupiah, formatDate } from '../utils/formatters'
import { CATEGORY_ICONS } from '../utils/constants'
import './TransactionItem.css'

/**
 * Single transaction list item component.
 *
 * @param {object} props
 * @param {object} props.transaction
 * @param {(tx: object) => void} props.onEdit
 * @param {(tx: object) => void} props.onDelete
 */
export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const { title, type, category, amount, date } = transaction

  const icon = CATEGORY_ICONS[category] || (type === 'income' ? '💰' : '🏷️')
  const formattedAmount = formatRupiah(amount, { showSign: true, type })
  const formattedDate = formatDate(date)

  return (
    <li className="transaction-item">
      {/* Left: Category Icon & Details */}
      <div className="transaction-left">
        <div
          className={`category-icon-box ${type}`}
          aria-hidden="true"
        >
          {icon}
        </div>
        <div className="transaction-details">
          <span className="transaction-title" title={title}>
            {title}
          </span>
          <div className="transaction-meta">
            <span className="category-tag">{category}</span>
            <span className="meta-separator" aria-hidden="true">·</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Right: Amount, Badge, and Action Buttons */}
      <div className="transaction-right">
        <div className="transaction-amount-wrapper">
          <span className={`transaction-amount ${type}`}>
            {formattedAmount}
          </span>
          <span className={`transaction-badge ${type}`}>
            {type === 'income' ? 'Income' : 'Expense'}
          </span>
        </div>

        <div className="transaction-actions">
          <button
            type="button"
            className="action-icon-btn edit-btn"
            title="Edit transaction"
            aria-label={`Edit transaction ${title}`}
            onClick={() => onEdit(transaction)}
          >
            <svg
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
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          <button
            type="button"
            className="action-icon-btn delete-btn"
            title="Delete transaction"
            aria-label={`Delete transaction ${title}`}
            onClick={() => onDelete(transaction)}
          >
            <svg
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
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  )
}
