import React, { useState } from 'react'
import './ApiErrorBanner.css'

/**
 * Inline API failure feedback banner.
 *
 * @param {object} props
 * @param {string|null} props.error - Error message string, or null to hide
 * @param {() => void} [props.onRetry] - Optional retry callback
 * @param {() => void} [props.onDismiss] - Optional dismiss callback
 */
export default function ApiErrorBanner({ error, onRetry, onDismiss }) {
  const [dismissed, setDismissed] = useState(false)

  if (!error || dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    if (onDismiss) onDismiss()
  }

  // Detect offline or network errors vs server/validation errors
  const isNetworkError =
    error.toLowerCase().includes('network') ||
    error.toLowerCase().includes('failed to fetch') ||
    error.toLowerCase().includes('offline') ||
    error.toLowerCase().includes('connection')

  return (
    <div className="api-error-banner" role="alert" aria-live="assertive">
      <div className="api-error-icon" aria-hidden="true">
        {isNetworkError ? '📡' : '⚠️'}
      </div>
      <div className="api-error-body">
        <p className="api-error-title">
          {isNetworkError ? 'Connection Problem' : 'Something went wrong'}
        </p>
        <p className="api-error-message">{error}</p>
      </div>
      <div className="api-error-actions">
        {onRetry && (
          <button
            type="button"
            className="api-error-retry-btn"
            onClick={onRetry}
          >
            Retry
          </button>
        )}
        <button
          type="button"
          className="api-error-dismiss-btn"
          onClick={handleDismiss}
          aria-label="Dismiss error"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
