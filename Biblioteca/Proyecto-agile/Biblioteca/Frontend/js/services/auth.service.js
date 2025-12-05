const AuthService = {
  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   */
  async login(email, password) {
    try {
      const response = await HttpClient.post('/auth/login', { email, password });

      if (response && response.token) {
        const userProfile = {
          id: response.id,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          role: { name: response.role }
        };
        Storage.saveAuth(response.token, userProfile);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register a new customer
   * @param {Object} data
   */
  async registerCustomer(data) {
    return await HttpClient.post('/auth/register/customer', data);
  },

  /**
   * Register a new author
   * @param {Object} data
   */
  async registerAuthor(data) {
    return await HttpClient.post('/auth/register/author', data);
  },

  logout() {
    Storage.clearAuth();
    Storage.clearCart();
    window.location.href = 'auth.html';
  }
};
