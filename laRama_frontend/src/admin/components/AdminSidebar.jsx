/**
 * Admin Sidebar Component - LaRama Frontend
 * Provides navigation for administrative panel sections.
 */

import { NavLink } from 'react-router-dom';
import { ADMIN_NAV_ITEMS } from '../constants/navigation';

export const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span role="img" aria-label="LaRama">🏷️</span>
        LaRama Admin
      </div>

      <nav className="admin-nav">
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? ' active' : ''}`
            }
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-nav-footer">
        <p>Expandable admin panel foundation for LaRama handcrafted products.</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
