import React from 'react'
import './Navbar.css'

/**
 * Navbar component for the Personal Expense Tracker application.
 * Provides clean navigation between app sections and user profile indicator.
 */
export default function Navbar({ activeRoute = 'dashboard' }) {
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
              <span className="brand-badge">Day 1</span>
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
              href="#transactions"
              className={`nav-link ${activeRoute === 'transactions' ? 'active' : ''}`}
              title="Coming in later days"
            >
              Transactions
              <span className="nav-tag">Day 3</span>
            </a>
          </li>
          <li>
            <a
              href="#analytics"
              className={`nav-link ${activeRoute === 'analytics' ? 'active' : ''}`}
              title="Coming in later days"
            >
              Analytics
              <span className="nav-tag">Day 6</span>
            </a>
          </li>
        </ul>

        {/* User Profile / Status */}
        <div className="navbar-user">
          <div className="navbar-challenge-tag">
            <span>🚀 Aji 50 Days Challenge</span>
          </div>

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
