// src/hooks/useAuth.js
// Hook personalizado para manejar autenticación

import { useState, useEffect, useContext, createContext } from 'react';
import apiServices from '../services/apiServices';

// Crear contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = apiServices.utils.getStoredToken();
      const storedUser = apiServices.utils.getStoredUser();

      if (!token && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
        return;
      }

      if (token) {
        try {
          const userData = await apiServices.auth.verifyToken();
          setUser(userData);
          setIsAuthenticated(true);
          return;
        } catch (verifyError) {
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
            return;
          }
          throw verifyError;
        }
      }

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      // Token inválido o expirado
      apiServices.utils.clearStoredToken();
      apiServices.utils.clearStoredUser();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await apiServices.auth.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiServices.auth.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    apiServices.auth.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};