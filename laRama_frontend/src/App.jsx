/**
 * Main Application Component - LaRama Frontend
 * Handles application routing, theme management, and global context providers
 * Integrates authentication, layout components, and page routing
 */

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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

// Global styling and CSS imports
import "./App.css";

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
      {/* Global authentication context provider */}
      <AuthProvider>
        <div className="min-h-screen flex flex-col app-surface">
          {/* Global header with theme toggle functionality */}
          <Header theme={theme} onToggleTheme={toggleTheme} isDark={isDark} />
          
          {/* Main content area with flexible layout */}
          <main className="flex-1">
            <Routes>
              {/* Public routes accessible to all users */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/about" element={<About />} />
              
              {/* E-commerce functionality routes */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/customize" element={<Customize />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes requiring authentication */}
              <Route
                path="/dashboard"
                element={(
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                )}
              />
            </Routes>
          </main>
          
          {/* Global footer component */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;