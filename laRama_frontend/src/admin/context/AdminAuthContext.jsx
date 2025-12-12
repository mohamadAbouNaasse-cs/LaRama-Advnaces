/**
 * Administrative Authentication Context - LaRama Frontend
 * Supplies authentication state and actions for the admin panel routes.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminApi, ADMIN_TOKEN_STORAGE_KEY } from '../services/adminApi';
import { AdminAuthContext } from './AdminAuthContext';

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY));
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setLoading(false);
        setAdmin(null);
        return;
      }

      try {
        setLoading(true);
        const response = await adminApi.verify();
        if (response.success && response.data?.admin) {
          setAdmin(response.data.admin);
        } else {
          clearSession();
        }
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token, clearSession]);

  const login = useCallback(async (credentials) => {
    setError(null);
    const response = await adminApi.login(credentials);

    if (response.success && response.data?.token) {
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, response.data.token);
      setToken(response.data.token);
      if (response.data.admin) {
        setAdmin(response.data.admin);
      }
      return response;
    }

    throw new Error(response.message || 'Unable to authenticate administrator.');
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(() => ({
    admin,
    token,
    loading,
    isAuthenticated: Boolean(token) && Boolean(admin),
    login,
    logout,
    error,
    setError,
  }), [admin, token, loading, login, logout, error, setError]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
