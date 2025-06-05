import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      try {
        setLoading(true);
        const userData = await authService.getCurrentUser();
        setCurrentUser(userData);
        setError(null);
      } catch (err) {
        console.error('Error checking authentication status:', err);
        setCurrentUser(null);
        // Don't set an error message for 401 responses as they're expected when not logged in
        if (err.response && err.response.status !== 401) {
          setError('Failed to authenticate user');
        }
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const userData = await authService.login(username, password);
      setCurrentUser(userData);
      setError(null);
      return userData;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (studentData) => {
    try {
      setLoading(true);
      const userData = await authService.register(studentData);
      setError(null);
      return userData;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setCurrentUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      const response = await authService.changePassword(passwordData);
      setError(null);
      return response;
    } catch (err) {
      console.error('Change password error:', err);
      setError(err.response?.data?.message || 'Password change failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
