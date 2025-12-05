const CollectionService = {
  /**
   * Create collection
   * @param {Object} data 
   */
  async create(data) {
    return await HttpClient.post('/collections', data);
  },

  /**
   * Get user collections
   * @param {number} userId 
   */
  async getUserCollections(userId) {
    return await HttpClient.get(`/collections/user/${userId}`);
  },

  /**
   * Get collection details
   * @param {number} id 
   */
  async getById(id) {
    return await HttpClient.get(`/collections/${id}`);
  },

  /**
   * Update collection
   * @param {number} id 
   * @param {Object} data 
   */
  async update(id, data) {
    return await HttpClient.put(`/collections/${id}`, data);
  },

  /**
   * Delete collection
   * @param {number} id 
   */
  async delete(id) {
    return await HttpClient.delete(`/collections/${id}`);
  },

  /**
   * Add book to collection
   * @param {number} collectionId 
   * @param {number} bookId 
   */
  async addBook(collectionId, bookId) {
    return await HttpClient.post(`/collections-books/${collectionId}/add-book?bookId=${bookId}`, {});
  },

  /**
   * Remove book from collection
   * @param {number} collectionId 
   * @param {number} bookId 
   */
  async removeBook(collectionId, bookId) {
    return await HttpClient.delete(`/collections-books/${collectionId}/remove-book/${bookId}`);
  },

  /**
   * Get books in collection
   * @param {number} collectionId 
   */
  async getBooks(collectionId) {
    return await HttpClient.get(`/collections-books/${collectionId}/books`);
  }
};
