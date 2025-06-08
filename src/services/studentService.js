import api from './api';

const studentService = {
  getAllStudents: async () => {
    try {
      const response = await api.get('/student/public/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentById: async (id) => {
    try {
      const response = await api.get(`/student/public/findById?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createStudent: async (studentData) => {
    try {
      const response = await api.post('/student/createStudent', studentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateStudent: async (studentData) => {
    try {
      const response = await api.put('/student/public/updateStudent', studentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteStudent: async (id) => {
    try {
      const response = await api.delete(`/student/public/deleteStudent?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentProfile: async () => {
    try {
      // This endpoint would return the current logged-in student's profile
      const response = await api.get('/student/profile');
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
  }
};

export default studentService;
