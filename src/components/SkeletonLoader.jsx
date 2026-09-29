import React from 'react'
import './SkeletonLoader.css'

/**
 * Skeleton shimmer row for the transaction list loading state.
 */
function SkeletonRow() {
  return (
    <li className="skeleton-row">
      <div className="skeleton-left">
        <div className="sk sk-icon" />
        <div className="skeleton-text-group">
          <div className="sk sk-title" />
          <div className="sk sk-meta" />
        </div>
      </div>
      <div className="skeleton-right">
        <div className="sk sk-amount" />
        <div className="sk sk-badge" />
      </div>
    </li>
  )
}

/**
 * Skeleton shimmer card for stat cards loading state.
 */
export function SkeletonStatCard() {
  return (
    <div className="skeleton-stat-card">
      <div className="skeleton-stat-header">
        <div className="sk sk-label" />
        <div className="sk sk-icon-sm" />
      </div>
      <div className="sk sk-value" />
      <div className="sk sk-subtext" />
    </div>
  )
}

/**
 * Skeleton shimmer for the analytics chart cards.
 */
export function SkeletonChartCard() {
  return (
    <div className="skeleton-chart-card">
      <div className="sk sk-chart-title" />
      <div className="sk sk-chart-body" />
    </div>
  )
}

/**
 * Skeleton transaction list — renders N shimmer rows.
 *
 * @param {object} props
 * @param {number} [props.rows=6]
 */
export default function SkeletonLoader({ rows = 6 }) {
  return (
    <ul className="skeleton-list" aria-busy="true" aria-label="Loading transactions">
      {Array.from({ length: rows }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <SkeletonRow key={i} />
      ))}
    </ul>
  )
}
