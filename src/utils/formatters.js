/**
 * Currency and Date Formatters for Personal Expense Tracker.
 */

/**
 * Format a number into standard Indonesian Rupiah format.
 * Examples:
 * 25000 -> "Rp 25.000"
 * 500000 -> "Rp 500.000"
 * 3250000 -> "Rp 3.250.000"
 * With showSign and type='expense': 25000 -> "-Rp 25.000"
 * With showSign and type='income': 500000 -> "+Rp 500.000"
 *
 * @param {number} amount
 * @param {object} options
 * @param {boolean} [options.showSign=false]
 * @param {'income'|'expense'} [options.type]
 * @returns {string}
 */
export function formatRupiah(amount, { showSign = false, type = null } = {}) {
  const numericAmount = Number(amount) || 0
  const isNegative = numericAmount < 0
  const absAmount = Math.abs(numericAmount)

  // Use Indonesian number formatting with dot as thousand separator
  const formattedNumber = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(absAmount)

  if (showSign) {
    if (type === 'income' || (!type && !isNegative && numericAmount > 0)) {
      return `+Rp ${formattedNumber}`
    }
    if (type === 'expense' || (!type && (isNegative || numericAmount > 0))) {
      return `-Rp ${formattedNumber}`
    }
  }

  if (isNegative) {
    return `-Rp ${formattedNumber}`
  }

  return `Rp ${formattedNumber}`
}

/**
 * Format compact Rupiah for chart axes and small badges.
 * e.g., 2500000 -> "Rp 2.5M", 50000 -> "Rp 50k"
 * @param {number} amount
 * @returns {string}
 */
export function formatCompactRupiah(amount) {
  const num = Number(amount) || 0
  const abs = Math.abs(num)
  const sign = num < 0 ? '-' : ''

  if (abs >= 1000000000) {
    return `${sign}Rp ${(abs / 1000000000).toFixed(1).replace(/\.0$/, '')}B`
  }
  if (abs >= 1000000) {
    return `${sign}Rp ${(abs / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (abs >= 1000) {
    return `${sign}Rp ${(abs / 1000).toFixed(0)}k`
  }
  return `${sign}Rp ${abs}`
}

/**
 * Format date string (YYYY-MM-DD) into readable format (e.g., "Sep 27, 2026").
 * Gracefully handles invalid inputs.
 *
 * @param {string} dateString - e.g. "2026-09-27"
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return ''

  try {
    const parts = dateString.split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const monthIndex = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      const date = new Date(year, monthIndex, day)

      if (!isNaN(date.getTime())) {
        return new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(date)
      }
    }

    const fallbackDate = new Date(dateString)
    if (!isNaN(fallbackDate.getTime())) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(fallbackDate)
    }
  } catch {
    // Return raw date string if parsing fails
  }

  return dateString
}

/**
 * Format date string (YYYY-MM-DD) into short date for charts (e.g. "27 Sep").
 * @param {string} dateString
 * @returns {string}
 */
export function formatShortDate(dateString) {
  if (!dateString) return ''
  try {
    const parts = dateString.split('-')
    if (parts.length === 3) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthIndex = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${day} ${monthNames[monthIndex]}`
      }
    }
  } catch {
    // fallback
  }
  return dateString
}

/**
 * Format date string into Month Year (e.g. "Sep 2026").
 * @param {string} dateString
 * @returns {string}
 */
export function formatMonthYear(dateString) {
  if (!dateString) return ''
  try {
    const parts = dateString.split('-')
    if (parts.length >= 2) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthIndex = parseInt(parts[1], 10) - 1
      const year = parts[0]
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${monthNames[monthIndex]} ${year}`
      }
    }
  } catch {
    // fallback
  }
  return dateString
}

/**
 * Get today's date formatted as YYYY-MM-DD.
 * @returns {string}
 */
export function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Check if a date string falls in the current calendar month.
 * @param {string} dateString - YYYY-MM-DD
 * @returns {boolean}
 */
export function isDateInThisMonth(dateString) {
  if (!dateString) return false
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1

  const parts = dateString.split('-')
  if (parts.length >= 2) {
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    return year === currentYear && month === currentMonth
  }
  return false
}

/**
 * Check if a date string falls in the last 7 days (including today).
 * @param {string} dateString - YYYY-MM-DD
 * @returns {boolean}
 */
export function isDateInThisWeek(dateString) {
  if (!dateString) return false
  try {
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const parts = dateString.split('-')
    if (parts.length === 3) {
      const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
      return targetDate >= sevenDaysAgo && targetDate <= today
    }
  } catch {
    // fallback
  }
  return false
}
