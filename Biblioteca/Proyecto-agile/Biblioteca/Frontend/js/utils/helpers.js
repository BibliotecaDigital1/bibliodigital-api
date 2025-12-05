const Helpers = {
  /**
   * Format price to currency string (Soles Peruanos)
   * @param {number} price
   * @returns {string}
   */
  formatPrice(price) {
    if (price == null || isNaN(price)) return "S/ 0,00";
    return "S/ " + Number(price).toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  /**
   * Format date string
   * @param {string|Date} dateString
   * @param {Object} options
   * @returns {string}
   */
  formatDate(dateString, options = {}) {
    const date = new Date(dateString)
    const defaultOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...options,
    }
    return new Intl.DateTimeFormat("es-ES", defaultOptions).format(date)
  },

  /**
   * Format date with time
   * @param {string|Date} dateString
   * @returns {string}
   */
  formatDateTime(dateString) {
    return this.formatDate(dateString, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  },

  /**
   * Format relative time (e.g., "2 hours ago")
   * @param {string|Date} dateString
   * @returns {string}
   */
  formatRelativeTime(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    const intervals = [
      { label: "año", seconds: 31536000 },
      { label: "mes", seconds: 2592000 },
      { label: "día", seconds: 86400 },
      { label: "hora", seconds: 3600 },
      { label: "minuto", seconds: 60 },
      { label: "segundo", seconds: 1 },
    ]

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds)
      if (count >= 1) {
        const plural = count !== 1 ? (interval.label === "mes" ? "es" : "s") : ""
        return `hace ${count} ${interval.label}${plural}`
      }
    }

    return "ahora mismo"
  },

  /**
   * Truncate text with ellipsis
   * @param {string} text
   * @param {number} maxLength
   * @returns {string}
   */
  truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
  },

  /**
   * Generate slug from title
   * @param {string} title
   * @returns {string}
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  },

  /**
   * Debounce function
   * @param {Function} func
   * @param {number} delay
   * @returns {Function}
   */
  debounce(func, delay) {
    let timeoutId
    return function (...args) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
  },

  /**
   * Throttle function
   * @param {Function} func
   * @param {number} limit
   * @returns {Function}
   */
  throttle(func, limit) {
    let inThrottle
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  /**
   * Get query parameter from URL
   * @param {string} param
   * @returns {string|null}
   */
  getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
  },

  /**
   * Set query parameter in URL
   * @param {string} param
   * @param {string} value
   */
  setQueryParam(param, value) {
    const url = new URL(window.location.href)
    url.searchParams.set(param, value)
    window.history.pushState({}, "", url)
  },

  /**
   * Generate unique ID
   * @returns {string}
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  },

  /**
   * Get initials from name
   * @param {string} firstName
   * @param {string} lastName
   * @returns {string}
   */
  getInitials(firstName, lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : ""
    const last = lastName ? lastName.charAt(0).toUpperCase() : ""
    return first + last
  },

  /**
   * Copy text to clipboard
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      return false
    }
  },

  /**
   * Check if element is in viewport
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  },

  /**
   * Smooth scroll to element
   * @param {string} selector
   * @param {number} offset
   */
  scrollToElement(selector, offset = 0) {
    const element = document.querySelector(selector)
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  },

  /**
   * Format file size
   * @param {number} bytes
   * @returns {string}
   */
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  },

  /**
   * Check if device is mobile
   * @returns {boolean}
   */
  isMobile() {
    return window.innerWidth < 768
  },

  /**
   * Check if device is tablet
   * @returns {boolean}
   */
  isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024
  },

  /**
   * Sleep/delay function
   * @param {number} ms
   * @returns {Promise}
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text
   * @returns {string}
   */
  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  },

  /**
   * Translate role to Spanish
   * @param {string} role
   * @returns {string}
   */
  translateRole(role) {
    const translations = {
      'CUSTOMER': 'Cliente',
      'ADMIN': 'Administrador',
      'AUTHOR': 'Autor',
      'ROLE_CUSTOMER': 'Cliente',
      'ROLE_ADMIN': 'Administrador',
      'ROLE_AUTHOR': 'Autor'
    };
    return translations[role] || role;
  },
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = Helpers
}
