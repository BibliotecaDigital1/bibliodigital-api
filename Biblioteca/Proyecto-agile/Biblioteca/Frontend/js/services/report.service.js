const ReportService = {
    /**
     * Get sales report
     * @param {string} date 
     */
    async getSalesReport(date) {
        return await HttpClient.get('/purchases/report', { date });
    }
};
