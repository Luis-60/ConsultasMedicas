import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (token) {
      setUser({ token, type: userType });
    }
    setLoading(false);
  }, []);
  const login = async (credentials, type) => {
    try {
      console.log('AuthContext: Tentando login', { credentials, type });
      let response;
      
      if (type === 'cliente') {
        response = await authService.loginCliente(credentials);
      } else {
        response = await authService.loginMedico(credentials);
      }

      if (!response) {
        throw new Error('Resposta vazia do servidor');
      }

      const userData = response;
      const token = userData.idCliente || userData.idMedico;
      
      localStorage.setItem('token', token.toString());
      localStorage.setItem('userType', type);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setUser({ token, type, ...userData });
      return true;
    } catch (error) {
      console.error('AuthContext: Erro no login', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userData');
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
