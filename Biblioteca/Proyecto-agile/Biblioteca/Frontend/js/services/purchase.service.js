const PurchaseService = {

  async getAll() {
    return await HttpClient.get('/purchases');
  },

  /**
   * Create a purchase
   * @param {Object} data 
   */
  async create(data) {
    return await HttpClient.post('/purchases', data);
  },

  async getHistory() {
    return await HttpClient.get('/purchases/user');
  },

  /**
   * Get purchase details
   * @param {number} id 
   */
  async getById(id) {
    return await HttpClient.get(`/purchases/${id}`);
  },

  /**
   * Confirm purchase
   * @param {number} id 
   */
  async confirm(id) {
    return await HttpClient.put(`/purchases/confirm/${id}`);
  },

  /**
   * Get purchase report
   * @param {string} date 
   */
  async getReport(date) {
    return await HttpClient.get('/purchases/report', { date });
  }
};
