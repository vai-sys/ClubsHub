
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('token', response.data.token);
      
    
      return userData;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw new Error('Login failed. Please check your credentials.');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message || error.message);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch profile:', error.response?.data?.message || error.message);
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const value = {
    user,
    login,
    logout,
    loading,
    role: user?.role
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};