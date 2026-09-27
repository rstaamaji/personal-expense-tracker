import { useState, useEffect } from 'react'

const THEME_STORAGE_KEY = 'expense_tracker_theme'

/**
 * Custom hook to manage light/dark theme with LocalStorage persistence
 * and system preference detection.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'

    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (stored === 'dark' || stored === 'light') {
        return stored
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    } catch (e) {
      console.warn('Could not read theme from localStorage', e)
    }

    return 'light'
  })

  useEffect(() => {
    if (typeof document === 'undefined') return

    // Apply data-theme attribute to <html> element
    document.documentElement.setAttribute('data-theme', theme)

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch (e) {
      console.warn('Could not save theme to localStorage', e)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  }
}
