/**
 * Administrative Route Guard - LaRama Frontend
 * Protects admin routes by enforcing authentication checks.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

const RequireAdmin = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="admin-content" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
        <p>Loading administrator panel...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAdmin;
