import React from 'react'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

/**
 * Navbar component for the Personal Expense Tracker application (Day 6).
 * Displays user profile, section navigation, and logout functionality.
 */
export default function Navbar({ activeRoute = 'dashboard' }) {
  const { user, logout } = useAuth()

  const displayName = user?.name || 'Rustam Aji'
  const displayRole = user?.email || 'Personal Workspace'

  // Extract initials (e.g. "Rustam Aji" -> "RA")
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('') || 'RA'

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <a href="#dashboard" className="navbar-brand">
          <div className="brand-icon-wrapper" aria-hidden="true">
            💰
          </div>
          <div className="brand-info">
            <span className="brand-title">Expense Tracker</span>
          </div>
        </a>

        {/* Navigation Items */}
        <ul className="navbar-nav">
          <li>
            <a
              href="#dashboard"
              className={`nav-link ${activeRoute === 'dashboard' ? 'active' : ''}`}
            >
              {activeRoute === 'dashboard' && <span className="nav-link-dot" />}
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#analytics-section"
              className="nav-link"
              title="Jump to Financial Analytics"
            >
              Analytics
            </a>
          </li>
          <li>
            <a
              href="#transactions-section"
              className="nav-link"
              title="Jump to Transactions List"
            >
              Transactions
            </a>
          </li>
        </ul>

        {/* Controls: User Profile & Logout */}
        <div className="navbar-user">
          {/* User Profile Card */}
          <div className="profile-card" title={`Signed in as ${displayName}`}>
            <div className="avatar-circle">{initials}</div>
            <div className="profile-info">
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">{displayRole}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            className="navbar-logout-btn"
            onClick={logout}
            title="Sign out of your account"
            aria-label="Logout"
          >
            <svg
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
