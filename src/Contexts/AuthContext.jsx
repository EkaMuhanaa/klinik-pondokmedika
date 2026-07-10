import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL + '/api';
  
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await axios.get('/admin/user');
          setUser(res.data);
        } catch (error) {
          console.error('Token invalid', error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/admin/login', { email, password });
    const { user, token } = res.data;
    setUser(user);
    setToken(token);
    localStorage.setItem('admin_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true;
  };

  const logout = async () => {
    try {
      if(token) await axios.post('/admin/logout');
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('admin_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
