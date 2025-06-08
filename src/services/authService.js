import api from './api';

const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (studentData) => {
    try {
      const response = await api.post('/student/createStudent', studentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/student/changePassword', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/currentUser');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
