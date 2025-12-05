const BookService = {

  async getRecent() {
    return await HttpClient.get('/books/recent');
  },

  /**
   * Get all books (Public)
   * @param {number} page 
   * @param {number} size 
   */
  async getAll(page = 0, size = 100) {
    return await HttpClient.get('/books');
  },

  /**
   * Get book details (Public)
   * @param {number} id 
   */
  async getById(id) {
    return await HttpClient.get(`/books/${id}`);
  },

  /**
   * Create a book (Admin)
   * @param {Object} data 
   */
  async create(data) {
    return await HttpClient.post('/admin/books', data);
  },

  /**
   * Update a book (Admin)
   * @param {number} id 
   * @param {Object} data 
   */
  async update(id, data) {
    return await HttpClient.put(`/admin/books/${id}`, data);
  },

  /**
   * Delete a book (Admin)
   * @param {number} id 
   */
  async delete(id) {
    return await HttpClient.delete(`/admin/books/${id}`);
  }
};
