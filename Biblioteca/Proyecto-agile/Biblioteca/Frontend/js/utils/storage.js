const STORAGE_CONFIG = {
  STORAGE_KEYS: {
    AUTH_TOKEN: "auth_token",
    USER_PROFILE: "user_profile",
    CART: "cart",
    THEME: "theme",
  },
}

const Storage = {
  /**
   * Save authentication data
   * @param {string} token
   * @param {Object} userProfile
   */
  saveAuth(token, userProfile) {
    try {
      localStorage.setItem(STORAGE_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token)
      localStorage.setItem(STORAGE_CONFIG.STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile))
    } catch (error) {
      console.error("Error saving auth data:", error)
    }
  },

  /**
   * Get authentication data
   * @returns {Object|null}
   */
  getAuth() {
    try {
      const token = localStorage.getItem(STORAGE_CONFIG.STORAGE_KEYS.AUTH_TOKEN)
      const userProfileStr = localStorage.getItem(STORAGE_CONFIG.STORAGE_KEYS.USER_PROFILE)

      if (!token || !userProfileStr || userProfileStr === "undefined") {
        return null
      }

      return {
        token,
        user: JSON.parse(userProfileStr),
      }
    } catch (error) {
      console.error("Error getting auth data:", error)
      return null
    }
  },

  /**
   * Get the authentication token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(STORAGE_CONFIG.STORAGE_KEYS.AUTH_TOKEN)
  },

  /**
   * Get the user profile
   * @returns {Object|null}
   */
  getUser() {
    try {
      const userProfileStr = localStorage.getItem(STORAGE_CONFIG.STORAGE_KEYS.USER_PROFILE)
      return userProfileStr ? JSON.parse(userProfileStr) : null
    } catch (error) {
      console.error("Error getting user profile:", error)
      return null
    }
  },

  /**
   * Clear authentication data
   */
  clearAuth() {
    localStorage.removeItem(STORAGE_CONFIG.STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_CONFIG.STORAGE_KEYS.USER_PROFILE)
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken()
  },

  /**
   * Get user role
   * @returns {string|null}
   */
  getUserRole() {
    const user = this.getUser()
    return user?.role?.name || null
  },

  /**
   * Save cart items
   * @param {Array} items
   */
  saveCart(items) {
    try {
      localStorage.setItem(STORAGE_CONFIG.STORAGE_KEYS.CART, JSON.stringify(items))
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  },

  /**
   * Get cart items
   * @returns {Array}
   */
  getCart() {
    try {
      const cartStr = localStorage.getItem(STORAGE_CONFIG.STORAGE_KEYS.CART)
      return cartStr ? JSON.parse(cartStr) : []
    } catch (error) {
      console.error("Error getting cart:", error)
      return []
    }
  },

  /**
   * Add item to cart
   * @param {Object} item
   * @returns {Array}
   */
  addToCart(item) {
    const cart = this.getCart()

    const itemBookId = item.bookId || item.id
    const existingIndex = cart.findIndex((i) => i.bookId == itemBookId)

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity || 1
    } else {
      cart.push({
        bookId: itemBookId,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1
      })
    }

    this.saveCart(cart)
    return cart
  },

  /**
   * Update cart item quantity
   * @param {number} bookId
   * @param {number} quantity
   * @returns {Array}
   */
  updateCartItemQuantity(bookId, quantity) {
    const cart = this.getCart()
    const index = cart.findIndex((i) => i.bookId == bookId)

    if (index >= 0) {
      if (quantity <= 0) {
        cart.splice(index, 1)
      } else {
        cart[index].quantity = quantity
      }
      this.saveCart(cart)
    }

    return cart
  },

  /**
   * Remove item from cart
   * @param {number} bookId
   * @returns {Array}
   */
  removeFromCart(bookId) {
    const cart = this.getCart().filter((item) => item.bookId != bookId)
    this.saveCart(cart)
    return cart
  },

  /**
   * Clear cart
   */
  clearCart() {
    localStorage.removeItem(STORAGE_CONFIG.STORAGE_KEYS.CART)
  },

  /**
   * Get cart total
   * @returns {number}
   */
  getCartTotal() {
    const cart = this.getCart()
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  },

  /**
   * Get cart items count
   * @returns {number}
   */
  getCartCount() {
    const cart = this.getCart()
    return cart.reduce((count, item) => count + item.quantity, 0)
  },

  /**
   * Save theme preference
   * @param {string} theme
   */
  saveTheme(theme) {
    localStorage.setItem(STORAGE_CONFIG.STORAGE_KEYS.THEME, theme)
  },

  /**
   * Get theme preference
   * @returns {string}
   */
  getTheme() {
    return localStorage.getItem(STORAGE_CONFIG.STORAGE_KEYS.THEME) || "dark"
  },
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = Storage
}
