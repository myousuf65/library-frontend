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

	issueScannedBooks: async (bookId, cardId) => {
		try {
			console.log(`API call: Issuing book ${bookId} to student ${cardId}`);
			const response = await api.post(`/transaction/scan/issueBook?bookId=${bookId}&studentId=${cardId}`);
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
			console.log(`API call: Getting transactions for student ID: ${cardId}`);
			const response = await api.get(`/transaction/student?cardId=${cardId}`);
			console.log("Student transactions response:", response.data);

			// If the response is empty, try getting all transactions as a fallback
			if (!response.data || response.data.length === 0) {
				console.log("No student transactions found, fetching all transactions as fallback");
				// Use direct function call instead of this.getAllTransactions()
				return transactionService.getAllTransactions();
			}

			return response.data;
		} catch (error) {
			console.error("API error in getStudentTransactions:", error.response || error);

			// Fallback to mock data for development/testing
			console.log("Error fetching student transactions, using mock data");
			return [
				{
					id: 1,
					transactionId: "mock-1",
					isIssueOperation: true,
					transactionStatus: "SUCCESSFUL",
					transactionDate: new Date().toISOString(),
					book: { id: 1, name: "Clean Code", author: { name: "Robert C. Martin" } }
				},
				{
					id: 2,
					transactionId: "mock-2",
					isIssueOperation: false,
					transactionStatus: "SUCCESSFUL",
					transactionDate: new Date().toISOString(),
					fineAmount: 0,
					book: { id: 2, name: "Design Patterns", author: { name: "Erich Gamma" } }
				}
			];
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
	},

	setFine: async (payload) => {
		try {
			const response = await api.post('/transaction/setfine', payload);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	clearFine: async (studentId) => {
		try {
			console.log('Clearing fine for student ID:', studentId);
			// Use the setfine endpoint with fine = 0 since clearfine is not available on ngrok
			const response = await api.post('/transaction/setfine', {
				studentId: studentId,
				fine: 0
			});
			console.log('Clear fine response:', response.data);
			return response.data;
		} catch (error) {
			console.error('Error clearing fine:', error.response || error);
			throw error;
		}
	}
};

export default transactionService;
