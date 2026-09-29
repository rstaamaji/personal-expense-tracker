import React, { useEffect } from 'react'
import './DeleteConfirmModal.css'

/**
 * Confirmation dialog for deleting a transaction without browser alert()
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {string} props.transactionTitle
 * @param {() => void} props.onCancel
 * @param {() => void} props.onConfirm
 * @param {boolean} [props.confirming] - Whether delete is in-flight
 */
export default function DeleteConfirmModal({
  isOpen,
  transactionTitle,
  onCancel,
  onConfirm,
  confirming = false,
}) {
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape' && !confirming) {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel, confirming])

  if (!isOpen) return null

  return (
    <div
      className="delete-modal-overlay"
      onClick={confirming ? undefined : onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div
        className="delete-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-icon-wrapper" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        <div className="delete-modal-content">
          <h3 id="delete-dialog-title" className="delete-modal-title">
            Delete this transaction?
          </h3>
          <p className="delete-modal-desc">
            Are you sure you want to remove <strong>"{transactionTitle}"</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={confirming}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? (
              <span className="delete-btn-spinner-wrap">
                <span className="delete-btn-spinner" />
                <span>Deleting…</span>
              </span>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
