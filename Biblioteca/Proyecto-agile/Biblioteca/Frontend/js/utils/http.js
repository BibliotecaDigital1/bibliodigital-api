const API_CONFIG = {
  BASE_URL: "http://localhost:8080/api/v1",
  TIMEOUT: 10000,
}

const HttpClient = {
  /**
   * Make a GET request
   * @param {string} endpoint
   * @param {Object} params
   * @returns {Promise<any>}
   */
  async get(endpoint, params = {}) {
    const url = this._buildUrl(endpoint, params)
    return this._request(url, { method: "GET" })
  },

  /**
   * Make a POST request
   * @param {string} endpoint
   * @param {Object} body
   * @returns {Promise<any>}
   */
  async post(endpoint, body = {}) {
    const url = this._buildUrl(endpoint)
    return this._request(url, {
      method: "POST",
      body: JSON.stringify(body),
    })
  },

  /**
   * Make a PUT request
   * @param {string} endpoint
   * @param {Object} body
   * @returns {Promise<any>}
   */
  async put(endpoint, body = {}) {
    const url = this._buildUrl(endpoint)
    return this._request(url, {
      method: "PUT",
      body: JSON.stringify(body),
    })
  },

  /**
   * Make a DELETE request
   * @param {string} endpoint
   * @returns {Promise<any>}
   */
  async delete(endpoint) {
    const url = this._buildUrl(endpoint)
    return this._request(url, { method: "DELETE" })
  },

  /**
   * Upload a file
   * @param {string} endpoint
   * @param {FormData} formData
   * @returns {Promise<any>}
   */
  async upload(endpoint, formData) {
    const url = this._buildUrl(endpoint)
    const headers = this._getHeaders(false)

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    })

    return this._handleResponse(response)
  },

  /**
   * Build full URL with query parameters
   * @param {string} endpoint
   * @param {Object} params
   * @returns {string}
   * @private
   */
  _buildUrl(endpoint, params = {}) {
    const url = new URL(endpoint.startsWith('http') ? endpoint : API_CONFIG.BASE_URL + endpoint)

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key])
      }
    })

    return url.toString()
  },

  /**
   * Get request headers
   * @param {boolean} includeContentType
   * @returns {Object}
   * @private
   */
  _getHeaders(includeContentType = true) {
    const headers = {}

    if (includeContentType) {
      headers["Content-Type"] = "application/json"
    }

    const auth = Storage.getAuth()
    if (auth && auth.token) {
      headers["Authorization"] = `Bearer ${auth.token}`
    }

    return headers
  },

  /**
   * Make HTTP request
   * @param {string} url
   * @param {Object} options
   * @returns {Promise<any>}
   * @private
   */
  async _request(url, options = {}) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    try {
      const response = await fetch(url, {
        ...options,
        headers: this._getHeaders(),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return this._handleResponse(response)
    } catch (error) {
      clearTimeout(timeoutId)
      return this._handleError(error)
    }
  },

  /**
   * Handle fetch response
   * @param {Response} response
   * @returns {Promise<any>}
   * @private
   */
  async _handleResponse(response) {

    if (response.status === 204) {
      return { success: true }
    }

    let data
    try {
      data = await response.json()
    } catch {
      data = null
    }

    if (!response.ok) {
      switch (response.status) {
        case 401:
          Storage.clearAuth()
          window.location.href = "/frontend/login.html"
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.")
        case 403:
          throw new Error("No tienes permisos para realizar esta acción.")
        case 404:
          throw new Error("Recurso no encontrado.")
        case 422:
          throw new Error(data?.message || "Datos de entrada inválidos.")
        case 500:
          throw new Error("Error del servidor. Intenta más tarde.")
        default:
          throw new Error(data?.message || "Ha ocurrido un error.")
      }
    }

    return data
  },

  /**
   * Handle fetch errors
   * @param {Error} error
   * @throws {Error}
   * @private
   */
  _handleError(error) {
    if (error.name === "AbortError") {
      throw new Error("La solicitud tardó demasiado. Intenta nuevamente.")
    }

    if (!navigator.onLine) {
      throw new Error("Sin conexión a internet.")
    }

    throw error
  },
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = HttpClient
}
