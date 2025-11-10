/**
 * Authentication Context Provider - LaRama Frontend
 * Manages global authentication state and user session persistence
 * Provides authentication methods and user data throughout the application
 * Handles token verification, storage, and error management
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext.js";
import apiService from "../services/api.js";

// localStorage key for persisting user authentication data
const AUTH_STORAGE_KEY = "larama-auth-user";

/**
 * Utility function to safely read stored user data from localStorage
 * Handles SSR compatibility and JSON parsing errors
 * @returns {object|null} Parsed user object or null if not found/invalid
 */
const readStoredUser = () => {
  // Server-side rendering safety check
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to read stored auth user", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(true);

  // Verify token on app start
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('larama-auth-token');
      if (token && !user) {
        try {
          const response = await apiService.verifyToken();
          if (response.success) {
            setUser(response.data.user);
          } else {
            // Token invalid, clear it
            localStorage.removeItem('larama-auth-token');
            localStorage.removeItem('larama-auth-user');
          }
        } catch (error) {
          console.warn('Token verification failed:', error);
          localStorage.removeItem('larama-auth-token');
          localStorage.removeItem('larama-auth-user');
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (user) {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.warn("Failed to persist auth user", error);
    }
  }, [user]);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    }
    setUser(null);
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await apiService.register(userData);
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error("Registration API error:", error);
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.message.includes("fetch")) {
        errorMessage = "Cannot connect to server. Please ensure the backend is running on port 5000.";
      } else if (error.message.includes("CORS")) {
        errorMessage = "Server connection blocked. Please check CORS configuration.";
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await apiService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error("Login API error:", error);
      let errorMessage = "Login failed. Please try again.";
      
      if (error.message.includes("fetch")) {
        errorMessage = "Cannot connect to server. Please ensure the backend is running on port 5000.";
      } else if (error.message.includes("CORS")) {
        errorMessage = "Server connection blocked. Please check CORS configuration.";
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      logout,
      register,
      loginUser,
    }),
    [user, loading, login, logout, register, loginUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

