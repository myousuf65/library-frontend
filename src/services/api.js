import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling cookies/session
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Log outgoing requests for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    // You can add auth token here if using JWT
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    // Remove Content-Type for multipart/form-data requests (file uploads)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    // Handle common errors
    console.error("API Response Error:", error.response || error);
    
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      if (error.response.status === 401) {
        console.log("Authentication error - redirecting to login");
        // Only redirect to login if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
