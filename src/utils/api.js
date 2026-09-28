/**
 * api.js
 * Centralized API client utility for the Personal Expense Tracker frontend.
 * Automatically injects the JWT Bearer token and handles 401 unauthenticated responses.
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  'http://localhost:5000/api'

const TOKEN_KEY = 'auth_token'

/**
 * Get stored JWT authentication token.
 */
export function getAuthToken() {
  if (typeof window === 'undefined' || !window.localStorage) return null
  return window.localStorage.getItem(TOKEN_KEY)
}

/**
 * Store JWT authentication token.
 */
export function setAuthToken(token) {
  if (typeof window === 'undefined' || !window.localStorage) return
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token)
  } else {
    window.localStorage.removeItem(TOKEN_KEY)
  }
}

/**
 * Remove stored JWT authentication token.
 */
export function removeAuthToken() {
  if (typeof window === 'undefined' || !window.localStorage) return
  window.localStorage.removeItem(TOKEN_KEY)
}

/**
 * Generic request wrapper supporting JSON payloads and automatic Bearer authentication.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`
  const token = getAuthToken()

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  let response
  try {
    response = await fetch(url, config)
  } catch (networkError) {
    throw new Error('Unable to connect to server. Please ensure the backend is running.')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // Non-JSON response
    data = null
  }

  // Handle 401 Unauthorized globally
  if (response.status === 401) {
    if (token) {
      removeAuthToken()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:expired'))
      }
    }
    const message = (data && data.message) || 'Session expired or authentication required'
    throw new Error(message)
  }

  if (!response.ok) {
    const message = (data && data.message) || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return data
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
}

export default api
