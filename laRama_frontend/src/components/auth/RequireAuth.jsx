/**
 * Authentication Route Guard Component - LaRama Frontend
 * Protects private routes by enforcing user authentication requirements
 * Redirects unauthenticated users to login page while preserving intended destination
 * Essential component for securing dashboard and user-specific content
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * RequireAuth Component - Route Protection Wrapper
 * Higher-order component that checks authentication status before rendering protected content
 * Manages redirect flow to maintain user experience after successful login
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Protected content to render when authenticated
 * @returns {JSX.Element} - Either the protected children or redirect to auth page
 */
const RequireAuth = ({ children }) => {
  // Get authentication status from global auth context
  const { isAuthenticated } = useAuth();
  
  // Capture current location for post-login redirect
  const location = useLocation();

  // Redirect to authentication page if user is not logged in
  // Pass current location in state to enable redirect after successful login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // User is authenticated - render protected content
  return children;
};

export default RequireAuth;