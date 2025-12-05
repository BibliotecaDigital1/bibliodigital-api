const AuthorService = {
 
    async getAll() {
        return await HttpClient.get('/admin/authors');
    },

    /**
     * Get author by ID
     * @param {number} id 
     */
    async getById(id) {
        return await HttpClient.get(`/admin/authors/${id}`);
    },

    /**
     * Create author
     * @param {Object} data 
     */
    async create(data) {
        return await HttpClient.post('/admin/authors', data);
    },

    /**
     * Update author
     * @param {number} id 
     * @param {Object} data 
     */
    async update(id, data) {
        return await HttpClient.put(`/admin/authors/${id}`, data);
    },

    /**
     * Delete author
     * @param {number} id 
     */
    async delete(id) {
        return await HttpClient.delete(`/admin/authors/${id}`);
    }
};
