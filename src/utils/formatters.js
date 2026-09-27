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
 * Format date string (YYYY-MM-DD) into readable format (e.g., "Sep 27, 2026").
 * Gracefully handles invalid inputs.
 *
 * @param {string} dateString - e.g. "2026-09-27"
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return ''

  try {
    // If it's YYYY-MM-DD, parse year, month, day to avoid UTC timezone offset shifts
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
