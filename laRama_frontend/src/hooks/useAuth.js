/**
 * Custom Authentication Hook - LaRama Frontend
 * Provides access to authentication context throughout the application
 * Handles user authentication state and related operations
 * Must be used within AuthProvider component tree
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * useAuth Hook
 * Accesses authentication context and provides user authentication state
 * @returns {object} Authentication context containing user data and auth methods
 * @throws {Error} When used outside of AuthProvider component
 */
export const useAuth = () => {
  // Access authentication context from React Context API
  const context = useContext(AuthContext);
  
  // Ensure hook is used within proper provider component
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};