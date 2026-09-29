import React, { useState, useEffect, useRef } from 'react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants'
import { getTodayDateString } from '../utils/formatters'
import './TransactionForm.css'

/**
 * TransactionForm modal component for creating and editing transactions.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {() => void} props.onClose - Modal close handler
 * @param {(data: object) => void} props.onSubmit - Submission handler
 * @param {object|null} [props.initialData] - Data for editing (null for add mode)
 */
export default function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const isEditMode = Boolean(initialData && initialData.id)

  const [title, setTitle] = useState(initialData?.title || '')
  const [amount, setAmount] = useState(
    initialData?.amount !== undefined ? String(initialData.amount) : ''
  )
  const [type, setType] = useState(initialData?.type || 'expense')
  const [category, setCategory] = useState(
    initialData?.category ||
      (initialData?.type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0])
  )
  const [date, setDate] = useState(initialData?.date || getTodayDateString())
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const titleInputRef = useRef(null)

  // Focus title input on mount
  useEffect(() => {
    titleInputRef.current?.focus()
  }, [])

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Available categories based on selected transaction type
  const availableCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  /**
   * Handle switching between Expense and Income.
   * Automatically updates category if current one is not valid for the new type.
   */
  const handleTypeChange = (newType) => {
    setType(newType)
    const validList = newType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
    if (!validList.includes(category)) {
      setCategory(validList[0])
    }
    // Clear type error if any
    if (errors.type) {
      setErrors((prev) => ({ ...prev, type: null }))
    }
  }

  /**
   * Validate form fields and submit data.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}

    if (!title || !title.trim()) {
      newErrors.title = 'Transaction name is required'
    }

    const parsedAmount = Number(amount)
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (!type) {
      newErrors.type = 'Please select transaction type'
    }

    if (!category) {
      newErrors.category = 'Please select a category'
    }

    if (!date) {
      newErrors.date = 'Date is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit validated transaction
    setSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        amount: parsedAmount,
        type,
        category,
        date,
      })
      onClose()
    } catch {
      // Errors are handled and toasted in Dashboard; keep modal open
      setSubmitting(false)
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 id="modal-title" className="modal-title">
              {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className="modal-subtitle">
              {isEditMode
                ? 'Update the details for this transaction.'
                : 'Enter details to log a new income or expense.'}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Type Segmented Control */}
            <div className="form-group">
              <label className="form-label">
                <span>Transaction Type</span>
                <span className="required-star">*</span>
              </label>
              <div className="type-segmented-control" role="group" aria-label="Transaction Type">
                <button
                  type="button"
                  className={`segmented-btn ${type === 'expense' ? 'active expense' : ''}`}
                  onClick={() => handleTypeChange('expense')}
                >
                  <span aria-hidden="true">↓</span>
                  <span>Expense</span>
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${type === 'income' ? 'active income' : ''}`}
                  onClick={() => handleTypeChange('income')}
                >
                  <span aria-hidden="true">↑</span>
                  <span>Income</span>
                </button>
              </div>
            </div>

            {/* Transaction Title */}
            <div className="form-group">
              <label htmlFor="tx-title" className="form-label">
                <span>Transaction Name</span>
                <span className="required-star">*</span>
              </label>
              <input
                id="tx-title"
                ref={titleInputRef}
                type="text"
                className={`form-input ${errors.title ? 'is-invalid' : ''}`}
                placeholder="e.g. Makan Siang, Salary, Freelance"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }))
                }}
                required
              />
              {errors.title && <span className="form-error-msg">{errors.title}</span>}
            </div>

            {/* Amount & Date in Two-Column Row */}
            <div className="form-row-two-col">
              {/* Amount */}
              <div className="form-group">
                <label htmlFor="tx-amount" className="form-label">
                  <span>Amount (Rp)</span>
                  <span className="required-star">*</span>
                </label>
                <div className="form-input-wrapper">
                  <span className="input-prefix">Rp</span>
                  <input
                    id="tx-amount"
                    type="number"
                    min="1"
                    step="any"
                    className={`form-input has-prefix ${errors.amount ? 'is-invalid' : ''}`}
                    placeholder="25000"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value)
                      if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }))
                    }}
                    required
                  />
                </div>
                {errors.amount && <span className="form-error-msg">{errors.amount}</span>}
              </div>

              {/* Date */}
              <div className="form-group">
                <label htmlFor="tx-date" className="form-label">
                  <span>Date</span>
                  <span className="required-star">*</span>
                </label>
                <input
                  id="tx-date"
                  type="date"
                  className={`form-input ${errors.date ? 'is-invalid' : ''}`}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value)
                    if (errors.date) setErrors((prev) => ({ ...prev, date: null }))
                  }}
                  required
                />
                {errors.date && <span className="form-error-msg">{errors.date}</span>}
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="form-group">
              <label htmlFor="tx-category" className="form-label">
                <span>Category</span>
                <span className="required-star">*</span>
              </label>
              <select
                id="tx-category"
                className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  if (errors.category) setErrors((prev) => ({ ...prev, category: null }))
                }}
                required
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="form-error-msg">{errors.category}</span>}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <span className="form-submit-spinner-wrap">
                  <span className="form-submit-spinner" />
                  <span>Saving…</span>
                </span>
              ) : isEditMode ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
