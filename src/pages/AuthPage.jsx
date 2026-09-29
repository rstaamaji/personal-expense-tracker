/**
 * AuthPage.jsx
 * Unified authentication view for Login and Registration.
 * Styled with the futuristic financial intelligence theme and eye iconography.
 * Enhanced with comprehensive field-level validation and duplicate email handling (Day 7C).
 */
import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import './AuthPage.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME_LENGTH = 100
const MAX_EMAIL_LENGTH = 150
const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 128

/* ------------------------------------------------------------------ */
/*  Pure Validation Functions                                         */
/* ------------------------------------------------------------------ */

function validateName(value) {
  const v = (value || '').trim()
  if (!v) return 'Full name is required.'
  if (v.length < 2) return 'Name must be at least 2 characters.'
  if (v.length > MAX_NAME_LENGTH) return `Name cannot exceed ${MAX_NAME_LENGTH} characters.`
  return null
}

function validateEmail(value) {
  const v = (value || '').trim()
  if (!v) return 'Email address is required.'
  if (!EMAIL_REGEX.test(v)) return 'Please enter a valid email address (e.g. name@domain.com).'
  if (v.length > MAX_EMAIL_LENGTH) return `Email cannot exceed ${MAX_EMAIL_LENGTH} characters.`
  return null
}

function validatePassword(value, isRegister = false) {
  if (!value) return 'Password is required.'
  if (isRegister && value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
  }
  if (value.length > MAX_PASSWORD_LENGTH) {
    return `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters.`
  }
  return null
}

function validateConfirmPassword(value, originalPassword) {
  if (!value) return 'Please confirm your password.'
  if (value !== originalPassword) return 'Passwords do not match. Please verify.'
  return null
}

export default function AuthPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode) // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Field validation and touched states
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Server error banner and duplicate email detection
  const [serverError, setServerError] = useState('')
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Password visibility toggle
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { login, register, authError, setAuthError } = useAuth()

  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }))

  const switchMode = (newMode) => {
    setMode(newMode)
    setServerError('')
    setIsDuplicateEmail(false)
    setFieldErrors({})
    setTouched({})
    setPassword('')
    setConfirmPassword('')
    if (setAuthError) setAuthError(null)
  }

  /* ---- Field Change Handlers with Live Validation ---- */
  const handleNameChange = (val) => {
    setName(val)
    if (touched.name) {
      setFieldErrors((prev) => ({ ...prev, name: validateName(val) }))
    }
  }

  const handleEmailChange = (val) => {
    setEmail(val)
    if (isDuplicateEmail) setIsDuplicateEmail(false)
    if (touched.email) {
      setFieldErrors((prev) => ({ ...prev, email: validateEmail(val) }))
    }
  }

  const handlePasswordChange = (val) => {
    setPassword(val)
    if (touched.password) {
      setFieldErrors((prev) => ({
        ...prev,
        password: validatePassword(val, mode === 'register'),
        ...(mode === 'register' && touched.confirmPassword
          ? { confirmPassword: validateConfirmPassword(confirmPassword, val) }
          : {}),
      }))
    }
  }

  const handleConfirmPasswordChange = (val) => {
    setConfirmPassword(val)
    if (touched.confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(val, password),
      }))
    }
  }

  /* ---- Submit Handler ---- */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    setIsDuplicateEmail(false)
    if (setAuthError) setAuthError(null)

    // Touch and validate all fields for the active mode
    if (mode === 'register') {
      setTouched({ name: true, email: true, password: true, confirmPassword: true })
      const errs = {
        name: validateName(name),
        email: validateEmail(email),
        password: validatePassword(password, true),
        confirmPassword: validateConfirmPassword(confirmPassword, password),
      }
      setFieldErrors(errs)

      if (Object.values(errs).some(Boolean)) {
        return
      }

      setSubmitting(true)
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      })
      setSubmitting(false)

      if (!res.success && res.error) {
        const errMsg = String(res.error)
        const isDup =
          errMsg.toLowerCase().includes('already registered') ||
          errMsg.toLowerCase().includes('duplicate') ||
          errMsg.toLowerCase().includes('exists')

        if (isDup) {
          setIsDuplicateEmail(true)
          setFieldErrors((prev) => ({
            ...prev,
            email: 'This email is already registered. Please sign in instead.',
          }))
          setServerError('An account with this email already exists. Would you like to sign in?')
        } else {
          setServerError(errMsg)
        }
      }
    } else {
      setTouched({ email: true, password: true })
      const errs = {
        email: validateEmail(email),
        password: validatePassword(password, false),
      }
      setFieldErrors(errs)

      if (Object.values(errs).some(Boolean)) {
        return
      }

      setSubmitting(true)
      const res = await login({
        email: email.trim(),
        password,
      })
      setSubmitting(false)

      if (!res.success && res.error) {
        setServerError(res.error)
      }
    }
  }

  const displayedError = serverError || authError
  const hasFieldError = (field) => touched[field] && Boolean(fieldErrors[field])

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
            disabled={submitting}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
            disabled={submitting}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Banner */}
        {displayedError && (
          <div className="auth-error-banner" role="alert" aria-live="assertive">
            <span className="auth-error-icon" aria-hidden="true">⚠️</span>
            <div className="auth-error-body">
              <span className="auth-error-label">
                {isDuplicateEmail ? 'Account Exists' : 'Authentication Feedback'}
              </span>
              <span className="auth-error-text">{displayedError}</span>
              {isDuplicateEmail && (
                <button
                  type="button"
                  className="auth-duplicate-switch-btn"
                  onClick={() => switchMode('login')}
                >
                  → Switch to Sign In
                </button>
              )}
            </div>
            <button
              type="button"
              className="auth-error-dismiss"
              onClick={() => {
                setServerError('')
                setIsDuplicateEmail(false)
                if (setAuthError) setAuthError(null)
              }}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Authentication Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="auth-form-group">
              <label htmlFor="auth-name" className="auth-label">
                <span>Full Name</span>
                <span className="required-star">*</span>
              </label>
              <input
                id="auth-name"
                type="text"
                className={`auth-input ${hasFieldError('name') ? 'is-invalid' : ''}`}
                placeholder="e.g. Rustam Aji"
                value={name}
                maxLength={MAX_NAME_LENGTH}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={() => {
                  touch('name')
                  setFieldErrors((prev) => ({ ...prev, name: validateName(name) }))
                }}
                required
                disabled={submitting}
                aria-invalid={hasFieldError('name')}
                aria-describedby={hasFieldError('name') ? 'auth-name-error' : undefined}
              />
              {hasFieldError('name') && (
                <span id="auth-name-error" className="auth-field-error" role="alert">
                  {fieldErrors.name}
                </span>
              )}
            </div>
          )}

          {/* Email Address */}
          <div className="auth-form-group">
            <label htmlFor="auth-email" className="auth-label">
              <span>Email Address</span>
              <span className="required-star">*</span>
            </label>
            <input
              id="auth-email"
              type="email"
              className={`auth-input ${hasFieldError('email') ? 'is-invalid' : ''}`}
              placeholder="e.g. user@example.com"
              value={email}
              maxLength={MAX_EMAIL_LENGTH}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={() => {
                touch('email')
                setFieldErrors((prev) => ({ ...prev, email: validateEmail(email) }))
              }}
              required
              disabled={submitting}
              aria-invalid={hasFieldError('email')}
              aria-describedby={hasFieldError('email') ? 'auth-email-error' : undefined}
            />
            {hasFieldError('email') && (
              <span id="auth-email-error" className="auth-field-error" role="alert">
                {fieldErrors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="auth-form-group">
            <div className="auth-label-row">
              <label htmlFor="auth-password" className="auth-label">
                <span>Password</span>
                <span className="required-star">*</span>
                {mode === 'register' && (
                  <span className="auth-hint">(min. 8 characters)</span>
                )}
              </label>
            </div>
            <div className="auth-password-wrapper">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                className={`auth-input has-toggle ${hasFieldError('password') ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                value={password}
                maxLength={MAX_PASSWORD_LENGTH}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={() => {
                  touch('password')
                  setFieldErrors((prev) => ({
                    ...prev,
                    password: validatePassword(password, mode === 'register'),
                  }))
                }}
                required
                disabled={submitting}
                aria-invalid={hasFieldError('password')}
                aria-describedby={hasFieldError('password') ? 'auth-password-error' : undefined}
              />
              <button
                type="button"
                className="auth-pwd-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {hasFieldError('password') && (
              <span id="auth-password-error" className="auth-field-error" role="alert">
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Confirm Password (Register mode only) */}
          {mode === 'register' && (
            <div className="auth-form-group">
              <label htmlFor="auth-confirm-password" className="auth-label">
                <span>Confirm Password</span>
                <span className="required-star">*</span>
              </label>
              <div className="auth-password-wrapper">
                <input
                  id="auth-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`auth-input has-toggle ${hasFieldError('confirmPassword') ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  value={confirmPassword}
                  maxLength={MAX_PASSWORD_LENGTH}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  onBlur={() => {
                    touch('confirmPassword')
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmPassword: validateConfirmPassword(confirmPassword, password),
                    }))
                  }}
                  required
                  disabled={submitting}
                  aria-invalid={hasFieldError('confirmPassword')}
                  aria-describedby={hasFieldError('confirmPassword') ? 'auth-confirm-error' : undefined}
                />
                <button
                  type="button"
                  className="auth-pwd-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {hasFieldError('confirmPassword') && (
                <span id="auth-confirm-error" className="auth-field-error" role="alert">
                  {fieldErrors.confirmPassword}
                </span>
              )}
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
                disabled={submitting}
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
                disabled={submitting}
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
