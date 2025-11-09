import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";

const Header = ({ onToggleTheme = () => {}, isDark = false }) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const initials = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase();

  const isActivePage = (path) => {
    return location.pathname === path;
  };
  
  const getLinkClassName = (path) => {
    const baseClass = "text-[#5C4B3D] transition-all duration-300 font-medium";
    if (isActivePage(path)) {
      return `${baseClass} text-[#000000] drop-shadow-[0_0_12px_rgba(245,158,11,0.8)] border-b-2 border-[#5C4B3D] pb-1`;
    }
    return `${baseClass} hover:text-[#000000] hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]`;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-[#DCC5B2] py-4 px-6 shadow-md transition-colors duration-700">
      <div className="container mx-auto flex justify-between items-center">
        {/* here i added the logo and brand name */}
        <Link
          to="/"
          className="flex items-center space-x-3 hover:drop-shadow-[0_0_6px_rgba(245,158,11,0.6)] transition-all duration-300"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#DCC5B2] to-[#5C4B3D] rounded-full flex items-center justify-center shadow-lg border-2 border-[#5C4B3D] overflow-hidden">
            <img
              src="/larama-logo-img.ico"
              alt="LaRama Logo"
              className="w-8 h-8 object-contain rounded-full"
            />
          </div>
          <span className="text-[#5C4B3D] font-serif text-2xl font-bold">LaRama</span>
        </Link>

        <div className="flex items-center space-x-4 md:space-x-6">
          {/* the navigation links to the pages*/}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={getLinkClassName("/")}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={getLinkClassName("/products")}
            >
              Products
            </Link>
            <Link
              to="/customize"
              className={getLinkClassName("/customize")}
            >
              Customize
            </Link>
            <Link
              to="/about"
              className={getLinkClassName("/about")}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={getLinkClassName("/contact")}
            >
              Contact
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="text-[#5C4B3D] hover:text-[#000000] transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {!isAuthenticated && (
            <Link
              to="/auth"
              className="hidden md:inline-flex items-center justify-center rounded-full border border-[#5C4B3D] px-5 py-2 text-sm font-semibold text-[#5C4B3D] transition-all duration-300 hover:bg-[#5C4B3D] hover:text-[#F0E4D3]"
            >
              Login / Sign Up
            </Link>
          )}

          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-3 text-[#5C4B3D]">
              <Link
                to="/dashboard"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0E4D3] font-semibold text-[#5C4B3D] shadow-md shadow-[#bfa087]/40 transition-all duration-300 hover:bg-[#E2CBB6]"
                aria-label="Go to dashboard"
              >
                {initials || "D"}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full border border-[#5C4B3D] px-5 py-2 text-sm font-semibold text-[#5C4B3D] transition-all duration-300 hover:bg-[#5C4B3D] hover:text-[#F0E4D3]"
              >
                Logout
              </button>
            </div>
          )}

          <ThemeToggle onToggle={onToggleTheme} isDark={isDark} />

          {!isAuthenticated ? (
            <Link
              to="/auth"
              className="inline-flex md:hidden items-center justify-center rounded-full border border-[#5C4B3D] px-4 py-2 text-sm font-semibold text-[#5C4B3D] transition-all duration-300 hover:bg-[#5C4B3D] hover:text-[#F0E4D3]"
            >
              Join
            </Link>
          ) : (
            <div className="inline-flex md:hidden items-center space-x-3">
              <Link
                to="/dashboard"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0E4D3] font-semibold text-[#5C4B3D] shadow-md shadow-[#bfa087]/40 transition-all duration-300 hover:bg-[#E2CBB6]"
                aria-label="Go to dashboard"
              >
                {initials || "D"}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full border border-[#5C4B3D] px-4 py-2 text-sm font-semibold text-[#5C4B3D] transition-all duration-300 hover:bg-[#5C4B3D] hover:text-[#F0E4D3]"
              >
                Logout
              </button>
            </div>
          )}

          {/* Cart Icon - Simplified without counter, since i tried to add the counter but i faced many problems and it should be connected to the backend ig so i skiped for now */}
          <Link
            to="/cart"
            className="text-[#5C4B3D] hover:text-[#000000] transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
