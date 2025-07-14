import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/profile');
        setUser({ ...response.data, subscribedChannels: response.data.subscribedChannels || [] });
      } catch (error) {
        console.error("Error refreshing user profile:", error);
        logout();
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          refreshUserProfile();
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Invalid token found in localStorage:", error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, subscribedChannels, channelId } = response.data;
      localStorage.setItem('token', token);
      const decodedUser = jwtDecode(token);
      setUser({ ...decodedUser, channelId, subscribedChannels: subscribedChannels || [] });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await refreshUserProfile();
      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/signup', { username, email, password });
      const { token, subscribedChannels, channelId } = response.data;
      localStorage.setItem('token', token);
      const decodedUser = jwtDecode(token);
      setUser({ ...decodedUser, channelId, subscribedChannels: subscribedChannels || [] });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await refreshUserProfile();
      return true;
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUserProfile }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);