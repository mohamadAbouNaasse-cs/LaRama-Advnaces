/**
 * Admin Navbar Component - LaRama Frontend
 * Renders top navigation bar for administrative layout with quick actions.
 */

import { useLocation } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminNavbar = () => {
  const location = useLocation();
  const { admin, logout } = useAdminAuth();

  const getPageTitle = () => {
    if (location.pathname.startsWith('/admin/products')) return 'Product Management';
    if (location.pathname.startsWith('/admin/orders')) return 'Order Oversight';
    if (location.pathname.startsWith('/admin/live-sessions')) return 'Live Sessions';
    return 'Dashboard Overview';
  };

  return (
    <header className="admin-navbar">
      <div>
        <div className="admin-breadcrumbs">Admin / {getPageTitle()}</div>
        <h1>{getPageTitle()}</h1>
      </div>
      <div className="admin-navbar-actions">
        <span>{admin?.email}</span>
        <button type="button" onClick={logout}>
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
