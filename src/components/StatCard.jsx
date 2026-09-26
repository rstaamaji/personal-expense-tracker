import React from 'react'
import './StatCard.css'

/**
 * Default icons for the summary cards
 */
function DefaultIcon({ type }) {
  switch (type) {
    case 'balance':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <path d="M2 10h20" />
          <circle cx="16" cy="15" r="1.5" />
        </svg>
      )
    case 'income':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      )
    case 'expense':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      )
    case 'transactions':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z" />
          <polyline points="14 3 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="13" y2="17" />
        </svg>
      )
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )
  }
}

/**
 * Reusable StatCard component for financial summary stats.
 */
export default function StatCard({
  label,
  value,
  subtext,
  type = 'default',
  icon,
  badgeText,
  badgeTrend = 'neutral'
}) {
  return (
    <article className={`stat-card type-${type}`}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <div className="stat-card-icon" aria-hidden="true">
          {icon || <DefaultIcon type={type} />}
        </div>
      </div>

      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
      </div>

      <footer className="stat-card-footer">
        {badgeText && (
          <span className={`stat-card-badge trend-${badgeTrend}`}>
            {badgeTrend === 'up' && '↑ '}
            {badgeTrend === 'down' && '↓ '}
            {badgeText}
          </span>
        )}
        {subtext && <span className="stat-card-subtext">{subtext}</span>}
      </footer>
    </article>
  )
}
