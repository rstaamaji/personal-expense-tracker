/**
 * AuthPage.jsx
 * Unified authentication view for Login and Registration.
 * Styled with the futuristic financial intelligence theme and eye iconography.
 */
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './AuthPage.css'

export default function AuthPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode) // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login, register, authError, setAuthError } = useAuth()

  const switchMode = (newMode) => {
    setMode(newMode)
    setLocalError('')
    if (setAuthError) setAuthError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (mode === 'register') {
      if (!name.trim()) {
        setLocalError('Please enter your full name')
        return
      }
      if (!email.trim()) {
        setLocalError('Please enter your email address')
        return
      }
      if (password.length < 8) {
        setLocalError('Password must be at least 8 characters long')
        return
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match')
        return
      }

      setSubmitting(true)
      const res = await register({ name: name.trim(), email: email.trim(), password })
      setSubmitting(false)
      if (!res.success && res.error) {
        setLocalError(res.error)
      }
    } else {
      if (!email.trim() || !password) {
        setLocalError('Please enter both email and password')
        return
      }

      setSubmitting(true)
      const res = await login({ email: email.trim(), password })
      setSubmitting(false)
      if (!res.success && res.error) {
        setLocalError(res.error)
      }
    }
  }

  const displayedError = localError || authError

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Futuristic Brand Header */}
        <div className="auth-header">
          <div className="auth-eye-badge" aria-hidden="true">
            <svg
              width="36"
              height="36"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="50" cy="50" rx="44" ry="26" stroke="url(#eyeGrad)" strokeWidth="4" />
              <circle cx="50" cy="50" r="16" fill="url(#irisGrad)" />
              <circle cx="50" cy="50" r="7" fill="#05070D" />
              <circle cx="53" cy="47" r="2.5" fill="#22D3EE" />
              <defs>
                <linearGradient id="eyeGrad" x1="0" y1="20" x2="100" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#22D3EE" />
                </linearGradient>
                <linearGradient id="irisGrad" x1="34" y1="34" x2="66" y2="66" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#22D3EE" />
                  <stop offset="0.5" stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="auth-title">FINANCE VISION</h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to access your personal financial intelligence workspace'
              : 'Create an account to start tracking income and expenses securely'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="auth-mode-tabs" role="tablist">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Banner */}
        {displayedError && (
          <div className="auth-error-banner" role="alert">
            <span className="auth-error-icon">⚠️</span>
            <span>{displayedError}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="auth-form-group">
              <label htmlFor="auth-name" className="auth-label">
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                className="auth-input"
                placeholder="e.g. Rustam Aji"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
          )}

          <div className="auth-form-group">
            <label htmlFor="auth-email" className="auth-label">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              className="auth-input"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="auth-password" className="auth-label">
              Password {mode === 'register' && <span className="auth-hint">(min. 8 characters)</span>}
            </label>
            <input
              id="auth-password"
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          {mode === 'register' && (
            <div className="auth-form-group">
              <label htmlFor="auth-confirm-password" className="auth-label">
                Confirm Password
              </label>
              <input
                id="auth-confirm-password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? (
              <span className="auth-spinner-wrapper">
                <span className="auth-spinner" />
                <span>Authenticating...</span>
              </span>
            ) : mode === 'login' ? (
              'Enter Intelligence Workspace'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="auth-footer">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="auth-toggle-link"
                onClick={() => switchMode('register')}
              >
                Sign up now
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                className="auth-toggle-link"
                onClick={() => switchMode('login')}
              >
                Sign in to your account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
