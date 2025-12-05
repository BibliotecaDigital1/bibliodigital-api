const UserService = {
    /**
     * Get user profile
     * @param {number} id 
     */
    async getProfile(id) {
        return await HttpClient.get(`/user/profile/${id}`);
    },

    /**
     * Update user profile
     * @param {number} id 
     * @param {Object} data 
     */
    async updateProfile(id, data) {
        return await HttpClient.put(`/user/profile/${id}`, data);
    },

    /**
     * Get user collections with book count
     * @param {number} userId 
     */
    async getCollections(userId) {
        return await HttpClient.get(`/collections/user/${userId}`);
    }
};
