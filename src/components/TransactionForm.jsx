import React, { useState, useEffect, useRef } from 'react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants'
import { getTodayDateString } from '../utils/formatters'
import './TransactionForm.css'

/* ------------------------------------------------------------------ */
/*  Pure validation logic (no side-effects)                            */
/* ------------------------------------------------------------------ */

const MAX_TITLE_LENGTH = 100
const MAX_AMOUNT = 1_000_000_000 // 1 billion Rp
const MIN_DATE = '2000-01-01'
const VALID_TYPES = ['income', 'expense']

function validateTitle(value) {
  const v = (value || '').trim()
  if (!v) return 'Transaction name is required.'
  if (v.length < 2) return 'Name must be at least 2 characters.'
  if (v.length > MAX_TITLE_LENGTH) return `Name must not exceed ${MAX_TITLE_LENGTH} characters.`
  return null
}

function validateAmount(value) {
  if (value === '' || value === null || value === undefined) return 'Amount is required.'
  const n = Number(value)
  if (isNaN(n)) return 'Amount must be a number.'
  if (n <= 0) return 'Amount must be greater than Rp 0.'
  if (!Number.isFinite(n)) return 'Amount is too large.'
  if (n > MAX_AMOUNT) return `Amount cannot exceed Rp ${MAX_AMOUNT.toLocaleString('id-ID')}.`
  if (Math.floor(n) !== n && String(value).split('.')[1]?.length > 2)
    return 'Amount may have at most 2 decimal places.'
  return null
}

function validateDate(value) {
  if (!value) return 'Date is required.'
  if (value < MIN_DATE) return `Date cannot be before ${MIN_DATE}.`
  const today = getTodayDateString()
  if (value > today) return 'Date cannot be in the future.'
  return null
}

function validateType(value) {
  if (!VALID_TYPES.includes(value)) return 'Please select a valid transaction type.'
  return null
}

function validateCategory(value, type) {
  if (!value) return 'Please select a category.'
  const valid = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  if (!valid.includes(value)) return 'Selected category is not valid for this transaction type.'
  return null
}

function validateAll({ title, amount, type, category, date }) {
  return {
    title: validateTitle(title),
    amount: validateAmount(amount),
    type: validateType(type),
    category: validateCategory(category, type),
    date: validateDate(date),
  }
}

function hasErrors(errs) {
  return Object.values(errs).some(Boolean)
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

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
  // Track which fields have been touched so we only show errors after the user interacts
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const titleInputRef = useRef(null)

  // Focus title input on mount
  useEffect(() => {
    titleInputRef.current?.focus()
  }, [])

  // Close on Escape key press (only when not submitting)
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e) {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, submitting])

  if (!isOpen) return null

  const availableCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  /* ---- Field change helpers ---- */
  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }))

  const handleTitleChange = (v) => {
    setTitle(v)
    if (touched.title) setErrors((prev) => ({ ...prev, title: validateTitle(v) }))
  }

  const handleAmountChange = (v) => {
    setAmount(v)
    if (touched.amount) setErrors((prev) => ({ ...prev, amount: validateAmount(v) }))
  }

  const handleDateChange = (v) => {
    setDate(v)
    if (touched.date) setErrors((prev) => ({ ...prev, date: validateDate(v) }))
  }

  const handleTypeChange = (newType) => {
    setType(newType)
    const validList = newType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
    const newCategory = validList.includes(category) ? category : validList[0]
    setCategory(newCategory)
    setErrors((prev) => ({
      ...prev,
      type: validateType(newType),
      category: validateCategory(newCategory, newType),
    }))
  }

  const handleCategoryChange = (v) => {
    setCategory(v)
    if (touched.category) setErrors((prev) => ({ ...prev, category: validateCategory(v, type) }))
  }

  /* ---- Submit ---- */
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Touch all fields to reveal any hidden errors
    setTouched({ title: true, amount: true, type: true, category: true, date: true })

    const newErrors = validateAll({ title, amount, type, category, date })
    setErrors(newErrors)
    if (hasErrors(newErrors)) return

    const parsedAmount = Number(amount)
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
      setSubmitting(false)
    }
  }

  /* ---- Helpers ---- */
  const fieldError = (field) => touched[field] && errors[field]

  return (
    <div
      className="modal-overlay"
      onClick={submitting ? undefined : onClose}
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
            disabled={submitting}
          >
            ✕
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">

            {/* Transaction Type */}
            <div className="form-group">
              <label className="form-label">
                <span>Transaction Type</span>
                <span className="required-star">*</span>
              </label>
              <div
                className={`type-segmented-control ${fieldError('type') ? 'is-invalid-group' : ''}`}
                role="group"
                aria-label="Transaction Type"
              >
                <button
                  type="button"
                  className={`segmented-btn ${type === 'expense' ? 'active expense' : ''}`}
                  onClick={() => handleTypeChange('expense')}
                  disabled={submitting}
                >
                  <span aria-hidden="true">↓</span>
                  <span>Expense</span>
                </button>
                <button
                  type="button"
                  className={`segmented-btn ${type === 'income' ? 'active income' : ''}`}
                  onClick={() => handleTypeChange('income')}
                  disabled={submitting}
                >
                  <span aria-hidden="true">↑</span>
                  <span>Income</span>
                </button>
              </div>
              {fieldError('type') && (
                <span className="form-error-msg" role="alert">{errors.type}</span>
              )}
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
                className={`form-input ${fieldError('title') ? 'is-invalid' : ''}`}
                placeholder="e.g. Makan Siang, Salary, Freelance"
                value={title}
                maxLength={MAX_TITLE_LENGTH}
                disabled={submitting}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={() => {
                  touch('title')
                  setErrors((prev) => ({ ...prev, title: validateTitle(title) }))
                }}
                aria-describedby={fieldError('title') ? 'tx-title-error' : undefined}
                aria-invalid={Boolean(fieldError('title'))}
              />
              <div className="form-field-footer">
                {fieldError('title') ? (
                  <span id="tx-title-error" className="form-error-msg" role="alert">{errors.title}</span>
                ) : (
                  <span />
                )}
                <span className={`form-char-count ${title.length > MAX_TITLE_LENGTH * 0.85 ? 'warn' : ''}`}>
                  {title.length}/{MAX_TITLE_LENGTH}
                </span>
              </div>
            </div>

            {/* Amount & Date */}
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
                    max={MAX_AMOUNT}
                    step="1"
                    className={`form-input has-prefix ${fieldError('amount') ? 'is-invalid' : ''}`}
                    placeholder="25000"
                    value={amount}
                    disabled={submitting}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    onBlur={() => {
                      touch('amount')
                      setErrors((prev) => ({ ...prev, amount: validateAmount(amount) }))
                    }}
                    aria-describedby={fieldError('amount') ? 'tx-amount-error' : undefined}
                    aria-invalid={Boolean(fieldError('amount'))}
                  />
                </div>
                {fieldError('amount') && (
                  <span id="tx-amount-error" className="form-error-msg" role="alert">{errors.amount}</span>
                )}
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
                  min={MIN_DATE}
                  max={getTodayDateString()}
                  className={`form-input ${fieldError('date') ? 'is-invalid' : ''}`}
                  value={date}
                  disabled={submitting}
                  onChange={(e) => handleDateChange(e.target.value)}
                  onBlur={() => {
                    touch('date')
                    setErrors((prev) => ({ ...prev, date: validateDate(date) }))
                  }}
                  aria-describedby={fieldError('date') ? 'tx-date-error' : undefined}
                  aria-invalid={Boolean(fieldError('date'))}
                />
                {fieldError('date') && (
                  <span id="tx-date-error" className="form-error-msg" role="alert">{errors.date}</span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="tx-category" className="form-label">
                <span>Category</span>
                <span className="required-star">*</span>
              </label>
              <select
                id="tx-category"
                className={`form-select ${fieldError('category') ? 'is-invalid' : ''}`}
                value={category}
                disabled={submitting}
                onChange={(e) => {
                  touch('category')
                  handleCategoryChange(e.target.value)
                }}
                onBlur={() => {
                  touch('category')
                  setErrors((prev) => ({ ...prev, category: validateCategory(category, type) }))
                }}
                aria-describedby={fieldError('category') ? 'tx-category-error' : undefined}
                aria-invalid={Boolean(fieldError('category'))}
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {fieldError('category') && (
                <span id="tx-category-error" className="form-error-msg" role="alert">{errors.category}</span>
              )}
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
