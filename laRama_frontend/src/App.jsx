import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import About from "./pages/About";
import Cart from "./pages/Cart";// i didn't use it now because of time limit, but i will develop it later or in the coming days.
import Customize from "./pages/Customize";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./components/auth/RequireAuth";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./App.css";

function App() {
  const getInitialTheme = () => {
    if (typeof window === "undefined") {
      return "light";
    }

    const storedTheme = window.localStorage.getItem("larama-theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    return typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;

    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.add("theme-transitioning");
    window.localStorage.setItem("larama-theme", theme);

    const timeout = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [theme]);

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen h-full flex flex-col app-surface overflow-x-hidden relative app-container w-full max-w-full">
          <Header theme={theme} onToggleTheme={toggleTheme} isDark={isDark} />
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/about" element={<About />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/customize" element={<Customize />} />
              <Route path="/auth" element={<Auth />} />
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
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;