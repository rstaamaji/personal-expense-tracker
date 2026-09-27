import React from 'react'
import './Navbar.css'

/**
 * Navbar component for the Personal Expense Tracker application.
 * Provides clean navigation between app sections, theme toggling, and user profile indicator.
 */
export default function Navbar({ activeRoute = 'dashboard', theme = 'light', onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <a href="#dashboard" className="navbar-brand">
          <div className="brand-icon-wrapper" aria-hidden="true">
            💰
          </div>
          <div className="brand-info">
            <span className="brand-title">
              Expense Tracker
            </span>
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

        {/* Controls: Theme Toggle & User Profile */}
        <div className="navbar-user">
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* User Profile Card */}
          <div className="profile-card" title="Signed in as Rustam Aji">
            <div className="avatar-circle">RA</div>
            <div className="profile-info">
              <span className="profile-name">Rustam Aji</span>
              <span className="profile-role">Personal Workspace</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
