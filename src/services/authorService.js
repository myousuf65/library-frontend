import api from './api';

const authorService = {
  getAllAuthors: async () => {
    try {
      const response = await api.get('/public/authors/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAuthorById: async (id) => {
    try {
      const response = await api.get(`/public/authors/findById?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAuthor: async (authorData) => {
    try {
      const response = await api.post('/createAuthor', authorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAuthor: async (authorData) => {
    try {
      const response = await api.put('/public/authors/updateAuthor', authorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAuthor: async (id) => {
    try {
      const response = await api.delete(`/public/authors/deleteAuthor?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authorService;
