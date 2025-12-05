const Validators = {
  /**
   * Validate email format
   * @param {string} email
   * @returns {boolean}
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate password strength
   * @param {string} password
   * @returns {Object}
   */
  validatePassword(password) {
    if (!password || password.length < 8) {
      return {
        isValid: false,
        strength: "weak",
        message: "La contraseña debe tener al menos 8 caracteres.",
      }
    }

    let strength = 0

    if (password.length >= 12) strength++

    if (/[a-z]/.test(password)) strength++

    if (/[A-Z]/.test(password)) strength++

    if (/\d/.test(password)) strength++

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++

    const strengthLabels = {
      0: "weak",
      1: "weak",
      2: "medium",
      3: "medium",
      4: "strong",
      5: "strong",
    }

    return {
      isValid: true,
      strength: strengthLabels[strength],
      message: strength >= 3 ? "Contraseña segura" : "Considera agregar más caracteres especiales o números",
    }
  },

  /**
   * Check if passwords match
   * @param {string} password
   * @param {string} confirmPassword
   * @returns {boolean}
   */
  passwordsMatch(password, confirmPassword) {
    return password === confirmPassword
  },

  /**
   * Check if value is required (not empty)
   * @param {any} value
   * @returns {boolean}
   */
  isRequired(value) {
    if (typeof value === "string") {
      return value.trim().length > 0
    }
    return value !== null && value !== undefined
  },

  /**
   * Check if value is numeric
   * @param {any} value
   * @returns {boolean}
   */
  isNumeric(value) {
    return !isNaN(Number.parseFloat(value)) && isFinite(value)
  },

  /**
   * Check if value is within range
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {boolean}
   */
  isInRange(value, min, max) {
    const num = Number.parseFloat(value)
    return num >= min && num <= max
  },

  /**
   * Check if string has minimum length
   * @param {string} value
   * @param {number} minLength
   * @returns {boolean}
   */
  hasMinLength(value, minLength) {
    return value && value.length >= minLength
  },

  /**
   * Check if string has maximum length
   * @param {string} value
   * @param {number} maxLength
   * @returns {boolean}
   */
  hasMaxLength(value, maxLength) {
    return !value || value.length <= maxLength
  },

  /**
   * Validate form data
   * @param {Object} data
   * @param {Object} rules
   * @returns {Object}
   */
  validateForm(data, rules) {
    const errors = {}

    Object.keys(rules).forEach((field) => {
      const value = data[field]
      const fieldRules = rules[field]

      if (fieldRules.required && !this.isRequired(value)) {
        errors[field] = fieldRules.requiredMessage || "Este campo es requerido."
        return
      }

      if (fieldRules.email && value && !this.isValidEmail(value)) {
        errors[field] = "Ingresa un correo electrónico válido."
        return
      }

      if (fieldRules.minLength && value && !this.hasMinLength(value, fieldRules.minLength)) {
        errors[field] = `Mínimo ${fieldRules.minLength} caracteres.`
        return
      }

      if (fieldRules.maxLength && value && !this.hasMaxLength(value, fieldRules.maxLength)) {
        errors[field] = `Máximo ${fieldRules.maxLength} caracteres.`
        return
      }

      if (fieldRules.numeric && value && !this.isNumeric(value)) {
        errors[field] = "Debe ser un número válido."
        return
      }

      if (fieldRules.min !== undefined && fieldRules.max !== undefined && value) {
        if (!this.isInRange(value, fieldRules.min, fieldRules.max)) {
          errors[field] = `Debe estar entre ${fieldRules.min} y ${fieldRules.max}.`
          return
        }
      }

      if (fieldRules.match && value !== data[fieldRules.match]) {
        errors[field] = fieldRules.matchMessage || "Los valores no coinciden."
        return
      }

      if (fieldRules.custom && typeof fieldRules.custom === "function") {
        const customError = fieldRules.custom(value, data)
        if (customError) {
          errors[field] = customError
        }
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  },
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = Validators
}
