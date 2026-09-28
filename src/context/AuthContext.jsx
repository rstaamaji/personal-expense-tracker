/**
 * AuthContext.jsx
 * Centralized authentication state management for Personal Expense Tracker (Day 6).
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => getAuthToken())
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  /**
   * Restore user session using stored JWT token.
   */
  const restoreSession = useCallback(async () => {
    const existingToken = getAuthToken()
    if (!existingToken) {
      setUser(null)
      setToken(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const res = await api.get('/auth/me')
      if (res && res.data && res.data.user) {
        setUser(res.data.user)
        setToken(existingToken)
      } else {
        removeAuthToken()
        setUser(null)
        setToken(null)
      }
    } catch (err) {
      console.warn('[AUTH] Session restoration failed:', err.message)
      removeAuthToken()
      setUser(null)
      setToken(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Restore session on initial load and listen for 401 expiration events
  useEffect(() => {
    restoreSession()

    const handleExpired = () => {
      setUser(null)
      setToken(null)
      setAuthError('Your session has expired. Please sign in again.')
    }

    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [restoreSession])

  /**
   * Register a new user account.
   */
  const register = useCallback(async ({ name, email, password }) => {
    setAuthError(null)
    try {
      const res = await api.post('/auth/register', { name, email, password })
      if (res && res.data && res.data.token) {
        setAuthToken(res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
        return { success: true }
      }
      throw new Error((res && res.message) || 'Registration failed')
    } catch (err) {
      setAuthError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Log in with email and password.
   */
  const login = useCallback(async ({ email, password }) => {
    setAuthError(null)
    try {
      const res = await api.post('/auth/login', { email, password })
      if (res && res.data && res.data.token) {
        setAuthToken(res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
        return { success: true }
      }
      throw new Error((res && res.message) || 'Login failed')
    } catch (err) {
      setAuthError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Log out current user session.
   */
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout').catch(() => {})
    } finally {
      removeAuthToken()
      setUser(null)
      setToken(null)
      setAuthError(null)
    }
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    loading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    restoreSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
