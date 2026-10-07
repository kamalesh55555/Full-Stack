import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // On mount / token change: persist token and decode user from stored data
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Try to restore user from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/auth/login`, { email, password });
      setToken(res.data.token);
      saveUser(res.data.user);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/auth/register`, { name, email, password });
      setToken(res.data.token);
      saveUser(res.data.user);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Signup failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (idToken) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/auth/google`, { idToken });
      setToken(res.data.token);
      saveUser(res.data.user);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Google login failed';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
  };

  // Helper: create an axios instance with the auth header baked in
  const authAxios = axios.create({ baseURL: API });
  authAxios.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, googleLogin, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
