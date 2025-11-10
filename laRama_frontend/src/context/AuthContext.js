/**
 * Authentication Context Definition - LaRama Frontend
 * Creates React Context for global authentication state management
 * Provides foundation for user authentication throughout the application
 * Used in conjunction with AuthContext.jsx provider for complete auth system
 */

import { createContext } from "react";

// Create authentication context with null default value
// This context will be populated by AuthProvider in AuthContext.jsx
export const AuthContext = createContext(null);