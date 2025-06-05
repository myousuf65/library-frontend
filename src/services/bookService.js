import api from './api';

const bookService = {
  getAllBooks: async () => {
    try {
      console.log("bookService: Calling /api/books/public/all endpoint");
      const response = await api.get('/api/books/public/all');
      console.log("bookService: Response received:", response.status);
      console.log("bookService: Response data type:", typeof response.data);
      console.log("bookService: Response data is array:", Array.isArray(response.data));
      if (Array.isArray(response.data)) {
        console.log("bookService: Number of books:", response.data.length);
      } else {
        console.log("bookService: Response data:", response.data);
      }
      return response.data;
    } catch (error) {
      console.error("bookService: Error in getAllBooks:", error);
      throw error;
    }
  },

  getBookById: async (id) => {
    try {
      const response = await api.get(`/api/books/public/findById?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  uploadBookImage: async (formData) => {
    try {
      console.log("Uploading image with form data:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? 'File: ' + value.name + ' (' + value.size + ' bytes)' : value}`);
      }
      
      // Make sure we're using the correct content type for file uploads
      const response = await api.post('/api/books/public/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Add timeout to ensure large images have time to upload
        timeout: 30000
      });
      
      console.log("Image upload successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading book image:", error);
      throw error;
    }
  },
  createBook: async (bookData) => {
    try {
      const response = await api.post('/api/books/create', bookData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  createBookWithImage: async (formData) => {
    try {
      // For debugging - log all form data entries
      console.log("Form data being sent to createWithImage endpoint:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? 'File: ' + value.name + ' (' + value.size + ' bytes)' : value}`);
      }
      
      // Use the endpoint that handles both book data and image in one request
      const response = await api.post('/api/books/public/createWithImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout for large images
      });
      
      console.log("Book created with image response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in createBookWithImage:", error);
      throw error;
    }
  },

  updateBook: async (bookData) => {
    try {
      console.log("bookService: Updating book with data:", JSON.stringify(bookData));
      const response = await api.put('/api/books/public/updateBook', bookData);
      console.log("bookService: Update response:", response.status, response.data);
      return response.data;
    } catch (error) {
      console.error("bookService: Error updating book:", error);
      throw error;
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/api/books/public/deleteBook?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchBooks: async (params) => {
    try {
      const response = await api.get('/api/books/search', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getBorrowedBooksByStudent: async (studentId) => {
    try {
      console.log("bookService: Fetching borrowed books for student ID:", studentId);
      const response = await api.get(`/api/books/public/borrowed?studentId=${studentId}`);
      console.log("bookService: Borrowed books response:", response.data);
      return response.data;
    } catch (error) {
      console.error("bookService: Error fetching borrowed books:", error);
      throw error;
    }
  },
  
  getBookImageUrl: (id) => {
    // Add a timestamp to prevent browser caching
    return `${api.defaults.baseURL}/api/books/public/image?id=${id}&timestamp=${new Date().getTime()}`;
  }
};

export default bookService;
