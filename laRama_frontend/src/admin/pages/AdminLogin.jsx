/**
 * Admin Login Page - LaRama Frontend
 * Provides initial authentication screen for administrative access.
 */

import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminLogin = () => {
  const { login, isAuthenticated, setError, error } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setError?.(null);
  }, [setError]);

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/admin/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError?.(null);

    try {
      await login(form);
      navigate('/admin/dashboard', { replace: true });
    } catch (authError) {
      setError?.(authError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <h1>LaRama Admin Access</h1>
        <p>Use the temporary administrator credentials to continue.</p>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">
            Email Address
            <input
              id="admin-email"
              name="email"
              type="email"
              placeholder="admin@larama.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </label>

          <label htmlFor="admin-password">
            Password
            <input
              id="admin-password"
              name="password"
              type="password"
              placeholder="LaRamaAdmin123!"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Authenticating…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
