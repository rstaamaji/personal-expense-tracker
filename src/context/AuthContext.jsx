/**
 * AuthContext.jsx
 * Centralized authentication state management for Personal Expense Tracker (Day 6).
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { AuthContext } from './authContextInstance'
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../utils/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => getAuthToken())
  const [loading, setLoading] = useState(() => Boolean(getAuthToken()))
  const [authError, setAuthError] = useState(null)

  // Restore session on initial load and listen for 401 expiration events
  useEffect(() => {
    const storedToken = getAuthToken()
    if (!storedToken) {
      return
    }

    let isMounted = true
    api.get('/auth/me')
      .then((res) => {
        if (!isMounted) return
        if (res && res.data && res.data.user) {
          setUser(res.data.user)
          setToken(storedToken)
        } else {
          removeAuthToken()
          setUser(null)
          setToken(null)
        }
      })
      .catch(() => {
        if (!isMounted) return
        removeAuthToken()
        setUser(null)
        setToken(null)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    const handleExpired = () => {
      setUser(null)
      setToken(null)
      setAuthError('Your session has expired. Please sign in again.')
    }

    window.addEventListener('auth:expired', handleExpired)
    return () => {
      isMounted = false
      window.removeEventListener('auth:expired', handleExpired)
    }
  }, [])

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

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      loading,
      authError,
      setAuthError,
      login,
      register,
      logout,
    }),
    [user, token, loading, authError, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
