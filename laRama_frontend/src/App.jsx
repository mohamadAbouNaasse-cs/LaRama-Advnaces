/**
 * Main Application Component - LaRama Frontend
 * Handles application routing, theme management, and global context providers
 * Integrates authentication, layout components, and page routing
 */

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";

// Layout components for consistent UI structure
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Page components for application routing
import Home from "./pages/Home";
import Products from "./pages/Products";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Customize from "./pages/Customize";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

// Authentication and routing protection
import RequireAuth from "./components/auth/RequireAuth";
import { AuthProvider } from "./context/AuthContext.jsx";
import AdminLayout from "./admin/layout/AdminLayout.jsx";
import AdminLogin from "./admin/pages/AdminLogin.jsx";
import AdminDashboard from "./admin/pages/AdminDashboard.jsx";
import AdminProducts from "./admin/pages/AdminProducts.jsx";
import AdminOrders from "./admin/pages/AdminOrders.jsx";
import AdminLiveSessions from "./admin/pages/AdminLiveSessions.jsx";
import AdminLiveRoom from "./admin/pages/AdminLiveRoom.jsx";
import RequireAdmin from "./admin/components/RequireAdmin.jsx";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext.jsx";
import LiveSession from "./live/pages/LiveSession.jsx";

// Global styling and CSS imports
import "./App.css";

const StorefrontLayout = ({ theme, toggleTheme, isDark }) => (
  <div className="min-h-screen flex flex-col app-surface">
    <Header theme={theme} onToggleTheme={toggleTheme} isDark={isDark} />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  /**
   * Theme Management Functions
   * Handles dark/light theme detection and persistence
   */
  const getInitialTheme = () => {
    // Server-side rendering safety check
    if (typeof window === "undefined") {
      return "light";
    }

    // Check for previously stored theme preference
    const storedTheme = window.localStorage.getItem("larama-theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    // Fallback to system preference detection
    return typeof window.matchMedia === "function" && 
           window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Theme state management
  const [theme, setTheme] = useState(getInitialTheme);

  /**
   * Theme Effect Handler
   * Applies theme changes to DOM and persists user preference
   */
  useEffect(() => {
    // SSR safety check
    if (typeof document === "undefined" || typeof window === "undefined") return;

    // Apply theme to document root for CSS variable cascading
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.add("theme-transitioning");
    
    // Persist theme preference in localStorage
    window.localStorage.setItem("larama-theme", theme);

    // Remove transition class after animation completes
    const timeout = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 600);

    // Cleanup timeout on component unmount or theme change
    return () => window.clearTimeout(timeout);
  }, [theme]);

  // Theme utility functions
  const isDark = theme === "dark";
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  /**
   * Application Render
   * Provides routing context, authentication context, and layout structure
   */
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={(
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              )}
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="live-sessions" element={<AdminLiveSessions />} />
              <Route path="live-sessions/room/:roomId" element={<AdminLiveRoom />} />
            </Route>

            <Route
              path="/"
              element={(
                <StorefrontLayout
                  theme={theme}
                  toggleTheme={toggleTheme}
                  isDark={isDark}
                />
              )}
            >
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="contact" element={<Contact />} />
              <Route path="returns" element={<Returns />} />
              <Route path="shipping" element={<Shipping />} />
              <Route path="about" element={<About />} />
              <Route path="cart" element={<Cart />} />
              <Route path="customize" element={<Customize />} />
              <Route path="auth" element={<Auth />} />
              <Route
                path="live/:productId"
                element={(
                  <RequireAuth>
                    <LiveSession />
                  </RequireAuth>
                )}
              />
              <Route
                path="dashboard"
                element={(
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                )}
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;