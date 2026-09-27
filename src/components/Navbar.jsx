import React from 'react'
import './Navbar.css'

/**
 * Navbar component for the Personal Expense Tracker application.
 * Provides clean navigation between app sections, theme toggling, and user profile indicator.
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

        {/* Controls: User Profile */}
        <div className="navbar-user">
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
