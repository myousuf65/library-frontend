import api from './api';

const dashboardService = {
  getDashboardStats: async () => {
    try {
      console.log("Fetching dashboard stats from API...");
      const response = await api.get('/api/dashboard/stats');
      console.log("Dashboard stats response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
  
  getRecentTransactions: async (limit = 5) => {
    try {
      console.log("Fetching recent transactions from API...");
      const response = await api.get(`/api/dashboard/recent-transactions?limit=${limit}`);
      console.log("Recent transactions response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
      throw error;
    }
  },
  
  getPopularBooks: async (limit = 5) => {
    try {
      console.log("Fetching popular books from API...");
      const response = await api.get(`/api/dashboard/popular-books?limit=${limit}`);
      console.log("Popular books response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching popular books:", error);
      throw error;
    }
  },
  
  getOverdueBooks: async (limit = 5) => {
    try {
      console.log("Fetching overdue books from API...");
      const response = await api.get(`/api/dashboard/overdue-books?limit=${limit}`);
      console.log("Overdue books response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching overdue books:", error);
      // Return empty array to show "No overdue books" message
      return [];
    }
  }
};

export default dashboardService;
