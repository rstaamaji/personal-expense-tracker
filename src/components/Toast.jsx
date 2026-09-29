import React, { useEffect } from 'react'
import './Toast.css'

/**
 * Toast Notification component for instant user feedback.
 *
 * @param {object} props
 * @param {string} props.message
 * @param {'success'|'error'|'info'} props.type
 * @param {() => void} props.onClose
 * @param {number} [props.duration=4000]
 */
export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  const icon =
    type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'

  return (
    <div className={`cyber-toast toast-${type}`} role="status" aria-live="polite">
      <div className="toast-icon-wrap" aria-hidden="true">
        <span>{icon}</span>
      </div>
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  )
}
