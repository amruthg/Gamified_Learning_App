// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user info exists in localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/users/login', { email, password });
    setUser(data.user);
    localStorage.setItem('userInfo', JSON.stringify(data.user));
    return data;
  };

  const signup = async (username, email, password) => {
    const { data } = await axios.post('/api/users/register', {
      username,
      email,
      password,
    });
    setUser(data.user);
    localStorage.setItem('userInfo', JSON.stringify(data.user));
    return data;
  };

  const logout = async () => {
    try {
      await axios.post('/api/users/logout');
      setUser(null);
      localStorage.removeItem('userInfo');
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  
  

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};