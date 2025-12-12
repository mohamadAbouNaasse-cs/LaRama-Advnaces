/**
 * Admin Layout Container - LaRama Frontend
 * Combines sidebar and navbar with routed admin content.
 */

import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
import '../styles/admin.css';

const AdminLayout = () => {
  return (
    <div className="admin-app">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
