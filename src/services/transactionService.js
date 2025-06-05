import api from './api';

const transactionService = {
  getAllTransactions: async () => {
    try {
      console.log("API call: Getting basic transactions (safer method)");
      // Try the basic endpoint first which avoids foreign key issues
      const response = await api.get('/transaction/basic');
      console.log("API response from basic endpoint:", response.data);
      return response.data;
    } catch (error) {
      console.error("API error in getAllTransactions:", error.response || error);
      
      // Fall back to the regular endpoint if basic fails
      try {
        console.log("Basic endpoint failed, trying regular endpoint");
        const regularResponse = await api.get('/transaction/all');
        console.log("API response from regular endpoint:", regularResponse.data);
        return regularResponse.data;
      } catch (regularError) {
        console.error("Regular endpoint also failed:", regularError);
        return [];
      }
    }
  },

  getTransactionById: async (id) => {
    try {
      const response = await api.get(`/transaction/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  issueBook: async (bookId, cardId) => {
    try {
      console.log(`API call: Issuing book ${bookId} to student ${cardId}`);
      const response = await api.post(`/transaction/issueBook?bookId=${bookId}&studentId=${cardId}`);
      console.log("Issue book response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API error in issueBook:", error.response || error);
      throw error;
    }
  },

  returnBook: async (bookId, cardId) => {
    try {
      console.log(`API call: Returning book ${bookId} from student ${cardId}`);
      const response = await api.post(`/transaction/returnBook?bookId=${bookId}&studentId=${cardId}`);
      console.log("Return book response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API error in returnBook:", error.response || error);
      throw error;
    }
  },

  getStudentTransactions: async (cardId) => {
    try {
      const response = await api.get(`/transaction/student?cardId=${cardId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBookTransactions: async (bookId) => {
    try {
      const response = await api.get(`/transaction/book?bookId=${bookId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getOverdueTransactions: async () => {
    try {
      const response = await api.get('/transaction/overdue');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default transactionService;
