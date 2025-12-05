const CategoryService = {

  async getAll() {
    return await HttpClient.get('/categories');
  },

  /**
   * Create category (Admin)
   * @param {Object} data 
   */
  async create(data) {
    return await HttpClient.post('/admin/categories', data);
  },

  /**
   * Update category (Admin)
   * @param {number} id 
   * @param {Object} data 
   */
  async update(id, data) {
    return await HttpClient.put(`/admin/categories/${id}`, data);
  },

  /**
   * Delete category (Admin)
   * @param {number} id 
   */
  async delete(id) {
    return await HttpClient.delete(`/admin/categories/${id}`);
  }
};
